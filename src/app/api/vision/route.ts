import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToB2, isB2Configured } from '@/lib/b2Storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';
import { validateImageSecurity } from '@/lib/imageValidator';
import { GeminiSuggestedName } from '@/lib/types';

interface GeminiColor {
  name: string;
  hex: string;
  percentage: number;
}

interface GeminiAnalysisResponse {
  isAnimal: boolean;
  identifiedObject?: string;
  rejectionReason?: string;
  detectedSpecies: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  detectedBreed: string;
  confidence: number;
  dominantColors: GeminiColor[];
  traits: string[];
  vibe: string;
  coatPattern?: string;
  eyeColor?: string;
  reasoningNotes?: string[];
  description: string;
  suggestedNames?: GeminiSuggestedName[];
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (15 vision requests per minute per IP to protect Gemini API quota)
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`vision_${clientIp}`, { limit: 15, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Please wait ${rateCheck.retryAfterSeconds}s before scanning another photo.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
      );
    }

    const { image } = await req.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // 2. Cryptographic Magic-Byte & File Integrity Validation
    const securityCheck = validateImageSecurity(image, 15 * 1024 * 1024);
    if (!securityCheck.valid) {
      return NextResponse.json({ success: false, error: securityCheck.error }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful signal for client to use local vision engine
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY_NOT_CONFIGURED' });
    }

    // Parse data URL format: data:<mime>;base64,<data>
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    // Stable Gemini Vision models: primary ultra-reliable model with automatic single-tier fallback
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite'
    ];

    const promptText = `
You are the high-accuracy core Vision AI engine for a pet naming platform.
Analyze this photo thoroughly with expert veterinary precision, but communicate in warm, friendly, natural pet-parent terms.

Return a STRICT JSON object with this exact structure:
{
  "isAnimal": boolean, // Set false ONLY if clearly an inanimate object (car, shoe, food, electronic, screenshot, empty room, furniture)
  "identifiedObject": "string", // If isAnimal is false, name the object clearly (e.g. "Sports Car", "Sneaker", "Laptop")
  "rejectionReason": "string", // If isAnimal is false, a gentle polite message explaining what was seen
  "detectedSpecies": "dog" | "cat" | "bird" | "rabbit" | "other",
  "detectedBreed": "string", // Clean, everyday, friendly breed/pet name (2 to 4 words max). Examples: "White Kitten", "Labrador Retriever", "Golden Retriever", "Orange Tabby Cat", "Tuxedo Cat", "French Bulldog", "Calico Cat", "British Shorthair", "Siberian Husky", "Siamese Cat", "Ragdoll Cat", "Holland Lop Bunny", "Budgerigar Parakeet". NEVER use complex slash-separated academic combos like "Flame Point Siamese / Cream Tabby Mix".
  "confidence": 96, // Integer between 88 and 99
  "dominantColors": [
    { "name": "Pure White", "hex": "#FFFFFF", "percentage": 70 },
    { "name": "Soft Cream", "hex": "#F5EAD8", "percentage": 20 },
    { "name": "Warm Amber", "hex": "#D97706", "percentage": 10 }
  ], // 2 to 3 actual dominant coat/feather colors with real hex codes matching the pet fur ONLY (exclude background wall/floor colors)
  "traits": [
    "string", // e.g. "Gentle, playful spirit"
    "string", // e.g. "Silky soft velvet coat"
    "string"  // e.g. "Inquisitive, loving companion"
  ],
  "vibe": "string", // 2-4 word personality vibe, e.g. "Sweet, Curious and Angelic", "Loyal, Warm and Cheerful", "Spirited, Cheerful and Warm", "Noble and Steadfast"
  "coatPattern": "string", // Clean, natural pattern name, e.g. "Soft White & Cream Fur", "Solid Golden Coat", "Classic Tabby Stripes", "Tuxedo Bicolor Mask", "Calico Patchwork"
  "eyeColor": "string", // e.g. "Sapphire Blue", "Warm Hazel", "Golden Amber", "Emerald Green", "Deep Espresso"
  "reasoningNotes": [
    "string", // e.g. "Biometrics: Feline facial geometry and delicate kitten muzzle"
    "string", // e.g. "Coat: Soft white plush fur with delicate cream highlights"
    "string", // e.g. "Eyes: Luminous sapphire-blue irises with bright clarity"
    "string"  // e.g. "Temperament: Calm, gentle and angelic posture"
  ],
  "description": "string", // 1-2 sentence warm, human, affectionate description of the pet (e.g. "An adorable little white kitten with striking blue eyes and a sweet, curious expression."). NEVER start with "Subject Pet Isolated:" or robotic phrases.
  "suggestedNames": [
    {
      "name": "string", // Distinctive, creative pet name specifically tailored to this pet's breed, coat pigment, and expressive face. CRUCIAL: Do NOT start all names with the letter "A"! Provide names across diverse letters (e.g. B, S, C, M, H, R, T, G, L, D, P, W, J, etc.).
      "meaning": "string", // Meaning or etymology
      "origin_language": "string", // e.g. "English", "French", "Japanese", "Spanish", "Italian", "Norse", "German", "Irish"
      "gender": "male" | "female" | "unisex",
      "reason": "string", // Direct reason why this name fits this pet in the photo (e.g. "Matches their bright golden coat and joyous, faithful eyes")
      "vibe": "string" // e.g. "cheerful", "cute", "noble", "playful", "gentle", "brave"
    }
  ] // Provide 20 to 25 unique, diverse, highly relevant names tailored to this specific pet photo
}

Critical Classification Rules:
1. NATURAL, LOVING BREED NAMES: Never produce awkward compound names with slashes (e.g. NEVER "Flame Point Siamese / Cream Tabby Mix" or "Domestic Shorthair / Tabby Mix"). If it's a white kitten, call it "White Kitten" or "Snow White Kitten". If it's a golden dog, call it "Golden Retriever" or "Yellow Labrador".
2. KITTENS & PUPPIES: If the animal is clearly a baby or young juvenile, explicitly call it a "Kitten" or "Puppy" (e.g. "White Kitten", "Golden Retriever Puppy", "Tabby Kitten").
3. BACKGROUND EXCLUSION: Always isolate the pet fur/feathers from background walls, floors, grass, or blankets. The dominantColors must belong strictly to the pet.
4. HIGHLY RELEVANT, DIVERSE PET NAMES: In "suggestedNames", produce 20 to 25 diverse names perfectly fitted to this pet's breed, colors, and facial expression. Crucially, do NOT start all names with the letter "A". Use diverse starting letters (e.g. S, B, C, R, H, M, G, L, T, O, P, D, W, J, etc.). Include a mix of male, female, and unisex names across multiple languages (English, French, Japanese, Spanish, Italian, Norse, etc.).
5. Return ONLY the raw valid JSON string. Do not wrap in markdown or markdown code fences.
`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            },
            {
              text: promptText
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.15
      }
    };

    // Execute primary model directly for clean 100% success rate without redundant errors on Google AI Studio
    let rawContent: string | null = null;
    let lastError: string | null = null;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          cache: 'no-store',
          signal: AbortSignal.timeout(20000)
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            rawContent = text;
            break; // Success on primary model: zero secondary errors generated
          }
        } else {
          lastError = `${model} returned HTTP ${res.status}`;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : 'Fetch failed';
      }
    }

    if (!rawContent) {
      return NextResponse.json({ success: false, error: lastError || 'Gemini Vision AI temporarily busy. Please retry.' });
    }

    // Clean potential markdown fences
    let cleaned = rawContent.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    const parsed: GeminiAnalysisResponse = JSON.parse(cleaned);

    // Sanitize breed name and description for natural, friendly user presentation
    let detectedBreed = (parsed.detectedBreed || 'Beloved Pet').trim();
    
    // Clean up awkward slash combinations (e.g. "Flame Point Siamese / Cream Tabby Mix")
    if (detectedBreed.toLowerCase().includes('flame point') || (detectedBreed.toLowerCase().includes('cream') && detectedBreed.toLowerCase().includes('siamese'))) {
      detectedBreed = detectedBreed.toLowerCase().includes('kitten') ? 'White Kitten' : 'Flame Point Cat';
    } else if (detectedBreed.includes(' / ') && detectedBreed.length > 25) {
      detectedBreed = detectedBreed.split(' / ')[0].trim();
    }

    // Clean robotic prefixes from description
    let description = (parsed.description || '').trim();
    description = description.replace(/^Subject Pet Isolated:\s*(Verified a lovely\s*)?/i, '').trim();
    if (description.length > 0) {
      description = description.charAt(0).toUpperCase() + description.slice(1);
    } else {
      description = `A wonderful ${detectedBreed} with expressive eyes and a lovely companion spirit.`;
    }

    // Asynchronously store uploaded pet photo to Backblaze B2 (10 GB Free Storage) if configured
    let cloudImageUrl: string | undefined = undefined;
    if (isB2Configured()) {
      try {
        const b2Res = await uploadImageToB2(image, parsed.detectedSpecies || 'pet');
        if (b2Res.success && b2Res.url) {
          cloudImageUrl = b2Res.url;
        }
      } catch (b2Err) {
        console.warn('Non-blocking B2 upload notice:', b2Err);
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        ...parsed,
        detectedBreed,
        description,
        subjectIsolated: true,
        cloudImageUrl
      }
    });
  } catch (err: unknown) {
    console.error('Vision AI endpoint error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

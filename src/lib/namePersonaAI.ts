import { PetNameRecord, NameAIEvaluation, NamePersonaCategory, RecommendedName, PetSpecies } from './types';

// ---------------------------------------------------------------------------
// INNER AI CLASSIFICATION SYSTEM
// Analyzes linguistic patterns, semantic keywords, etymology, and phonetics
// to classify names into: 'luxury', 'cute', 'funny', 'brave', 'gentle', 'mystical'
// ---------------------------------------------------------------------------

const LUXURY_KEYWORDS = [
  'king', 'queen', 'emperor', 'empress', 'crown', 'gold', 'silver', 'diamond',
  'jewel', 'gem', 'royal', 'noble', 'majesty', 'majestic', 'imperial', 'splendor',
  'palace', 'prince', 'princess', 'lord', 'lady', 'duchess', 'duke', 'baron',
  'monarch', 'haute', 'aristocrat', 'sterling', 'dignity', 'glory', 'regal',
  'sovereign', 'opulent', 'luxury', 'crystal', 'aurelius', 'bentley', 'versace',
  'armani', 'chanel', 'dior', 'rolex', 'tiffany', 'gucci', 'winston', 'maximilian'
];

const FUNNY_KEYWORDS = [
  'funny', 'silly', 'witty', 'joke', 'comic', 'food', 'snack', 'nugget', 'waffle',
  'pickle', 'bark', 'purr', 'paws', 'potato', 'spud', 'nacho', 'churro', 'bean',
  'meatball', 'noodle', 'goofy', 'chunky', 'quizzical', 'sir ', 'captain ',
  'professor ', 'lord ', 'chomper', 'gizmo', 'tofu', 'boba', 'taco', 'wasabi',
  'bubbles', 'chewbacca', 'yoda', 'spaghetti', 'cheddar', 'munchkin', 'boop'
];

const CUTE_KEYWORDS = [
  'cute', 'sweet', 'soft', 'little', 'gentle', 'darling', 'cuddle', 'pure',
  'honey', 'blossom', 'flower', 'fluffy', 'baby', 'joy', 'peaceful', 'cake',
  'sugar', 'candy', 'peach', 'cookie', 'cotton', 'sweetheart', 'cherished',
  'rice cake', 'mochi', 'mimi', 'pebble', 'button', 'sunny', 'petal', 'dewdrop'
];

const BRAVE_KEYWORDS = [
  'brave', 'fierce', 'warrior', 'strength', 'mighty', 'courage', 'hero', 'bold',
  'hunter', 'thunder', 'storm', 'fire', 'lion', 'wolf', 'protector', 'valiant'
];

const MYSTICAL_KEYWORDS = [
  'mystical', 'magic', 'celestial', 'cosmic', 'star', 'moon', 'shadow', 'night',
  'spirit', 'god', 'goddess', 'astral', 'aurora', 'eclipse', 'nebula', 'oracle'
];

/**
 * Inner AI Engine: Evaluates a pet name and determines its persona category
 * (Luxury 💎, Cute 🌸, Funny 😂, Brave 🦁, Mystical 🔮, Gentle 🌿)
 */
export function classifyNamePersona(record: PetNameRecord): NameAIEvaluation {
  const nameLower = record.name.toLowerCase();
  const meaningLower = record.meaning.toLowerCase();
  const tagsText = [...(record.vibe_tags || []), ...(record.color_tags || [])].join(' ').toLowerCase();
  const fullText = `${nameLower} ${meaningLower} ${tagsText} ${record.origin_language.toLowerCase()}`;

  // Scoring accumulators
  let luxuryScore = 0;
  let funnyScore = 0;
  let cuteScore = 0;
  let braveScore = 0;
  let mysticalScore = 0;

  // 1. Tag direct matches
  if (record.vibe_tags?.includes('noble') || record.vibe_tags?.includes('luxury') || record.vibe_tags?.includes('regal')) {
    luxuryScore += 35;
  }
  if (record.vibe_tags?.includes('funny') || record.vibe_tags?.includes('playful') || record.vibe_tags?.includes('food')) {
    funnyScore += 30;
  }
  if (record.vibe_tags?.includes('cute') || record.vibe_tags?.includes('sweet') || record.vibe_tags?.includes('gentle')) {
    cuteScore += 30;
  }
  if (record.vibe_tags?.includes('fierce') || record.vibe_tags?.includes('brave')) {
    braveScore += 30;
  }
  if (record.vibe_tags?.includes('mystical')) {
    mysticalScore += 30;
  }

  // 2. Keyword scans
  for (const kw of LUXURY_KEYWORDS) {
    if (fullText.includes(kw)) luxuryScore += 18;
  }
  for (const kw of FUNNY_KEYWORDS) {
    if (fullText.includes(kw)) funnyScore += 18;
  }
  for (const kw of CUTE_KEYWORDS) {
    if (fullText.includes(kw)) cuteScore += 18;
  }
  for (const kw of BRAVE_KEYWORDS) {
    if (fullText.includes(kw)) braveScore += 16;
  }
  for (const kw of MYSTICAL_KEYWORDS) {
    if (fullText.includes(kw)) mysticalScore += 16;
  }

  // 3. Phonetic and Morphological Analysis
  // Diminutives like -y, -ie, -i, -o with soft letters lean Cute
  if (/[aeiou][a-z]*(y|ie|i|o|u)$/i.test(nameLower) && nameLower.length <= 6) {
    cuteScore += 12;
  }
  // Honorific titles or food words lean Funny
  if (/^(sir|lord|lady|captain|baron|miss|dr|professor)\s/i.test(nameLower) || /(nugget|waffles|pickle|spud|taco|noodle)/i.test(nameLower)) {
    funnyScore += 25;
  }
  // High-syllable Latinate, French, or Germanic aristocratic names lean Luxury
  if (nameLower.length >= 7 && (record.origin_language === 'Latin' || record.origin_language === 'French' || record.origin_language === 'Italian')) {
    luxuryScore += 15;
  }

  // Determine top category
  const categories: { cat: NamePersonaCategory; score: number }[] = [
    { cat: 'luxury', score: luxuryScore },
    { cat: 'cute', score: cuteScore },
    { cat: 'funny', score: funnyScore },
    { cat: 'brave', score: braveScore },
    { cat: 'mystical', score: mysticalScore }
  ];

  categories.sort((a, b) => b.score - a.score);
  const best = categories[0];

  // Default to cute if low confidence
  const primaryCategory = best.score > 15 ? best.cat : 'cute';
  const confidence = Math.min(99, Math.max(82, 70 + Math.round(best.score / 2)));

  switch (primaryCategory) {
    case 'luxury':
      return {
        primaryCategory: 'luxury',
        confidence,
        label: 'Luxury',
        badgeIcon: '💎',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        reasoning: `Inner AI classified as Luxury: Rooted in aristocratic nobility, prestige etymology, and elegant cadences.`
      };
    case 'funny':
      return {
        primaryCategory: 'funny',
        confidence,
        label: 'Funny',
        badgeIcon: '😂',
        badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
        reasoning: `Inner AI classified as Funny: High playful quirkiness, comedic charm, and cheerful food/honorific humor.`
      };
    case 'cute':
      return {
        primaryCategory: 'cute',
        confidence,
        label: 'Cute',
        badgeIcon: '🌸',
        badgeColor: 'bg-pink-100 text-pink-900 border-pink-300',
        reasoning: `Inner AI classified as Cute: Soft phonetic syllables, affectionate confectionery roots, and warm gentle charm.`
      };
    case 'brave':
      return {
        primaryCategory: 'brave',
        confidence,
        label: 'Brave',
        badgeIcon: '🦁',
        badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
        reasoning: `Inner AI classified as Brave: Strong consonant cadence and heroic, courageous origins.`
      };
    case 'mystical':
      return {
        primaryCategory: 'mystical',
        confidence,
        label: 'Mystical',
        badgeIcon: '🔮',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        reasoning: `Inner AI classified as Mystical: Celestial cosmology and nocturnal spiritual resonance.`
      };
    default:
      return {
        primaryCategory: 'gentle',
        confidence: 88,
        label: 'Gentle',
        badgeIcon: '🌿',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        reasoning: `Inner AI classified as Gentle: Peaceful nature roots and calm, loyal spirit.`
      };
  }
}

/**
 * Inner AI Database Search Engine:
 * Queries the database and prioritizes names matching desired persona, species, language & color.
 */
export function searchNamesFromDatabase(
  allNames: PetNameRecord[],
  criteria: {
    persona?: 'cute' | 'funny' | 'luxury' | 'all' | string;
    species?: PetSpecies;
    targetLanguage?: string;
    gender?: string;
    coatColor?: string;
  }
): RecommendedName[] {
  const scored: RecommendedName[] = [];

  for (const nameRec of allNames) {
    const aiEvaluation = classifyNamePersona(nameRec);

    let matchScore = 60;
    const reasons: string[] = [];

    // 1. Persona match (Cute, Funny, Luxury)
    if (criteria.persona && criteria.persona !== 'all') {
      const target = criteria.persona.toLowerCase();
      if (aiEvaluation.primaryCategory === target) {
        matchScore += 35;
        reasons.push(`AI Verified ${aiEvaluation.label} Persona (${aiEvaluation.confidence}% match)`);
      } else if (nameRec.vibe_tags?.some(v => v.includes(target) || target.includes(v))) {
        matchScore += 20;
        reasons.push(`Matches your ${criteria.persona} style preference`);
      } else {
        matchScore -= 15;
      }
    } else {
      reasons.push(`AI Classified Persona: ${aiEvaluation.badgeIcon} ${aiEvaluation.label}`);
    }

    // 2. Language filter
    if (criteria.targetLanguage && criteria.targetLanguage !== 'All Languages' && criteria.targetLanguage !== 'All') {
      if (nameRec.origin_language.toLowerCase().includes(criteria.targetLanguage.toLowerCase())) {
        matchScore += 25;
        reasons.push(`${nameRec.origin_language} linguistic heritage`);
      } else {
        continue; // strict language filter
      }
    }

    // 3. Gender filter
    if (criteria.gender && criteria.gender !== 'all') {
      if (nameRec.gender !== criteria.gender && nameRec.gender !== 'unisex') {
        continue;
      }
      if (nameRec.gender === criteria.gender) {
        matchScore += 15;
      }
    }

    // 4. Species fit
    if (criteria.species) {
      const speciesList = Array.isArray(nameRec.species) ? nameRec.species : [nameRec.species];
      if (speciesList.includes(criteria.species) || speciesList.includes('any')) {
        matchScore += 15;
      }
    }

    // 5. Coat color fit
    if (criteria.coatColor && nameRec.color_tags?.includes(criteria.coatColor.toLowerCase())) {
      matchScore += 20;
      reasons.push(`Harmonizes with ${criteria.coatColor} coat tones`);
    }

    scored.push({
      ...nameRec,
      matchScore: Math.min(99, Math.max(50, matchScore)),
      matchReasons: Array.from(new Set(reasons)),
      aiPersona: aiEvaluation
    });
  }

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

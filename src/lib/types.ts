export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other' | 'any';

export type PetGender = 'male' | 'female' | 'unisex';

export interface PetNameRecord {
  id: string;
  name: string;
  meaning: string;
  origin_language: string;
  pronunciation?: string;
  gender: PetGender;
  species: PetSpecies | PetSpecies[];
  color_tags: string[]; // e.g. ['golden', 'white', 'black', 'brown', 'orange', 'grey', 'spotted']
  vibe_tags: string[];  // e.g. ['playful', 'gentle', 'noble', 'cute', 'fierce', 'mystical']
  popularity: number;
  fun_fact?: string;
}

export interface DetectedColor {
  name: string;
  hex: string;
  percentage: number;
}

export interface GeminiSuggestedName {
  name: string;
  meaning: string;
  origin_language?: string;
  gender?: PetGender;
  reason: string;
  vibe?: string;
  color_tags?: string[];
}

export interface PetAnalysisResult {
  isAnimal: boolean;
  identifiedObject?: string;
  rejectionReason?: string;
  detectedSpecies: PetSpecies;
  detectedBreed: string;
  confidence: number;
  dominantColors: DetectedColor[];
  traits: string[];
  vibe: string;
  description: string;
  subjectIsolated?: boolean;
  backgroundDetected?: string;
  coatPattern?: string;
  eyeColor?: string;
  reasoningNotes?: string[];
  cloudImageUrl?: string;
  suggestedNames?: GeminiSuggestedName[];
}

export type NamePersonaCategory = 'cute' | 'funny' | 'luxury' | 'brave' | 'gentle' | 'mystical';

export interface NameAIEvaluation {
  primaryCategory: NamePersonaCategory;
  confidence: number;
  label: string; // e.g. 'Luxury', 'Cute', 'Funny'
  badgeColor: string;
  badgeIcon: string;
  reasoning: string;
}

export interface RecommendedName extends PetNameRecord {
  matchScore: number;
  matchReasons: string[];
  aiPersona?: NameAIEvaluation;
}

export interface UserPreferences {
  targetLanguage: string; // 'All' or specific language
  gender: 'all' | PetGender;
  vibe: string; // 'all' or specific vibe
}

// ---------------------------------------------------------------------------
// Store & Order Management Types for Admin Panel
// ---------------------------------------------------------------------------
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface PetBandOrder {
  id: string; // e.g. "ORD-7291"
  createdAt: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  petName: string;
  petSpecies: string;
  petImage?: string;
  bandColor: string;
  bandMaterial: string;
  collarSize: string;
  customEngravingText?: string;
  paymentMethod: 'Cash on Delivery' | 'Direct Bank Transfer' | 'Online Payment';
  orderTotalLKR: number;
  status: OrderStatus;
  notes?: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  adminPhoneNumber: string; // e.g. "+94771234567"
  apiKey?: string; // CallMeBot API key
}

// ---------------------------------------------------------------------------
// User Authentication & Account Types
// ---------------------------------------------------------------------------
export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  role?: 'user' | 'admin';
  savedNamesCount?: number;
  ordersCount?: number;
  provider?: 'email' | 'dev_bypass' | 'google' | 'email_verification_code';
  avatarUrl?: string;
}

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

export interface PetAnalysisResult {
  detectedSpecies: PetSpecies;
  detectedBreed: string;
  confidence: number;
  dominantColors: DetectedColor[];
  traits: string[];
  vibe: string;
  description: string;
}

export interface RecommendedName extends PetNameRecord {
  matchScore: number;
  matchReasons: string[];
}

export interface UserPreferences {
  targetLanguage: string; // 'All' or specific language
  gender: 'all' | PetGender;
  vibe: string; // 'all' or specific vibe
}

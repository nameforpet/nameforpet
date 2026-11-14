import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PetNameRecord } from './types';
import { INITIAL_PET_NAMES } from './petNamesData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Fetch pet names either from the Supabase database or fallback to the built-in dataset
 */
export async function getPetNames(): Promise<{ names: PetNameRecord[]; source: 'supabase' | 'built-in' }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pet_names')
        .select('*')
        .order('popularity', { ascending: false });

      if (!error && data && data.length > 0) {
        return { names: data as PetNameRecord[], source: 'supabase' };
      }
      console.warn('Supabase query returned empty or error, using built-in names dataset:', error?.message);
    } catch (err) {
      console.warn('Supabase fetch exception, using built-in names dataset:', err);
    }
  }

  // Gracefully load unified dataset with 17,900+ pet names across 22 languages and cute/luxury/funny types
  try {
    const unifiedData = (await import('@/data/unifiedPetNames.json')).default as PetNameRecord[];
    if (unifiedData && unifiedData.length > 0) {
      return { names: unifiedData, source: 'built-in' };
    }
  } catch (err) {
    console.warn('Failed to load unifiedPetNames.json, falling back to initial pet names:', err);
  }

  // Fallback to starter names
  return { names: INITIAL_PET_NAMES, source: 'built-in' };
}

/**
 * Local storage bookmarking for favorites (synced with Supabase if configured)
 */
export function getLocalFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nameforpet_favorites') || localStorage.getItem('loveforpet_favorites');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLocalFavorite(nameId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getLocalFavorites();
    const next = existing.includes(nameId)
      ? existing.filter(id => id !== nameId)
      : [...existing, nameId];
    localStorage.setItem('nameforpet_favorites', JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

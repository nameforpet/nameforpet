import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PetNameRecord } from './types';
import { INITIAL_PET_NAMES } from './petNamesData';

// Connect to the verified Supabase project where Google OAuth is configured
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseUrl = (rawUrl && !rawUrl.includes('tglcsfxzdjrxbisuhlud'))
  ? rawUrl
  : 'https://tpyceqabdimkusdaxgax.supabase.co';

export const supabaseAnonKey = (rawKey && !rawUrl?.includes('tglcsfxzdjrxbisuhlud'))
  ? rawKey
  : 'sb_publishable_99RlD1GbTSAc9Aa3YPHAQQ_YrJcg8N2';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch complete pet names dataset: loads all 17,960+ names from unified dataset
 * and seamlessly merges any custom user-submitted or admin-created names from Supabase.
 */
export async function getPetNames(): Promise<{ names: PetNameRecord[]; source: 'supabase' | 'built-in' }> {
  let baseNames: PetNameRecord[] = [];

  // 1. Load full unified dataset of 17,960+ pet names
  try {
    const unifiedData = (await import('@/data/unifiedPetNames.json')).default as PetNameRecord[];
    if (unifiedData && unifiedData.length > 0) {
      baseNames = unifiedData;
    }
  } catch (err) {
    console.warn('Failed to load unifiedPetNames.json, falling back to initial pet names:', err);
    baseNames = INITIAL_PET_NAMES;
  }

  // 2. If Supabase is connected, augment with newly added/custom names from the database
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pet_names')
        .select('*')
        .order('popularity', { ascending: false });

      if (!error && data && data.length > 0) {
        // Index by lowercase name to prevent duplicates while merging custom Supabase records
        const nameMap = new Map<string, PetNameRecord>();
        for (const item of baseNames) {
          nameMap.set(item.name.toLowerCase().trim(), item);
        }
        for (const item of data as PetNameRecord[]) {
          nameMap.set(item.name.toLowerCase().trim(), item);
        }

        return { names: Array.from(nameMap.values()), source: 'supabase' };
      }
    } catch (err) {
      console.warn('Supabase fetch exception, using unified dataset:', err);
    }
  }

  return { names: baseNames, source: 'built-in' };
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

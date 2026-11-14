import { PetSpecies } from './types';

export interface GalleryItem {
  id: string;
  name: string;
  meaning: string;
  language: string;
  species: PetSpecies | string;
  breed: string;
  imageSrc: string;
  hasBand?: boolean;
  bandColor?: string;
  dateAdded: string;
  isUserAdded?: boolean;
}

const STORAGE_KEY = 'nameforpet_gallery';

// Initial pre-loaded showcase pets so the gallery is beautiful and alive immediately
export const INITIAL_SHOWCASE_PETS: GalleryItem[] = [
  {
    id: 'showcase-1',
    name: 'Mochi (餅)',
    meaning: 'Sweet Japanese rice cake; brings soft joy and fortune',
    language: 'Japanese',
    species: 'dog',
    breed: 'Golden Retriever Pup',
    imageSrc: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    bandColor: '#f97316',
    dateAdded: '2026-10-28',
    isUserAdded: false,
  },
  {
    id: 'showcase-2',
    name: 'Luna',
    meaning: 'Moon; celestial nocturnal beauty and quiet grace',
    language: 'Spanish',
    species: 'cat',
    breed: 'Midnight Shorthair',
    imageSrc: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    bandColor: '#8b5cf6',
    dateAdded: '2026-10-29',
    isUserAdded: false,
  },
  {
    id: 'showcase-3',
    name: 'Soleil',
    meaning: 'Sun; radiant warm sunshine and boundless light',
    language: 'French',
    species: 'cat',
    breed: 'Ginger Tabby',
    imageSrc: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=75',
    hasBand: false,
    dateAdded: '2026-10-30',
    isUserAdded: false,
  },
  {
    id: 'showcase-4',
    name: 'Nieve',
    meaning: 'Snow; pure, serene and peaceful white coat',
    language: 'Spanish',
    species: 'rabbit',
    breed: 'Fluffy White Bunny',
    imageSrc: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    bandColor: '#ec4899',
    dateAdded: '2026-10-31',
    isUserAdded: false,
  },
  {
    id: 'showcase-5',
    name: 'Archie',
    meaning: 'Truly brave and genuine hearted adventurer',
    language: 'Germanic',
    species: 'dog',
    breed: 'Tricolor Beagle',
    imageSrc: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    bandColor: '#3b82f6',
    dateAdded: '2026-11-01',
    isUserAdded: false,
  },
  {
    id: 'showcase-6',
    name: 'Kuro (黒)',
    meaning: 'Sleek black shadow of night',
    language: 'Japanese',
    species: 'cat',
    breed: 'Bombay Cat',
    imageSrc: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    dateAdded: '2026-11-01',
    isUserAdded: false,
  },
  {
    id: 'showcase-7',
    name: 'Bella',
    meaning: 'Beautiful and beloved darling',
    language: 'Italian',
    species: 'dog',
    breed: 'Labradoodle Pup',
    imageSrc: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    dateAdded: '2026-11-01',
    isUserAdded: false,
  },
  {
    id: 'showcase-8',
    name: 'Milo',
    meaning: 'Beloved soldier with sweet gentle heart',
    language: 'Celtic',
    species: 'dog',
    breed: 'Happy Corgi',
    imageSrc: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    dateAdded: '2026-11-01',
    isUserAdded: false,
  },
  {
    id: 'showcase-9',
    name: 'Freya',
    meaning: 'Noble lady of courage and warmth',
    language: 'Norse',
    species: 'dog',
    breed: 'Siberian Husky',
    imageSrc: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=75',
    hasBand: false,
    dateAdded: '2026-11-01',
    isUserAdded: false,
  },
  {
    id: 'showcase-10',
    name: 'Simba',
    meaning: 'Fierce and brave lion king',
    language: 'Swahili',
    species: 'cat',
    breed: 'Golden British Shorthair',
    imageSrc: 'https://images.unsplash.com/photo-1561948955-570b27e84530?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    dateAdded: '2026-11-01',
    isUserAdded: false,
  },
  {
    id: 'showcase-11',
    name: 'Rio',
    meaning: 'Vibrant flowing river of colors',
    language: 'Spanish',
    species: 'bird',
    breed: 'Tropical Macaw',
    imageSrc: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=75',
    hasBand: true,
    dateAdded: '2026-11-01',
    isUserAdded: false,
  },
];

export function getGalleryItems(): GalleryItem[] {
  if (typeof window === 'undefined') return INITIAL_SHOWCASE_PETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SHOWCASE_PETS));
      return INITIAL_SHOWCASE_PETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SHOWCASE_PETS;
  } catch (err) {
    console.warn('Error reading gallery:', err);
    return INITIAL_SHOWCASE_PETS;
  }
}

export function saveGalleryItems(items: GalleryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving gallery items:', err);
  }
}

export function addGalleryItem(item: {
  name: string;
  meaning: string;
  language: string;
  species: string;
  breed: string;
  imageSrc: string;
  hasBand?: boolean;
}): GalleryItem {
  const current = getGalleryItems();
  
  // Check if already added
  const existing = current.find(
    i => i.name.toLowerCase() === item.name.toLowerCase() && i.imageSrc === item.imageSrc
  );
  if (existing) return existing;

  const newItem: GalleryItem = {
    id: 'gallery-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: item.name,
    meaning: item.meaning,
    language: item.language,
    species: item.species,
    breed: item.breed,
    imageSrc: item.imageSrc,
    hasBand: item.hasBand ?? false,
    dateAdded: new Date().toISOString().split('T')[0],
    isUserAdded: true,
  };

  // Prepend new item so it appears at top of gallery
  const updated = [newItem, ...current];
  saveGalleryItems(updated);
  return newItem;
}

export function removeGalleryItem(id: string): GalleryItem[] {
  const current = getGalleryItems();
  const updated = current.filter(i => i.id !== id);
  saveGalleryItems(updated);
  return updated;
}

export function isItemInGallery(name: string, imageSrc: string): boolean {
  const current = getGalleryItems();
  return current.some(
    i => i.name.toLowerCase() === itemNormalized(name) && i.imageSrc === imageSrc
  );
}

function itemNormalized(name: string): string {
  return name.split('(')[0].trim().toLowerCase();
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pet Gallery & Community Wall | NameForPet',
  description: 'Explore our community pet gallery. See adorable dogs, cats, rabbits, and birds with their AI-matched names, detected coat palettes, and breed characteristics.',
  keywords: [
    'pet gallery',
    'community pet photos',
    'cute pet portraits',
    'dog photo gallery',
    'cat photo gallery',
    'ai matched pet names'
  ],
  alternates: {
    canonical: 'https://www.nameforpet.com/gallery',
  },
  openGraph: {
    title: 'Pet Gallery & Community Wall - NameForPet',
    description: 'Browse community pet portraits and discover adorable dogs, cats, and rabbits with their AI-matched names.',
    url: 'https://www.nameforpet.com/gallery',
    siteName: 'nameforpet.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Gallery & Community Wall - NameForPet',
    description: 'Browse community pet portraits and discover adorable pets with their AI-matched names.',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
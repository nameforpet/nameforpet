import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse 17,900+ Pet Names by Species, Language & Vibe | NameForPet',
  description: 'Search the world\'s most comprehensive pet name dictionary. Over 17,900 names for dogs, cats, rabbits, and birds across 22 languages with cultural origins, meanings, and personality styles.',
  keywords: [
    'browse pet names',
    'dog names dictionary',
    'cat names database',
    'pet names by language',
    'japanese pet names',
    'french dog names',
    'cute pet names',
    'luxury pet names',
    'funny pet names',
    'pet names A-Z'
  ],
  alternates: {
    canonical: 'https://www.nameforpet.com/browse',
  },
  openGraph: {
    title: 'Browse 17,900+ Pet Names - NameForPet',
    description: 'Explore 17,900+ unique pet names for dogs, cats, rabbits, and birds with cultural meanings and pronunciation.',
    url: 'https://www.nameforpet.com/browse',
    siteName: 'nameforpet.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse 17,900+ Pet Names - NameForPet',
    description: 'Explore 17,900+ unique pet names for dogs, cats, rabbits, and birds across 22 languages.',
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
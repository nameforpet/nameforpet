import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse 17,900+ Pet Names by Species, Language & Personality | NameForPet',
  description: 'Search the world\'s largest pet name database. Filter 17,900+ dog names, cat names, rabbit names and bird names by language (Japanese, French, Spanish, Korean), personality vibe (cute, brave, luxury), and species. Each name includes cultural origin, meaning, and pronunciation.',
  keywords: [
    'browse pet names', 'pet name search', 'dog names dictionary', 'cat names database',
    'pet names by language', 'japanese pet names list', 'french dog names list',
    'spanish cat names', 'korean pet names', 'norse dog names',
    'cute pet names list', 'luxury pet names list', 'funny dog names list',
    'brave cat names', 'unique pet names with meanings', 'pet names A-Z',
    'dog name ideas 2025', 'cat name ideas 2025', 'best pet names',
    'pet names by personality', 'gender neutral pet names', 'rare pet names'
  ],
  alternates: {
    canonical: 'https://www.nameforpet.com/browse',
  },
  openGraph: {
    title: 'Browse 17,900+ Pet Names by Language & Personality – NameForPet',
    description: 'Filter dog, cat, rabbit and bird names by 22 languages and personality styles. Every name includes cultural origin, meaning, and AI personality badge.',
    url: 'https://www.nameforpet.com/browse',
    siteName: 'NameForPet',
    type: 'website',
    images: [{ url: 'https://www.nameforpet.com/opengraph-image', width: 1200, height: 630, alt: 'Browse 17,900+ Pet Names – NameForPet' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse 17,900+ Pet Names – NameForPet',
    description: 'Filter dog, cat, rabbit & bird names by 22 languages and personality. Free pet name finder at nameforpet.com.',
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pet Gallery – Community Dog & Cat Photos with AI Names | NameForPet',
  description: 'Browse our community pet photo gallery. See real dogs, cats, rabbits, and birds with their AI-matched names, detected coat colors, breed traits, and personality badges. Share your own pet photo and join 1,400+ happy pet owners.',
  keywords: [
    'pet gallery', 'community pet photos', 'cute dog photos', 'cute cat photos',
    'pet portraits', 'ai matched pet names', 'dog photo gallery', 'cat photo gallery',
    'pet name ideas from photo', 'pet community', 'share pet photo',
    'adorable pets', 'cute animals with names', 'pet naming gallery'
  ],
  alternates: {
    canonical: 'https://www.nameforpet.com/gallery',
  },
  openGraph: {
    title: 'Pet Gallery – Community Dog & Cat Photos with AI Names – NameForPet',
    description: 'Browse adorable community pet photos with their AI-suggested names. Dogs, cats, rabbits & birds — all named by Vision AI on nameforpet.com.',
    url: 'https://www.nameforpet.com/gallery',
    siteName: 'NameForPet',
    type: 'website',
    images: [{ url: 'https://www.nameforpet.com/opengraph-image', width: 1200, height: 630, alt: 'Pet Gallery – NameForPet Community' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Gallery – Community Pets with AI Names – NameForPet',
    description: 'See adorable dogs, cats & rabbits with their AI-matched names. Join the community at nameforpet.com.',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
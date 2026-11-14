import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Pet Gallery & Showcase - nameforpet.com',
  description: 'Explore adorable dogs, cats, rabbits, and birds from pet owners worldwide with their AI-matched names, coat colors, and origin meanings.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Community Pet Gallery - nameforpet.com',
    description: 'Browse real pet photos and their unique multilingual AI-matched names.',
    url: 'https://nameforpet.com/gallery',
    type: 'website',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

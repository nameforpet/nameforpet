import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'nameforpet.com - AI Pet Name Generator from Photo',
    short_name: 'nameforpet',
    description: 'Find the perfect name for your dog, cat, rabbit, or bird from photo using Vision AI across 22+ languages.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF6F0',
    theme_color: '#FAF6F0',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

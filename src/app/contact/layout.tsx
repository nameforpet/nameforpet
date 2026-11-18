import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact NameForPet – Questions, Feedback & Custom Name Requests',
  description: 'Have a question about our AI pet name generator? Want to suggest a new name or report an issue? Reach out to the NameForPet team. We read every message and usually reply within 24 hours.',
  keywords: [
    'contact nameforpet', 'pet name suggestion', 'feedback', 'nameforpet support',
    'ai pet name help', 'custom pet name request'
  ],
  alternates: {
    canonical: 'https://www.nameforpet.com/contact',
  },
  openGraph: {
    title: 'Contact NameForPet – Questions & Feedback',
    description: 'Reach out to the NameForPet team for questions, suggestions, or custom name requests.',
    url: 'https://www.nameforpet.com/contact',
    siteName: 'NameForPet',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

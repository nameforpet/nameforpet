import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Community Support - NameForPet',
  description: 'Have a pet name suggestion, feedback on our Vision AI, or partnership inquiries? Get in touch with the NameForPet team at nameforpet1@gmail.com.',
  alternates: {
    canonical: 'https://www.nameforpet.com/contact',
  },
  openGraph: {
    title: 'Contact Us - NameForPet',
    description: 'Get in touch with the NameForPet team for pet name suggestions, Vision AI feedback, and support.',
    url: 'https://www.nameforpet.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
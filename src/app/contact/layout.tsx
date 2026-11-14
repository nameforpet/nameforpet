import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Community Support - nameforpet.com',
  description: 'Have a pet name suggestion, feedback on our Vision AI, or custom pet tag inquiries? Get in touch with the nameforpet.com team directly at nameforpet1@gmail.com.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us - nameforpet.com',
    description: 'Get in touch with the nameforpet.com team for name suggestions, feedback, and custom pet collar tag inquiries.',
    url: 'https://nameforpet.com/contact',
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

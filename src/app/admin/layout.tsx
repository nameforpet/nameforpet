import type { Metadata } from 'next';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export const metadata: Metadata = {
  title: 'Admin Portal - Orders & WhatsApp Dispatch | nameforpet.com',
  description: 'Private administration panel for nameforpet.com order fulfillment and customer alerts.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      {children}
    </AdminAuthGuard>
  );
}

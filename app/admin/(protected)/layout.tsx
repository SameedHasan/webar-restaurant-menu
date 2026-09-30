import { AdminNav } from '@/components/admin/AdminNav';
import { requireAdminContext } from '@/lib/admin/auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminContext();

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminNav restaurantName={admin.restaurant.name} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

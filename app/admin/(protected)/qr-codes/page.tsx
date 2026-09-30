import { QRCodeGenerator } from '@/components/admin/QRCodeGenerator';
import { requireAdminContext } from '@/lib/admin/auth';
import { getAdminTables } from '@/lib/admin/tables';
import { getAppUrl } from '@/lib/config/env';

export default async function QRCodesPage() {
  const admin = await requireAdminContext();
  const tables = await getAdminTables(admin.restaurant.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Table QR codes</h1>
      <p className="mt-1 text-sm text-stone-500">
        Print these codes and place them on tables. Customers scan to open the menu.
      </p>
      <div className="mt-8">
        <QRCodeGenerator restaurant={admin.restaurant} tables={tables} appUrl={getAppUrl()} />
      </div>
    </div>
  );
}

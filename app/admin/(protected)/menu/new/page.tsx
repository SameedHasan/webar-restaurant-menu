import { ItemForm } from '@/components/admin/ItemForm';
import { createMenuItemFormAction } from '@/app/admin/(protected)/actions';
import { requireAdminContext } from '@/lib/admin/auth';
import { getAdminCategories } from '@/lib/admin/menu-items';

export default async function NewMenuItemPage() {
  const admin = await requireAdminContext();
  const categories = await getAdminCategories(admin.restaurant.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Add menu item</h1>
      <p className="mt-1 text-sm text-stone-500">Upload a photo and fill in the item details.</p>
      <div className="mt-8">
        <ItemForm categories={categories} action={createMenuItemFormAction} />
      </div>
    </div>
  );
}

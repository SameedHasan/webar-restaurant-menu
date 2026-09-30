import { notFound } from 'next/navigation';
import {
  deleteMenuItemFormAction,
  updateMenuItemFormAction,
} from '@/app/admin/(protected)/actions';
import { ItemForm } from '@/components/admin/ItemForm';
import { requireAdminContext } from '@/lib/admin/auth';
import { getAdminCategories, getAdminMenuItem } from '@/lib/admin/menu-items';

interface EditMenuItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMenuItemPage({ params }: EditMenuItemPageProps) {
  const { id } = await params;
  const admin = await requireAdminContext();
  const [item, categories] = await Promise.all([
    getAdminMenuItem(admin.restaurant.id, id),
    getAdminCategories(admin.restaurant.id),
  ]);

  if (!item) notFound();

  const updateAction = updateMenuItemFormAction.bind(null, id);
  const deleteAction = deleteMenuItemFormAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Edit menu item</h1>
      <p className="mt-1 text-sm text-stone-500">{item.name}</p>
      <div className="mt-8">
        <ItemForm
          categories={categories}
          item={item}
          action={updateAction}
          deleteAction={deleteAction}
        />
      </div>
    </div>
  );
}

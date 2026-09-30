'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminContext } from '@/lib/admin/auth';
import {
  createAdminMenuItem,
  deleteAdminMenuItem,
  updateAdminMenuItem,
  type MenuItemInput,
} from '@/lib/admin/menu-items';
import { createAdminTable } from '@/lib/admin/tables';

function parseMenuItemInput(formData: FormData): MenuItemInput {
  const description = formData.get('description');
  const imageUrl = formData.get('image_url');

  return {
    category_id: String(formData.get('category_id')),
    name: String(formData.get('name')),
    description: description ? String(description) : null,
    price: parseFloat(String(formData.get('price'))),
    image_url: imageUrl ? String(imageUrl) : null,
    is_available: formData.get('is_available') === 'true',
  };
}

export async function createMenuItemFormAction(formData: FormData) {
  const admin = await requireAdminContext();
  await createAdminMenuItem(admin.restaurant.id, parseMenuItemInput(formData));
  revalidatePath('/admin/menu');
  redirect('/admin/menu');
}

export async function updateMenuItemFormAction(itemId: string, formData: FormData) {
  const admin = await requireAdminContext();
  await updateAdminMenuItem(admin.restaurant.id, itemId, parseMenuItemInput(formData));
  revalidatePath('/admin/menu');
  revalidatePath(`/admin/menu/${itemId}`);
  redirect('/admin/menu');
}

export async function deleteMenuItemFormAction(itemId: string) {
  const admin = await requireAdminContext();
  await deleteAdminMenuItem(admin.restaurant.id, itemId);
  revalidatePath('/admin/menu');
  redirect('/admin/menu');
}

export async function createTableAction(tableNumber: number) {
  const admin = await requireAdminContext();
  await createAdminTable(admin.restaurant.id, tableNumber);
  revalidatePath('/admin/qr-codes');
}

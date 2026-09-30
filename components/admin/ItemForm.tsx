'use client';

import { useState, useTransition } from 'react';
import { Generate3DPanel } from '@/components/admin/Generate3DPanel';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Category, MenuItem } from '@/lib/types/database';

interface ItemFormProps {
  categories: Category[];
  item?: MenuItem;
  action: (formData: FormData) => Promise<void>;
  deleteAction?: () => Promise<void>;
}

export function ItemForm({ categories, item, action, deleteAction }: ItemFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image_url ?? null);
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('image_url', imageUrl ?? '');

    startTransition(async () => {
      await action(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={item?.name ?? ''}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={item?.description ?? ''}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-stone-700">
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={item?.price ?? ''}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-stone-700">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={item?.category_id ?? categories[0]?.id}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_available"
          name="is_available"
          type="checkbox"
          value="true"
          defaultChecked={item?.is_available ?? true}
          className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="is_available" className="text-sm text-stone-700">
          Available on menu
        </label>
      </div>

      <ImageUpload value={imageUrl} onChange={setImageUrl} />

      {item && (
        <Generate3DPanel
          item={{
            id: item.id,
            name: item.name,
            image_url: imageUrl,
            model_url: item.model_url,
            ai_status: item.ai_status,
            ai_error: item.ai_error,
          }}
        />
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">
          {isPending ? 'Saving…' : item ? 'Save changes' : 'Create item'}
        </button>

        {item && deleteAction && !showDeleteConfirm && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
            Delete
          </button>
        )}

        {showDeleteConfirm && deleteAction && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deleteAction();
              })
            }
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
            Confirm delete
          </button>
        )}
      </div>
    </form>
  );
}

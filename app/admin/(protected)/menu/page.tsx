import Image from 'next/image';
import Link from 'next/link';
import { requireAdminContext } from '@/lib/admin/auth';
import { getAdminMenu } from '@/lib/admin/menu-items';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export default async function AdminMenuPage() {
  const admin = await requireAdminContext();
  const { categories } = await getAdminMenu(admin.restaurant.id);

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Menu items</h1>
          <p className="mt-1 text-sm text-stone-500">{totalItems} items across {categories.length} categories</p>
        </div>
        <Link
          href="/admin/menu/new"
          className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">
          Add item
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="mb-4 text-lg font-semibold text-stone-800">{category.name}</h2>
            {category.items.length === 0 ? (
              <p className="text-sm text-stone-400">No items in this category.</p>
            ) : (
              <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/admin/menu/${item.id}`}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-stone-50">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xl">🍽️</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-stone-900">{item.name}</p>
                        <p className="truncate text-sm text-stone-500">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-amber-700">{formatPrice(item.price)}</p>
                        <p className="text-xs text-stone-400">
                          {item.is_available ? 'Available' : 'Hidden'}
                          {item.model_url ? ' · AR' : ''}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

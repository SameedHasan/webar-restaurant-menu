import { notFound } from 'next/navigation';
import { ARViewLayout } from '@/components/ar/ARViewLayout';
import { getMenuItemForAR } from '@/lib/data/menu';

interface ARPageProps {
  params: Promise<{
    restaurantSlug: string;
    tableNumber: string;
    itemId: string;
  }>;
}

export async function generateMetadata({ params }: ARPageProps) {
  const { restaurantSlug, tableNumber, itemId } = await params;
  const data = await getMenuItemForAR(
    restaurantSlug,
    parseInt(tableNumber, 10),
    itemId,
  );

  if (!data) {
    return { title: 'AR View Not Found' };
  }

  return {
    title: `${data.item.name} — AR View`,
    description: `View ${data.item.name} in augmented reality`,
  };
}

export default async function ARPage({ params }: ARPageProps) {
  const { restaurantSlug, tableNumber, itemId } = await params;
  const parsedTable = parseInt(tableNumber, 10);

  if (Number.isNaN(parsedTable) || parsedTable < 1) {
    notFound();
  }

  const data = await getMenuItemForAR(restaurantSlug, parsedTable, itemId);

  if (!data) {
    notFound();
  }

  return <ARViewLayout restaurant={data.restaurant} table={data.table} item={data.item} />;
}

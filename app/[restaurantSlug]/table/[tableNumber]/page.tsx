import { notFound } from 'next/navigation';
import { MenuView } from '@/components/menu/MenuView';
import { getMenuByTable } from '@/lib/data/menu';

interface TableMenuPageProps {
  params: Promise<{
    restaurantSlug: string;
    tableNumber: string;
  }>;
}

export async function generateMetadata({ params }: TableMenuPageProps) {
  const { restaurantSlug, tableNumber } = await params;
  const data = await getMenuByTable(restaurantSlug, parseInt(tableNumber, 10));

  if (!data) {
    return { title: 'Menu Not Found' };
  }

  return {
    title: `${data.restaurant.name} — Table ${data.table.table_number}`,
    description: data.restaurant.description ?? `Browse the menu at ${data.restaurant.name}`,
  };
}

export default async function TableMenuPage({ params }: TableMenuPageProps) {
  const { restaurantSlug, tableNumber } = await params;
  const parsedTable = parseInt(tableNumber, 10);

  if (Number.isNaN(parsedTable) || parsedTable < 1) {
    notFound();
  }

  const data = await getMenuByTable(restaurantSlug, parsedTable);

  if (!data) {
    notFound();
  }

  return <MenuView data={data} />;
}

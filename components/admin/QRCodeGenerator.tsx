'use client';

import QRCode from 'qrcode';
import { useEffect, useState, useTransition } from 'react';
import { createTableAction } from '@/app/admin/(protected)/actions';
import type { Restaurant, Table } from '@/lib/types/database';

interface QRCodeGeneratorProps {
  restaurant: Restaurant;
  tables: Table[];
  appUrl: string;
}

interface QRData {
  tableNumber: number;
  menuUrl: string;
  dataUrl: string;
}

export function QRCodeGenerator({ restaurant, tables, appUrl }: QRCodeGeneratorProps) {
  const [qrCodes, setQrCodes] = useState<QRData[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function generate() {
      const results = await Promise.all(
        tables.map(async (table) => {
          const menuUrl = `${appUrl}/${restaurant.slug}/table/${table.table_number}`;
          const dataUrl = await QRCode.toDataURL(menuUrl, {
            width: 512,
            margin: 2,
            color: { dark: '#1c1917', light: '#ffffff' },
          });
          return { tableNumber: table.table_number, menuUrl, dataUrl };
        }),
      );
      setQrCodes(results);
    }

    generate();
  }, [tables, restaurant.slug, appUrl]);

  function handleAddTable(event: React.FormEvent) {
    event.preventDefault();
    const num = parseInt(tableNumber, 10);
    if (Number.isNaN(num) || num < 1) {
      setError('Enter a valid table number');
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await createTableAction(num);
        setTableNumber('');
      } catch {
        setError('Table number already exists');
      }
    });
  }

  function downloadQR(qr: QRData) {
    const link = document.createElement('a');
    link.href = qr.dataUrl;
    link.download = `${restaurant.slug}-table-${qr.tableNumber}-qr.png`;
    link.click();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/80">
        <h2 className="text-lg font-semibold text-stone-900">Add table</h2>
        <p className="mt-1 text-sm text-stone-500">
          Each table gets a unique QR code linking to your menu.
        </p>
        <form onSubmit={handleAddTable} className="mt-4 flex flex-wrap gap-3">
          <input
            type="number"
            min="1"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table number"
            className="w-36 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">
            {isPending ? 'Adding…' : 'Add table'}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {qrCodes.map((qr) => (
          <div
            key={qr.tableNumber}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80">
            <p className="text-center text-sm font-semibold text-stone-900">
              Table {qr.tableNumber}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr.dataUrl}
              alt={`QR code for table ${qr.tableNumber}`}
              className="mx-auto mt-3 w-full max-w-[200px]"
            />
            <p className="mt-3 break-all text-center text-xs text-stone-400">{qr.menuUrl}</p>
            <button
              type="button"
              onClick={() => downloadQR(qr)}
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-stone-200 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
              Download PNG
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

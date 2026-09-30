import Link from 'next/link';

export default function TableNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <p className="text-5xl">🍽️</p>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Menu not found</h1>
      <p className="mt-2 max-w-sm text-stone-500">
        This restaurant or table doesn&apos;t exist. Check the QR code and try again.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800">
        Go home
      </Link>
    </div>
  );
}

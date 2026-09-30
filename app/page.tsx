import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-amber-700">TableAR Menu</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          WebAR Restaurant Menu
        </h1>
        <p className="mt-3 text-stone-600">
          Scan a table QR code to browse the menu and visualize dishes in augmented reality — no app
          download required.
        </p>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/80">
          <h2 className="text-sm font-semibold text-stone-800">Try the demo</h2>
          <p className="mt-1 text-sm text-stone-500">
            Simulates scanning a QR code for Demo Bistro, Table 3.
          </p>
          <Link
            href="/demo-bistro/table/3"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800">
            Open Demo Menu
          </Link>
        </div>

        <div className="mt-8 space-y-3 text-sm text-stone-500">
          <p>
            <span className="font-medium text-stone-700">Phase 1</span> — Menu browsing
          </p>
          <p>
            <span className="font-medium text-stone-700">Phase 2</span> — WebAR with model-viewer
          </p>
          <p>
            <span className="font-medium text-stone-700">Phase 3</span> — Admin dashboard
          </p>
          <p>
            <span className="font-medium text-stone-700">Phase 4</span> — AI image-to-3D generation
            (current)
          </p>
        </div>

        <Link
          href="/admin/login"
          className="mt-8 block text-sm font-medium text-amber-700 hover:text-amber-800">
          Restaurant admin dashboard →
        </Link>
      </main>
    </div>
  );
}

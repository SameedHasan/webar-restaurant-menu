# WebAR Restaurant Menu

Mobile-first WebAR menu for restaurants. Customers scan a table QR code to browse the menu and visualize dishes in augmented reality — no app download required.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 and tap **Open Demo Menu**, or go directly to:

http://localhost:3000/demo-bistro/table/3

Phase 1 uses **mock data** by default — no Supabase setup required.

## Documentation

| Doc | Description |
|-----|-------------|
| [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) | Full project plan, file structure, phases |
| [Architecture](./docs/ARCHITECTURE.md) | System diagram and data flows |
| [Phase 1](./docs/phases/phase-1.md) | Foundation + mobile menu (current) |
| [Phase 2](./docs/phases/phase-2.md) | WebAR with model-viewer |
| [Phase 3](./docs/phases/phase-3.md) | Admin dashboard |
| [Phase 4](./docs/phases/phase-4.md) | AI image-to-3D generation |

## Tech Stack

- **Next.js 16** (App Router, React Server Components)
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL, Auth, Storage)
- **Google model-viewer** (Phase 2)
- **Meshy / Tripo AI** (Phase 4)

## Supabase Setup (when ready)

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL Editor
3. Optionally run `supabase/seed.sql`
4. Copy `.env.example` → `.env.local` and fill in credentials
5. Set `USE_MOCK_DATA=false`

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Typecheck
```

## Project Phases

- [x] **Phase 1** — DB schema, mock data, mobile menu UI
- [x] **Phase 2** — `<model-viewer>` WebAR integration
- [x] **Phase 3** — Admin dashboard + QR generator
- [x] **Phase 4** — AI image-to-3D pipeline

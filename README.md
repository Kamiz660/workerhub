# WorkerHub

A direct-contact directory for finding local contract workers in Kerala, currently focused on Koothattukulam.

People use it to find electricians, plumbers, carpenters, painters, technicians, and masons near them. No login wall, no agency middleman, and no service cuts. You tap a worker's listing to call them directly or open a pre-filled WhatsApp chat.

## What it does

- Lists local skilled trades by category and town.
- Provides direct phone calls via `tel:` links and one-tap WhatsApp chat links.
- Lets workers publish a trade listing through a 4-step form with draft recovery.
- Runs without mandatory user accounts for browsing, calling, or initial worker onboarding.
- Supports bilingual English and Malayalam UI copy.

## Tech stack

- Next.js 16 with App Router
- React 19 and TypeScript
- Tailwind CSS with Shadcn UI components
- Framer Motion for UI transitions
- Supabase for PostgreSQL storage and avatar uploads
- Vitest with React Testing Library for automated tests

## Getting started

### Prerequisites

You need Node.js 18 or newer installed on your machine.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Kamiz660/workerhub.git
cd workerhub
npm install
```

### Environment variables

Create a `.env.local` file in the root folder with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

If these variables are missing during local development, the app falls back to local mock data so pages still render.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running tests

Run the test suite with Vitest:

```bash
npm test
```

To run a single test run without watch mode:

```bash
npx vitest run
```

## Project structure

```text
src/
├── app/                  # Next.js App Router pages and routes
│   ├── page.tsx          # Home page with location and trade filters
│   └── workers/
│       ├── page.tsx      # Worker list view
│       └── [id]/         # Worker profile with direct call actions
├── components/           # UI elements and layouts
│   ├── layout/           # Header and footer
│   ├── shared/           # Modal dialogs and trade onboarding form
│   └── ui/               # Base Shadcn UI primitives
├── data/                 # Static fallback data for offline mode
├── features/             # Feature-specific components
├── hooks/                # Custom React hooks (geolocation, draft autosave)
├── lib/                  # Utilities, Supabase client, and data layer (workers-api.ts)
└── services/             # Service functions wrapping the data access layer
```

## Data and security notes

- The `workers` table uses Supabase Row Level Security with public read and insert policies for zero-barrier registration.
- Phone inputs run through basic regex checks to filter repeated and sequential dummy numbers.
- A hidden honeypot input blocks basic bot submissions.

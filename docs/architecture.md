# Project Architecture

This document describes the high-level architecture, directory layout, data flows, and design patterns of the **WorkerHub MVP**.

---

## 1. Architectural Overview

WorkerHub is built as a lightweight, client-focused Next.js application designed to connect users with local contract workers. 

* **Validation over Scale**: In line with the MVP goals, the architecture prioritizes implementation speed, simplicity, and direct client-side integration with Supabase rather than complex backend microservices or server-side middleware.
* **No Authentication / Accounts**: Both workers and clients interact with the site anonymously. Worker registration and searching do not require auth flows, relying instead on Row-Level Security (RLS) rules.
* **Direct Contact Workflows**: Communication happens directly via third-party links (WhatsApp, email, phone calls) rather than in-app messaging.

---

## 2. Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS
* **UI Components**: Shadcn/ui & Framer Motion
* **Database & Storage**: Supabase

---

## 3. Directory Layout

The codebase follows a hybrid structured-by-type and structured-by-feature layout:

```text
src/
├── app/                  # Routing and page containers
│   ├── page.tsx          # Homepage/Landing page orchestrator
│   └── workers/
│       ├── page.tsx      # Worker list (search, filters, & sorting)
│       └── [id]/
│           └── page.tsx  # Worker profile details page
├── components/           # Shared presentation components
│   ├── layout/           # Global Header & Footer
│   ├── shared/           # Reusable page elements (e.g. Add Worker Modal)
│   └── ui/               # Shadcn/ui base primitives
├── data/                 # Static mock data (e.g. initial categories & reviews)
├── features/             # Domain-specific logic grouped by feature
│   ├── home/             # Homepage feature components (CTA Banner, Popular Services)
│   └── search/           # Autocomplete inputs & search logic
├── hooks/                # Custom React hooks (e.g. geolocation)
├── lib/                  # Core client-side modules and utilities
│   ├── constants.ts      # Global event names and constants
│   ├── supabase.ts       # Supabase client instantiation
│   ├── types.ts          # Shared TypeScript interfaces
│   └── workers-api.ts    # Dedicated Data Access Layer (DAL)
└── services/             # Orchestrates calls to data access layers
```

---

## 4. Data Layer & API Architecture

To avoid code sprawl and maintain a clean separation of concerns, all database transactions are centralized:

### Dedicated Data Access Layer (DAL)
All database interactions are managed in [src/lib/workers-api.ts](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/src/lib/workers-api.ts). 
* **Rules**: UI components do not query Supabase directly. They must use the service functions exported by `workers-api.ts`.
* **Safe Fallbacks**: [src/lib/supabase.ts](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/src/lib/supabase.ts) uses resilient string fallbacks for environment variables. This prevents build failures during Vercel builds or server-side prerendering when variables are not configured in the host environment.

### Database Tables & Storage
* **`workers` Table**: Stores records of registered professionals (name, profession, category, location, phone, email, rating, etc.). Protected by basic public SELECT and INSERT RLS policies.
* **`avatars` Storage Bucket**: Public Supabase storage bucket used for worker profile photo uploads.

---

## 5. Security, Validation & Spam Mitigation

* **Zod Schemas**: The `InsertWorkerSchema` defines the shape and rules for new registration inputs.
* **Phone Validation**: The system validates phone numbers using a regular expression to filter out obvious dummy inputs (e.g., repeating digits `99999999` or sequential sequences `12345678`).
* **Honeypot Filter**: A hidden form field `hp_website` is placed in the registration modal. If filled (typically by automated bots), the mutation throws an immediate error.
* **Registration Cooldown**: Duplicate worker additions within a short window (10 minutes) are blocked at the form level.

---

## 6. Component Communication & State Patterns

* **State Boundary Ownership**: Page components (e.g. `src/app/page.tsx`) own the primary asynchronous state (e.g. `workers` array). Secondary components receive this data as read-only props.
* **Decoupled Event Dispatching**: UI triggers (such as clicking "List Yourself" inside CTA banners) interact with global components (like the Add Worker Modal) using standard DOM CustomEvents, preventing deep prop-drilling.
  * `open-add-worker-modal`: Opens the registration modal.
  * `worker-added`: Dispatched after a successful registration to trigger a client-side database refresh.

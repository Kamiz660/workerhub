# Project State Snapshot

## Current Features
- **Browse Workers**: Real-time filtering list directly on the homepage showing local professionals with category, location, rating, and availability badge. Hourly rate is hidden from the grid to focus on direct calling.
- **Autofill Suggestions**: Search inputs for "Location" and "What do you need?" function as autocomplete fields. Suggestions appear only once the user begins typing (minimum 1 character) and hide the generic section headers.
- **Location Check Validation**: Clicking a quick category icon button requires a selected location first. If empty, the interface highlights/toggles the location selector to guide the user.
- **Mobile Redesign**: Optimized mobile UI with left-aligned header logo, avatar (CircleUserRound) icon on header for login, inline map illustration in the hero section, location selector capsule (rounded-xl, emerald-600 text) in the hero text area, single input card for job search.
- **Dual CTA Banner**: Translucent glass-style (bg-blue-600/90 + backdrop-blur-xl) banner with two action paths: "List Yourself" (for workers) and "Add a Worker" (for users who know trusted workers). Both buttons now open the registration modal.
- **Worker Registration Form**: Full registration modal accessible from Header ("List Your Service"), CTA Banner ("List Yourself" / "Add a Worker"), and the results grid tail card. Features progressive disclosure UI, interactive category grid, Zod validation, profile picture upload (max 5MB), duplicate submission prevention (10m cooldown), and a hidden honeypot field.
- **Compact Results Header**: On mobile, the available workers header is simplified into a clean single line showing `{Count} Workers` and a quick "Clear" filter link, maximizing vertical space.
- **Simplified Worker Cards**: Removed "Tap to call" meta info and stripped the "Master" prefix from profession names (e.g. "Master Plumber" -> "Plumber") for clean, readable listings.
- **Fixed Dropdown UX**: Dropdowns render above the main page fold using a high `z-50` stack order.

## Architecture (Supabase Backend Integration Complete)

### Database
- **Supabase Project**: WorkerHub (`rlhvkzmrmxkyfasrdlxm`), region: ap-northeast-1.
- **`workers` table**: Stores all worker records. RLS enabled with public SELECT and INSERT policies.
- **`avatars` storage bucket**: Public bucket for profile picture uploads. RLS policies allow public read and insert.
- **Current Data**: Single `testuser` record for testing. No fake/mock data pre-populated.

### Data Layer
- All database access centralized in `src/lib/workers-api.ts`.
- No direct Supabase calls in UI components.
- `src/services/workers.ts` delegates to workers-api.ts for all async operations.
- Categories and reviews remain static from `src/data/mock-workers.ts`.

### Event System
- Single semantic CustomEvent: `"open-add-worker-modal"` (defined in `src/lib/constants.ts`).
- `"worker-added"` event dispatched after successful registration to trigger local state refresh.

### Validation Layer
- Zod library used for schema-based form validation (`InsertWorkerSchema` in workers-api.ts). Handles optional fields, null insertion for missing stats (hourlyRate, experience), and smart defaults.
- Client-side file validation: max 5MB, JPEG/PNG/WebP only.
- Anti-Spam: Hidden honeypot field validation in API layer and strict phone format regex.

### Hooks
- `src/hooks/use-geolocation.ts` — Browser geolocation + reverse-geocoding. Returns `isLocating` and promise-based `getCurrentLocation()`.

### Feature Modules
- `src/features/search/components/hero-search.tsx` — MobileHeroSearch + DesktopHeroSearch (search inputs, dropdowns, hero headline, illustration).
- `src/features/home/components/cta-banner.tsx` — Self-contained glassmorphic CTA banner with modal triggers.
- `src/features/home/components/how-to-use.tsx` — HowToUseMobile (horizontal) + HowToUseDesktop (vertical sidebar).
- `src/features/home/components/category-grid.tsx` — MobileCategoryGrid + DesktopCategoryRow with callback interface.
- `src/features/home/components/worker-results.tsx` — Worker grid, results header, empty state, loading indicator, and List Your Service card.
- `src/features/home/components/value-props.tsx` — Bottom trust/benefit indicators.

### Page Architecture
- `src/app/page.tsx` — Async orchestrator. Owns workers state, fetches via useEffect with isActive guard, listens for WORKER_ADDED.
- `src/app/workers/page.tsx` — Async worker list with client-side sorting/filtering via useMemo.
- `src/app/workers/[id]/page.tsx` — Async worker profile with loading state.
- Data boundary ownership: Pages own state, hooks own side effects, workers-api owns data access, components render only.

## UI Structure
- Sticky header: Logo on the left, avatar icon on mobile (right), desktop "List Your Service" button (right) — opens registration modal.
- Mobile Layout (top to bottom): Hero area with map illustration → Search card with location + job inputs → Glass CTA banner (dual buttons) → How to Use step indicators → Popular Services grid → Worker results.
- Desktop Layout: Traditional split hero section, category buttons row, and results sidebar with How to Use.
- Category Buttons: Grid of 8 options on mobile for easy single-tap filters.
- Worker detail page features side-by-side info layouts and a sticky bottom CTA on mobile. Supports uploaded profile pictures.

## Current Constraints
- **No Authentication / Accounts**: Both workers and users interact without registration.
- **No Direct Messaging / Real Payments**: All contact links resolve to WhatsApp, phone calls, or mail.
- **Frontend-only DB Writes**: Anonymous client-side inserts via Supabase anon key. RLS is the only security layer. Acceptable for MVP validation.
- **Reviews remain static**: Mock data from `src/data/mock-workers.ts`.

## Current Assumptions
- Autofill lists require typing to avoid blocking input fields on focus.
- Dual CTA serves two user personas: workers listing themselves and community members recommending trusted workers.
- "How to Use" comes before Popular Services on mobile to orient new users.
- "Current Location" button text uses emerald-600 for slightly softer contrast.
- "Master" prefix is unnecessary for localized mobile listings.

## Technical Debt
- Search autocomplete data (categoriesList, popularTowns) is duplicated in hero-search.tsx — could be moved to a shared config.
- Category button data (categoryButtons) lives in category-grid.tsx — shared ownership is fine for now.
- `src/app/workers/page.tsx` has inline filtering/sorting logic that could later move to a service or hook.
- Reviews not yet stored in Supabase — still using static mock data.
- Experiments directory deleted — `src/app/experiments/` route removed.
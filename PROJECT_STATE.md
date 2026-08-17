# Project State Snapshot

## Current Features
- **Browse Workers**: Real-time filtering list directly on the homepage showing local professionals with category, location, rating, and availability badge. Hourly rate is hidden from the grid to focus on direct calling.
- **Airbnb-Inspired Worker Profile Page**: Mature marketplace layout for `src/app/workers/[id]/page.tsx` adhering to an 8px spacing grid:
  - **5-Second Trust Hero Header**: Clean avatar (`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl`), worker name (`font-extrabold text-2xl`), category title, verified badge (`BadgeCheck`), star rating score, location chip, and direct CTAs ("Call Now", "WhatsApp").
  - **Structured Information Flow**: Minimalist Back header -> Hero Card & CTAs -> About Section -> Services Offered Grid -> Airbnb-style Trust & Safety Panel ("Why hire with confidence": Phone Verified, Direct Call, Local Member) -> Customer Reviews -> Mobile Sticky Contact Bar (`fixed bottom-0`).
- **Autofill Suggestions**: Search inputs for "Location" and "What do you need?" function as autocomplete fields. Suggestions appear only once the user begins typing (minimum 1 character) and hide the generic section headers.
- **Location Check Validation**: Clicking a quick category icon button requires a selected location first. If empty, the interface highlights/toggles the location selector to guide the user.
- **Mobile Redesign**: Optimized mobile UI with left-aligned header logo, avatar (User) icon on header for login, inline map illustration in the hero section, location selector capsule (rounded-xl, emerald-600 text) in the hero text area, single input card for job search.
- **Worker Acquisition Funnel (Ultra-Frictionless Registration)**:
  - **4-Step Progressive Wizard**: Information grouped logically (Step 1: Trade Category selection [1-tap start], Step 2: Name & Phone number, Step 3: Location town/district, Step 4: Optional photos/bio/experience boost).
  - **Draft Autosave & Resume**: Form state, step position, and timestamp automatically persisted to `localStorage` (`worker_listing_draft`). Opening registration detects existing drafts and prompts *"Resume your saved draft? [Resume] [Start Fresh]"*.
  - **Exit Protection**: Intercepts accidental modal backdrop clicks when inputs are dirty with a confirmation prompt: *"Discard your listing draft? [Continue Editing] [Discard & Start Over]"*.
  - **Live Worker Card Preview**: Success screen displays instant confirmation (*"🎉 Your listing is live. People in {location} can now find and call you directly."*) alongside a live preview of their published worker profile card.
  - **Post-Submission Account Upsell**: Takes advantage of the sunk-cost effect after publication with a gentle upsell (*"Want to manage or edit your profile later? [Create Free Account]"*).
  - **Funnel Analytics Tracking**: Simple event logger (`trackFunnelEvent`) persisting funnel events (`listing_started`, `category_selected`, `listing_step_completed`, `listing_published`, `account_created_post_submit`) to `localStorage` for data-driven drop-off analysis.
  - **Mobile Sheet UI vs Desktop Modal**: Renders as a full-screen sheet on mobile (`h-full rounded-none sm:rounded-2xl`) and a progress-bar dialog on desktop.
- **Refined Authentication Dialog**:
  - **Default Mode**: Opens in **Sign Up** mode by default (unless explicitly triggered from Header "Log In").
  - **Action Verb Intent Labels**: Replaced abstract role titles with goal-oriented action verbs: **"Hire a worker"** (`auth.intentCustomer`) and **"Offer services"** (`auth.intentWorker`).
  - **Zero-Clutter Log In**: Log In view hides marketing benefit bullets to eliminate cognitive load for returning users.
  - **Desktop SaaS Visual Panel & Spacing Hierarchy**: Features a modern dark-indigo radial backdrop (`bg-[radial-gradient(...)] from-slate-900 via-slate-900 to-indigo-950`), glowing ambient micro-elements, brand badge ("WorkerHub"), interactive glass micro-card ("Local Network Active", "500+ Local Workers"), and strict uppercase label spacing hierarchy (`text-[11px] font-bold uppercase tracking-wider text-slate-700`).
- **Dual CTA Banners (Platform-Specific)**:
  - **Mobile**: Translucent glass-style (`bg-primary/90` + `backdrop-blur-xl`) vertical block with action buttons "List Yourself" and "Add a Worker".
  - **Desktop**: Premium white card with thin border (`border-slate-200/80`), corner glow micro-decorations, Vercel-style vertical gradient divider, once-off mount shimmer, and interactive button hovers. Card 2 ("List Yourself") takes priority with a light-blue background.
- **Compact Results Header**: On mobile, the available workers header is simplified into a clean single line showing `{Count} Workers` and a quick "Clear" filter link.
- **Simplified Worker Cards**: Removed "Tap to call" meta info and stripped "Master" prefix from profession names. Hover transitions use subtle color-temperature shifts.
- **Fixed Dropdown & Stacking UX**: Dropdowns render above the main page fold using a high `z-50` stack order. `DesktopCategoryRow` uses clean positive margin (`mt-4 sm:mt-6`) to prevent hero section stacking context from clipping card tops.
- **Brand Favicon & Identity**: Favicon updated to match the navbar logo (rounded primary-blue container with centered white HardHat emblem) in vector SVG and layout metadata.
- **Design System Update**: Redesigned UI to use `Geist` font for a modern feel. Added a semantic slate-blue `primary` brand color. Replaced generic black shadows with tinted shadows.

## Customizations & Developer Tools
- **Malayalam Localization Skill**: Workspace customization skill at [SKILL.md](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/.agents/skills/malayalam-localization/SKILL.md) for localizing English copy into natural Malayalam.
- **Malayalam Copy Optimizations**: Refined translation values for shorter, direct, and more natural phrasings across both mobile and PC screen sizes (e.g. `Hire a worker` -> "തൊഴിലാളിയെ ആവശ്യമുണ്ട്", `Offer services` -> "സേവനങ്ങൾ നൽകാം").
- **Minimal Offline Toast**: Displays a sleek capsule notification ("Offline mode active") at the bottom of the screen with `z-[9999]` if database connections fail.

## Architecture (Supabase Backend Integration Complete)
- **Architecture Documentation**: Documented in [docs/architecture.md](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/docs/architecture.md).

### Database
- **Supabase Project**: WorkerHub (`rlhvkzmrmxkyfasrdlxm`), region: ap-northeast-1.
- **`workers` table**: Stores all worker records. RLS enabled with public SELECT and INSERT policies.
- **`avatars` storage bucket**: Public bucket for profile picture uploads.

### Data Layer
- All database access centralized in `src/lib/workers-api.ts`.
- `src/services/workers.ts` delegates to workers-api.ts for all async operations.

### Event System
- `EVENTS.OPEN_ADD_WORKER_MODAL` triggers the progressive onboarding funnel.
- `EVENTS.WORKER_ADDED` dispatched after successful registration to refresh home state.

### Hooks & Features
- `src/hooks/use-geolocation.ts` — Geolocation & reverse-geocoding hook.
- `src/components/shared/add-worker-modal.tsx` — 4-step progressive onboarding funnel, draft autosave/resume, exit protection, live card preview, funnel analytics.
- `src/components/shared/auth-dialog.tsx` — Responsive auth dialog with desktop illustration, Sign Up default mode, and verb intent toggles.

## Testing Infrastructure
- **Vitest** configured with `jsdom` environment, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`.
- **Test script**: `npm run test` or `npx vitest run`.
- **Test suites**: 37 passing tests across 8 test suites:
  - `signup.test.ts` (6 tests)
  - `login.test.ts` (7 tests)
  - `session.test.ts` (2 tests)
  - `logout.test.ts` (2 tests)
  - `auth-context.test.tsx` (4 tests)
  - `auth-dialog.test.tsx` (6 tests: zero-clutter login mode, contextual reason headers, signup intent switching with verb labels, password toggle, error display, onSuccess callback execution)
  - `header.test.tsx` (5 tests: loading placeholder, logged-out login button & dialog opening, logged-in user badge & logout action)
  - `browse-workers.test.tsx` (5 tests)

## Product Strategy Decisions
- **Friction Reduction Priority**: Minimize decisions and time to publishing a live listing. Target completion rate over arbitrary time metrics. No upfront account or verification checks required before publishing.
- **Sunk-Cost Post-Submission Account Creation**: Account creation is offered after successful listing submission when user investment is highest.
- **Natural Language Intents**: Uses direct goal-based action verbs ("Hire a worker" / "Offer services") rather than abstract personas ("Customer" / "Worker").
- **Research-Backed Zero-Clutter Log In**: Marketing/benefit bullet cards are hidden in Log In mode to eliminate extraneous cognitive load for returning users.
- **Contextual Auth Checkpoint**: Authentication remembers context reason and resumes target flows via `onSuccess` callbacks.

## Current Assumptions
- Dual CTA serves workers listing themselves and community members recommending trusted workers.
- "How to Use" comes before Popular Services on mobile to orient new users.
- If profile creation fails after auth signup, user metadata `name` is preserved so that subsequent login backfills missing `profiles` row.
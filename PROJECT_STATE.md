# Project State Snapshot

## Current Features

- **Meta Pixel + Conversions API (CAPI) Tracking**:
  - **Deduplicated Dual-Channel Architecture**: Dispatches conversions to both browser Meta Pixel and server-side Conversions API (`/api/meta-capi`) sharing a single `event_id` (UUID) per user action for Meta deduplication.
  - **Tracked Conversion Events**:
    - `ViewContent`: Fired on worker profile view (`/workers/[id]`) with worker profession and category.
    - `Search`: Fired on intentional search button clicks and quick category filter clicks with sanitized query string.
    - `Contact`: Fired on Call Now (`content_name: 'phone_call'`) and WhatsApp (`content_name: 'whatsapp'`) CTA button clicks across worker cards, detail pages, and contact modal.
  - **Zero Customer PII**: Strict privacy guard; no phone numbers, WhatsApp numbers, customer names, or emails are collected or sent to Meta.
  - **Server-Side Token Isolation**: `META_CONVERSIONS_API_TOKEN` remains strictly server-side in the API route handler, never bundled or exposed to the client bundle. Only `NEXT_PUBLIC_META_PIXEL_ID` is public.
  - **Resilient Header & Cookie Handling**: Gracefully extracts client IP (from `x-forwarded-for` / `x-real-ip`) and User-Agent, and optionally forwards `_fbp` and `_fbc` cookies when available.
  - **Test Suite**: Unit test suite in `src/lib/__tests__/meta-tracker.test.ts` verifying dual dispatch, sanitization, and fallback behavior.
- **Koothattukulam Validation Focus (Default Location & Single Service Town)**:
  - **Landing Page Default Location**: Search filters and worker query on the home page initialize with `"Koothattukulam"` by default (`useState("Koothattukulam")`), presenting verified local talent for Koothattukulam validation immediately on first load.
  - **Footer Service Town**: Cleaned up the footer's service town listing to exclusively feature **Koothattukulam** (*"Serving Koothattukulam & nearby local areas."*).
- **Local-First Instant Search with Background Supabase Sync**:
  - **0ms Instant Query Resolution**: `src/services/workers.ts` resolves searches immediately against the local seed dataset (`USE_LOCAL_CACHE_FIRST = true`), eliminating network wait states and loading freezes.
  - **Resilient Supabase Sync & Timeout Guard**: Asynchronously queries Supabase with a 1.5s timeout and merges newly registered remote workers (Supabase records take precedence, deduplicated by `id`).
  - **100% Offline & Error Fallback**: If Supabase is offline or times out, searches and profile lookups seamlessly return local seed matches without showing empty directory states.
  - **Modular Migration Switch**: `USE_LOCAL_CACHE_FIRST` flag enables switching back to pure direct Supabase queries with a single line change post-validation.
- **Verified Live Service Providers in Koothattukulam (`src/data/workers.ts`)**:
  - **Vishnu Sajeevan** (`w25`): Electrician & Plumber (`+91 95269 48845`, `vishnusajeevan38@gmail.com`). Matches searches for both Electrician and Plumber.
  - **Ken Mathew** (`w26`): Electrician & Plumber (`+91 98464 78464`, `kenkm07@gmail.com`). Matches searches for both Electrician and Plumber.
  - **Sajeev P K** (`w27`): Electrician & Plumber (`+91 99613 50862`). Matches searches for both Electrician and Plumber.
- **Dark-Blue to Accent-Blue Gradient Footer**:
  - **Color & Atmosphere**: Features a rich gradient background (`bg-gradient-to-b from-slate-900 via-blue-900 to-blue-950 text-slate-200`) accented with a subtle top radial ambient glow (`bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(37,99,235,0.28),transparent)]`).
  - **Live Marketplace Status Strip**: Top horizontal strip with a pulsing emerald beacon (*"Live Local Marketplace in Kerala"*) and key directory pillars (*"100% Direct Calling"*, *"Zero Commission"*, *"Free for Community"*).
  - **Skilled Worker Registration Hero Card**: Inset card in the brand column (*"Are you a skilled worker?"*) with a one-tap `"List Your Trade Free"` trigger for the onboarding wizard.
  - **Interactive Category Links**: Icon-infused category links for Electrician, Plumber, Carpenter, Painter, Technician, and Mason.
  - **Trust & Direct Dial Box**: Explains zero-barrier calling without logins or agency middle-men.
  - **Sub-Footer**: Localization-aware copyright, Kerala community badge with heart emblem, and town origin.
- **Browse Workers**: Real-time filtering list directly on the homepage showing local professionals with category, location, rating, and availability badge. Hourly rate is hidden from the grid to focus on direct calling.
- **Worker Profile Page Direct Contact & Visual Surface System**:
  - **Clean White Desktop Contact Panel**: Sits in a structured white card (`bg-white rounded-2xl border border-slate-200/90 shadow-md p-6`) with high-contrast primary blue **"Call Now"** button and emerald **"Chat on WhatsApp"** button.
  - **Centered CTA Text (No Icon Offset)**: "Call Now" and "Chat on WhatsApp" buttons pin their icons to the left with absolute positioning (`absolute left-5` / `left-4`), ensuring button text is centered with geometric precision across the button width.
  - **Angled Blue Diagonal Background & Light Streak**: Full-page container uses a dynamic angled blue gradient backdrop with an illuminated diagonal light streak.
  - **Elevated Translucent Hero Profile Sheet**: Refined `rounded-3xl` container with subtle glassmorphic transparency (`bg-white/80 backdrop-blur-md border border-white/60 shadow-lg`), crisp avatar borders, authoritative name typography, and Service Area block.
  - **Services Offered Layer**: Sits in refined `bg-gradient-to-br from-blue-200 via-blue-100/20 to-white` surface with crisp borders.
  - **Zero Fake Reviews & Clean Review Layer**: Stripped all artificial reviews and fake scores. The review section cleanly reflects genuine customer feedback.
  - **Single Status Signal**: Clean green `• Available` status badge kept in the primary contact card/sticky bar.
  - **Report Profile Feature**: Interactive report dialog accessible via a subtle flag link on both desktop sidebar and mobile profile view.
  - **Native Calling & WhatsApp**: Direct `tel:` links opening native dialers, and WhatsApp buttons generating direct `https://wa.me/<digits>?text=...` URLs.
- **Contact Modal Refinements**: Email option removed from quick contact modal; only active, entered phone/WhatsApp methods are shown without cluttering disabled states.
- **Autofill Suggestions**: Search inputs for "Location" and "What do you need?" function as autocomplete fields. Suggestions appear only once the user begins typing (minimum 1 character) and hide the generic section headers.
- **Location Check Validation**: Clicking a quick category icon button requires a selected location first. If empty, the interface highlights/toggles the location selector to guide the user.
- **Mobile Redesign**: Optimized mobile UI with left-aligned header logo, avatar (User) icon on header for login, inline map illustration in the hero section, location selector capsule (rounded-xl, emerald-600 text) in the hero text area, single input card for job search.
- **Worker Acquisition Funnel (Ultra-Frictionless Registration)**:
  - **4-Step Progressive Wizard**: Information grouped logically (Step 1: Trade Category selection [1-tap start], Step 2: Name & Phone number, Step 3: Location town/district, Step 4: Optional photos/bio/experience boost).
  - **Draft Autosave & Resume**: Form state, step position, and timestamp automatically persisted to `localStorage` (`worker_listing_draft`).
  - **Exit Protection**: Intercepts accidental modal backdrop clicks when inputs are dirty with confirmation prompt.
  - **Live Worker Card Preview**: Success screen displays instant confirmation alongside a live preview of the published worker profile card.
  - **Post-Submission Account Upsell**: Takes advantage of the sunk-cost effect after publication with a gentle upsell.
  - **Funnel Analytics Tracking**: Simple event logger (`trackFunnelEvent`) persisting funnel events (`listing_started`, `category_selected`, `listing_step_completed`, `listing_published`, `account_created_post_submit`) to `localStorage`.
- **Refined Authentication Dialog**:
  - **Default Mode**: Opens in **Sign Up** mode by default.
  - **Action Verb Intent Labels**: Replaced abstract role titles with goal-oriented action verbs: **"Hire a worker"** and **"Offer services"**.
  - **Zero-Clutter Log In**: Log In view hides marketing benefit bullets to eliminate cognitive load for returning users.
- **Dual CTA Banners (Platform-Specific)**:
  - **Mobile**: Translucent glass-style (`bg-primary/90` + `backdrop-blur-xl`) vertical block with action buttons "List Yourself" and "Add a Worker".
  - **Desktop**: Premium white card with thin border (`border-slate-200/80`), corner glow micro-decorations, Vercel-style vertical gradient divider, once-off mount shimmer, and interactive button hovers.
- **Spacious Authentic Human Worker Cards**:
  - Elevated person card with `rounded-3xl` container, generous `w-16 h-16 rounded-2xl` gradient avatar with verified shield, prominent trade title, and bold dark location badge. Includes an interactive profile chevron arrow (`>`). All fake ratings stripped.
  - Live availability signal (*"Available for calls & visits"*).
  - Verified trust badge (*"Phone & Identity Verified"*).
  - Dual direct actions ("Call Now" and "WhatsApp").

## Customizations & Developer Tools

- **Unslop Writing Skill**: Workspace customization skill at [.agents/skills/unslop/SKILL.md](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/.agents/skills/unslop/SKILL.md) to strip AI writing tells and enforce human voice across all documentation.
- **Malayalam Localization Skill**: Workspace customization skill at [.agents/skills/malayalam-localization/SKILL.md](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/.agents/skills/malayalam-localization/SKILL.md) for localizing English copy into natural Malayalam.
- **Contact Utilities**: `src/lib/contact.ts` centralizes phone normalization (`normalizePhoneNumberForWhatsApp`), `tel:` link generation (`getTelLink`), and WhatsApp URL generation (`getWhatsAppLink`).
- **Meta Tracker Utility**: `src/lib/meta-tracker.ts` centralizes dual-channel dispatch (`trackMetaConversion`) and search query sanitization.

## Architecture

### Backend & API
- **Supabase**: WorkerHub (`rlhvkzmrmxkyfasrdlxm`), region: ap-northeast-1.
- **Meta Conversions API Route**: `src/app/api/meta-capi/route.ts` handles server-side event delivery to Meta Graph API v21.0.

### Hooks & Features
- `src/hooks/use-geolocation.ts` — Geolocation & reverse-geocoding hook.
- `src/components/shared/add-worker-modal.tsx` — 4-step progressive onboarding funnel.
- `src/components/shared/auth-dialog.tsx` — Responsive auth dialog.

## Testing Infrastructure

- **Vitest** configured with `jsdom` environment, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`.
- **Test script**: `npm run test` or `npx vitest run`.
- **Test suites**: Contact utilities (`contact.test.ts`), Meta tracking (`meta-tracker.test.ts`), Auth, Session, Header, Browse Workers. 57 passing tests.

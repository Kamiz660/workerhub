# Project State Snapshot

## Current Features

- **Koothattukulam Validation Focus (Default Location & Single Service Town)**:
  - **Landing Page Default Location**: Search filters and worker query on the home page initialize with `"Koothattukulam"` by default (`useState("Koothattukulam")`), presenting verified local talent for Koothattukulam validation immediately on first load.
  - **Footer Service Town**: Cleaned up the footer's service town listing to exclusively feature **Koothattukulam** (*"Serving Koothattukulam & nearby local areas."*).
- **Local-First Instant Search with Background Supabase Sync**:
  - **0ms Instant Query Resolution**: `src/services/workers.ts` resolves searches immediately against the local seed dataset (`USE_LOCAL_CACHE_FIRST = true`), eliminating network wait states and loading freezes.
  - **Resilient Supabase Sync & Timeout Guard**: Asynchronously queries Supabase with a 1.5s timeout and merges newly registered remote workers (Supabase records take precedence, deduplicated by `id`).
  - **100% Offline & Error Fallback**: If Supabase is offline or times out, searches and profile lookups seamlessly return local seed matches without showing empty directory states.
  - **Modular Migration Switch**: `USE_LOCAL_CACHE_FIRST` flag enables switching back to pure direct Supabase queries with a single line change post-validation.
- **Verified Service Providers in Koothattukulam**:
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
  - **Clean White Desktop Contact Panel**: Sits in a structured white card (`bg-white rounded-2xl border border-slate-200/90 shadow-md p-6`) with high-contrast primary blue **"Call Now"** button (`bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-xs hover:shadow-md`) and emerald **"Chat on WhatsApp"** button (`bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12`).
  - **Centered CTA Text (No Icon Offset)**: "Call Now" and "Chat on WhatsApp" buttons pin their icons to the left with absolute positioning (`absolute left-5` / `left-4`), ensuring button text is centered with geometric precision across the button width.
  - **Angled Blue Diagonal Background & Light Streak**: Full-page container uses a dynamic angled blue gradient backdrop with an illuminated diagonal light streak, giving the page a modern, high-energy visual atmosphere.
  - **Elevated Hero Profile Sheet**: Clean white `rounded-3xl` container elevated with `shadow-md`, crisp avatar borders (`border-2 border-primary/20`), authoritative name typography, 4-item directory credentials strip (Location, Experience, Service mode, Direct Contact), editorial bio, and Service Area block (_"Serves {location} & nearby areas"_).
  - **Services Offered Layer**: Sits in refined `bg-gradient-to-br from-blue-200 via-blue-100/20 to-white` surface with crisp borders.
  - **Single Status Signal**: Clean green `• Available` status badge kept in the primary contact card/sticky bar, removing redundant duplicate header indicators.
  - **Prominent Navigation**: High-contrast "Back to search" action button with a translucent circular glass container and hover transitions.
  - **Report Profile Feature**: Interactive report dialog accessible via a subtle flag link on both desktop sidebar and mobile profile view, allowing users to report inactive numbers or invalid listings with instant feedback.
  - **Native Calling & WhatsApp**:
    - **Native Calling**: Direct `tel:` links opening native dialers.
    - **Official WhatsApp Click-to-Chat**: WhatsApp buttons generating direct `https://wa.me/<digits>?text=...` URLs with pre-filled enquiry message.
- **Contact Modal Refinements**: Email option removed from quick contact modal; only active, entered phone/WhatsApp methods are shown without cluttering disabled states.
- **Autofill Suggestions**: Search inputs for "Location" and "What do you need?" function as autocomplete fields. Suggestions appear only once the user begins typing (minimum 1 character) and hide the generic section headers.
- **Location Check Validation**: Clicking a quick category icon button requires a selected location first. If empty, the interface highlights/toggles the location selector to guide the user.
- **Mobile Redesign**: Optimized mobile UI with left-aligned header logo, avatar (User) icon on header for login, inline map illustration in the hero section, location selector capsule (rounded-xl, emerald-600 text) in the hero text area, single input card for job search.
- **Worker Acquisition Funnel (Ultra-Frictionless Registration)**:
  - **4-Step Progressive Wizard**: Information grouped logically (Step 1: Trade Category selection [1-tap start], Step 2: Name & Phone number, Step 3: Location town/district, Step 4: Optional photos/bio/experience boost).
  - **Draft Autosave & Resume**: Form state, step position, and timestamp automatically persisted to `localStorage` (`worker_listing_draft`). Opening registration detects existing drafts and prompts _"Resume your saved draft? [Resume] [Start Fresh]"_.
  - **Exit Protection**: Intercepts accidental modal backdrop clicks when inputs are dirty with a confirmation prompt: _"Discard your listing draft? [Continue Editing] [Discard & Start Over]"_.
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
- **Spacious Human-First Worker Cards**:
  - **Human Identity & Credibility**: Elevated person card with `rounded-3xl` container, generous `w-16 h-16 rounded-2xl` gradient avatar with verified shield, prominent trade title, and rating + location row.
  - **Live Availability Signal**: Pulsing emerald live beacon (*"Available for calls & visits"*) with experience tag.
  - **Service Specialties**: Displays key service tag pills (e.g. `House Wiring`, `Pipe Repair`, `Inverter Setup`) directly on the card so users understand exact capabilities at a glance.
  - **Dual Direct Actions**: High-contrast **"Call Now"** direct dialer button and emerald **"WhatsApp"** direct chat button with generous padding and micro-interactions.
  - **Spacious Grid Rhythm**: Relaxed `gap-6` spacing across desktop and mobile, with proportional `rounded-3xl` tail card for listing services.
- **Fixed Dropdown & Stacking UX with Status Indicators**:
  - **Option Visibility & Grayed-Out States**: Dropdowns for both Location and Job/Profession display all platform options.
    - **Active Options** (e.g. Koothattukulam for town; Electrician and Plumber for trade) are fully clickable with bold high contrast text and a glowing emerald **green dot** indicator.
    - **Unadded Options** (e.g. Muvattupuzha, Piravom; Carpenter, Painter, Mason, etc.) are rendered with clear darkened slate text/icons (`text-slate-600 font-semibold`) and a subtle slate **"Coming Soon"** (`"ഉടൻ വരും"`) badge on the right.
  - **Test User Filtering**: Hardened query filters in `workers.ts` and `worker-results.tsx` to automatically strip any legacy testuser records.
  - **Stacking Context**: `DesktopHeroSearch` is configured with `relative z-30`, with `relative z-30` for Location and `relative z-20` for Job, while `DesktopCategoryRow` sits at `relative z-10` with `-mt-2 sm:-mt-6` margins. On mobile, search card fields are layered in descending stacking order (`z-30` Location, `z-20` Job, `z-10` Search button) and support immediate `onMouseDown`/`onClick` tap handlers to prevent mobile keyboard dismissal blur cancellations.
- **Navbar & Navigation Interaction**:
  - **Smooth Scroll to Top**: Clicking the WorkerHub logo in the top navbar smoothly scrolls the window to top with the search hero in full view.
- **Mobile Hero Vertical Breathing Room**:
  - Relaxed vertical padding (`pt-6 pb-6`) and line-height (`leading-[1.18]`) on the mobile hero header container, creating balanced vertical spacing between the navbar, headline text, and search input card without horizontal shift.
- **Brand Favicon & Identity**: Favicon updated to match the navbar logo (rounded primary-blue container with centered white HardHat emblem) in vector SVG and layout metadata.
- **Design System Update**: Redesigned UI to use `Geist` font for a modern feel. Added a semantic slate-blue `primary` brand color. Replaced generic black shadows with tinted shadows.

## Customizations & Developer Tools

- **Unslop Writing Skill**: Workspace customization skill at [.agents/skills/unslop/SKILL.md](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/.agents/skills/unslop/SKILL.md) to strip AI writing tells and enforce human voice across all documentation.
- **Malayalam Localization Skill**: Workspace customization skill at [.agents/skills/malayalam-localization/SKILL.md](file:///c:/GAMES%20G/Code/APP/Antigravity%20porjects/WorkerHub/.agents/skills/malayalam-localization/SKILL.md) for localizing English copy into natural Malayalam.
- **Malayalam Copy Optimizations**: Refined translation values for shorter, direct, and more natural phrasings across both mobile and PC screen sizes (e.g. `Hire a worker` -> "തൊഴിലാളിയെ ആവശ്യമുണ്ട്", `Offer services` -> "സേവനങ്ങൾ നൽകാം").
- **Contact Utilities**: `src/lib/contact.ts` centralizes phone normalization (`normalizePhoneNumberForWhatsApp`), `tel:` link generation (`getTelLink`), and WhatsApp URL generation (`getWhatsAppLink`).
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
- **Test suites**: Contact utilities (`contact.test.ts`), Auth, Session, Header, Browse Workers.

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

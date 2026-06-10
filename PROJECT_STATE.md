# Project State Snapshot

## Current Features
- **Browse Workers**: Real-time filtering list directly on the homepage showing local professionals with categories, locations, hourly rate, experience, rating, and availability badge.
- **1:1 Reference Search Layout**: Form-row search widget with readable sentence-case labels ("Location" and "What do you need?") and a prominent "Search Workers" button.
- **Inline Trust Signals**: Compact trust badges ("100% Free", "Local Workers", "Call Directly") displayed in the hero section below the search form for early confidence building.
- **Auto-Scroll on Search/Category**: Clicking "Search Workers" or any category quick-select button smoothly scrolls the viewport to the "Available Local Workers" section with proper sticky-header offset (80px).
- **Fixed Dropdown UX**: Removed `overflow-hidden` from the hero section so job/location dropdowns render correctly without clipping. Both dropdowns use `z-50` and open on focus/input. Location and job fields have explicit z-index hierarchy to prevent overlap.
- **Worker Hero Illustration**: Flat vector graphic of three skilled professionals in the hero section (desktop only), featuring a community trust badge overlay. City background opacity at 80% for higher contrast.
- **Spread Category Bar**: 8 category icon buttons use `justify-between` on desktop to spread evenly across the full content width. Horizontally scrollable on mobile with hidden scrollbar, larger touch targets (min-w-72px, p-2.5), and increased icon/label sizes.
- **Consistent Alignment System**: All sections (hero, categories, worker grid, footer) share the same container pattern — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` applied on the inner container — ensuring all left and right content edges align precisely on every breakpoint.
- **Dual Column Grid**:
  - **Left Column**: Real-time worker listings with clean cards showing price (₹/hr), rating counts, location, "Tap to call" indicator, and solid blue "Call Now" CTA buttons.
  - **Right Column (desktop)** / **Top (mobile via order-first)**: "How to Use" card showing a vertical 4-step process guide.
- **Bottom Value Propositions**: 2×2 grid on mobile, 4-column on desktop — 4 badge indicators (100% Free, Local & Trusted, Call Directly, Quick & Easy).
- **Sticky Mobile CTA on Worker Detail Page**: Fixed bottom bar with "Contact {Name} — Call Now" button that remains visible regardless of scroll position. Desktop CTA remains inline in the profile header.

## UI Structure
- Sticky header with HardHat icon logo, "List Your Service" button hidden on mobile (visible sm+).
- Logo: blue rounded square with `HardHat` lucide icon + "WorkerHub" wordmark.
- Landing page (`/`) serves as the primary real-time search and browse console.
- Mobile-optimized hero: smaller heading (text-2xl), tighter spacing, inline trust signals.
- Worker cards: price badge, compact meta row (location + "Tap to call"), solid blue CTA.
- Worker detail page: side-by-side avatar layout on all screen sizes, sticky bottom CTA on mobile, larger back button touch target (min-h-44px), bottom padding to clear sticky bar.

## Current Constraints
- **No Backend Database**: Statically typed client-side mock data with 24 professionals.
- **No Authentication / Accounts**: Both workers and users interact without registration.
- **No Direct Messaging / Real Payments**: All contact links resolve to WhatsApp, phone calls, or mail.

## Current Assumptions
- Single content rail at `max-w-7xl` with consistent `px-4 sm:px-6 lg:px-8` on the inner container creates a unified left/right edge across all sections.
- Mobile categories use a horizontal scroll container (no wrapping, hidden scrollbar) with larger icons/text for thumb-friendly interaction.
- "How to Use" section shows first on mobile (order-first) to guide first-time users before they see worker cards.
- Trust signals are duplicated: compact inline version in hero (for early confidence) and detailed bottom value proposition bar.
- Worker card phone numbers are hidden behind the "Call Now" CTA to funnel contact intent through the modal for potential future analytics.
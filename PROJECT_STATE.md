# Project State Snapshot

## Current Features
- **Browse Workers**: Real-time filtering list directly on the homepage showing local professionals with categories, locations, hourly rate, experience, rating, and availability badge.
- **1:1 Reference Search Layout**: Form-row search widget with readable sentence-case labels ("Location" and "What do you need?") and a prominent "Search Workers" button featuring a custom `UserSearch` icon.
- **Hero Description**: A clean secondary paragraph subtext ("Select your town, choose the work you need...") left-aligned on all viewports.
- **Compact Trust Signals**: Minimal inline trust badges ("100% Free", "Local Workers", "Call Directly") centered below the search inputs container on mobile, taking minimal space.
- **Auto-Scroll on Search/Category**: Clicking "Search Workers" or any category quick-select button smoothly scrolls the viewport to the "Available Local Workers" section with proper sticky-header offset (80px).
- **Fixed Dropdown UX**: Removed `overflow-hidden` from the hero section so job/location dropdowns render correctly without clipping. Both dropdowns use `z-50` and open on focus/input. Location and job fields have explicit z-index hierarchy to prevent overlap.
- **Worker Hero Illustration**: Flat vector graphic of three skilled professionals in the hero section (desktop only), featuring a community trust badge overlay. City background opacity at 80% for higher contrast.
- **Spread Category Bar**: 8 category icon buttons use `justify-between` on desktop. On mobile, it scrolls horizontally with hidden scrollbars and uses `-mx-4 px-4` negative margin formatting to avoid abrupt margin clipping.
- **List Your Service Grid Tail Card**: Integrated as the last/tail item within the workers grid. Mimics the exact border size and rounded corners (`rounded-2xl`) of the worker cards but with a dashed, clickable-style light-blue border (`border-blue-200`), plus icon, and a CTA invitation.
- **Consistent Alignment System**: All sections (hero, categories, worker grid, footer) share the same container pattern — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` applied on the inner container.
- **Dual Column Grid**:
  - **Left Column**: Real-time worker listings with clean cards showing price (₹/hr), rating counts, location, "Tap to call" indicator, and solid blue "Call Now" CTA buttons.
  - **Right Column (desktop)** / **Top (mobile via order-first)**: "How to Use" card showing a vertical 4-step process guide left-aligned on all viewports.
- **Bottom Value Propositions**: 2×2 grid on mobile, 4-column on desktop — 4 badge indicators (100% Free, Local & Trusted, Call Directly, Quick & Easy).
- **Sticky Mobile CTA on Worker Detail Page**: Fixed bottom bar with "Contact {Name} — Call Now" button that remains visible regardless of scroll position. Desktop CTA remains inline in the profile header.

## UI Structure
- Sticky header with HardHat icon logo centered on mobile, "List Your Service" button hidden on mobile (visible sm+) and styled with a lighter `border-blue-600/40` thin border effect.
- Logo: blue rounded square with `HardHat` lucide icon + "WorkerHub" wordmark.
- Landing page (`/`) serves as the primary real-time search and browse console.
- Mobile-optimized hero: left-aligned heading and description, but centered compact trust signals on mobile below the search bar. Spacing added above the Search button on mobile layout.
- Worker cards: price badge, compact row, solid blue CTA.
- Worker detail page: side-by-side avatar layout, sticky bottom CTA on mobile.

## Current Constraints
- **No Backend Database**: Statically typed client-side mock data with 24 professionals.
- **No Authentication / Accounts**: Both workers and users interact without registration.
- **No Direct Messaging / Real Payments**: All contact links resolve to WhatsApp, phone calls, or mail.

## Current Assumptions
- Mobile categories use a horizontal scroll container (no wrapping, hidden scrollbar) extending fully to screen edges.
- "How to Use" section shows first on mobile (order-first) and maintains standard left alignment.
- Trust signals are duplicated: minimal inline version in hero and detailed bottom value proposition bar.
- Worker card phone numbers are hidden behind the "Call Now" CTA to funnel contact intent through the modal for potential future analytics.
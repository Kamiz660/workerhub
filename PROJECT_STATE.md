# Project State Snapshot

## Current Features
- **Browse Workers**: Real-time filtering list directly on the homepage showing local professionals with category, location, rating, and availability badge. Hourly rate is hidden from the grid to focus on direct calling.
- **Autofill Suggestions**: Search inputs for "Location" and "What do you need?" function as autocomplete fields. Suggestions appear only once the user begins typing (minimum 1 character) and hide the generic section headers.
- **Location Check Validation**: Clicking a quick category icon button requires a selected location first. If empty, the interface highlights/toggles the location selector to guide the user.
- **Mobile Redesign**: Optimized mobile UI with left-aligned header logo, prominent "+" button on the header, inline map illustration in the hero section, location selector capsule in the hero text area, single input card for job search, 4x2 popular services card grid, and a custom horizontal "How to Use" card replacing the trusted banner.
- **Compact Results Header**: On mobile, the available workers header is simplified into a clean single line showing `{Count} Workers` and a quick "Clear" filter link, maximizing vertical space.
- **Simplified Worker Cards**: Removed "Tap to call" meta info and stripped the "Master" prefix from profession names (e.g. "Master Plumber" -> "Plumber") for clean, readable listings.
- **Fixed Dropdown UX**: Dropdowns render above the main page fold using a high `z-50` stack order.

## UI Structure
- Sticky header: Logo on the left and desktop/mobile buttons on the right.
- Mobile Layout: Hero area with location selector capsule, map illustration, a search card, Popular Services grid, and the How to Use step indicators card.
- Desktop Layout: Traditional split hero section, category buttons row, and results sidebar.
- Category Buttons: Grid of 8 options on mobile for easy single-tap filters.
- Worker detail page features side-by-side info layouts and a sticky bottom CTA on mobile.

## Current Constraints
- **No Backend Database**: Statically typed client-side mock data with 24 professionals.
- **No Authentication / Accounts**: Both workers and users interact without registration.
- **No Direct Messaging / Real Payments**: All contact links resolve to WhatsApp, phone calls, or mail.

## Current Assumptions
- Autofill lists require typing to avoid blocking input fields on focus.
- "How to Use" is visually secondary on mobile to keep focus on search and action.
- "Master" prefix is unnecessary for localized mobile listings.
# Available Components Registry

Before creating a new UI component, check this list to see if a reusable pattern already exists. Reusing components is critical for speed and design consistency.

## Shared UI (`src/components/shared/` or similar)
*(List your custom shared buttons, cards, modals, etc. here as you build them)*
- **Add Worker Modal**: Used for adding/contacting workers (example).
- ...

## Shadcn/UI (`src/components/ui/`)
This project uses Shadcn. Check here for base primitives before writing raw HTML elements:
- Button
- Input
- Dialog
- Card
- (Add more as they are installed)

## Features (`src/features/`)
*(List your domain-specific components here so agents don't recreate them)*
- **CTA Banner**: For call-to-actions on the home page.
- **Worker Profile**: The standard profile display layout.

---
**AI Instruction**: Whenever you create a new, highly reusable component, update this file so future agents know it exists.

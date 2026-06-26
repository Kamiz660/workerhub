# Design Spec: Friction-Reduction, Social Proof, and Micro-interactions

This document outlines the design changes for introducing micro-interactions, social proof badging, perceived effort reductions, and tactile spring feedback across key user action targets on WorkerHub.

## Goals
* **Lower Perceived Effort:** Reassure the user that key actions (adding workers, listing self) are simple, free, and fast.
* **Warm-Room Effect:** Make the marketplace feel alive, active, and trustworthy through subtle presence badging and activity stacks.
* **Satisfying Tactility:** Make buttons feel physical, responsive, and satisfying using spring-like click scaling.
* **Natural Focus Anchoring:** Shift card temperature/chroma on hover to draw focus to clickable elements without layout disruption.

---

## Component Specifications

### 1. CTA Banners (`cta-banner.tsx`)

#### Desktop Banner
* **"Add a Worker" Card (Button 1):**
  * **Header Badge:** Render a small grey badge `Takes 60s` next to the main card title.
  * **Social Presence Footer:** Add a text line `Active in your area` with a small green status indicator dot that pulses dynamically.
  * **Tactile Spring:** Apply `active:scale-[0.98]` transition class on click.
* **"List Yourself" Card (Button 2):**
  * **Header Badge:** Render a small green badge `Always Free` next to the main card title.
  * **Social Presence Footer:** Add a text line `Join 40+ active workers` next to three overlapping initials placeholders (`JD`, `MK`, `TL`) styled using current brand colors.
  * **Hover State Chroma:** Swap hover background from translucent gradient to a very soft primary brand color tint (`hover:bg-primary/[0.02]`) and its border to a soft brand border (`hover:border-primary/30`).
  * **Tactile Spring:** Apply `active:scale-[0.98]` transition class on click.

#### Mobile Banner
* Update both mobile action buttons from `active:scale-[0.97]` to `active:scale-[0.98]` for consistency.

---

### 2. General Navigation (`header.tsx`)
* **"List Your Service" Button:**
  * Add `active:scale-[0.98] transition-transform` to make the primary navigation action feel springy and tactile.

---

### 3. Worker Cards & Grid (`worker-card.tsx`, `worker-results.tsx`)

#### Worker Card
* **Hover State Chroma:** Instead of generic shadow shifts, modify `Card` classes to shift background to `hover:bg-primary/[0.02]` and border to `hover:border-primary/30` over a `duration-300` transition.

#### Grid Tail Card ("List Your Service")
* **Header Badge:** Render a small grey badge `Always Free` next to the main card title.
* **Hover State Chroma:** Shift background to `hover:bg-primary/[0.02]` and border to `hover:border-primary/30` on hover.
* **Tactile Spring:** Apply `active:scale-[0.98]` on click.

---

### 4. Global Button Spring (`button.tsx`)
* **Shadcn Button Component:**
  * Replace the translate-y offset (`active:not-aria-[haspopup]:translate-y-px`) with scale transition `active:scale-[0.98]` in `buttonVariants` to globally propagate tactile click feedback to components like "Call Now" buttons.

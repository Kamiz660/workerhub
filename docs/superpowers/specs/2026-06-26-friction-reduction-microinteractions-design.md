# Design Spec: Friction-Reduction, Trust Chips, and Micro-interactions

This document outlines the design changes for introducing trust chips, micro-interactions, genuine database-driven social proof, and tactile spring feedback across key user action targets on WorkerHub.

## Goals
* **Lower Perceived Effort & Friction:** Reassure the user that key actions (adding workers, listing self) are simple, free, and fast.
* **Genuine Trust & Social Proof:** Avoid fabricated activity metrics. Fetch real database counts dynamically for active workers, and use standard copy to represent general community availability.
* **Add Trust Chips:** Address immediate conversion barriers upfront (Free to list, No signup, Contact directly) near search inputs.
* **Satisfying Tactility:** Make buttons feel physical and responsive using spring-like click scaling (`active:scale-[0.98] transition-all duration-150 ease-out`).
* **Natural Focus Anchoring:** Shift card temperature/chroma and border lines on hover to draw focus to clickable elements without layout disruption.

---

## Component Specifications

### 1. Trust Chips (`hero-search.tsx`)
Render a clean horizontal row of trust indicators directly below search boxes:
* **Desktop:** `✓ Free to list   ✓ No signup   ✓ Contact workers directly`
* **Mobile:** `✓ Free to list   ✓ No signup   ✓ Direct contact` (rendered inside a light, rounded container).

### 2. CTA Banners (`cta-banner.tsx`)

#### Desktop Banner
* **"Add a Worker" Card (Button 1):**
  * **Header Badge:** Render a small grey badge `About 1 minute` next to the main card title.
  * **Presence Footer:** Add a text line `Workers are joining every week` (honest status, no fake indicators).
  * **Tactile Spring:** Apply `active:scale-[0.98] transition-all duration-150 ease-out` on click.
* **"List Yourself" Card (Button 2):**
  * **Header Badge:** Render a small green badge `Always Free` next to the main card title.
  * **Presence Footer:** Query the database for the active worker count using a lightweight Supabase `head` request.
    * If count is successfully fetched and > 0, render: `Join {count} workers already listed`.
    * Fallback (if loading or count is 0): `Free to list your services`.
  * **Hover State Chroma:** Swap hover background to a very soft primary brand color tint (`hover:bg-primary/[0.02]`) and its border to a soft brand border (`hover:border-primary/30 hover:shadow-md`) to combine subtle depth and chroma shift.
  * **Tactile Spring:** Apply `active:scale-[0.98] transition-all duration-150 ease-out` on click.

#### Mobile Banner
* Update both mobile action buttons from `active:scale-[0.97]` to `active:scale-[0.98] transition-all duration-150 ease-out`.

---

### 3. General Navigation (`header.tsx`)
* **"List Your Service" Button:**
  * Add `active:scale-[0.98] transition-all duration-150 ease-out` to make the primary navigation action feel springy and tactile.

---

### 4. Worker Cards & Grid (`worker-card.tsx`, `worker-results.tsx`)

#### Worker Card
* **Hover State Chroma:** Modify `Card` classes to shift background to `hover:bg-primary/[0.02]`, border to `hover:border-primary/30`, and add `hover:shadow-md` over a `duration-300` transition.

#### Grid Tail Card ("List Your Service")
* **Header Badge:** Render a small grey badge `Always Free` next to the main card title.
* **Hover State Chroma:** Shift background to `hover:bg-primary/[0.02]` and border to `hover:border-primary/30` on hover.
* **Tactile Spring:** Apply `active:scale-[0.98] transition-all duration-150 ease-out` on click.

---

### 5. Global Button Spring (`button.tsx`)
* **Shadcn Button Component:**
  * Replace the translate-y offset (`active:not-aria-[haspopup]:translate-y-px`) with scale transition `active:scale-[0.98]` and ensure `transition-all duration-150 ease-out` is fully configured inside `buttonVariants` CVA configuration.
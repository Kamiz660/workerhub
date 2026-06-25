# DESIGN.md

## Design Philosophy

The product should feel **trustworthy, highly polished, and professional**. It must prioritize a clean, light-theme utility layout that feels like a premium consumer service.

Users should feel:
* **This is highly professional:** The interface is clean, crisp, and high-quality, giving them instant confidence.
* **This is a trustworthy utility:** Not a futuristic start-up concept or gaming portal, but a solid, real-world utility for finding local help.
* **Finding help is effortless:** Clean search boxes, direct text hierarchy, and rapid response.

Avoid designs that feel:
* **Heavy and dark:** No dark mode homepages or heavy slate-900 backdrops, which feel heavy, childish, or futuristic.
* **Over-decorated:** Avoid gaming neon lights, glowing radar pings, or bright multi-color gradient avatars.
* **AI-generated or speculative:** Keep the visual vocabulary grounded in real tools and clean typography.

* **Component Library Policy:** Use Shadcn/ui components whenever possible to maintain design consistency, professional aesthetics, and fast implementation. Only build custom components if Shadcn/ui does not offer a suitable base.

---

## Design Inspiration

Reference products:
* [Thumbtack](https://www.thumbtack.com) (for crisp white panels, clean input rows, and trustworthy worker lists).
* [Airbnb](https://www.airbnb.com) (for high-contrast light layouts, search consoles, and clean avatars).
* [Linear](https://linear.app) (for precision borders, crisp borders, and minimalist typography).

---

## Visual Style

* **Premium Light Polish:**
  * **Backgrounds:** Pure white (`bg-white`) and light gray/blue-gray overlays (`bg-slate-50`).
  * **Borders:** Thin, crisp borders (`border-slate-200`) to separate items cleanly without clutter.
  * **Shadows:** Soft, natural drop shadows (`shadow-sm`, `shadow-md` with slate-100 colors) that elevate items naturally.
  * **Visual Accents:** Keep ornaments to a minimum. A subtle dotted grid backdrop (`bg-[radial-gradient(#e2e8f0_1px,transparent_1px)]`) is preferred over colorful meshes or neon blurs.

---

## Colors

Primary goal: **Trust, Clarity, and Premium Light Utility.**

Prefer:
* **Base:** Pure whites, crisp light grays (`slate-50`, `slate-100`).
* **Text:** High-contrast charcoal (`slate-900` for headings, `slate-650` for body).
* **Primary Accent:** Deep slate-charcoal (`slate-900`) for primary buttons and brand marks to give a highly grounded, professional feel.
* **Highlight Accent:** A refined, warm amber-orange (`amber-500` or `orange-500`) used selectively for active badges, stars, or hover states. No neon greens or purples.

---

## Typography

Prioritize extreme legibility.

Prefer:
* **Clear weight contrast:** Heavy slate-900 text for titles, clean gray text for descriptions.
* **No decorative fonts:** Use standard, highly readable sans-serif fonts.

---

## Marketplace UX Rules

Users should quickly answer:
1. What service is offered?
2. Who provides it?
3. Can I trust them?
4. How do I contact them?

These answers should be presented inside clean white cards with crisp text.

---

## Worker Cards

Worker cards should look like professional credentials:
1. **Avatar:** Crisp initials inside a neutral light gray or slate background (`bg-slate-100 text-slate-800`), not loud colored gradients.
2. **Details:** Clear list of services, years of experience, and location badge.
3. **Primary Action:** Solid, high-contrast button for direct contact.
4. **Collapsible Details:** Keep the secondary details hidden behind a clean toggle so cards remain compact and clean on mobile.

---

## Mobile & Responsive Design

* **Mobile-First layout:** Single-column vertical scroll on mobile, double-column grid on desktop.
* **Large tap targets:** Inputs, dropdowns, and button links have a minimum height of 44px to accommodate fingers.

# Worker Profile Call and WhatsApp Direct Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable the Call and WhatsApp buttons on worker profiles so that they trigger native dialers (`tel:`) and official WhatsApp click-to-chat conversations (`wa.me`) with a pre-filled message using the worker's existing phone number.

**Architecture:** Create a lightweight, strongly typed contact utility module (`src/lib/contact.ts`) to handle international phone normalization, `tel:` link creation, and `wa.me` URL construction with encoded message params. Wire these utilities into the mobile sticky action bar and desktop hero action buttons on `src/app/workers/[id]/page.tsx` and `src/components/shared/contact-modal.tsx`.

**Tech Stack:** Next.js App Router, TypeScript, React 19, Tailwind CSS, Lucide Icons, Vitest.

## Global Constraints

- **File Change Limit**: Maximum 3 production files (`src/lib/contact.ts`, `src/app/workers/[id]/page.tsx`, `src/components/shared/contact-modal.tsx`) and 1 test file.
- **No Scope Expansion**: Do not refactor unrelated page components or database APIs.
- **Direct Device Protocol**: Use standard `tel:` links and official `https://wa.me/<number>?text=...` format. No external API, no WhatsApp Business API, no authentication required.
- **Mobile-First UX**: On mobile screen sizes, clicking "Call" directly initiates the `tel:` URI instead of displaying an intermediate modal dialog.
- **Message Template**: Pre-filled WhatsApp message: `"Hi, I found you on WorkerHub and I'm interested in your services. I'd like to know more."`

---

### Task 1: Contact Utilities and Unit Tests

**Files:**
- Create: `src/lib/contact.ts`
- Create: `src/lib/__tests__/contact.test.ts`

**Interfaces:**
- Produces:
  - `normalizePhoneNumberForWhatsApp(phone: string | null | undefined): string`
  - `getTelLink(phone: string | null | undefined): string`
  - `DEFAULT_WHATSAPP_MESSAGE: string`
  - `getWhatsAppLink(phone: string | null | undefined, message?: string): string`

- [ ] **Step 1: Write failing unit tests for contact utility functions**

Create `src/lib/__tests__/contact.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  normalizePhoneNumberForWhatsApp,
  getTelLink,
  getWhatsAppLink,
  DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/contact";

describe("Contact Utilities", () => {
  describe("normalizePhoneNumberForWhatsApp", () => {
    it("normalizes standard Indian format with spaces and +91", () => {
      expect(normalizePhoneNumberForWhatsApp("+91 94970 12345")).toBe("919497012345");
    });

    it("prepends country code 91 for 10-digit numbers", () => {
      expect(normalizePhoneNumberForWhatsApp("9876543210")).toBe("919876543210");
    });

    it("handles 11-digit numbers starting with 0", () => {
      expect(normalizePhoneNumberForWhatsApp("09876543210")).toBe("919876543210");
    });

    it("handles numbers with hyphens and special characters", () => {
      expect(normalizePhoneNumberForWhatsApp("+91-94970-12345")).toBe("919497012345");
    });

    it("returns empty string for null, undefined, or empty inputs", () => {
      expect(normalizePhoneNumberForWhatsApp(null)).toBe("");
      expect(normalizePhoneNumberForWhatsApp(undefined)).toBe("");
      expect(normalizePhoneNumberForWhatsApp("")).toBe("");
    });
  });

  describe("getTelLink", () => {
    it("creates valid tel: URI for +91 prefixed numbers", () => {
      expect(getTelLink("+91 94970 12345")).toBe("tel:+919497012345");
    });

    it("creates valid tel: URI for 10-digit numbers", () => {
      expect(getTelLink("9876543210")).toBe("tel:+919876543210");
    });

    it("creates valid tel: URI for numbers with leading 0", () => {
      expect(getTelLink("09876543210")).toBe("tel:+919876543210");
    });

    it("returns empty string for null or empty input", () => {
      expect(getTelLink(null)).toBe("");
      expect(getTelLink("")).toBe("");
    });
  });

  describe("getWhatsAppLink", () => {
    it("generates wa.me URL with default pre-filled message correctly URL encoded", () => {
      const url = getWhatsAppLink("+91 94970 12345");
      expect(url).toBe(
        `https://wa.me/919497012345?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`
      );
      expect(url).toContain("https://wa.me/919497012345?text=Hi%2C%20I%20found%20you%20on%20WorkerHub");
    });

    it("supports custom pre-filled message", () => {
      const url = getWhatsAppLink("9876543210", "Hello Rajesh!");
      expect(url).toBe("https://wa.me/919876543210?text=Hello%20Rajesh!");
    });

    it("generates link without text parameter if empty message is explicitly passed", () => {
      const url = getWhatsAppLink("9876543210", "");
      expect(url).toBe("https://wa.me/919876543210");
    });

    it("returns empty string for null or empty phone", () => {
      expect(getWhatsAppLink(null)).toBe("");
      expect(getWhatsAppLink("")).toBe("");
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/contact.test.ts`
Expected: FAIL ("Cannot find module '@/lib/contact'")

- [ ] **Step 3: Implement minimal code in `src/lib/contact.ts`**

Create `src/lib/contact.ts`:
```ts
/**
 * Normalizes a phone number to digits only in international format (without '+' or symbols).
 * For 10-digit Indian numbers or 11-digit numbers starting with 0, prepends country code 91.
 */
export function normalizePhoneNumberForWhatsApp(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return "";

  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return `91${cleaned.slice(1)}`;
  }
  return cleaned;
}

/**
 * Generates a valid tel: URI for native mobile dialer.
 */
export function getTelLink(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("+")) {
    return `tel:${cleaned}`;
  }
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `tel:+91${digitsOnly}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return `tel:+91${digitsOnly.slice(1)}`;
  }
  return `tel:+${digitsOnly}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I found you on WorkerHub and I'm interested in your services. I'd like to know more.";

/**
 * Generates an official WhatsApp click-to-chat URL with optional pre-filled message.
 */
export function getWhatsAppLink(
  phone: string | null | undefined,
  message: string = DEFAULT_WHATSAPP_MESSAGE
): string {
  const normalizedPhone = normalizePhoneNumberForWhatsApp(phone);
  if (!normalizedPhone) return "";

  if (message) {
    return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${normalizedPhone}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/contact.test.ts`
Expected: PASS

---

### Task 2: Integrate Call & WhatsApp Links in Worker Profile & Contact Modal

**Files:**
- Modify: `src/app/workers/[id]/page.tsx`
- Modify: `src/components/shared/contact-modal.tsx`

**Interfaces:**
- Consumes: `getTelLink`, `getWhatsAppLink` from `@/lib/contact`

- [ ] **Step 1: Update `src/app/workers/[id]/page.tsx`**

Integrate `getTelLink` and `getWhatsAppLink`:
1. Import `getTelLink`, `getWhatsAppLink` from `@/lib/contact`.
2. Compute `telLink = getTelLink(worker.phone)` and `whatsAppUrl = getWhatsAppLink(worker.phone)`.
3. In Desktop CTAs (`hidden sm:flex`):
   - Wrap Call button with `telLink` (`<Button asChild ...><a href={telLink || "#"} ...>`).
   - Use `whatsAppUrl` for WhatsApp button `href`.
4. In Mobile Sticky Bottom Bar (`fixed bottom-0`):
   - Update `profile-contact-btn-mobile` from modal click to direct `<Button asChild ...><a href={telLink || "#"} ...>`.
   - Update WhatsApp button `href` to `whatsAppUrl`.

- [ ] **Step 2: Update `src/components/shared/contact-modal.tsx`**

1. Import `getTelLink`, `getWhatsAppLink` from `@/lib/contact`.
2. Replace `href={`tel:${worker.phone}`}` with `href={getTelLink(worker.phone)}`.
3. Replace WhatsApp `href` with `href={getWhatsAppLink(worker.phone)}`.

- [ ] **Step 3: Run full test suite and type check**

Run: `npx vitest run`
Run: `npm run lint`

---

### Task 3: Verification and State Update

- [ ] **Step 1: Verify all 3 requirements from prompt**
  1. Call button generates valid `tel:` URI on mobile & desktop.
  2. WhatsApp button generates valid `wa.me` URL without `+`, spaces, hyphens.
  3. WhatsApp message is properly URL-encoded with standard text.
- [ ] **Step 2: Update `PROJECT_STATE.md` with the new contact system capabilities.**

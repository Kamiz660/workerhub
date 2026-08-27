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

    it("prepends country code 91 for 10-digit Indian numbers", () => {
      expect(normalizePhoneNumberForWhatsApp("9876543210")).toBe("919876543210");
    });

    it("handles 11-digit numbers starting with 0 and converts to 91 prefix", () => {
      expect(normalizePhoneNumberForWhatsApp("09876543210")).toBe("919876543210");
    });

    it("strips hyphens, brackets, and spaces", () => {
      expect(normalizePhoneNumberForWhatsApp("+91-(94970)-12345")).toBe("919497012345");
    });

    it("preserves international numbers with country codes", () => {
      expect(normalizePhoneNumberForWhatsApp("+1 555 123 4567")).toBe("15551234567");
    });

    it("handles empty, null, undefined, or non-numeric values safely", () => {
      expect(normalizePhoneNumberForWhatsApp(null)).toBe("");
      expect(normalizePhoneNumberForWhatsApp(undefined)).toBe("");
      expect(normalizePhoneNumberForWhatsApp("")).toBe("");
      expect(normalizePhoneNumberForWhatsApp("   ")).toBe("");
      expect(normalizePhoneNumberForWhatsApp("invalid-phone")).toBe("");
    });
  });

  describe("getTelLink", () => {
    it("creates safe tel: URI for +91 prefixed numbers", () => {
      expect(getTelLink("+91 94970 12345")).toBe("tel:+919497012345");
    });

    it("creates safe tel: URI with +91 prepended for 10-digit numbers", () => {
      expect(getTelLink("9876543210")).toBe("tel:+919876543210");
    });

    it("creates safe tel: URI for numbers with leading 0", () => {
      expect(getTelLink("09876543210")).toBe("tel:+919876543210");
    });

    it("creates safe tel: URI for 12-digit numbers starting with 91 without plus", () => {
      expect(getTelLink("919876543210")).toBe("tel:+919876543210");
    });

    it("handles international numbers with + symbol safely", () => {
      expect(getTelLink("+1 (555) 123-4567")).toBe("tel:+15551234567");
    });

    it("returns empty string for null, undefined, empty, or invalid input", () => {
      expect(getTelLink(null)).toBe("");
      expect(getTelLink(undefined)).toBe("");
      expect(getTelLink("")).toBe("");
      expect(getTelLink("   ")).toBe("");
      expect(getTelLink("abc")).toBe("");
    });
  });

  describe("getWhatsAppLink", () => {
    it("generates wa.me URL with the approved WorkerHub pre-filled message correctly URL-encoded", () => {
      const url = getWhatsAppLink("+91 94970 12345");
      expect(url).toBe(
        `https://wa.me/919497012345?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`
      );
      expect(url).toContain("https://wa.me/919497012345?text=Hi%2C%20I%20found%20you%20on%20WorkerHub");
    });

    it("verifies the exact default message wording", () => {
      expect(DEFAULT_WHATSAPP_MESSAGE).toBe(
        "Hi, I found you on WorkerHub and I'm interested in your services. I'd like to know more."
      );
    });

    it("supports custom pre-filled message", () => {
      const url = getWhatsAppLink("9876543210", "Hello Rajesh!");
      expect(url).toBe("https://wa.me/919876543210?text=Hello%20Rajesh!");
    });

    it("omits query parameter if message is empty", () => {
      const url = getWhatsAppLink("9876543210", "");
      expect(url).toBe("https://wa.me/919876543210");
    });

    it("returns empty string if phone number cannot be resolved", () => {
      expect(getWhatsAppLink(null)).toBe("");
      expect(getWhatsAppLink(undefined)).toBe("");
      expect(getWhatsAppLink("")).toBe("");
      expect(getWhatsAppLink("invalid")).toBe("");
    });
  });
});

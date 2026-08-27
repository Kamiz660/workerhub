/**
 * Contact Utilities
 * 
 * Normalizes phone numbers and constructs direct communication URLs
 * (tel: URI for native mobile dialers and official wa.me click-to-chat links).
 */

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I found you on WorkerHub and I'm interested in your services. I'd like to know more.";

/**
 * Normalizes a phone number into digits only for international WhatsApp click-to-chat.
 * Strips all non-digit characters.
 * For 10-digit Indian numbers or 11-digit numbers starting with 0, prepends standard 91 country code.
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
 * Formats a phone number safely for a `tel:` URI.
 * Guarantees +91 is prepended for Indian phone numbers (10-digit, 11-digit starting with 0, or 12-digit starting with 91).
 * Preserves international '+' codes if present.
 * Returns an empty string if the phone is missing or invalid.
 */
export function getTelLink(phone: string | null | undefined): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  if (!trimmed) return "";

  const cleaned = trimmed.replace(/[^\d+]/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("+")) {
    return `tel:${cleaned}`;
  }

  const digitsOnly = cleaned.replace(/\D/g, "");
  if (!digitsOnly) return "";

  if (digitsOnly.length === 10) {
    return `tel:+91${digitsOnly}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return `tel:+91${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return `tel:+${digitsOnly}`;
  }
  return `tel:+91${digitsOnly}`;
}

/**
 * Generates an official WhatsApp click-to-chat URL with a URL-encoded pre-filled message.
 * Returns an empty string if the phone number cannot be resolved.
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

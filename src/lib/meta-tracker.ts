export interface MetaCustomData {
  content_name?: string;
  content_category?: string;
  search_string?: string;
}

/**
 * Sanitizes search input to prevent sending phone numbers, emails,
 * or long free-form text to Meta.
 */
function sanitizeSearchString(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  // Reject or strip if it looks like an email or phone number
  const hasEmail = /\S+@\S+\.\S+/.test(trimmed);
  const hasPhone = /\b\d{7,15}\b/.test(trimmed.replace(/[\s-]/g, ""));
  if (hasEmail || hasPhone) {
    return undefined;
  }

  // Cap length to 60 characters
  return trimmed.slice(0, 60);
}

/**
 * Dispatches a conversion event to both browser Meta Pixel (if loaded)
 * and server-side Conversions API via /api/meta-capi with the same event_id
 * so Meta can deduplicate them.
 */
export function trackMetaConversion(
  eventName: "ViewContent" | "Search" | "Contact",
  customData?: MetaCustomData
): string {
  const eventId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const cleanCustomData: MetaCustomData = {};
  if (customData?.content_name) cleanCustomData.content_name = customData.content_name;
  if (customData?.content_category) cleanCustomData.content_category = customData.content_category;
  if (customData?.search_string) {
    const sanitized = sanitizeSearchString(customData.search_string);
    if (sanitized) cleanCustomData.search_string = sanitized;
  }

  // 1. Browser Meta Pixel
  if (typeof window !== "undefined") {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      try {
        fbq("track", eventName, cleanCustomData, { eventID: eventId });
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Meta Pixel] Error tracking event:", err);
        }
      }
    }

    // 2. Server CAPI via internal route relay
    try {
      fetch("/api/meta-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          eventId,
          customData: cleanCustomData,
          eventSourceUrl: window.location.href,
        }),
        keepalive: true,
      }).catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Meta CAPI Relay] Error:", err);
        }
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Meta CAPI Relay] Dispatch failed:", err);
      }
    }
  }

  return eventId;
}

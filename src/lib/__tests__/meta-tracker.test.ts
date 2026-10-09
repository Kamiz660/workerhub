import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackMetaConversion } from "@/lib/meta-tracker";

describe("trackMetaConversion", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("generates a unique event ID and triggers both Pixel and CAPI relay", () => {
    const mockFbq = vi.fn();
    (window as unknown as { fbq: typeof mockFbq }).fbq = mockFbq;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = mockFetch;

    const eventId = trackMetaConversion("Contact", {
      content_name: "phone_call",
      content_category: "electrician",
    });

    expect(eventId).toBeDefined();
    expect(typeof eventId).toBe("string");
    expect(eventId.length).toBeGreaterThan(10);

    // Pixel verified
    expect(mockFbq).toHaveBeenCalledTimes(1);
    expect(mockFbq).toHaveBeenCalledWith(
      "track",
      "Contact",
      {
        content_name: "phone_call",
        content_category: "electrician",
      },
      { eventID: eventId }
    );

    // CAPI relay fetch verified
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("/api/meta-capi");
    expect(options.method).toBe("POST");
    expect(options.keepalive).toBe(true);

    const body = JSON.parse(options.body);
    expect(body.eventName).toBe("Contact");
    expect(body.eventId).toBe(eventId);
    expect(body.customData).toEqual({
      content_name: "phone_call",
      content_category: "electrician",
    });
  });

  it("sanitizes search_string to strip phone numbers and emails", () => {
    const mockFbq = vi.fn();
    (window as unknown as { fbq: typeof mockFbq }).fbq = mockFbq;
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    // With email
    trackMetaConversion("Search", {
      search_string: "user@example.com",
    });
    expect(mockFbq.mock.calls[0][2]).toEqual({});

    // With phone number
    mockFbq.mockClear();
    trackMetaConversion("Search", {
      search_string: "9876543210",
    });
    expect(mockFbq.mock.calls[0][2]).toEqual({});

    // Normal query is preserved
    mockFbq.mockClear();
    trackMetaConversion("Search", {
      search_string: "  Plumber in Piravom  ",
    });
    expect(mockFbq.mock.calls[0][2]).toEqual({
      search_string: "Plumber in Piravom",
    });
  });

  it("works safely when window.fbq is undefined", () => {
    delete (window as unknown as { fbq?: unknown }).fbq;
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    expect(() => {
      const eventId = trackMetaConversion("ViewContent", {
        content_name: "Electrician",
      });
      expect(eventId).toBeDefined();
    }).not.toThrow();

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

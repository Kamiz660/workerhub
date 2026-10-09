import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventId, customData, eventSourceUrl } = body;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { error: "Missing eventName or eventId" },
        { status: 400 }
      );
    }

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1382744028249618";
    const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

    if (!pixelId || !accessToken) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[Meta CAPI] Skipped: NEXT_PUBLIC_META_PIXEL_ID or META_CONVERSIONS_API_TOKEN is not configured"
        );
      }
      return NextResponse.json({ status: "skipped", reason: "missing_credentials" });
    }

    // Extract client IP gracefully from proxy headers; omit if unavailable
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : request.headers.get("x-real-ip") || undefined;

    // Extract User-Agent
    const userAgent = request.headers.get("user-agent") || undefined;

    // Treat _fbp and _fbc as optional; only include when present
    const fbp = request.cookies.get("_fbp")?.value;
    const fbc = request.cookies.get("_fbc")?.value;

    const userData: Record<string, string> = {};
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const eventPayload: Record<string, unknown> = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: "website",
      user_data: userData,
    };

    if (eventSourceUrl) {
      eventPayload.event_source_url = eventSourceUrl;
    }

    if (customData && typeof customData === "object" && Object.keys(customData).length > 0) {
      eventPayload.custom_data = customData;
    }

    const metaRequestBody: Record<string, unknown> = {
      data: [eventPayload],
    };

    if (process.env.META_TEST_EVENT_CODE) {
      metaRequestBody.test_event_code = process.env.META_TEST_EVENT_CODE;
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaRequestBody),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Meta CAPI] Error from Meta Graph API:", responseData);
      }
      return NextResponse.json(
        { error: "Meta Graph API error", details: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, eventId, metaResponse: responseData });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Meta CAPI] Handler error:", err);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

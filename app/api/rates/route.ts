import { jsonError, jsonOk, withErrorHandling } from "@/lib/api";

const SOURCE = "https://open.er-api.com/v6/latest/USD";

interface RatesPayload {
  result?: string;
  time_last_update_utc?: string;
  time_next_update_utc?: string;
  rates?: Record<string, number>;
}

/**
 * Proxying the rate feed (rather than calling it from the browser) lets Next
 * cache one upstream response for everyone and keeps the third-party host out
 * of the client's connection list. Rates publish daily; six hours is a safe
 * revalidation window.
 */
export const GET = withErrorHandling(async () => {
  try {
    const response = await fetch(SOURCE, { next: { revalidate: 21600 } });
    if (!response.ok) throw new Error(`Upstream responded ${response.status}`);

    const payload = (await response.json()) as RatesPayload;
    if (payload.result !== "success" || !payload.rates) {
      throw new Error("Unexpected upstream payload");
    }

    return jsonOk({
      base: "USD",
      rates: payload.rates,
      updatedAt: payload.time_last_update_utc ?? null,
      nextUpdateAt: payload.time_next_update_utc ?? null,
    });
  } catch (error) {
    console.error("[rates]", error);
    return jsonError(
      "Exchange rates are unavailable right now. Please try again shortly.",
      502
    );
  }
});

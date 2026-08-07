import { jsonError, jsonOk, withErrorHandling } from "@/lib/api";

export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

const ALLOWED_TYPES = new Set(["any", "programming", "knock-knock", "general"]);

export const GET = withErrorHandling(async (request: Request) => {
  const type = (
    new URL(request.url).searchParams.get("type") ?? "any"
  ).toLowerCase();

  if (!ALLOWED_TYPES.has(type)) {
    return jsonError("Unknown joke type.");
  }

  const url = `https://official-joke-api.appspot.com/jokes/${
    type === "any" ? "" : `${type}/`
  }random`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Upstream responded ${response.status}`);

    // The endpoint returns a bare object for `/random` and an array for the
    // type-filtered variants.
    const payload: unknown = await response.json();
    const joke = (Array.isArray(payload) ? payload[0] : payload) as
      Joke | undefined;

    if (!joke?.setup) return jsonError("No joke available right now.", 404);

    return jsonOk({ joke }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[jokes]", error);
    return jsonError(
      "Couldn't reach the joke service. Try again shortly.",
      502
    );
  }
});

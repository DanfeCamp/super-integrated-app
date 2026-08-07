import { jsonError, jsonOk, withErrorHandling } from "@/lib/api";

const SOURCE =
  "https://raw.githubusercontent.com/nirajgiriXD/garden-of-quotes/main/public/quotes.json";

export interface Quote {
  quote: string;
  author: string;
  tags: string[];
}

interface SourcePayload {
  data?: Quote[];
}

/**
 * The upstream file is a static export that changes rarely, so it's cached for
 * an hour. Randomisation happens per request against the cached list, which
 * keeps results varied without re-fetching ~1 MB of JSON each time.
 */
async function fetchQuotes(): Promise<Quote[]> {
  const response = await fetch(SOURCE, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
  const payload = (await response.json()) as SourcePayload;
  return Array.isArray(payload.data) ? payload.data : [];
}

export const GET = withErrorHandling(async (request: Request) => {
  const tag = (
    new URL(request.url).searchParams.get("tag") ?? "any"
  ).toLowerCase();

  let quotes: Quote[];
  try {
    quotes = await fetchQuotes();
  } catch (error) {
    console.error("[quotes]", error);
    return jsonError(
      "Couldn't reach the quote library. Try again shortly.",
      502
    );
  }

  const pool =
    tag === "any"
      ? quotes
      : quotes.filter((quote) =>
          quote.tags?.some((item) => item.toLowerCase() === tag)
        );

  if (pool.length === 0) {
    return jsonError(`No quotes found for "${tag}".`, 404);
  }

  const quote = pool[Math.floor(Math.random() * pool.length)];
  return jsonOk(
    { quote },
    // Per-request randomness must never be cached by a CDN.
    { headers: { "Cache-Control": "no-store" } }
  );
});

import Papa from "papaparse";

import { jsonError, jsonOk, withErrorHandling } from "@/lib/api";

const SOURCE =
  "https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv";

const MAX_RESULTS = 60;

interface CsvRow {
  "Cookie / Data Key name"?: string;
  Domain?: string;
  Category?: string;
  "Data Controller"?: string;
  "Retention period"?: string;
  Platform?: string;
  Description?: string;
  "Wildcard match"?: string;
}

export interface CookieRecord {
  name: string;
  domain: string;
  category: string;
  controller: string;
  retention: string;
  platform: string;
  description: string;
}

/** The database is a ~2 MB CSV that updates rarely; cache it for a day. */
async function fetchDatabase(): Promise<CsvRow[]> {
  const response = await fetch(SOURCE, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
  const csv = await response.text();
  return Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  }).data;
}

function normalise(row: CsvRow): CookieRecord {
  return {
    name: row["Cookie / Data Key name"]?.trim() || "—",
    domain: row.Domain?.trim() || "—",
    category: row.Category?.trim() || "Unclassified",
    controller: row["Data Controller"]?.trim() || "Unknown",
    retention: row["Retention period"]?.trim() || "Unknown",
    platform: row.Platform?.trim() || "Unknown",
    description: row.Description?.trim() || "No description provided.",
  };
}

export const GET = withErrorHandling(async (request: Request) => {
  const params = new URL(request.url).searchParams;
  const name = params.get("name")?.trim().toLowerCase() ?? "";
  // Accept a pasted URL as well as a bare hostname.
  const domain = params
    .get("domain")
    ?.trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");

  if (!name && !domain) {
    return jsonError("Enter a cookie name or a domain to search for.");
  }

  let rows: CsvRow[];
  try {
    rows = await fetchDatabase();
  } catch (error) {
    console.error("[cookie-details]", error);
    return jsonError(
      "Couldn't reach the cookie database. Please try again shortly.",
      502
    );
  }

  // Substring matching (the old exact-equality search returned nothing for
  // prefixed cookies like `_ga_XXXX`, which is most of the interesting ones).
  const matches = rows.filter((row) => {
    const rowName = row["Cookie / Data Key name"]?.toLowerCase() ?? "";
    const rowDomain = row.Domain?.toLowerCase() ?? "";
    const nameMatches = !name || rowName.includes(name);
    const domainMatches = !domain || rowDomain.includes(domain);
    return nameMatches && domainMatches;
  });

  // Exact name matches first — they're what people are usually looking for.
  const ranked = matches.sort((a, b) => {
    const aExact = a["Cookie / Data Key name"]?.toLowerCase() === name ? 0 : 1;
    const bExact = b["Cookie / Data Key name"]?.toLowerCase() === name ? 0 : 1;
    return aExact - bExact;
  });

  return jsonOk({
    total: ranked.length,
    results: ranked.slice(0, MAX_RESULTS).map(normalise),
  });
});

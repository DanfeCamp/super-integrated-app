"use client";

import { Cookie, Loader2, Search, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { pluralize } from "@/lib/utils";

interface CookieRecord {
  name: string;
  domain: string;
  category: string;
  controller: string;
  retention: string;
  platform: string;
  description: string;
}

interface SearchResponse {
  total: number;
  results: CookieRecord[];
}

const EXAMPLES = [
  { label: "_ga", name: "_ga", domain: "" },
  { label: "_fbp", name: "_fbp", domain: "" },
  { label: "PHPSESSID", name: "PHPSESSID", domain: "" },
  { label: "youtube.com", name: "", domain: "youtube.com" },
];

const CATEGORY_TONE: Record<
  string,
  "success" | "warning" | "destructive" | "muted"
> = {
  functional: "success",
  necessary: "success",
  analytics: "warning",
  performance: "warning",
  marketing: "destructive",
  targeting: "destructive",
};

export function CookieDetailsTool() {
  const [name, setName] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [data, setData] = React.useState<SearchResponse | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);

  const runSearch = React.useCallback(
    async (searchName: string, searchDomain: string) => {
      if (!searchName.trim() && !searchDomain.trim()) {
        setError("Enter a cookie name or a domain to search for.");
        return;
      }

      setBusy(true);
      setError(null);
      setSearched(true);

      try {
        const params = new URLSearchParams();
        if (searchName.trim()) params.set("name", searchName.trim());
        if (searchDomain.trim()) params.set("domain", searchDomain.trim());

        const response = await fetch(`/api/cookie-details?${params}`);
        const payload = (await response.json()) as SearchResponse & {
          error?: string;
        };

        if (!response.ok) throw new Error(payload.error ?? "Search failed.");
        setData(payload);
      } catch (caught) {
        setData(null);
        setError(caught instanceof Error ? caught.message : "Search failed.");
      } finally {
        setBusy(false);
      }
    },
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void runSearch(name, domain);
            }}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cookie-name">Cookie name</Label>
                <Input
                  id="cookie-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="_ga"
                  spellCheck={false}
                  className="font-mono"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cookie-domain">Domain</Label>
                <Input
                  id="cookie-domain"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  placeholder="google.com"
                  spellCheck={false}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Searching…
                  </>
                ) : (
                  <>
                    <Search className="size-4" aria-hidden />
                    Search
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={!name && !domain && !data}
                onClick={() => {
                  setName("");
                  setDomain("");
                  setData(null);
                  setError(null);
                  setSearched(false);
                }}
              >
                Clear
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 border-t pt-4">
            <span className="text-muted-foreground text-xs font-medium">
              Try:
            </span>
            {EXAMPLES.map((example) => (
              <Button
                key={example.label}
                variant="outline"
                size="sm"
                className="font-mono text-xs"
                onClick={() => {
                  setName(example.name);
                  setDomain(example.domain);
                  void runSearch(example.name, example.domain);
                }}
              >
                {example.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {busy ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : data ? (
        data.results.length === 0 ? (
          <Card>
            <EmptyState
              icon={Cookie}
              title="No matching cookies"
              description="This cookie isn't in the Open Cookie Database yet. Try a partial name, or search by domain only."
            />
          </Card>
        ) : (
          <>
            <p
              className="text-muted-foreground text-sm"
              role="status"
              aria-live="polite"
            >
              {data.total} {pluralize(data.total, "match", "matches")}
              {data.total > data.results.length
                ? ` — showing the first ${data.results.length}`
                : ""}
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.results.map((cookie, index) => (
                <li key={`${cookie.name}-${cookie.domain}-${index}`}>
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <code className="text-sm font-semibold break-all">
                          {cookie.name}
                        </code>
                        <Badge
                          variant={
                            CATEGORY_TONE[cookie.category.toLowerCase()] ??
                            "muted"
                          }
                          className="shrink-0"
                        >
                          {cookie.category}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {cookie.description}
                      </p>

                      <dl className="mt-auto flex flex-col gap-1.5 border-t pt-3 text-xs">
                        <Row label="Domain" value={cookie.domain} mono />
                        <Row label="Controller" value={cookie.controller} />
                        <Row label="Retention" value={cookie.retention} />
                        <Row label="Platform" value={cookie.platform} />
                      </dl>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </>
        )
      ) : !searched ? (
        <Card>
          <EmptyState
            icon={Cookie}
            title="Look up any cookie"
            description="Search by name to find out what a cookie does, or by domain to see everything a site sets."
          />
        </Card>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className={`truncate text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

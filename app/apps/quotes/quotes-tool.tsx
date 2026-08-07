"use client";

import {
  Loader2,
  Quote as QuoteIcon,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TAGS = [
  "any",
  "motivation",
  "wisdom",
  "happiness",
  "love",
  "funny",
  "finance",
  "sigma",
] as const;

interface Quote {
  quote: string;
  author: string;
  tags: string[];
}

export function QuotesTool() {
  const [tag, setTag] = React.useState<string>("any");
  const [quote, setQuote] = React.useState<Quote | null>(null);
  const [busy, setBusy] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (selectedTag: string) => {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/quotes?tag=${encodeURIComponent(selectedTag)}`
      );
      const payload = (await response.json()) as {
        quote?: Quote;
        error?: string;
      };

      if (!response.ok || !payload.quote) {
        throw new Error(payload.error ?? "Couldn't load a quote.");
      }
      setQuote(payload.quote);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Couldn't load a quote."
      );
    } finally {
      setBusy(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching a quote is external-system synchronisation.
    void load(tag);
  }, [tag, load]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.code !== "Space" ||
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "BUTTON"].includes(target?.tagName ?? "")
      ) {
        return;
      }
      event.preventDefault();
      void load(tag);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tag, load]);

  const shareText = quote ? `“${quote.quote}” — ${quote.author}` : "";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div
        role="group"
        aria-label="Filter by theme"
        className="flex flex-wrap justify-center gap-2"
      >
        {TAGS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTag(item)}
            aria-pressed={tag === item}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition-all",
              "focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none",
              tag === item
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {item === "any" ? "All themes" : item}
          </button>
        ))}
      </div>

      <Card className="from-primary/5 relative overflow-hidden bg-linear-to-br to-transparent">
        <QuoteIcon
          aria-hidden
          className="text-primary/10 pointer-events-none absolute -top-4 -left-2 size-32"
        />
        <CardContent className="relative flex min-h-72 flex-col justify-center gap-6 py-12 sm:py-16">
          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : busy ? (
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-7 w-full max-w-lg" />
              <Skeleton className="h-7 w-full max-w-md" />
              <Skeleton className="mt-4 h-5 w-40" />
            </div>
          ) : quote ? (
            <figure className="flex flex-col items-center gap-6 text-center">
              <blockquote className="max-w-2xl text-xl leading-relaxed font-medium text-balance sm:text-2xl">
                &ldquo;{quote.quote}&rdquo;
              </blockquote>
              <figcaption className="flex flex-col items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  — {quote.author || "Unknown"}
                </span>
                {quote.tags.length > 0 ? (
                  <span className="text-muted-foreground text-xs capitalize">
                    {quote.tags.join(" · ")}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => void load(tag)} disabled={busy} size="lg">
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading…
            </>
          ) : (
            <>
              <RefreshCw className="size-4" aria-hidden />
              New quote
            </>
          )}
        </Button>
        <CopyButton value={shareText} label="Copy quote" size="lg" />
      </div>

      <p className="text-muted-foreground hidden text-center text-xs sm:block">
        Press <Kbd>Space</Kbd> for another quote
      </p>
    </div>
  );
}

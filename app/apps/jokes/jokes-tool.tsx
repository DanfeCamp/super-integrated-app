"use client";

import { Eye, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "any", label: "Anything" },
  { value: "general", label: "General" },
  { value: "programming", label: "Programming" },
  { value: "knock-knock", label: "Knock-knock" },
] as const;

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

export function JokesTool() {
  const [type, setType] = React.useState<string>("any");
  const [joke, setJoke] = React.useState<Joke | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [busy, setBusy] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (selectedType: string) => {
    setBusy(true);
    setError(null);
    setRevealed(false);

    try {
      const response = await fetch(
        `/api/jokes?type=${encodeURIComponent(selectedType)}`
      );
      const payload = (await response.json()) as {
        joke?: Joke;
        error?: string;
      };

      if (!response.ok || !payload.joke) {
        throw new Error(payload.error ?? "Couldn't load a joke.");
      }
      setJoke(payload.joke);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Couldn't load a joke."
      );
    } finally {
      setBusy(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching a joke is external-system synchronisation.
    void load(type);
  }, [type, load]);

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
      // Space reveals first, then moves on — matching how you'd tell a joke.
      if (!revealed && joke) setRevealed(true);
      else void load(type);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [type, load, revealed, joke]);

  const shareText = joke ? `${joke.setup}\n\n${joke.punchline}` : "";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div
        role="group"
        aria-label="Filter by joke type"
        className="flex flex-wrap justify-center gap-2"
      >
        {TYPES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setType(item.value)}
            aria-pressed={type === item.value}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
              "focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none",
              type === item.value
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="flex min-h-64 flex-col justify-center gap-8 py-12 text-center sm:py-14">
          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : busy ? (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-7 w-full max-w-md" />
              <Skeleton className="h-10 w-40" />
            </div>
          ) : joke ? (
            <>
              <p className="mx-auto max-w-xl text-lg leading-relaxed font-medium text-balance sm:text-xl">
                {joke.setup}
              </p>

              {revealed ? (
                <p
                  className="text-primary animate-fade-up mx-auto max-w-xl text-xl leading-relaxed font-semibold text-balance sm:text-2xl"
                  aria-live="polite"
                >
                  {joke.punchline}
                </p>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setRevealed(true)}
                  className="mx-auto"
                >
                  <Eye className="size-4" aria-hidden />
                  Reveal the punchline
                </Button>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => void load(type)} disabled={busy} size="lg">
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading…
            </>
          ) : (
            <>
              <RefreshCw className="size-4" aria-hidden />
              New joke
            </>
          )}
        </Button>
        <CopyButton
          value={shareText}
          label="Copy joke"
          size="lg"
          disabled={!revealed}
        />
      </div>

      <p className="text-muted-foreground hidden text-center text-xs sm:block">
        Press <Kbd>Space</Kbd> to{" "}
        {revealed ? "get another joke" : "reveal the punchline"}
      </p>
    </div>
  );
}

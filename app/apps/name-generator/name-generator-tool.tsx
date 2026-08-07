"use client";

import { RefreshCw, SearchX, Star, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn, pluralize } from "@/lib/utils";

import {
  generateNames,
  MAX_LENGTH,
  MIN_LENGTH,
  styles,
  type StyleId,
} from "./generate";

const STORAGE_KEY = "sia:name-generator-shortlist";
const COUNTS = [12, 24, 48] as const;

export function NameGeneratorTool() {
  const [style, setStyle] = React.useState<StyleId>("brandable");
  const [count, setCount] = React.useState(12);
  const [length, setLength] = React.useState<[number, number]>([
    MIN_LENGTH,
    MAX_LENGTH,
  ]);
  const [startsWith, setStartsWith] = React.useState("");
  const [names, setNames] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  const [shortlist, setShortlist, shortlistHydrated] = useLocalStorage<
    string[]
  >(STORAGE_KEY, []);

  const generate = React.useCallback(() => {
    setNames(
      generateNames({
        style,
        count,
        minLength: length[0],
        maxLength: length[1],
        startsWith,
      })
    );
  }, [style, count, length, startsWith]);

  // Names come from Math.random(), so the first batch has to be produced on
  // the client — generating during render would not survive hydration.
  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- randomised output cannot be derived during render without a hydration mismatch. */
    generate();
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [generate]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.code !== "Space" ||
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(
          target?.tagName ?? ""
        )
      ) {
        return;
      }
      event.preventDefault();
      generate();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generate]);

  const toggleFavourite = (name: string) =>
    setShortlist((previous) =>
      previous.includes(name)
        ? previous.filter((entry) => entry !== name)
        : [...previous, name]
    );

  const activeStyle = styles.find((entry) => entry.id === style);
  const isFiltered =
    Boolean(startsWith) || length[0] !== MIN_LENGTH || length[1] !== MAX_LENGTH;

  const resetFilters = () => {
    setStartsWith("");
    setLength([MIN_LENGTH, MAX_LENGTH]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        {/* ------------------------------ controls ----------------------- */}
        <Card className="lg:sticky lg:top-24">
          <CardContent className="flex flex-col gap-6">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-medium">Style</legend>
              <div className="flex flex-col gap-1.5">
                {styles.map((entry) => {
                  const active = entry.id === style;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setStyle(entry.id)}
                      aria-pressed={active}
                      className={cn(
                        "focus-visible:ring-ring/40 flex flex-col gap-0.5 rounded-lg border px-3.5 py-2.5 text-left transition-colors",
                        "focus-visible:ring-[3px] focus-visible:outline-none",
                        active
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/70 hover:border-primary/30 hover:bg-accent/40"
                      )}
                    >
                      <span className="text-sm font-medium">{entry.name}</span>
                      <span className="text-muted-foreground font-mono text-[0.6875rem]">
                        {entry.examples}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <Label htmlFor="length">Length</Label>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {length[0]}–{length[1]} characters
                </span>
              </div>
              <Slider
                id="length"
                value={length}
                onValueChange={([min, max]) =>
                  setLength([min ?? MIN_LENGTH, max ?? MAX_LENGTH])
                }
                min={MIN_LENGTH}
                max={MAX_LENGTH}
                step={1}
                minStepsBetweenThumbs={1}
                aria-label="Name length range"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="starts-with">Starts with</Label>
                <Input
                  id="starts-with"
                  value={startsWith}
                  onChange={(event) =>
                    // One letter only: the generators can't be steered further
                    // than an initial without rejecting nearly every candidate.
                    setStartsWith(
                      event.target.value.replace(/[^a-z]/gi, "").slice(0, 1)
                    )
                  }
                  placeholder="Any"
                  maxLength={1}
                  autoComplete="off"
                  className="uppercase"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="count">Per batch</Label>
                <Select
                  value={String(count)}
                  onValueChange={(next) => setCount(Number(next))}
                >
                  <SelectTrigger id="count">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option} names
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={generate}>
                <RefreshCw className="size-4" aria-hidden />
                Generate
              </Button>
              {isFiltered ? (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset filters
                </Button>
              ) : null}
              <p className="text-muted-foreground text-center text-xs">
                or press <Kbd>Space</Kbd>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ------------------------------ results ------------------------ */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">{activeStyle?.name} names</h2>
            <p
              className="text-muted-foreground text-sm"
              role="status"
              aria-live="polite"
            >
              {ready
                ? `${names.length} ${pluralize(names.length, "name")}`
                : "Generating…"}
            </p>
          </div>

          {activeStyle ? (
            <p className="text-muted-foreground -mt-2 text-sm leading-relaxed">
              {activeStyle.description}
            </p>
          ) : null}

          {!ready ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Array.from({ length: 12 }, (_, index) => (
                <Skeleton key={index} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : names.length === 0 ? (
            <Card className="border-dashed">
              <EmptyState
                icon={SearchX}
                title="No names fit those filters"
                description={`Nothing in the ${activeStyle?.name.toLowerCase()} style matches that length and starting letter. Widen the range or clear the letter.`}
                action={
                  <Button variant="outline" onClick={resetFilters}>
                    Reset filters
                  </Button>
                }
              />
            </Card>
          ) : (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {names.map((name) => (
                <NameCard
                  key={name}
                  name={name}
                  starred={shortlist.includes(name)}
                  onToggle={() => toggleFavourite(name)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ------------------------------ shortlist ------------------------ */}
      {shortlistHydrated && shortlist.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">
                Shortlist
                <span className="text-muted-foreground ml-2 font-normal">
                  {shortlist.length} saved
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <CopyButton
                  value={shortlist.join("\n")}
                  label="Copy all"
                  copiedLabel="Copied all"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShortlist([])}
                >
                  <Trash2 className="size-4" aria-hidden />
                  Clear
                </Button>
              </div>
            </div>

            <ul className="flex flex-wrap gap-2">
              {shortlist.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => toggleFavourite(name)}
                    className={cn(
                      "border-primary/30 bg-primary/5 text-foreground group flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-3.5 text-sm font-medium transition-colors",
                      "hover:border-destructive/40 hover:bg-destructive/8 focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none"
                    )}
                  >
                    {name}
                    <Star
                      aria-hidden
                      className="fill-primary text-primary group-hover:fill-destructive group-hover:text-destructive size-3.5 transition-colors"
                    />
                    <span className="sr-only">Remove from shortlist</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="text-muted-foreground text-xs">
              Saved in this browser only — clearing your site data removes it.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function NameCard({
  name,
  starred,
  onToggle,
}: {
  name: string;
  starred: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className={cn(
        "group border-border/70 bg-card relative flex items-center gap-1 rounded-lg border px-3 py-2.5 transition-colors",
        "hover:border-primary/35 focus-within:border-primary/35",
        starred && "border-primary/40 bg-primary/5"
      )}
    >
      <span
        className="min-w-0 flex-1 truncate text-sm font-medium"
        title={name}
      >
        {name}
      </span>

      {/* Kept in the DOM and only faded, so the layout doesn't shift on hover
          and touch devices — which never hover — still get the controls. */}
      <div className="flex shrink-0 items-center opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <CopyButton value={name} variant="ghost" className="size-7" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7"
          onClick={onToggle}
          aria-pressed={starred}
          aria-label={
            starred ? `Remove ${name} from shortlist` : `Save ${name}`
          }
        >
          <Star
            className={cn(
              "size-4 transition-colors",
              starred && "fill-primary text-primary"
            )}
            aria-hidden
          />
        </Button>
      </div>
    </li>
  );
}

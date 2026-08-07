"use client";

import { SearchX, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { aiPromptCategories, aiPrompts } from "@/data/ai-prompts";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn, pluralize } from "@/lib/utils";

type Filter = string | "all";

export function AiPromptsTool() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<Filter>("all");
  const debouncedQuery = useDebouncedValue(query, 150);

  const counts = React.useMemo(() => {
    const map = new Map<Filter, number>([["all", aiPrompts.length]]);
    for (const prompt of aiPrompts) {
      map.set(prompt.category, (map.get(prompt.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const results = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return aiPrompts.filter((prompt) => {
      if (category !== "all" && prompt.category !== category) return false;
      if (!q) return true;
      return (
        prompt.title.toLowerCase().includes(q) ||
        prompt.prompt.toLowerCase().includes(q)
      );
    });
  }, [debouncedQuery, category]);

  const isFiltered = Boolean(query) || category !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search prompts…"
            aria-label="Search prompts"
            className="h-11 pr-10"
          />
          {query ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          <Chip
            active={category === "all"}
            count={counts.get("all") ?? 0}
            onClick={() => setCategory("all")}
          >
            All
          </Chip>
          {aiPromptCategories.map((item) => (
            <Chip
              key={item}
              active={category === item}
              count={counts.get(item) ?? 0}
              onClick={() => setCategory(item)}
            >
              {item.replace(/ Prompts$/, "")}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p
          className="text-muted-foreground text-sm"
          role="status"
          aria-live="polite"
        >
          {results.length} {pluralize(results.length, "prompt")}
          {isFiltered ? " match your filters" : " in the library"}
        </p>
        {isFiltered ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Reset
          </Button>
        ) : null}
      </div>

      <h2 className="sr-only">Prompts</h2>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No prompts found"
          description={`Nothing matches "${query}". Try a shorter or more general term.`}
          action={
            <Button variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
          className="border-border/70 rounded-xl border border-dashed"
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((prompt) => (
            <li key={`${prompt.category}-${prompt.title}`}>
              <Card className="group hover:border-primary/30 h-full transition-colors">
                <CardContent className="flex h-full flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="leading-snug font-semibold tracking-tight">
                      {prompt.title}
                    </h3>
                    <CopyButton
                      value={prompt.prompt}
                      variant="ghost"
                      className="shrink-0 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
                    />
                  </div>
                  <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                    {prompt.prompt}
                  </p>
                  <Badge variant="muted" className="mt-auto self-start">
                    {prompt.category.replace(/ Prompts$/, "")}
                  </Badge>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        "focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
      <span
        className={cn(
          "text-[0.6875rem] tabular-nums",
          active ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}

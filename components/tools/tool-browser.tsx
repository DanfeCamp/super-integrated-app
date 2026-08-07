"use client";

import { LayoutGrid, List, SearchX, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { ToolCard, ToolListItem } from "@/components/tools/tool-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  searchTools,
  toolCategories,
  type Tool,
  type ToolCategoryId,
} from "@/data/tools";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn, pluralize } from "@/lib/utils";

type CategoryFilter = ToolCategoryId | "all";
type ViewMode = "grid" | "list";

/**
 * The browse experience for `/apps`: type-ahead search, category chips and a
 * grid/list switch. Filtering is client-side — the catalogue is ~30 items, so
 * a round trip per keystroke would be strictly worse.
 */
export function ToolBrowser({ tools }: { tools: Tool[] }) {
  // Deep links like `/apps?q=qr` (used by the site's SearchAction schema)
  // land with the search box pre-filled.
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = React.useState<CategoryFilter>("all");
  const [view, setView] = React.useState<ViewMode>("grid");
  const debouncedQuery = useDebouncedValue(query, 150);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const counts = React.useMemo(() => {
    const map = new Map<CategoryFilter, number>([["all", tools.length]]);
    for (const tool of tools) {
      map.set(tool.category, (map.get(tool.category) ?? 0) + 1);
    }
    return map;
  }, [tools]);

  const results = React.useMemo(() => {
    const pool =
      category === "all"
        ? tools
        : tools.filter((tool) => tool.category === category);
    // searchTools already ranks; without a query keep live tools first.
    return debouncedQuery
      ? searchTools(debouncedQuery, pool)
      : [...pool].sort((a, b) => {
          if (a.status !== b.status) return a.status === "live" ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
  }, [tools, category, debouncedQuery]);

  const isFiltered = Boolean(query) || category !== "all";

  const reset = () => {
    setQuery("");
    setCategory("all");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools by name, task or keyword…"
              aria-label="Search tools"
              className="h-11 pr-10 pl-4"
            />
            {query ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute top-1/2 right-1.5 -translate-y-1/2"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>

          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(next) => next && setView(next as ViewMode)}
            aria-label="Layout"
            className="self-start sm:self-auto"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid aria-hidden />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          <FilterChip
            active={category === "all"}
            count={counts.get("all") ?? 0}
            onClick={() => setCategory("all")}
          >
            All
          </FilterChip>
          {toolCategories.map((item) => (
            <FilterChip
              key={item.id}
              active={category === item.id}
              count={counts.get(item.id) ?? 0}
              onClick={() => setCategory(item.id)}
            >
              {item.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p
          className="text-muted-foreground text-sm"
          role="status"
          aria-live="polite"
        >
          {results.length} {pluralize(results.length, "tool")}
          {isFiltered ? " match your filters" : " available"}
        </p>
        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset filters
          </Button>
        ) : null}
      </div>

      <h2 className="sr-only">Results</h2>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No tools found"
          description={`Nothing matches "${query}". Try a broader term, or clear the filters to see everything.`}
          action={
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          }
          className="border-border/70 rounded-xl border border-dashed"
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {results.map((tool) => (
            <ToolListItem key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
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
      {/* Plain text rather than a tinted pill: any translucent scrim over the
          primary fill lands under 4.5:1 in one theme or the other. */}
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

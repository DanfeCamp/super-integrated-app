"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { categoryEntries } from "@/components/layout/nav-data";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { categoryIcons } from "@/data/category-icons";
import { getToolIcon } from "@/data/tool-icons";
import {
  getCategory,
  liveTools,
  searchTools,
  spotlightTools,
} from "@/data/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Global search. Opens with ⌘K / Ctrl-K from anywhere and is the primary way
 * to reach a tool once someone knows the catalogue.
 *
 * Open state is owned by the caller so a single instance can be driven from
 * several triggers — the header's field, its collapsed icon and the row inside
 * the mobile sheet all point at this one dialog and one keyboard listener.
 */
export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const recent = useRecentTools();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;

      // Leave the shortcut alone while someone is typing in a field.
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }

      event.preventDefault();
      onOpenChange(!open);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const results = React.useMemo(
    () => searchTools(query, liveTools).slice(0, 8),
    [query]
  );

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      setQuery("");
      router.push(href);
    },
    [onOpenChange, router]
  );

  const showRecent = !query && recent.length > 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search every tool and page on SIA"
    >
      <CommandInput
        placeholder="Search tools, categories and pages…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No tool matches &ldquo;{query}&rdquo;.</CommandEmpty>

        {showRecent ? (
          <>
            <CommandGroup heading="Recently used">
              {recent.map((tool) => {
                const Icon = getToolIcon(tool.slug);
                return (
                  <CommandItem
                    key={`recent-${tool.slug}`}
                    value={`recent ${tool.name}`}
                    onSelect={() => go(`/apps/${tool.slug}`)}
                  >
                    <Icon
                      className={cn(
                        "size-4",
                        getCategory(tool.category).foreground
                      )}
                      aria-hidden
                    />
                    <span>{tool.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        ) : null}

        {results.length > 0 ? (
          <CommandGroup heading={query ? "Tools" : "Popular tools"}>
            {(query ? results : spotlightTools.slice(0, 6)).map((tool) => {
              const Icon = getToolIcon(tool.slug);
              const category = getCategory(tool.category);
              return (
                <CommandItem
                  key={tool.slug}
                  value={`${tool.name} ${tool.keywords.join(" ")}`}
                  onSelect={() => go(`/apps/${tool.slug}`)}
                >
                  <Icon
                    className={cn("size-4", category.foreground)}
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{tool.name}</span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {category.name}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ) : null}

        <CommandSeparator />

        <CommandGroup heading="Browse by category">
          {categoryEntries.map(({ category, count }) => {
            const Icon = categoryIcons[category.id];
            return (
              <CommandItem
                key={category.id}
                // Both names are searchable: someone typing "images" should
                // land on "Images & Media" even though the chip says "Images".
                value={`category ${category.name} ${category.shortName}`}
                onSelect={() => go(`/categories/${category.id}`)}
              >
                <Icon
                  className={cn("size-4", category.foreground)}
                  aria-hidden
                />
                <span className="flex-1 truncate">{category.name}</span>
                <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                  {count}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandGroup heading="Pages">
          {mainNav.map((item) => (
            <CommandItem
              key={item.href}
              value={`page ${item.title}`}
              onSelect={() => go(item.href)}
            >
              <ArrowRight
                className="text-muted-foreground size-4"
                aria-hidden
              />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/**
 * The search affordance. `field` is the full input-shaped button; `icon` is the
 * collapsed form used once the viewport can no longer spare the width.
 */
export function SearchTrigger({
  onClick,
  variant = "field",
  className,
}: {
  onClick: () => void;
  variant?: "field" | "icon";
  className?: string;
}) {
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        aria-label="Search tools"
        aria-keyshortcuts="Meta+K Control+K"
        className={cn("text-muted-foreground hover:text-foreground", className)}
      >
        <Search className="size-4.5" aria-hidden />
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "group border-input bg-muted/50 text-muted-foreground flex h-9 items-center gap-2 rounded-lg border px-3 text-sm",
        "hover:border-ring/40 hover:bg-muted focus-visible:ring-ring/40 transition-colors",
        "focus-visible:ring-[3px] focus-visible:outline-none",
        className
      )}
    >
      <Search
        className="group-hover:text-foreground size-4 shrink-0 transition-colors"
        aria-hidden
      />
      <span className="truncate">Search tools…</span>
      <Kbd className="ml-auto">⌘K</Kbd>
    </button>
  );
}

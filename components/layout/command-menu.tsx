"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

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
import { getToolIcon } from "@/data/tool-icons";
import {
  getCategory,
  liveTools,
  searchTools,
  toolCategories,
} from "@/data/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Global search. Opens with ⌘K / Ctrl-K from anywhere and is the primary way
 * to reach a tool once someone knows the catalogue.
 */
export function CommandMenu({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
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
      setOpen((previous) => !previous);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = React.useMemo(
    () => searchTools(query, liveTools).slice(0, 8),
    [query]
  );

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const showRecent = !query && recent.length > 0;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "text-muted-foreground h-9 w-full justify-start gap-2 px-3 font-normal sm:w-56 lg:w-72",
          className
        )}
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="truncate">Search tools…</span>
        <Kbd className="ml-auto hidden sm:inline-flex">⌘K</Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
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
              {(query ? results : liveTools.slice(0, 6)).map((tool) => {
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

          <CommandGroup heading="Categories">
            {toolCategories.map((category) => (
              <CommandItem
                key={category.id}
                value={`category ${category.name}`}
                onSelect={() => go(`/categories/${category.id}`)}
              >
                <ArrowRight
                  className="text-muted-foreground size-4"
                  aria-hidden
                />
                <span>{category.name}</span>
              </CommandItem>
            ))}
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
    </>
  );
}

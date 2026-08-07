"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  History,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { GitHubIcon } from "@/components/layout/brand-icons";
import { CommandMenu, SearchTrigger } from "@/components/layout/command-menu";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import {
  categoryEntries,
  defaultCategoryId,
  headerNavLeading,
  headerNavTrailing,
} from "@/components/layout/nav-data";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryIcons } from "@/data/category-icons";
import { liveTools, type Tool, type ToolCategoryId } from "@/data/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { siteConfig } from "@/lib/site";
import { cn, pluralize } from "@/lib/utils";

/** Distance scrolled before the header is allowed to retract at all. */
const RETRACT_AFTER = 320;
/** Ignore scroll jitter below this many pixels — trackpads are noisy. */
const DIRECTION_THRESHOLD = 6;

const MENU_ID = "tools-menu";
const TRIGGER_ID = "tools-menu-trigger";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { scrolled, retracted } = useHeaderScroll();

  // Close everything on navigation — none of these have route awareness.
  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- dismissal is a reaction to navigation, not state derivable at render time. */
    setMenuOpen(false);
    setMobileOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  // A panel anchored to the header has nowhere sensible to go once the page
  // moves under it, so dismiss on the first scroll instead of following along.
  React.useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [menuOpen]);

  const isActive = React.useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname]
  );

  const toolsActive = pathname.startsWith("/apps");
  // Retracting while something is open would drag the open thing off-screen.
  const hidden = retracted && !menuOpen && !mobileOpen && !searchOpen;

  return (
    <>
      <header
        id="top"
        className={cn(
          "sticky top-0 z-50 w-full border-b border-transparent",
          // Transform + colour only, both compositor-friendly. The height never
          // changes, so nothing below the header can be pushed around.
          "transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out",
          scrolled && "surface-glass border-border/60 shadow-sm",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        {/* Reading position, drawn by the scroll timeline — no JS, no listener. */}
        <span
          aria-hidden
          className={cn(
            "scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Dims the page behind an open mega menu and catches the click that
            dismisses it. Anchored to the header rather than the viewport: the
            header's transform and backdrop-filter make it the containing
            block, so `fixed` would collapse to the header's own box. Kept a
            sibling of the menu so leaving the panel really is a pointer-leave
            rather than a move into one of its descendants. */}
        {menuOpen ? (
          <div
            aria-hidden
            onClick={() => setMenuOpen(false)}
            className="animate-in fade-in-0 bg-foreground/5 absolute inset-x-0 top-full h-dvh duration-200"
          />
        ) : null}

        {/* Three tracks on desktop so the links sit centred in the viewport
            rather than centred in whatever width the brand and actions leave
            over. Below that it collapses to a plain row. */}
        <div className="container-page flex h-16 items-center gap-2 lg:grid lg:h-17 lg:grid-cols-[1fr_auto_1fr]">
          <Logo className="lg:justify-self-start" />

          <nav
            aria-label="Main"
            className="hidden items-center gap-0.5 lg:flex lg:justify-self-center"
          >
            {headerNavLeading.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={isActive(item.href)}
              >
                {item.title}
              </NavLink>
            ))}

            <ToolsMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              active={toolsActive}
            />

            {headerNavTrailing.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={isActive(item.href)}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:justify-self-end">
            <SearchTrigger
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex lg:w-44 xl:w-56"
            />
            <SearchTrigger
              onClick={() => setSearchOpen(true)}
              variant="icon"
              className="lg:hidden"
            />

            <a
              href={siteConfig.links.repo}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${siteConfig.name} on GitHub`}
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-accent hidden size-9 place-items-center rounded-md transition-colors sm:grid",
                "focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none"
              )}
            >
              <GitHubIcon className="size-4.5" />
            </a>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        onSearch={() => {
          setMobileOpen(false);
          setSearchOpen(true);
        }}
        isActive={isActive}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scroll behaviour                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Two booleans from one passive, rAF-throttled listener: whether the page has
 * moved off the top (the header earns its background) and whether the reader is
 * heading down the page (it gets out of the way). React bails out of identical
 * state, so a full scroll produces a handful of renders, not hundreds.
 */
function useHeaderScroll() {
  const [scrolled, setScrolled] = React.useState(false);
  const [retracted, setRetracted] = React.useState(false);

  React.useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const y = Math.max(window.scrollY, 0);
      setScrolled(y > 4);

      const delta = y - previous;
      if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
      previous = y;
      setRetracted(delta > 0 && y > RETRACT_AFTER);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    // Restored scroll positions land before the first scroll event fires.
    frame = requestAnimationFrame(measure);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { scrolled, retracted };
}

/* -------------------------------------------------------------------------- */
/*  Desktop navigation                                                        */
/* -------------------------------------------------------------------------- */

const navItemClasses = [
  "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium",
  "transition-colors duration-150",
  "focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none",
].join(" ");

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        navItemClasses,
        active
          ? "text-foreground bg-accent/80 ring-border/60 ring-1 ring-inset"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      {children}
    </Link>
  );
}

/**
 * The tools mega menu, built as a disclosure rather than a menubar: its content
 * is a set of links, not commands, so arrow-key roving would fight the reading
 * order screen-reader users expect. The button owns `aria-expanded`, Escape
 * returns focus to it, and moving focus out of the group closes the panel.
 */
function ToolsMenu({
  open,
  onOpenChange,
  active,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  active: boolean;
}) {
  const groupRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef(0);

  const schedule = React.useCallback(
    (next: boolean, delay: number) => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => onOpenChange(next), delay);
    },
    [onOpenChange]
  );

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const close = React.useCallback(
    (returnFocus: boolean) => {
      window.clearTimeout(timer.current);
      onOpenChange(false);
      if (returnFocus) triggerRef.current?.focus();
    },
    [onOpenChange]
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === "ArrowDown" && event.target === triggerRef.current) {
      event.preventDefault();
      onOpenChange(true);
      // The panel mounts with the state change, so wait a frame for the DOM.
      requestAnimationFrame(() =>
        panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()
      );
    }
  };

  return (
    <div
      ref={groupRef}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!groupRef.current?.contains(event.relatedTarget as Node | null)) {
          window.clearTimeout(timer.current);
          onOpenChange(false);
        }
      }}
      // Hover is an accelerator, never the only way in: the button still works
      // on click, and touch never fires these.
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") schedule(true, 90);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") schedule(false, 180);
      }}
    >
      <button
        ref={triggerRef}
        id={TRIGGER_ID}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => {
          window.clearTimeout(timer.current);
          onOpenChange(!open);
        }}
        className={cn(
          navItemClasses,
          active || open
            ? "text-foreground bg-accent/80 ring-border/60 ring-1 ring-inset"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        Tools
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? <ToolsPanel ref={panelRef} /> : null}
    </div>
  );
}

/**
 * Category-first browsing: a rail of categories on the left, the tools in the
 * highlighted one on the right. Categories are the fixed part of the menu, so
 * the panel's size stays the same whether the catalogue holds thirty tools or
 * three hundred — a new tool lengthens one column instead of the whole menu.
 *
 * Built on Radix tabs, which is exactly this interaction: one visible set of
 * many, roving arrow-key focus along the rail, Tab into the panel that belongs
 * to it. Pointer users get the same switch on hover.
 */
function ToolsPanel({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  const recent = useRecentTools();
  const [openCategory, setOpenCategory] =
    React.useState<ToolCategoryId>(defaultCategoryId);

  return (
    <div
      ref={ref}
      id={MENU_ID}
      aria-labelledby={TRIGGER_ID}
      className="animate-in fade-in-0 slide-in-from-top-1 absolute inset-x-0 top-full duration-200 ease-out"
    >
      <div className="container-page pt-2">
        {/* Centred rather than left-anchored: the trigger now sits in the
            middle of the bar, so a panel hugging the left edge would read as a
            mistake. */}
        <div className="bg-popover/95 supports-backdrop-filter:bg-popover/85 border-border/70 relative mx-auto max-w-272 overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl">
          <span
            aria-hidden
            className="via-primary/45 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
          />

          <Tabs
            value={openCategory}
            onValueChange={(next) => setOpenCategory(next as ToolCategoryId)}
            orientation="vertical"
            className="grid gap-2 p-2 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
          >
            <TabsList
              aria-label="Tool categories"
              className="h-auto w-full flex-col items-stretch justify-start gap-0.5 rounded-none bg-transparent p-0"
            >
              {categoryEntries.map(({ category, count }) => {
                const Icon = categoryIcons[category.id];
                const isOpen = category.id === openCategory;

                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    // Hover mirrors the keyboard behaviour so a pointer never
                    // has to click twice to look inside a category.
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") {
                        setOpenCategory(category.id);
                      }
                    }}
                    className={cn(
                      "group/tab h-auto w-full flex-none justify-start gap-3 rounded-xl px-2.5 py-2 text-left whitespace-normal",
                      "data-[state=active]:bg-accent/70 data-[state=active]:shadow-none",
                      "hover:bg-accent/40"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "ring-border/60 grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br ring-1 ring-inset",
                        "transition-transform duration-300 group-hover/tab:scale-105",
                        category.gradient,
                        category.foreground
                      )}
                    >
                      <Icon className="size-4.5" strokeWidth={1.75} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{category.name}</span>
                      <span className="text-muted-foreground block text-[0.6875rem] font-normal tabular-nums">
                        {count} {pluralize(count, "tool")}
                      </span>
                    </span>

                    <ChevronRight
                      aria-hidden
                      className={cn(
                        "text-muted-foreground size-3.5 shrink-0 transition-opacity duration-200",
                        isOpen ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categoryEntries.map(({ category, tools, count }) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="animate-in fade-in-0 bg-muted/40 ring-border/50 rounded-xl p-4 ring-1 duration-200 ring-inset"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold">{category.name}</h2>
                    <p className="text-muted-foreground mt-1 max-w-lg text-xs leading-relaxed text-pretty">
                      {category.description}
                    </p>
                  </div>
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-primary group/all focus-visible:ring-ring/40 inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-medium hover:underline focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    All {count}
                    <ArrowRight
                      aria-hidden
                      className="size-3 transition-transform group-hover/all:translate-x-0.5"
                    />
                  </Link>
                </div>

                <ul className="mt-3 grid gap-0.5 sm:grid-cols-2">
                  {tools.map((tool) => (
                    <ToolRow key={tool.slug} tool={tool} withTagline />
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>

          {recent.length > 0 ? (
            <div className="border-border/60 flex flex-wrap items-center gap-2 border-t px-5 py-3">
              <PanelHeading icon={History}>Jump back in</PanelHeading>
              <ul className="flex flex-wrap items-center gap-1.5">
                {recent.slice(0, 4).map((tool) => (
                  <li key={`recent-${tool.slug}`}>
                    <Link
                      href={`/apps/${tool.slug}`}
                      className={cn(
                        "border-border/70 bg-card hover:border-primary/40 hover:bg-accent/50 flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-xs font-medium transition-colors",
                        "focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none"
                      )}
                    >
                      <ToolIconTile
                        tool={tool}
                        size="sm"
                        className="size-5 rounded-full [&_svg]:size-3"
                      />
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground font-medium">
                {liveTools.length} {pluralize(liveTools.length, "tool")}
              </span>{" "}
              across {categoryEntries.length} categories — free, no account,
              nothing to install.
            </p>
            <div className="flex items-center gap-1.5">
              <Button asChild size="sm" variant="ghost">
                <Link href="/categories">Explore categories</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/apps">
                  Browse all tools
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelHeading({
  icon: Icon,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-muted-foreground flex items-center gap-1.5 px-1 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
    </h2>
  );
}

function ToolRow({
  tool,
  withTagline = false,
}: {
  tool: Tool;
  withTagline?: boolean;
}) {
  return (
    <li>
      <Link
        href={`/apps/${tool.slug}`}
        className={cn(
          "hover:bg-background/80 group/row flex items-center gap-2.5 rounded-lg p-2 transition-colors",
          "focus-visible:bg-background/80 focus-visible:outline-none"
        )}
      >
        <ToolIconTile tool={tool} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {tool.name}
          </span>
          {withTagline ? (
            <span className="text-muted-foreground block truncate text-xs">
              {tool.tagline}
            </span>
          ) : null}
        </span>
        <ArrowRight
          aria-hidden
          className="text-muted-foreground size-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover/row:translate-x-0 group-hover/row:opacity-100"
        />
      </Link>
    </li>
  );
}

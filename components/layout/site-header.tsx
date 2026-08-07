"use client";

import { ArrowRight, ChevronDown, History, Menu, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { GitHubIcon } from "@/components/layout/brand-icons";
import { CommandMenu, SearchTrigger } from "@/components/layout/command-menu";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { categoryEntries } from "@/components/layout/nav-data";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import { Button } from "@/components/ui/button";
import { categoryIcons } from "@/data/category-icons";
import { featuredTools, liveTools } from "@/data/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { siteConfig } from "@/lib/site";
import { cn, pluralize } from "@/lib/utils";

/** Links that sit beside the tools menu. `/apps` is covered by the menu. */
const inlineNav = [
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about-us" },
  { title: "Contact", href: "/contact-us" },
] as const;

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

        <div className="container-page flex h-16 items-center gap-2 lg:h-17">
          <Logo />

          <nav
            aria-label="Main"
            className="ml-6 hidden items-center gap-0.5 lg:flex"
          >
            <ToolsMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              active={toolsActive}
            />
            {inlineNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={isActive(item.href)}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <SearchTrigger
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex lg:w-56 xl:w-64"
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

function ToolsPanel({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  const recent = useRecentTools();
  const popular = featuredTools.slice(0, recent.length > 0 ? 4 : 6);

  return (
    <div
      ref={ref}
      id={MENU_ID}
      aria-labelledby={TRIGGER_ID}
      className="animate-in fade-in-0 slide-in-from-top-1 absolute inset-x-0 top-full duration-200 ease-out"
    >
      <div className="container-page pt-2">
        <div className="bg-popover/95 supports-backdrop-filter:bg-popover/85 border-border/70 relative max-w-272 overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl">
          <span
            aria-hidden
            className="via-primary/45 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
          />

          <div className="grid gap-1 p-2 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            <section className="p-3">
              <PanelHeading>Browse by category</PanelHeading>
              <ul className="mt-3 grid gap-0.5 sm:grid-cols-2">
                {categoryEntries.map(({ category, count }) => {
                  const Icon = categoryIcons[category.id];
                  return (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.id}`}
                        className={cn(
                          "group/item hover:bg-accent/70 flex items-start gap-3 rounded-xl p-2.5 transition-colors",
                          "focus-visible:bg-accent/70 focus-visible:outline-none"
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "ring-border/60 grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br ring-1 ring-inset",
                            "transition-transform duration-300 group-hover/item:scale-105",
                            category.gradient,
                            category.foreground
                          )}
                        >
                          <Icon className="size-4.5" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-baseline gap-1.5 text-sm font-medium">
                            {category.name}
                            <span className="text-muted-foreground text-[0.6875rem] tabular-nums">
                              {count}
                            </span>
                          </span>
                          <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-relaxed">
                            {category.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="bg-muted/40 ring-border/50 rounded-xl p-3 ring-1 ring-inset">
              {recent.length > 0 ? (
                <>
                  <PanelHeading icon={History}>Jump back in</PanelHeading>
                  <ul className="mt-2 mb-4 flex flex-col gap-0.5">
                    {recent.slice(0, 3).map((tool) => (
                      <ToolRow key={`recent-${tool.slug}`} tool={tool} />
                    ))}
                  </ul>
                </>
              ) : null}

              <PanelHeading icon={Star}>Most used</PanelHeading>
              <ul className="mt-2 flex flex-col gap-0.5">
                {popular.map((tool) => (
                  <ToolRow key={tool.slug} tool={tool} />
                ))}
              </ul>
            </section>
          </div>

          <div className="border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground font-medium">
                {liveTools.length} {pluralize(liveTools.length, "tool")}
              </span>{" "}
              ready to use — free, no account, nothing to install.
            </p>
            <div className="flex items-center gap-1.5">
              <Button asChild size="sm" variant="ghost">
                <Link href="/contact-us">Request a tool</Link>
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

function ToolRow({ tool }: { tool: (typeof featuredTools)[number] }) {
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
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {tool.name}
        </span>
        <ArrowRight
          aria-hidden
          className="text-muted-foreground size-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/row:translate-x-0 group-hover/row:opacity-100"
        />
      </Link>
    </li>
  );
}

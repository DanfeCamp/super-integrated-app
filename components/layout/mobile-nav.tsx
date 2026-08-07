"use client";

import {
  ArrowRight,
  Home,
  Info,
  LayoutGrid,
  Mail,
  Monitor,
  Moon,
  Shapes,
  Sun,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import * as React from "react";

import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
} from "@/components/layout/brand-icons";
import { SearchTrigger } from "@/components/layout/command-menu";
import { Logo } from "@/components/layout/logo";
import { categoryEntries } from "@/components/layout/nav-data";
import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { categoryIcons } from "@/data/category-icons";
import { featuredTools, liveTools } from "@/data/tools";
import { useMounted } from "@/hooks/use-mounted";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { siteConfig } from "@/lib/site";
import { cn, pluralize } from "@/lib/utils";

const primaryNav: { title: string; href: string; icon: LucideIcon }[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "All tools", href: "/apps", icon: LayoutGrid },
  { title: "Categories", href: "/categories", icon: Shapes },
  { title: "About", href: "/about-us", icon: Info },
  { title: "Contact", href: "/contact-us", icon: Mail },
];

const socials = [
  { label: "GitHub", href: siteConfig.links.repo, Icon: GitHubIcon },
  { label: "Facebook", href: siteConfig.links.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: siteConfig.links.instagram, Icon: InstagramIcon },
];

/**
 * Navigation for anything narrower than a laptop. A right-anchored sheet
 * rather than a full-screen takeover: it keeps a sliver of the page visible so
 * the overlay reads as temporary, and it puts every row within thumb reach of
 * the edge the thumb already rests on.
 */
export function MobileNav({
  open,
  onOpenChange,
  onSearch,
  isActive,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => void;
  isActive: (href: string) => boolean;
}) {
  const recent = useRecentTools();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 p-0">
        <SheetTitle className="sr-only">Site navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Browse every page, category and tool on {siteConfig.fullName}
        </SheetDescription>

        <div className="border-border/60 flex h-16 shrink-0 items-center border-b px-5 pr-14">
          <Logo size="sm" tagline={false} />
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <nav aria-label="Mobile" className="flex flex-col gap-7">
            <SearchTrigger onClick={onSearch} className="h-11 w-full" />

            <Section title="Menu">
              <ul className="flex flex-col gap-0.5">
                {primaryNav.map(({ title, href, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg py-2.5 pr-3 pl-3.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                        )}
                      >
                        {active ? (
                          <span
                            aria-hidden
                            className="bg-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full"
                          />
                        ) : null}
                        <Icon className="size-4.5 shrink-0" aria-hidden />
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Section>

            <Section title="Categories">
              <ul className="flex flex-col gap-0.5">
                {categoryEntries.map(({ category, count }) => {
                  const Icon = categoryIcons[category.id];
                  return (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.id}`}
                        className="hover:bg-accent/60 flex items-center gap-3 rounded-lg p-2 transition-colors"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "ring-border/60 grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br ring-1 ring-inset",
                            category.gradient,
                            category.foreground
                          )}
                        >
                          <Icon className="size-4.5" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-medium">
                          {category.name}
                        </span>
                        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                          {count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Section>

            {recent.length > 0 ? (
              <Section title="Jump back in">
                <ul className="flex flex-wrap gap-2">
                  {recent.slice(0, 4).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/apps/${tool.slug}`}
                        className="border-border/70 bg-card hover:border-primary/40 hover:bg-accent/40 flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-sm transition-colors"
                      >
                        <ToolIconTile
                          tool={tool}
                          size="sm"
                          className="size-6 rounded-full [&_svg]:size-3"
                        />
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            <Section title="Popular tools">
              <ul className="flex flex-col gap-0.5">
                {featuredTools.slice(0, 6).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/apps/${tool.slug}`}
                      className="hover:bg-accent/60 flex items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      <ToolIconTile tool={tool} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {tool.name}
                        </span>
                        <span className="text-muted-foreground block truncate text-xs">
                          {tool.tagline}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>

            <Link
              href="/apps"
              className="border-border/70 bg-card hover:border-primary/40 hover:bg-accent/40 group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors"
            >
              <span className="text-sm font-medium">
                Browse all {liveTools.length}{" "}
                {pluralize(liveTools.length, "tool")}
              </span>
              <ArrowRight
                className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </nav>
        </div>

        <div className="border-border/60 flex shrink-0 items-center justify-between gap-3 border-t px-5 py-3.5">
          <ThemePicker />
          <div className="flex items-center gap-0.5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground hover:bg-accent grid size-9 place-items-center rounded-md transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-muted-foreground px-1 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * A segmented control instead of the desktop dropdown: on touch, three visible
 * targets beat a menu that costs a tap to discover.
 */
function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <ToggleGroup
      type="single"
      value={mounted ? theme : undefined}
      onValueChange={(next) => next && setTheme(next)}
      aria-label="Colour theme"
    >
      <ToggleGroupItem value="light" aria-label="Light">
        <Sun aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark">
        <Moon aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System">
        <Monitor aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { categoryIcons } from "@/data/category-icons";
import { liveTools } from "@/data/tools";
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
 *
 * Tools are reached the same way as on desktop — category first — but as an
 * accordion rather than a rail: on touch, one collapsed row per category beats
 * a list of every tool the site has, and it stays that way as the catalogue
 * grows.
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
  const [openCategory, setOpenCategory] = React.useState("");

  // Opening the last category would otherwise expand its tools below the fold
  // with no hint that anything happened. Runs after the expand animation so the
  // browser scrolls to the item's final height, not its collapsed one.
  React.useEffect(() => {
    if (!openCategory) return;
    const timer = window.setTimeout(() => {
      document
        .querySelector(`[data-nav-category="${openCategory}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 220);
    return () => window.clearTimeout(timer);
  }, [openCategory]);

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

            <Section title="Browse by category">
              {/* Collapsible rather than always-open: the whole catalogue is
                  reachable in two taps without a screen and a half of scroll. */}
              <Accordion
                type="single"
                collapsible
                className="w-full"
                value={openCategory}
                onValueChange={setOpenCategory}
              >
                {categoryEntries.map(({ category, tools, count }) => {
                  const Icon = categoryIcons[category.id];

                  return (
                    <AccordionItem
                      key={category.id}
                      value={category.id}
                      data-nav-category={category.id}
                      className="border-border/60"
                    >
                      <AccordionTrigger className="hover:text-foreground items-center gap-3 py-2.5 text-sm">
                        <span className="flex min-w-0 flex-1 items-center gap-3">
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
                          <span className="min-w-0 flex-1 truncate text-left font-medium">
                            {category.name}
                          </span>
                          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                            {count}
                          </span>
                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="pt-0 pb-3">
                        <ul className="flex flex-col gap-0.5">
                          {tools.map((tool) => (
                            <li key={tool.slug}>
                              <Link
                                href={`/apps/${tool.slug}`}
                                className="hover:bg-accent/60 text-foreground flex items-center gap-3 rounded-lg p-2 transition-colors"
                              >
                                <ToolIconTile
                                  tool={tool}
                                  size="sm"
                                  className="size-7 rounded-md [&_svg]:size-3.5"
                                />
                                <span className="min-w-0 flex-1 truncate text-sm">
                                  {tool.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={`/categories/${category.id}`}
                          className="text-primary group mt-1 ml-2 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                        >
                          All {category.shortName.toLowerCase()}
                          <ArrowRight
                            aria-hidden
                            className="size-3 transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
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

import { ArrowRight, ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";

import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
} from "@/components/layout/brand-icons";
import { Logo } from "@/components/layout/logo";
import { categoryEntries } from "@/components/layout/nav-data";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryIcons } from "@/data/category-icons";
import { featuredTools, liveTools } from "@/data/tools";
import { footerNav, siteConfig, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import pkg from "@/package.json";

const socials = [
  { label: "GitHub", href: siteConfig.links.repo, Icon: GitHubIcon },
  { label: "Facebook", href: siteConfig.links.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: siteConfig.links.instagram, Icon: InstagramIcon },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 relative mt-24 border-t">
      <Decoration />

      <div className="container-page relative">
        {/* ---------------------------------------------------------------- */}
        {/*  Brand + newsletter                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20 lg:py-16">
          <div className="flex flex-col items-start gap-5">
            <Logo size="lg" />

            <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-pretty">
              {siteConfig.description}
            </p>

            <p className="border-primary/35 text-muted-foreground max-w-md border-l-2 pl-4 text-sm leading-relaxed text-pretty">
              {siteConfig.mission}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <Button asChild size="sm">
                <Link href="/apps">
                  Browse all {liveTools.length} tools
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href={siteConfig.links.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <GitHubIcon className="size-3.5" />
                  View source
                </a>
              </Button>
            </div>

            <div className="mt-1 flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className={cn(
                    "text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent",
                    "focus-visible:ring-ring/40 grid size-9 place-items-center rounded-lg border border-transparent",
                    "transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  )}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "bg-card/70 border-border/70 relative overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm sm:p-7",
              "lg:self-start"
            )}
          >
            <span
              aria-hidden
              className="via-primary/40 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
            />
            <div
              aria-hidden
              className="bg-primary/10 pointer-events-none absolute -top-20 -right-16 size-48 rounded-full blur-3xl"
            />

            <div className="relative flex flex-col gap-4">
              <span
                aria-hidden
                className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg"
              >
                <Mail className="size-4.5" />
              </span>

              <div className="flex flex-col gap-1.5">
                <h2 className="font-semibold tracking-tight">
                  New tools, now and then
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                  A short note when something worth using ships. No tracking
                  pixels, no drip campaign, no reselling your address.
                </p>
              </div>

              <NewsletterForm />

              <p
                id="newsletter-note"
                className="text-muted-foreground text-xs leading-relaxed"
              >
                Sign-ups aren&apos;t open yet — this is a placeholder. Until
                then,{" "}
                <a
                  href={siteConfig.links.changelog}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  release notes live on GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Link columns                                                    */}
        {/* ---------------------------------------------------------------- */}
        <nav
          aria-label="Footer"
          className="border-border/60 grid grid-cols-2 gap-x-6 gap-y-10 border-t py-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8"
        >
          <Column title="Popular tools" id="footer-popular">
            {featuredTools.slice(0, 6).map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/apps/${tool.slug}`}
                  className="group text-muted-foreground hover:text-foreground focus-visible:text-foreground -mx-2 flex items-center gap-2.5 rounded-md px-2 py-1 text-sm transition-colors focus-visible:outline-none"
                >
                  <ToolIconTile
                    tool={tool}
                    size="sm"
                    className="size-6 rounded-md [&_svg]:size-3.5"
                  />
                  <span className="truncate">{tool.name}</span>
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <MoreLink href="/apps">All {liveTools.length} tools</MoreLink>
            </li>
          </Column>

          <Column title="Categories" id="footer-categories">
            {categoryEntries.map(({ category, count }) => {
              const Icon = categoryIcons[category.id];
              return (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="group text-muted-foreground hover:text-foreground focus-visible:text-foreground -mx-2 flex items-center gap-2.5 rounded-md px-2 py-1 text-sm transition-colors focus-visible:outline-none"
                  >
                    <Icon
                      className={cn("size-3.5 shrink-0", category.foreground)}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="truncate">{category.name}</span>
                    <span className="text-muted-foreground/70 ml-auto text-[0.6875rem] tabular-nums">
                      {count}
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="pt-1">
              <MoreLink href="/categories">All categories</MoreLink>
            </li>
          </Column>

          {footerNav.map((section) => (
            <Column
              key={section.title}
              title={section.title}
              id={`footer-${section.title.toLowerCase()}`}
            >
              {section.links.map((link) => (
                <li key={link.title}>
                  <FooterLink link={link} />
                </li>
              ))}
            </Column>
          ))}
        </nav>

        {/* ---------------------------------------------------------------- */}
        {/*  Divider + back to top                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="border-border/60 relative border-t">
          <a
            href="#top"
            className={cn(
              "group bg-card border-border/70 text-muted-foreground absolute -top-4.5 right-0 grid size-9 place-items-center rounded-full border shadow-sm",
              "hover:text-foreground hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md",
              "focus-visible:ring-ring/40 transition-all duration-200 focus-visible:ring-[3px] focus-visible:outline-none"
            )}
          >
            <ArrowUp
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5"
              aria-hidden
            />
            <span className="sr-only">Back to top</span>
          </a>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Bottom bar                                                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col-reverse items-start justify-between gap-4 pt-8 pb-10 sm:flex-row sm:items-center">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span>
              &copy; {year} {siteConfig.fullName}
            </span>
            <Separator />
            <Badge
              variant="muted"
              className="font-mono text-[0.6875rem] tabular-nums"
            >
              v{pkg.version}
            </Badge>
            <Separator />
            <a
              href={siteConfig.links.license}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-foreground transition-colors"
            >
              Apache&nbsp;2.0
            </a>
          </div>

          <p className="text-muted-foreground text-sm">
            Built with{" "}
            <span role="img" aria-label="love" className="text-destructive">
              ❤️
            </span>{" "}
            by{" "}
            <a
              href={siteConfig.author.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground font-medium underline-offset-4 transition-colors hover:underline"
            >
              {siteConfig.author.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * A dot grid and a single radial wash, both masked. Same recipe as the hero, so
 * the page opens and closes on the same note — and both rasterise in one pass
 * rather than forcing a large blur filter.
 */
function Decoration() {
  return (
    <>
      <div
        aria-hidden
        className="via-primary/35 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
      />
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 [background:radial-gradient(ellipse_45%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]"
      />
    </>
  );
}

function Separator() {
  return (
    <span
      aria-hidden
      className="bg-border hidden size-1 rounded-full sm:block"
    />
  );
}

function Column({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <h2
        id={id}
        className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase"
      >
        {title}
      </h2>
      <ul aria-labelledby={id} className="flex flex-col gap-1">
        {children}
      </ul>
    </div>
  );
}

/** The one emphasised link that closes a generated column. */
function MoreLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-primary group inline-flex items-center gap-1 text-sm font-medium hover:underline"
    >
      {children}
      <ArrowRight
        className="size-3 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}

function FooterLink({ link }: { link: NavLink }) {
  const className =
    "group text-muted-foreground hover:text-foreground focus-visible:text-foreground -mx-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors focus-visible:outline-none";

  if (!link.href) {
    return (
      <span className="text-muted-foreground/70 -mx-2 inline-flex items-center gap-2 px-2 py-1 text-sm">
        {link.title}
        <Badge variant="muted" className="px-1.5 py-0 text-[0.625rem]">
          Soon
        </Badge>
      </span>
    );
  }

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {link.title}
        <ArrowUpRight
          aria-hidden
          className="size-3 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.title}
    </Link>
  );
}

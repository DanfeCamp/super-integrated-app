import { ArrowRight, Lock, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

import { RecentTools } from "@/components/home/recent-tools";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolGrid } from "@/components/tools/tool-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  featuredTools,
  getLiveToolsByCategory,
  liveTools,
  toolCategories,
} from "@/data/tools";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: Zap,
    title: "Instant, no setup",
    body: "Every tool opens straight into a working state. No sign-up, no install, no paywall.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Most tools run entirely in your browser. Your files and text never leave your device.",
  },
  {
    icon: Sparkles,
    title: "One consistent place",
    body: "The same keyboard shortcuts, layout and behaviour across every tool in the collection.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="container-page flex flex-col gap-16 pb-8 sm:gap-20">
        <RecentTools />

        <section aria-labelledby="popular" className="flex flex-col gap-6">
          <SectionHeading
            id="popular"
            eyebrow="Most used"
            title="Start with these"
            description="The tools people reach for most often."
            href="/apps"
            linkLabel="Browse all tools"
          />
          <ToolGrid tools={featuredTools} />
        </section>

        <section aria-labelledby="why" className="flex flex-col gap-6">
          <h2 id="why" className="sr-only">
            Why use SIA
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="border-border/70 bg-card flex flex-col gap-2.5 rounded-xl border p-6"
              >
                <span
                  aria-hidden
                  className="bg-primary/10 text-primary mb-1 grid size-9 place-items-center rounded-lg"
                >
                  <Icon className="size-4.5" />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {toolCategories.map((category) => {
          const categoryTools = getLiveToolsByCategory(category.id);
          if (categoryTools.length === 0) return null;

          return (
            <section
              key={category.id}
              aria-labelledby={`category-${category.id}`}
              className="flex flex-col gap-6"
            >
              <SectionHeading
                id={`category-${category.id}`}
                eyebrow={category.name}
                title={category.description}
                href={`/categories/${category.id}`}
                linkLabel={`All ${category.name.toLowerCase()}`}
                titleClassName="text-xl sm:text-2xl font-medium text-muted-foreground max-w-3xl"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTools.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} showCategory={false} />
                ))}
              </div>
            </section>
          );
        })}

        <CallToAction />
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Two soft radial washes plus a dot field — cheap, GPU-free depth. */}
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] opacity-60"
      />
      {/* A radial gradient rather than a blurred circle: same wash, but it
          rasterises in one pass instead of forcing a 120px blur filter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[36rem] [background:radial-gradient(ellipse_50%_50%_at_50%_40%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)]"
      />

      <div className="container-page relative flex flex-col items-center gap-7 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
        <Badge
          variant="outline"
          asChild
          className="bg-card/70 gap-1.5 py-1 pr-1.5 pl-3 backdrop-blur-sm"
        >
          <Link href="/apps">
            <span className="bg-success size-1.5 rounded-full" aria-hidden />
            {liveTools.length} tools ready to use
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        </Badge>

        {/* Deliberately un-animated: this is the LCP element, and fading it in
            from opacity 0 would push Largest Contentful Paint out by the whole
            animation duration. */}
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-gradient">Every everyday tool,</span>
          <br />
          in one place.
        </h1>

        <p className="text-muted-foreground animate-fade-up max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
          {siteConfig.name} collects the calculators, converters and generators
          you keep searching for into one fast, free workspace. No accounts, no
          adverts, no limits.
        </p>

        <div className="animate-fade-up animate-delay-60 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/apps">
              Browse all tools
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/categories">Explore by category</Link>
          </Button>
        </div>

        <ul className="animate-fade-up animate-delay-120 mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {featuredTools.slice(0, 5).map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/apps/${tool.slug}`}
                className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
              >
                {tool.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  titleClassName,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  titleClassName?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-2">
        {eyebrow ? (
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={cn("text-2xl font-semibold sm:text-3xl", titleClassName)}
        >
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className="text-primary group inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {linkLabel}
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      ) : null}
    </div>
  );
}

function CallToAction() {
  return (
    <section className="border-border/70 from-primary/8 relative overflow-hidden rounded-2xl border bg-linear-to-br to-transparent p-8 text-center sm:p-14">
      <div
        aria-hidden
        className="bg-primary/12 pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Missing a tool you need?
        </h2>
        <p className="text-muted-foreground max-w-lg text-balance">
          {siteConfig.name} is open source and growing. Tell us what would make
          your day easier and it might be next.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/contact-us">Request a tool</Link>
          </Button>
          <Button asChild variant="outline">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type * as React from "react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/layout/json-ld";
import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import { TrackToolVisit } from "@/components/tools/track-tool-visit";
import { Card, CardContent } from "@/components/ui/card";
import { getCategory, getRelatedTools, getTool, type Tool } from "@/data/tools";
import { breadcrumbJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

import { ToolCard } from "./tool-card";

/**
 * The page template every tool route renders into. It owns breadcrumbs,
 * the title block, structured data, the usage panel, source attribution and
 * the related-tools rail — so a new tool only has to supply its own UI.
 */
export function ToolShell({
  slug,
  children,
  /** Optional wide content rendered under the tool, above "How to use it". */
  aside,
  contentClassName,
}: {
  slug: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
  contentClassName?: string;
}) {
  const tool = getTool(slug);
  if (!tool) notFound();

  const category = getCategory(tool.category);
  const related = getRelatedTools(slug);
  const crumbs = [
    { name: "Tools", href: "/apps" },
    { name: category.name, href: `/categories/${category.id}` },
    { name: tool.name, href: `/apps/${tool.slug}` },
  ];

  return (
    <>
      <JsonLd data={softwareApplicationJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", href: "/" }, ...crumbs])}
      />
      <TrackToolVisit slug={slug} />

      <div className="container-page flex flex-col gap-8 py-8 sm:gap-10 sm:py-10">
        <Breadcrumbs items={crumbs} />

        <ToolHeader tool={tool} />

        <div className={cn("animate-fade-up", contentClassName)}>
          {children}
        </div>

        {aside}

        {tool.usage.length > 0 ? <UsagePanel tool={tool} /> : null}

        {related.length > 0 ? (
          <section
            aria-labelledby="related-tools"
            className="border-border/60 flex flex-col gap-5 border-t pt-10"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="related-tools" className="text-xl font-semibold">
                Related tools
              </h2>
              <Link
                href={`/categories/${category.id}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                All {category.shortName.toLowerCase()} tools
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ToolCard key={item.slug} tool={item} showCategory={false} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

function ToolHeader({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <ToolIconTile tool={tool} size="lg" />
        <div className="flex min-w-0 flex-col gap-2">
          <Link
            href={`/categories/${category.id}`}
            className={cn(
              "text-xs font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-70",
              category.foreground
            )}
          >
            {category.name}
          </Link>
          <h1 className="text-3xl font-semibold sm:text-4xl">{tool.name}</h1>
        </div>
      </div>
      <p className="text-muted-foreground max-w-3xl text-base leading-relaxed text-pretty sm:text-lg">
        {tool.description}
      </p>
    </header>
  );
}

function UsagePanel({ tool }: { tool: Tool }) {
  return (
    <section
      aria-labelledby="how-to-use"
      className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start"
    >
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 id="how-to-use" className="text-lg font-semibold">
            How to use {tool.name}
          </h2>
          <ol className="flex flex-col gap-3">
            {tool.usage.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed">
                <span
                  aria-hidden
                  className="bg-primary/10 text-primary mt-px grid size-5 shrink-0 place-items-center rounded-full text-[0.6875rem] font-semibold"
                >
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {tool.sources?.length ? (
        <Card className="lg:w-72">
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Data sources</h2>
            <ul className="flex flex-col gap-2">
              {tool.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
                  >
                    {source.label}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import { getLiveToolsByCategory, toolCategories } from "@/data/tools";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { cn, pluralize } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description:
    "Browse SIA's tools by category — calculators and converters, productivity and time, text and writing, images and media, developer tools, generators, and games.",
  path: "/categories",
  keywords: ["tool categories", "browse tools", "online utilities"],
});

export default function CategoriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Categories", href: "/categories" },
        ])}
      />

      <div className="container-page flex flex-col gap-8 py-8 sm:py-10">
        <Breadcrumbs items={[{ name: "Categories", href: "/categories" }]} />
        <PageHeader
          eyebrow="Browse"
          title="Categories"
          description={`${toolCategories.length} groups covering everything on SIA. Pick the one that matches what you're trying to do.`}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolCategories.map((category) => {
            const categoryTools = getLiveToolsByCategory(category.id);

            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className={cn(
                  "group border-border/70 bg-card relative flex flex-col gap-4 rounded-xl border p-6 transition-all duration-300",
                  "hover:border-primary/35 hover:-translate-y-0.5 hover:shadow-lg",
                  "focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none"
                )}
              >
                <div className="flex items-start justify-between">
                  <div
                    aria-hidden
                    className={cn(
                      "ring-border/60 grid size-11 place-items-center rounded-xl bg-linear-to-br ring-1 transition-transform duration-300 ring-inset group-hover:scale-105",
                      category.gradient,
                      category.foreground
                    )}
                  >
                    <span className="text-sm font-bold">
                      {categoryTools.length}
                    </span>
                  </div>
                  <ArrowRight
                    aria-hidden
                    className="text-muted-foreground size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h2 className="font-semibold tracking-tight">
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                    {category.description}
                  </p>
                </div>

                <p className="text-muted-foreground mt-auto text-xs">
                  {categoryTools.length}{" "}
                  {pluralize(categoryTools.length, "tool")} ·{" "}
                  {categoryTools
                    .slice(0, 3)
                    .map((tool) => tool.name)
                    .join(", ")}
                </p>
              </Link>
            );
          })}
        </div>

        <section className="border-border/60 flex flex-col gap-6 border-t pt-10">
          {toolCategories.map((category) => {
            const categoryTools = getLiveToolsByCategory(category.id);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id} className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold">{category.name}</h2>
                <ul className="flex flex-wrap gap-2">
                  {categoryTools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/apps/${tool.slug}`}
                        className="border-border/70 bg-card hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-ring/40 flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
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
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}

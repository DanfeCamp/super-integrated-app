import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { ToolGrid } from "@/components/tools/tool-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getLiveToolsByCategory,
  getToolsByCategory,
  toolCategories,
} from "@/data/tools";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";
import { pluralize } from "@/lib/utils";

type Params = Promise<{ category: string }>;

/** Every category is known at build time — render them all statically. */
export function generateStaticParams() {
  return toolCategories.map((category) => ({ category: category.id }));
}

function findCategory(id: string) {
  return toolCategories.find((category) => category.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: id } = await params;
  const category = findCategory(id);
  if (!category) return {};

  const count = getLiveToolsByCategory(category.id).length;
  const short = category.shortName.toLowerCase();

  return buildMetadata({
    // `shortName` rather than the display name throughout: "Developer Tools
    // tools" is the kind of thing a template writes and nobody reads back.
    title: category.name,
    description: `${category.description} ${count} free ${short} ${pluralize(count, "tool")} on SIA — no sign-up required.`,
    path: `/categories/${category.id}`,
    keywords: [
      `${short} tools`,
      `online ${short} tools`,
      "free online tools",
      "web utilities",
    ],
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: id } = await params;
  const category = findCategory(id);
  if (!category) notFound();

  const categoryId = category.id;
  const allTools = getToolsByCategory(categoryId);
  const live = allTools.filter((tool) => tool.status === "live");
  const planned = allTools.filter((tool) => tool.status === "planned");

  const crumbs = [
    { name: "Categories", href: "/categories" },
    { name: category.name, href: `/categories/${categoryId}` },
  ];

  return (
    <>
      <JsonLd data={itemListJsonLd(category.name, live)} />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", href: "/" }, ...crumbs])}
      />

      <div className="container-page flex flex-col gap-8 py-8 sm:gap-10 sm:py-10">
        <Breadcrumbs items={crumbs} />

        <PageHeader
          eyebrow="Category"
          title={category.name}
          description={category.description}
          actions={
            <Button asChild variant="outline">
              <Link href="/apps">All tools</Link>
            </Button>
          }
        />

        {live.length > 0 ? (
          <section aria-labelledby="available-tools">
            <h2 id="available-tools" className="sr-only">
              Available {category.shortName.toLowerCase()} tools
            </h2>
            <ToolGrid tools={live} showCategory={false} />
          </section>
        ) : null}

        {planned.length > 0 ? (
          <section aria-labelledby="planned" className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <h2 id="planned" className="text-lg font-semibold">
                On the roadmap
              </h2>
              <Badge variant="muted">{planned.length}</Badge>
            </div>
            <ToolGrid tools={planned} showCategory={false} />
          </section>
        ) : null}

        <section className="border-border/60 flex flex-col gap-4 border-t pt-10">
          <h2 className="text-lg font-semibold">Other categories</h2>
          <ul className="flex flex-wrap gap-2">
            {toolCategories
              .filter((other) => other.id !== categoryId)
              .map((other) => (
                <li key={other.id}>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/categories/${other.id}`}>
                      {other.name}
                      <span className="text-muted-foreground">
                        {getLiveToolsByCategory(other.id).length}
                      </span>
                    </Link>
                  </Button>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </>
  );
}

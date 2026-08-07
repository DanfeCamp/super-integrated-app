import { ArrowRight, Hammer, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

import { ToolGrid } from "@/components/tools/tool-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategory, getRelatedTools, getTool } from "@/data/tools";
import { siteConfig } from "@/lib/site";

/**
 * The placeholder a tool renders while its registry entry is `status:
 * "planned"`. Nothing ships in that state today — every tool in the registry
 * is implemented — but staging a future one is just a matter of adding the
 * entry and pointing its route here.
 *
 * It stays useful rather than apologetic: it says what the tool will do, gives
 * a way to influence whether it gets built, and routes people to something
 * that works right now.
 */
export function ComingSoon({ slug }: { slug: string }) {
  const tool = getTool(slug);
  const alternatives = getRelatedTools(slug, 4);
  const category = tool ? getCategory(tool.category) : null;

  return (
    <div className="flex flex-col gap-8">
      <Card className="relative overflow-hidden">
        {/* Same radial wash as the hero and footer, so a placeholder still
            looks like part of the product rather than a holding page. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-64 [background:radial-gradient(ellipse_45%_60%_at_50%_50%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]"
        />
        <div
          aria-hidden
          className="via-primary/40 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
        />

        <CardContent className="relative flex flex-col items-center gap-4 py-14 text-center">
          <span
            aria-hidden
            className="bg-primary/10 text-primary ring-primary/15 grid size-14 place-items-center rounded-2xl ring-1 ring-inset"
          >
            <Hammer className="size-6" />
          </span>

          <Badge variant="brand">In development</Badge>

          <h2 className="text-xl font-semibold tracking-tight">
            {tool?.name ?? "This tool"} isn&apos;t ready yet
          </h2>

          <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-pretty">
            {tool?.tagline ?? "We're still building this one."} It will land
            here when it works properly — everything else on {siteConfig.name}{" "}
            is finished, free and needs no account.
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/apps">
                Browse all tools
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={siteConfig.links.featureRequest}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageSquarePlus className="size-4" aria-hidden />
                Tell us what you need
              </a>
            </Button>
          </div>

          <p className="text-muted-foreground mt-1 text-xs">
            Requests genuinely change the order things get built in.
          </p>
        </CardContent>
      </Card>

      {alternatives.length > 0 ? (
        <section aria-labelledby="alternatives" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="alternatives" className="text-lg font-semibold">
              Ready to use right now
            </h2>
            {category ? (
              <Link
                href={`/categories/${category.id}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                All {category.shortName.toLowerCase()} tools
              </Link>
            ) : null}
          </div>
          <ToolGrid tools={alternatives} />
        </section>
      ) : null}
    </div>
  );
}

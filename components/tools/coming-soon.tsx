import { Hammer } from "lucide-react";
import Link from "next/link";

import { ToolGrid } from "@/components/tools/tool-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRelatedTools, getTool } from "@/data/tools";
import { siteConfig } from "@/lib/site";

/**
 * Placeholder for tools that are on the roadmap. It stays useful rather than
 * apologetic: it says what's coming and routes people to working alternatives.
 */
export function ComingSoon({ slug }: { slug: string }) {
  const tool = getTool(slug);
  const alternatives = getRelatedTools(slug, 4);

  return (
    <div className="flex flex-col gap-8">
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <span
            aria-hidden
            className="bg-primary/10 text-primary grid size-14 place-items-center rounded-2xl"
          >
            <Hammer className="size-6" />
          </span>
          <h2 className="text-xl font-semibold">
            {tool?.name ?? "This tool"} is on the way
          </h2>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-balance">
            We&apos;re building it now. In the meantime, everything else on{" "}
            {siteConfig.name} is free and ready to use — no account required.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/apps">Browse all tools</Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={`${siteConfig.links.github}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Follow progress
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {alternatives.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Try these instead</h2>
          <ToolGrid tools={alternatives} />
        </section>
      ) : null}
    </div>
  );
}

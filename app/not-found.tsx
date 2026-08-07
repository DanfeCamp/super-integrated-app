import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ToolGrid } from "@/components/tools/tool-grid";
import { Button } from "@/components/ui/button";
import { featuredTools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page flex flex-col gap-12 py-20">
      <div className="flex flex-col items-center gap-5 text-center">
        <span
          aria-hidden
          className="bg-primary/10 text-primary grid size-14 place-items-center rounded-2xl"
        >
          <Compass className="size-6" />
        </span>
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="text-muted-foreground max-w-md text-balance">
          The link may be out of date, or the tool may have moved. Everything
          that does exist is one click away.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/apps">Browse all tools</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="text-center text-lg font-semibold">
          Popular tools instead
        </h2>
        <ToolGrid tools={featuredTools.slice(0, 4)} />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { ToolBrowser } from "@/components/tools/tool-browser";
import { Skeleton } from "@/components/ui/skeleton";
import { liveTools, tools } from "@/data/tools";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "All tools",
  description: `Browse all ${liveTools.length} free online tools on SIA — calculators, converters, generators and productivity utilities. Search by name or filter by category.`,
  path: "/apps",
  keywords: [
    "online tools",
    "free web tools",
    "utility tools",
    "tool directory",
  ],
});

export default function AppsPage() {
  return (
    <>
      <JsonLd data={itemListJsonLd("All tools", liveTools)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Tools", href: "/apps" },
        ])}
      />

      <div className="container-page flex flex-col gap-8 py-8 sm:py-10">
        <Breadcrumbs items={[{ name: "Tools", href: "/apps" }]} />
        <PageHeader
          eyebrow="The collection"
          title="All tools"
          description={`Every tool on SIA in one list. ${liveTools.length} are ready to use today, with more on the way.`}
        />
        {/* The browser reads `?q=` from the URL, which needs a Suspense
            boundary — with one, the shell around it still prerenders. */}
        <Suspense fallback={<BrowserSkeleton />}>
          <ToolBrowser tools={tools} />
        </Suspense>
      </div>
    </>
  );
}

function BrowserSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-11 w-full rounded-md" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-44 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

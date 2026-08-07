"use client";

import { Clock } from "lucide-react";
import Link from "next/link";

import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import { useRecentTools } from "@/hooks/use-recent-tools";

/**
 * Renders nothing until there is something to show, so first-time visitors
 * never see an empty rail — and nothing reserves layout that stays blank.
 */
export function RecentTools() {
  const recent = useRecentTools();
  if (recent.length === 0) return null;

  return (
    <section aria-labelledby="recent-tools" className="flex flex-col gap-4">
      <h2
        id="recent-tools"
        className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase"
      >
        <Clock className="size-3.5" aria-hidden />
        Pick up where you left off
      </h2>
      <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {recent.map((tool) => (
          <li key={tool.slug} className="shrink-0">
            <Link
              href={`/apps/${tool.slug}`}
              className="border-border/70 bg-card hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-ring/40 flex items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
            >
              <ToolIconTile
                tool={tool}
                size="sm"
                className="size-7 rounded-full [&_svg]:size-3.5"
              />
              {tool.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

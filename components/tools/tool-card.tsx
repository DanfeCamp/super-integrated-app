import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ToolIconTile } from "@/components/tools/tool-icon-tile";
import { Badge } from "@/components/ui/badge";
import { getCategory, type Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

/**
 * Grid card. The whole card is one link (via a stretched overlay) so the hit
 * target matches what it looks like, while the accessible name stays just the
 * tool's title.
 */
export function ToolCard({
  tool,
  showCategory = true,
  className,
}: {
  tool: Tool;
  showCategory?: boolean;
  className?: string;
}) {
  const category = getCategory(tool.category);
  const isPlanned = tool.status === "planned";

  return (
    <article
      className={cn(
        "group bg-card border-border/70 relative flex flex-col gap-3 rounded-xl border p-5 shadow-xs transition-all duration-300",
        "hover:border-primary/35 hover:-translate-y-0.5 hover:shadow-lg",
        "focus-within:border-primary/35 focus-within:shadow-lg",
        // Not `opacity-*`: dimming the card would drag every child's
        // contrast below AA along with it.
        isPlanned &&
          "bg-muted/40 hover:border-border/70 border-dashed hover:translate-y-0 hover:shadow-xs",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <ToolIconTile
          tool={tool}
          className="group-hover:scale-105 group-hover:rotate-[-3deg]"
        />
        {isPlanned ? (
          <Badge variant="muted">Coming soon</Badge>
        ) : (
          <ArrowUpRight
            aria-hidden
            className="text-muted-foreground size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="leading-snug font-semibold tracking-tight">
          {isPlanned ? (
            tool.name
          ) : (
            <Link
              href={`/apps/${tool.slug}`}
              className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
            >
              {tool.name}
            </Link>
          )}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
          {tool.tagline}
        </p>
      </div>

      {showCategory ? (
        <p
          className={cn(
            "mt-auto pt-1 text-xs font-medium",
            category.foreground
          )}
        >
          {category.name}
        </p>
      ) : null}
    </article>
  );
}

/** Compact single-line variant used by the dense list view. */
export function ToolListItem({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);
  const isPlanned = tool.status === "planned";

  const content = (
    <>
      <ToolIconTile tool={tool} size="sm" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-2 font-medium">
          <span className="truncate">{tool.name}</span>
          {isPlanned ? (
            <Badge variant="muted" className="shrink-0">
              Soon
            </Badge>
          ) : null}
        </span>
        <span className="text-muted-foreground truncate text-sm">
          {tool.tagline}
        </span>
      </span>
      <span
        className={cn(
          "hidden shrink-0 text-xs font-medium sm:block",
          category.foreground
        )}
      >
        {category.name}
      </span>
    </>
  );

  const shared =
    "flex items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 transition-colors";

  return isPlanned ? (
    <div className={cn(shared, "bg-muted/40 border-dashed")}>{content}</div>
  ) : (
    <Link
      href={`/apps/${tool.slug}`}
      className={cn(
        shared,
        "hover:border-primary/35 hover:bg-accent/40 focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none"
      )}
    >
      {content}
    </Link>
  );
}

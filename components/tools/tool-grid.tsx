import { ToolCard } from "@/components/tools/tool-card";
import type { Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

export function ToolGrid({
  tools,
  showCategory = true,
  className,
}: {
  tools: Tool[];
  showCategory?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} showCategory={showCategory} />
      ))}
    </div>
  );
}

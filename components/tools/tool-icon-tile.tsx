import { getToolIcon } from "@/data/tool-icons";
import { getCategory, type Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-9 rounded-lg [&_svg]:size-4",
  md: "size-11 rounded-xl [&_svg]:size-5",
  lg: "size-14 rounded-2xl [&_svg]:size-6",
} as const;

/**
 * The icon medallion used on every card, list row and tool header. Colour is
 * derived from the tool's category so a whole grid reads as grouped families
 * rather than 30 unrelated accents.
 */
export function ToolIconTile({
  tool,
  size = "md",
  className,
}: {
  tool: Tool;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const Icon = getToolIcon(tool.slug);
  const category = getCategory(tool.category);

  return (
    <span
      aria-hidden
      className={cn(
        "ring-border/60 grid shrink-0 place-items-center bg-linear-to-br ring-1 transition-transform duration-300 ring-inset",
        category.gradient,
        category.foreground,
        sizes[size],
        className
      )}
    >
      {/* eslint-disable-next-line react-hooks/static-components -- `Icon` is
          read from a module-level registry, not defined here, so its identity
          is stable across renders. */}
      <Icon strokeWidth={1.75} />
    </span>
  );
}

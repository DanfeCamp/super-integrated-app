import type { LucideIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * The one empty/zero-result treatment for the whole app: an icon medallion, a
 * short title, one explanatory line and an optional escape hatch.
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className
      )}
      {...props}
    >
      {Icon ? (
        <div className="bg-muted text-muted-foreground mb-1 flex size-12 items-center justify-center rounded-full">
          <Icon className="size-5" aria-hidden />
        </div>
      ) : null}
      <p className="text-base font-medium">{title}</p>
      {description ? (
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed text-balance">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export { EmptyState };

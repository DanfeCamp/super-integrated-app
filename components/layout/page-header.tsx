import type * as React from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned controls on desktop, stacked underneath on mobile. */
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        {eyebrow ? (
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}

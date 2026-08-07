import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group focus-visible:ring-ring/40 flex items-center gap-2.5 rounded-md focus-visible:ring-[3px] focus-visible:outline-none",
        className
      )}
      aria-label={`${siteConfig.fullName} — home`}
    >
      <span
        aria-hidden
        className="from-primary to-primary/70 text-primary-foreground grid size-8 place-items-center rounded-lg bg-linear-to-br text-[0.9375rem] font-bold shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        S
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="text-[0.9375rem] font-semibold tracking-tight">
            {siteConfig.name}
          </span>
          <span className="text-muted-foreground mt-0.5 hidden text-[0.6875rem] tracking-wide sm:block">
            Super Integrated App
          </span>
        </span>
      ) : null}
    </Link>
  );
}

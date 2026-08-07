import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Server-rendered breadcrumbs. The trail is passed in rather than derived from
 * `window.location` so it is present in the initial HTML for crawlers and
 * doesn't shift layout after hydration.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            className="hover:text-foreground focus-visible:ring-ring/40 flex items-center gap-1 rounded p-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
          >
            <Home className="size-3.5" aria-hidden />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex min-w-0 items-center">
              <ChevronRight
                className="size-3.5 shrink-0 opacity-50"
                aria-hidden
              />
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-foreground truncate px-1 font-medium"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground focus-visible:ring-ring/40 truncate rounded px-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const markSizes = {
  sm: "size-7 rounded-[0.5rem]",
  md: "size-9 rounded-[0.625rem]",
  lg: "size-11 rounded-xl",
} as const;

const wordmarkSizes = {
  sm: "text-[0.875rem]",
  md: "text-[1rem]",
  lg: "text-[1.125rem]",
} as const;

/**
 * The brand mark: a four-cell grid with one cell resolved into a dot — many
 * separate tools, one place. Drawn as geometry rather than a letter so it
 * survives being rendered at 20px in a browser tab and at 44px in the footer.
 */
export function LogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof markSizes;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block shrink-0 overflow-hidden",
        "shadow-sm ring-1 ring-white/15 ring-inset",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-md",
        markSizes[size],
        className
      )}
    >
      {/* One asset drives the mark everywhere — header, footer, favicon, app
          icon and the social card all resolve to the same geometry. `priority`
          because it sits in the header on every route; `unoptimized` because
          the optimiser refuses SVG by default and there is nothing in a 900-byte
          vector for it to improve on anyway. */}
      <Image
        src="/logo.svg"
        alt=""
        width={64}
        height={64}
        priority
        unoptimized
        className="size-full"
      />
    </span>
  );
}

/**
 * Mark plus wordmark, linked home. `tagline` adds the expanded product name
 * beneath the wordmark — worth it in the header and footer, noise everywhere
 * else.
 */
export function Logo({
  className,
  size = "md",
  showWordmark = true,
  tagline = true,
}: {
  className?: string;
  size?: keyof typeof markSizes;
  showWordmark?: boolean;
  tagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group focus-visible:ring-ring/40 flex items-center gap-2.5 rounded-lg focus-visible:ring-[3px] focus-visible:outline-none",
        className
      )}
      aria-label={`${siteConfig.fullName} — home`}
    >
      <LogoMark size={size} />
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-semibold tracking-[-0.02em]",
              wordmarkSizes[size]
            )}
          >
            {siteConfig.name}
          </span>
          {/* Spelling the acronym out is the whole job of this line — "SIA"
              alone means nothing to a first-time visitor. */}
          {tagline ? (
            <span className="text-muted-foreground mt-1 hidden text-[0.625rem] font-medium tracking-[0.12em] uppercase sm:block">
              {siteConfig.fullName}
            </span>
          ) : null}
        </span>
      ) : null}
    </Link>
  );
}

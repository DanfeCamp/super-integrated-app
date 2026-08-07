"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center gap-5 py-24 text-center">
      <span
        aria-hidden
        className="bg-destructive/10 text-destructive grid size-14 place-items-center rounded-2xl"
      >
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-balance">
        This tool hit an unexpected error. Trying again usually fixes it — if it
        keeps happening, we&apos;d like to hear about it.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground font-mono text-xs">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/apps">Browse all tools</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/contact-us">Report it</Link>
        </Button>
      </div>
    </div>
  );
}

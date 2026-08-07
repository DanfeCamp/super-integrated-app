import type * as React from "react";

import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-muted text-muted-foreground border-border pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-0.5 rounded border px-1.5 font-mono text-[0.6875rem] font-medium select-none",
        className
      )}
      {...props}
    />
  );
}

export { Kbd };

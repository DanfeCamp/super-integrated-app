import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-background flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none",
        "placeholder:text-muted-foreground",
        "file:text-foreground file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        // 16px on mobile keeps iOS Safari from zooming the viewport on focus.
        "max-sm:text-base",
        className
      )}
      {...props}
    />
  );
}

export { Input };

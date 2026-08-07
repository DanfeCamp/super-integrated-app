import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-background flex min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        "field-sizing-content resize-y max-sm:text-base",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };

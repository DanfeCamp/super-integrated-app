"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type * as React from "react";

import { cn } from "@/lib/utils";

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "bg-muted text-muted-foreground inline-flex w-fit items-center rounded-lg p-1",
        className
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none",
        "hover:text-foreground focus-visible:ring-ring/45 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };

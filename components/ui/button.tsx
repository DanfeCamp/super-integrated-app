import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-150",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45 focus-visible:border-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-px",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-ring/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-sm px-3 text-[0.8125rem] has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 text-[0.9375rem] has-[>svg]:px-5",
        xl: "h-12 rounded-lg px-7 text-base has-[>svg]:px-6",
        icon: "size-9",
        "icon-sm": "size-8 rounded-sm",
        "icon-lg": "size-11 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

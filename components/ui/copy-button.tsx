"use client";

import { Check, Copy } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "value" | "children"
> {
  value: string;
  /** Rendered next to the icon. Omit for an icon-only button. */
  label?: string;
  copiedLabel?: string;
}

/**
 * Copy control with built-in success feedback. Announces the state change via
 * `aria-live` so it isn't a purely visual confirmation.
 */
function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  variant = "outline",
  size,
  className,
  onClick,
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();
  const resolvedSize = size ?? (label ? "sm" : "icon-sm");

  return (
    <Button
      type="button"
      variant={variant}
      size={resolvedSize}
      disabled={!value}
      aria-label={label ? undefined : copied ? copiedLabel : "Copy"}
      className={cn("relative", className)}
      onClick={(event) => {
        void copy(value);
        onClick?.(event);
      }}
      {...props}
    >
      {copied ? (
        <Check className="text-success animate-pop size-4" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      {label ? <span>{copied ? copiedLabel : label}</span> : null}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </Button>
  );
}

export { CopyButton };

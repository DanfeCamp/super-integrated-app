"use client";

import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { summarise } from "./json";

/**
 * Collapsible tree view. Nodes deeper than `AUTO_OPEN_DEPTH` start closed so a
 * large document doesn't render thousands of rows on first paint.
 */
const AUTO_OPEN_DEPTH = 2;

export function JsonTree({ value }: { value: unknown }) {
  return (
    // Plain nested lists with disclosure buttons rather than ARIA tree roles:
    // this is a read-only outline with no selection or roving focus, and a
    // half-implemented `tree` is worse for screen readers than none.
    <ul className="font-mono text-[0.8125rem] leading-relaxed">
      <Node label={null} value={value} depth={0} />
    </ul>
  );
}

function Node({
  label,
  value,
  depth,
}: {
  label: string | null;
  value: unknown;
  depth: number;
}) {
  const branch = value !== null && typeof value === "object";
  const [open, setOpen] = React.useState(depth < AUTO_OPEN_DEPTH);

  const entries: [string, unknown][] = !branch
    ? []
    : Array.isArray(value)
      ? value.map((item, index) => [String(index), item])
      : Object.entries(value as Record<string, unknown>);

  if (!branch) {
    return (
      <li className="flex gap-2 py-px pl-5">
        {label !== null ? <Key name={label} /> : null}
        <Scalar value={value} />
      </li>
    );
  }

  return (
    <li className="py-px">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="hover:bg-accent/60 focus-visible:ring-ring/45 -ml-1 flex w-full items-center gap-1 rounded px-1 text-left outline-none focus-visible:ring-2"
      >
        <ChevronRight
          className={cn(
            "text-muted-foreground size-3.5 shrink-0 transition-transform",
            open && "rotate-90"
          )}
          aria-hidden
        />
        {label !== null ? <Key name={label} /> : null}
        <span className="text-muted-foreground">
          {open ? (Array.isArray(value) ? "[" : "{") : summarise(value)}
        </span>
      </button>

      {open ? (
        <>
          <ul className="border-border/60 ml-2 border-l pl-3">
            {entries.map(([key, child]) => (
              <Node key={key} label={key} value={child} depth={depth + 1} />
            ))}
            {entries.length === 0 ? (
              <li className="text-muted-foreground pl-5 italic">empty</li>
            ) : null}
          </ul>
          <span className="text-muted-foreground ml-2 pl-3">
            {Array.isArray(value) ? "]" : "}"}
          </span>
        </>
      ) : null}
    </li>
  );
}

function Key({ name }: { name: string }) {
  return (
    <span className="text-foreground shrink-0 font-medium">
      {name}
      <span className="text-muted-foreground">:</span>
    </span>
  );
}

function Scalar({ value }: { value: unknown }) {
  if (value === null) {
    return <span className="text-muted-foreground italic">null</span>;
  }
  switch (typeof value) {
    case "string":
      return (
        <span className="text-success wrap-anywhere">&quot;{value}&quot;</span>
      );
    case "number":
      return <span className="text-primary tabular-nums">{value}</span>;
    case "boolean":
      return (
        <span className="text-warning-foreground dark:text-warning">
          {String(value)}
        </span>
      );
    default:
      return <span>{String(value)}</span>;
  }
}

"use client";

import { Delete, History } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Kbd } from "@/components/ui/kbd";
import { evaluate, ExpressionError, formatResult } from "./evaluate";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  id: number;
  expression: string;
  result: string;
}

type KeyKind = "digit" | "operator" | "action" | "equals";

interface KeyDef {
  label: string;
  /** Inserted into the expression; defaults to `label`. */
  insert?: string;
  kind: KeyKind;
  /** Keyboard characters that trigger this key. */
  keys?: string[];
  ariaLabel?: string;
  span?: boolean;
}

const KEYS: KeyDef[] = [
  { label: "AC", kind: "action", ariaLabel: "All clear", keys: ["Escape"] },
  { label: "(", kind: "operator" },
  { label: ")", kind: "operator" },
  { label: "÷", insert: "/", kind: "operator", keys: ["/"] },

  { label: "7", kind: "digit" },
  { label: "8", kind: "digit" },
  { label: "9", kind: "digit" },
  { label: "×", insert: "*", kind: "operator", keys: ["*", "x"] },

  { label: "4", kind: "digit" },
  { label: "5", kind: "digit" },
  { label: "6", kind: "digit" },
  { label: "−", insert: "-", kind: "operator", keys: ["-"] },

  { label: "1", kind: "digit" },
  { label: "2", kind: "digit" },
  { label: "3", kind: "digit" },
  { label: "+", kind: "operator" },

  { label: "%", kind: "operator" },
  { label: "0", kind: "digit" },
  { label: ".", kind: "digit" },
  { label: "=", kind: "equals", keys: ["=", "Enter"], ariaLabel: "Equals" },
];

export function CalculatorTool() {
  const [expression, setExpression] = React.useState("");
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  // After `=`, the next digit starts a fresh expression rather than appending.
  const [justEvaluated, setJustEvaluated] = React.useState(false);
  const nextId = React.useRef(0);

  const append = React.useCallback(
    (value: string, kind: KeyKind) => {
      setError(null);
      setExpression((previous) => {
        if (justEvaluated) {
          setJustEvaluated(false);
          // Continue from the answer when an operator follows `=`.
          return kind === "operator" && result
            ? `${result.replace(/,/g, "")}${value}`
            : value;
        }
        return previous + value;
      });
      if (justEvaluated && kind !== "operator") setResult(null);
    },
    [justEvaluated, result]
  );

  const clearAll = React.useCallback(() => {
    setExpression("");
    setResult(null);
    setError(null);
    setJustEvaluated(false);
  }, []);

  const backspace = React.useCallback(() => {
    setError(null);
    setJustEvaluated(false);
    setExpression((previous) => previous.slice(0, -1));
  }, []);

  const compute = React.useCallback(() => {
    if (!expression.trim()) return;
    try {
      const value = evaluate(expression);
      const formatted = formatResult(value);
      setResult(formatted);
      setError(null);
      setJustEvaluated(true);
      setHistory((previous) =>
        [
          { id: (nextId.current += 1), expression, result: formatted },
          ...previous,
        ].slice(0, 20)
      );
    } catch (caught) {
      setResult(null);
      setError(
        caught instanceof ExpressionError
          ? caught.message
          : "That expression isn't valid"
      );
    }
  }, [expression]);

  const press = React.useCallback(
    (key: KeyDef) => {
      if (key.kind === "action") return clearAll();
      if (key.kind === "equals") return compute();
      append(key.insert ?? key.label, key.kind);
    },
    [append, clearAll, compute]
  );

  // Full keyboard control — the calculator is usable without touching a key.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(target?.tagName ?? "")
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Backspace") {
        event.preventDefault();
        return backspace();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        return clearAll();
      }
      if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        return compute();
      }

      const match = KEYS.find(
        (key) => key.label === event.key || key.keys?.includes(event.key)
      );
      if (match) {
        event.preventDefault();
        press(match);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [backspace, clearAll, compute, press]);

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start">
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          {/* Display */}
          <div
            className="bg-muted/50 flex min-h-28 flex-col justify-end gap-1 rounded-lg px-4 py-3 text-right"
            aria-live="polite"
          >
            <output
              className="text-muted-foreground min-h-6 font-mono text-sm break-all"
              aria-label="Expression"
            >
              {expression || "0"}
            </output>
            <div
              className={cn(
                "text-3xl font-semibold break-all tabular-nums sm:text-4xl",
                error && "text-destructive text-lg sm:text-xl"
              )}
            >
              {error ?? result ?? ""}
              {!error && !result ? (
                <span className="text-muted-foreground/40">=</span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground hidden text-xs sm:block">
              <Kbd>Enter</Kbd> to calculate · <Kbd>Esc</Kbd> to clear
            </p>
            <div className="ml-auto flex gap-1.5">
              <CopyButton
                value={result ?? expression}
                aria-label="Copy result"
              />
              <Button
                variant="outline"
                size="icon-sm"
                onClick={backspace}
                aria-label="Backspace"
                disabled={!expression}
              >
                <Delete className="size-4" />
              </Button>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2">
            {KEYS.map((key) => (
              <Button
                key={key.label}
                type="button"
                onClick={() => press(key)}
                aria-label={key.ariaLabel ?? key.label}
                variant={
                  key.kind === "equals"
                    ? "default"
                    : key.kind === "digit"
                      ? "secondary"
                      : "outline"
                }
                className={cn(
                  "h-13 text-base font-medium tabular-nums sm:h-14 sm:text-lg",
                  key.kind === "action" &&
                    "text-destructive hover:bg-destructive/10 hover:text-destructive",
                  key.span && "col-span-2"
                )}
              >
                {key.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-24">
        <CardContent className="flex max-h-[32rem] flex-col gap-3 p-0">
          <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <History className="text-muted-foreground size-4" aria-hidden />
              History
            </h2>
            {history.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistory([])}
                className="text-muted-foreground"
              >
                Clear
              </Button>
            ) : null}
          </div>

          {history.length === 0 ? (
            <EmptyState
              icon={History}
              title="Nothing yet"
              description="Calculations you run will show up here so you can reuse them."
              className="py-10"
            />
          ) : (
            <ul className="flex flex-col gap-1 overflow-y-auto px-3 pb-3">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setExpression(entry.result.replace(/,/g, ""));
                      setResult(null);
                      setError(null);
                      setJustEvaluated(false);
                    }}
                    className="hover:bg-accent focus-visible:ring-ring/40 flex w-full flex-col items-end gap-0.5 rounded-lg px-3 py-2.5 text-right transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    <span className="text-muted-foreground font-mono text-xs break-all">
                      {entry.expression}
                    </span>
                    <span className="font-semibold break-all tabular-nums">
                      {entry.result}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

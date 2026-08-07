"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Mode {
  id: string;
  /** Short label for the mode picker. */
  tab: string;
  /** Sentence split around the two inputs, e.g. "What is [a]% of [b]?" */
  sentence: [string, string, string];
  aLabel: string;
  bLabel: string;
  aPlaceholder: string;
  bPlaceholder: string;
  compute: (a: number, b: number) => number | null;
  /** Working shown under the result, so the answer is checkable. */
  explain: (a: number, b: number, result: number) => string;
  suffix?: string;
}

const MODES: Mode[] = [
  {
    id: "of",
    tab: "% of a number",
    sentence: ["What is", "% of", "?"],
    aLabel: "Percentage",
    bLabel: "Number",
    aPlaceholder: "15",
    bPlaceholder: "200",
    compute: (a, b) => (a / 100) * b,
    explain: (a, b, result) =>
      `${format(a)} ÷ 100 × ${format(b)} = ${format(result)}`,
  },
  {
    id: "share",
    tab: "What percent",
    sentence: ["", "is what percent of", "?"],
    aLabel: "Part",
    bLabel: "Whole",
    aPlaceholder: "30",
    bPlaceholder: "200",
    compute: (a, b) => (b === 0 ? null : (a / b) * 100),
    explain: (a, b, result) =>
      `${format(a)} ÷ ${format(b)} × 100 = ${format(result)}%`,
    suffix: "%",
  },
  {
    id: "change",
    tab: "Change",
    sentence: ["What is the percentage change from", "to", "?"],
    aLabel: "From",
    bLabel: "To",
    aPlaceholder: "120",
    bPlaceholder: "150",
    compute: (a, b) => (a === 0 ? null : ((b - a) / a) * 100),
    explain: (a, b, result) =>
      `(${format(b)} − ${format(a)}) ÷ ${format(a)} × 100 = ${format(result)}%`,
    suffix: "%",
  },
  {
    id: "reverse",
    tab: "Reverse",
    sentence: ["", "is", "% of what number?"],
    aLabel: "Amount",
    bLabel: "Percentage",
    aPlaceholder: "45",
    bPlaceholder: "15",
    compute: (a, b) => (b === 0 ? null : a / (b / 100)),
    explain: (a, b, result) =>
      `${format(a)} ÷ (${format(b)} ÷ 100) = ${format(result)}`,
  },
  {
    id: "increase",
    tab: "Increase",
    sentence: ["Increase", "by", "%"],
    aLabel: "Number",
    bLabel: "Percentage",
    aPlaceholder: "250",
    bPlaceholder: "20",
    compute: (a, b) => a * (1 + b / 100),
    explain: (a, b, result) =>
      `${format(a)} + ${format((a * b) / 100)} = ${format(result)}`,
  },
  {
    id: "decrease",
    tab: "Decrease",
    sentence: ["Decrease", "by", "%"],
    aLabel: "Number",
    bLabel: "Percentage",
    aPlaceholder: "250",
    bPlaceholder: "20",
    compute: (a, b) => a * (1 - b / 100),
    explain: (a, b, result) =>
      `${format(a)} − ${format((a * b) / 100)} = ${format(result)}`,
  },
];

function format(value: number): string {
  if (!Number.isFinite(value)) return "—";
  // Round away floating-point dust (0.1 × 3 = 0.30000000000000004) before
  // formatting, but keep genuine precision for small fractions.
  const rounded = Number(value.toPrecision(12));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function PercentageCalculatorTool() {
  const [modeId, setModeId] = React.useState(MODES[0]!.id);
  // Values are kept per mode so switching tabs doesn't wipe what you typed.
  const [values, setValues] = React.useState<Record<string, [string, string]>>(
    {}
  );

  const mode = MODES.find((item) => item.id === modeId) ?? MODES[0]!;
  const [a, b] = values[mode.id] ?? ["", ""];

  const setValue = (index: 0 | 1, next: string) =>
    setValues((previous) => {
      const current = previous[mode.id] ?? ["", ""];
      const updated: [string, string] = [current[0], current[1]];
      updated[index] = next;
      return { ...previous, [mode.id]: updated };
    });

  const numberA = Number.parseFloat(a.replace(/,/g, ""));
  const numberB = Number.parseFloat(b.replace(/,/g, ""));
  const complete = Number.isFinite(numberA) && Number.isFinite(numberB);
  const result = complete ? mode.compute(numberA, numberB) : null;

  const resultText =
    result === null ? "" : `${format(result)}${mode.suffix ?? ""}`;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div
            role="tablist"
            aria-label="Calculation type"
            className="-mx-1 flex flex-wrap gap-2 px-1"
          >
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === mode.id}
                onClick={() => setModeId(item.id)}
                className={cn(
                  "focus-visible:ring-ring/45 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]",
                  item.id === mode.id
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.tab}
              </button>
            ))}
          </div>

          {/* The sentence is the interface: reading it left to right states the
              question the numbers answer. */}
          <div className="flex flex-wrap items-end gap-x-3 gap-y-4 text-base sm:text-lg">
            {mode.sentence[0] ? (
              <span className="pb-2.5">{mode.sentence[0]}</span>
            ) : null}
            <Field
              id="pct-a"
              label={mode.aLabel}
              value={a}
              placeholder={mode.aPlaceholder}
              onChange={(next) => setValue(0, next)}
            />
            <span className="pb-2.5">{mode.sentence[1]}</span>
            <Field
              id="pct-b"
              label={mode.bLabel}
              value={b}
              placeholder={mode.bPlaceholder}
              onChange={(next) => setValue(1, next)}
            />
            {mode.sentence[2] ? (
              <span className="pb-2.5">{mode.sentence[2]}</span>
            ) : null}
          </div>

          <div className="bg-muted/40 border-border/60 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                Result
              </span>
              <output
                aria-live="polite"
                className="text-3xl font-semibold tabular-nums sm:text-4xl"
              >
                {result === null ? (
                  <span className="text-muted-foreground text-2xl font-normal sm:text-3xl">
                    —
                  </span>
                ) : (
                  <>
                    {format(result)}
                    {mode.suffix ? (
                      <span className="text-muted-foreground text-2xl">
                        {mode.suffix}
                      </span>
                    ) : null}
                  </>
                )}
              </output>
              <p className="text-muted-foreground text-sm">
                {result !== null ? (
                  mode.explain(numberA, numberB, result)
                ) : complete ? (
                  <span className="text-warning-foreground dark:text-warning">
                    That calculation would divide by zero.
                  </span>
                ) : (
                  "Fill in both fields to see the answer."
                )}
              </p>
            </div>
            <CopyButton value={resultText} label="Copy" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <span className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-muted-foreground text-xs font-medium">
        {label}
      </Label>
      <Input
        id={id}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-32 text-base tabular-nums sm:w-36"
      />
    </span>
  );
}

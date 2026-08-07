"use client";

import { ChevronDown, TrendingUp } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const FREQUENCIES = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semi-annually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
] as const;

interface FieldState {
  principal: string;
  rate: string;
  years: string;
}

const initial: FieldState = { principal: "10000", rate: "7.5", years: "10" };

function parse(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function InterestCalculatorTool() {
  const [fields, setFields] = React.useState<FieldState>(initial);
  const [frequency, setFrequency] = React.useState<string>("12");
  const [showSchedule, setShowSchedule] = React.useState(false);

  const principal = parse(fields.principal);
  const rate = parse(fields.rate);
  const years = parse(fields.years);

  const errors = {
    principal:
      fields.principal !== "" && (principal === null || principal < 0)
        ? "Enter a positive amount"
        : null,
    rate: fields.rate !== "" && rate === null ? "Enter a valid rate" : null,
    years:
      fields.years !== "" && (years === null || years <= 0)
        ? "Enter at least one year"
        : null,
  };

  const isValid =
    principal !== null &&
    principal >= 0 &&
    rate !== null &&
    years !== null &&
    years > 0 &&
    !errors.principal &&
    !errors.rate &&
    !errors.years;

  const results = React.useMemo(() => {
    if (!isValid) return null;

    const n = Number(frequency);
    const r = rate / 100;

    const simpleInterest = principal * r * years;
    const compoundTotal = principal * (1 + r / n) ** (n * years);
    const compoundInterest = compoundTotal - principal;

    // Year-by-year compound balances for the expandable schedule.
    const schedule = Array.from({ length: Math.ceil(years) }, (_, index) => {
      const year = Math.min(index + 1, years);
      const balance = principal * (1 + r / n) ** (n * year);
      return {
        year,
        balance,
        interest: balance - principal,
      };
    });

    return {
      simpleInterest,
      simpleTotal: principal + simpleInterest,
      compoundInterest,
      compoundTotal,
      advantage: compoundInterest - simpleInterest,
      schedule,
    };
  }, [isValid, principal, rate, years, frequency]);

  const update = (key: keyof FieldState) => (value: string) =>
    setFields((previous) => ({ ...previous, [key]: value }));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <NumberField
            id="principal"
            label="Principal amount"
            value={fields.principal}
            onChange={update("principal")}
            error={errors.principal}
            min={0}
            step={100}
            prefix="$"
          />

          <div className="flex flex-col gap-3">
            <NumberField
              id="rate"
              label="Annual interest rate"
              value={fields.rate}
              onChange={update("rate")}
              error={errors.rate}
              step={0.1}
              suffix="%"
            />
            <Slider
              value={[Math.min(Math.max(rate ?? 0, 0), 30)]}
              onValueChange={([next]) => update("rate")(String(next ?? 0))}
              min={0}
              max={30}
              step={0.1}
              aria-label="Annual interest rate"
            />
          </div>

          <div className="flex flex-col gap-3">
            <NumberField
              id="years"
              label="Term"
              value={fields.years}
              onChange={update("years")}
              error={errors.years}
              min={1}
              step={1}
              suffix="years"
            />
            <Slider
              value={[Math.min(Math.max(years ?? 1, 1), 40)]}
              onValueChange={([next]) => update("years")(String(next ?? 1))}
              min={1}
              max={40}
              step={1}
              aria-label="Term in years"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="frequency">Compounding frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Only affects the compound calculation.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setFields(initial)}
            className="self-start"
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard
            label="Simple interest"
            total={results?.simpleTotal}
            interest={results?.simpleInterest}
            principal={principal}
          />
          <ResultCard
            label="Compound interest"
            total={results?.compoundTotal}
            interest={results?.compoundInterest}
            principal={principal}
            highlight
          />
        </div>

        {results ? (
          <>
            <Card className="border-primary/25 bg-primary/5">
              <CardContent className="flex items-start gap-3 py-4">
                <span
                  aria-hidden
                  className="bg-primary/12 text-primary mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg"
                >
                  <TrendingUp className="size-4" />
                </span>
                <p className="text-sm leading-relaxed">
                  Compounding{" "}
                  {FREQUENCIES.find(
                    (item) => item.value === frequency
                  )?.label.toLowerCase()}{" "}
                  earns{" "}
                  <strong className="font-semibold">
                    ${currency.format(Math.abs(results.advantage))}
                  </strong>{" "}
                  {results.advantage >= 0 ? "more" : "less"} than simple
                  interest over {years} {years === 1 ? "year" : "years"}.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <button
                  type="button"
                  onClick={() => setShowSchedule((previous) => !previous)}
                  aria-expanded={showSchedule}
                  className="hover:bg-accent/50 focus-visible:ring-ring/40 flex w-full items-center justify-between gap-2 rounded-xl px-5 py-4 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                >
                  Year-by-year breakdown
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "text-muted-foreground size-4 transition-transform duration-200",
                      showSchedule && "rotate-180"
                    )}
                  />
                </button>

                {showSchedule ? (
                  <div className="max-h-80 overflow-y-auto border-t">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr className="text-muted-foreground text-left">
                          <th scope="col" className="px-5 py-2.5 font-medium">
                            Year
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-2.5 text-right font-medium"
                          >
                            Interest earned
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-2.5 text-right font-medium"
                          >
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.schedule.map((row) => (
                          <tr key={row.year} className="border-t">
                            <th
                              scope="row"
                              className="px-5 py-2.5 text-left font-normal tabular-nums"
                            >
                              {row.year % 1 === 0
                                ? row.year
                                : row.year.toFixed(1)}
                            </th>
                            <td className="text-muted-foreground px-5 py-2.5 text-right tabular-nums">
                              ${currency.format(row.interest)}
                            </td>
                            <td className="px-5 py-2.5 text-right font-medium tabular-nums">
                              ${currency.format(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  total,
  interest,
  principal,
  highlight,
}: {
  label: string;
  total?: number;
  interest?: number;
  principal: number | null;
  highlight?: boolean;
}) {
  const share =
    total && total > 0 && interest !== undefined ? (interest / total) * 100 : 0;

  return (
    <Card className={cn(highlight && "border-primary/30")}>
      <CardContent className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>

        {total === undefined ? (
          <p className="text-muted-foreground text-2xl font-semibold">—</p>
        ) : (
          <>
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                highlight && "text-primary"
              )}
            >
              ${currency.format(total)}
            </p>
            <dl className="text-muted-foreground flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-4">
                <dt>Principal</dt>
                <dd className="tabular-nums">
                  ${currency.format(principal ?? 0)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Interest</dt>
                <dd className="text-foreground font-medium tabular-nums">
                  ${currency.format(interest ?? 0)}
                </dd>
              </div>
            </dl>

            {/* Principal vs interest at a glance. */}
            <div
              className="bg-muted mt-1 flex h-2 overflow-hidden rounded-full"
              role="img"
              aria-label={`Interest makes up ${share.toFixed(0)}% of the total`}
            >
              <span
                className={cn(
                  "h-full transition-all duration-500",
                  highlight ? "bg-primary" : "bg-muted-foreground/50"
                )}
                style={{ width: `${100 - share}%` }}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  error,
  prefix,
  suffix,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  prefix?: string;
  suffix?: string;
} & Omit<React.ComponentProps<"input">, "onChange" | "value" | "id">) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {prefix ? (
          <span
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm"
          >
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("tabular-nums", prefix && "pl-7", suffix && "pr-16")}
          {...props}
        />
        {suffix ? (
          <span
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm"
          >
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}

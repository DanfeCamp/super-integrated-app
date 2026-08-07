"use client";

import { ChevronDown, Download, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { currencies } from "@/data/currencies";
import { cn, downloadBlob } from "@/lib/utils";

import { amortize, formatTerm, type YearSummary } from "./amortize";

type TermUnit = "years" | "months";

const CURRENCY_OPTIONS = currencies.map((currency) => ({
  value: currency.code,
  label: currency.code,
  keywords: currency.name,
}));

export function LoanCalculatorTool() {
  const [amount, setAmount] = React.useState("250000");
  const [rate, setRate] = React.useState("6.5");
  const [term, setTerm] = React.useState("25");
  const [termUnit, setTermUnit] = React.useState<TermUnit>("years");
  const [extra, setExtra] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");
  const [openYear, setOpenYear] = React.useState<number | null>(null);

  const money = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      });
    } catch {
      // Unknown ISO code (shouldn't happen via the picker, but the state is
      // free-form) — fall back to plain numbers rather than throwing.
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
    }
  }, [currency]);

  const principal = Number.parseFloat(amount.replace(/,/g, ""));
  const annualRate = Number.parseFloat(rate);
  const termValue = Number.parseFloat(term);
  const extraMonthly = Number.parseFloat(extra.replace(/,/g, "")) || 0;
  const months =
    termUnit === "years" ? Math.round(termValue * 12) : Math.round(termValue);

  const error = validate(principal, annualRate, months);
  const result = error
    ? null
    : amortize({ principal, annualRate, months, extraMonthly });

  // A payment smaller than the first month's interest never clears the loan.
  const neverPaysOff =
    result !== null &&
    result.schedule.length > 0 &&
    result.schedule.at(-1)!.balance > 0.01;

  const downloadCsv = () => {
    if (!result) return;
    const header = "Month,Payment,Interest,Principal,Balance";
    const body = result.schedule
      .map((row) =>
        [
          row.month,
          row.payment.toFixed(2),
          row.interest.toFixed(2),
          row.principal.toFixed(2),
          row.balance.toFixed(2),
        ].join(",")
      )
      .join("\n");
    downloadBlob(
      new Blob([`${header}\n${body}\n`], { type: "text/csv;charset=utf-8" }),
      "amortisation-schedule.csv"
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
        <Card>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="loan-amount">Loan amount</Label>
              <div className="flex gap-2">
                <Input
                  id="loan-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="tabular-nums"
                />
                <Combobox
                  label="Currency"
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onValueChange={setCurrency}
                  className="w-28 shrink-0"
                  searchPlaceholder="Search currency…"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="loan-rate">Annual interest rate</Label>
              <div className="relative">
                <Input
                  id="loan-rate"
                  inputMode="decimal"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                  className="pr-8 tabular-nums"
                />
                <span
                  aria-hidden
                  className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm"
                >
                  %
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="loan-term">Term</Label>
              <div className="flex gap-2">
                <Input
                  id="loan-term"
                  inputMode="numeric"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  className="tabular-nums"
                />
                <ToggleGroup
                  type="single"
                  value={termUnit}
                  onValueChange={(value) =>
                    value && setTermUnit(value as TermUnit)
                  }
                  aria-label="Term unit"
                  className="shrink-0"
                >
                  <ToggleGroupItem value="years">Years</ToggleGroupItem>
                  <ToggleGroupItem value="months">Months</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="loan-extra">Extra monthly payment</Label>
              <Input
                id="loan-extra"
                inputMode="decimal"
                value={extra}
                placeholder="0"
                onChange={(event) => setExtra(event.target.value)}
                className="tabular-nums"
              />
              <p className="text-muted-foreground text-xs">
                Optional. Paid straight off the balance each month.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {error ? (
            <Card>
              <CardContent>
                <Alert variant="warning">
                  <TriangleAlert />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : result ? (
            <>
              <Card>
                <CardContent className="flex flex-col gap-5">
                  <div className="bg-primary/5 border-primary/15 flex flex-col gap-1 rounded-xl border p-5">
                    <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                      Monthly payment
                    </span>
                    <output
                      aria-live="polite"
                      className="text-3xl font-semibold tabular-nums sm:text-4xl"
                    >
                      {money.format(result.monthlyPayment + extraMonthly)}
                    </output>
                    {extraMonthly > 0 ? (
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {money.format(result.monthlyPayment)} scheduled +{" "}
                        {money.format(extraMonthly)} extra
                      </span>
                    ) : null}
                  </div>

                  {neverPaysOff ? (
                    <Alert variant="warning">
                      <TriangleAlert />
                      <AlertDescription>
                        At this rate the payment never clears the balance — the
                        figures below are capped at 100 years.
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                    <Stat
                      label="Total interest"
                      value={money.format(result.totalInterest)}
                    />
                    <Stat
                      label="Total repaid"
                      value={money.format(result.totalPaid)}
                    />
                    <Stat label="Principal" value={money.format(principal)} />
                    <Stat
                      label="Paid off in"
                      value={formatTerm(result.actualMonths)}
                    />
                  </dl>

                  <InterestBar
                    principal={principal}
                    interest={result.totalInterest}
                    format={(value) => money.format(value)}
                  />

                  {result.interestSaved > 0 ? (
                    <p className="text-success text-sm">
                      Paying {money.format(extraMonthly)} extra each month saves{" "}
                      <strong className="font-semibold tabular-nums">
                        {money.format(result.interestSaved)}
                      </strong>{" "}
                      in interest and clears the loan{" "}
                      <strong className="font-semibold">
                        {formatTerm(result.monthsSaved)}
                      </strong>{" "}
                      early.
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">
                      Amortisation schedule
                    </h2>
                    <Button variant="outline" size="sm" onClick={downloadCsv}>
                      <Download className="size-4" aria-hidden />
                      Download CSV
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-136 text-sm">
                      <caption className="sr-only">
                        Interest and principal paid each year, with the balance
                        remaining at the end of the year.
                      </caption>
                      <thead>
                        <tr className="border-border/60 text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                          <th scope="col" className="py-2 pr-3 font-medium">
                            Year
                          </th>
                          <th
                            scope="col"
                            className="py-2 pr-3 text-right font-medium"
                          >
                            Interest
                          </th>
                          <th
                            scope="col"
                            className="py-2 pr-3 text-right font-medium"
                          >
                            Principal
                          </th>
                          <th
                            scope="col"
                            className="py-2 pr-3 text-right font-medium"
                          >
                            Balance
                          </th>
                          <th scope="col" className="w-8 py-2">
                            <span className="sr-only">Expand</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.years.map((year) => (
                          <YearRow
                            key={year.year}
                            year={year}
                            open={openYear === year.year}
                            onToggle={() =>
                              setOpenYear((current) =>
                                current === year.year ? null : year.year
                              )
                            }
                            format={(value) => money.format(value)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function validate(
  principal: number,
  rate: number,
  months: number
): string | null {
  if (!Number.isFinite(principal) || principal <= 0)
    return "Enter a loan amount greater than zero.";
  if (!Number.isFinite(rate) || rate < 0)
    return "Enter an interest rate of zero or more.";
  if (!Number.isFinite(months) || months < 1)
    return "Enter a term of at least one month.";
  if (months > 1200) return "Terms longer than 100 years aren't supported.";
  return null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="text-base font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function InterestBar({
  principal,
  interest,
  format,
}: {
  principal: number;
  interest: number;
  format: (value: number) => string;
}) {
  const total = principal + interest;
  const share = total > 0 ? (principal / total) * 100 : 100;

  return (
    <div className="flex flex-col gap-2">
      <div
        className="bg-muted flex h-3 overflow-hidden rounded-full"
        role="img"
        aria-label={`${format(principal)} principal and ${format(interest)} interest`}
      >
        <div className="bg-primary h-full" style={{ width: `${share}%` }} />
        <div
          className="bg-warning h-full"
          style={{ width: `${100 - share}%` }}
        />
      </div>
      <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="bg-primary size-2 rounded-full" />
          Principal {Math.round(share)}%
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="bg-warning size-2 rounded-full" />
          Interest {Math.round(100 - share)}%
        </span>
      </div>
    </div>
  );
}

function YearRow({
  year,
  open,
  onToggle,
  format,
}: {
  year: YearSummary;
  open: boolean;
  onToggle: () => void;
  format: (value: number) => string;
}) {
  return (
    <>
      <tr className="border-border/40 hover:bg-accent/40 border-b transition-colors">
        <th scope="row" className="py-2 pr-3 text-left font-medium">
          Year {year.year}
        </th>
        <td className="py-2 pr-3 text-right tabular-nums">
          {format(year.interest)}
        </td>
        <td className="py-2 pr-3 text-right tabular-nums">
          {format(year.principal)}
        </td>
        <td className="py-2 pr-3 text-right tabular-nums">
          {format(year.endingBalance)}
        </td>
        <td className="py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            aria-expanded={open}
            aria-label={`${open ? "Hide" : "Show"} monthly detail for year ${year.year}`}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                open && "rotate-180"
              )}
              aria-hidden
            />
          </Button>
        </td>
      </tr>
      {open
        ? year.rows.map((row) => (
            <tr
              key={row.month}
              className="bg-muted/30 text-muted-foreground text-xs"
            >
              <td className="py-1.5 pr-3 pl-4">Month {row.month}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">
                {format(row.interest)}
              </td>
              <td className="py-1.5 pr-3 text-right tabular-nums">
                {format(row.principal)}
              </td>
              <td className="py-1.5 pr-3 text-right tabular-nums">
                {format(row.balance)}
              </td>
              <td />
            </tr>
          ))
        : null}
    </>
  );
}

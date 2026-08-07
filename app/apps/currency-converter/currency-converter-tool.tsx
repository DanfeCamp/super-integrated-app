"use client";

import { ArrowUpDown, RefreshCw, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { currencies } from "@/data/currencies";

interface RatesResponse {
  base: string;
  rates: Record<string, number>;
  updatedAt: string | null;
}

const POPULAR = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD"] as const;

/** Which input the user last edited — the other is the derived one. */
type Source = "from" | "to";

export function CurrencyConverterTool() {
  const [data, setData] = React.useState<RatesResponse | null>(null);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [from, setFrom] = React.useState("USD");
  const [to, setTo] = React.useState("EUR");
  const [amount, setAmount] = React.useState("100");
  const [source, setSource] = React.useState<Source>("from");

  const load = React.useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/rates");
      if (!response.ok) throw new Error("Request failed");
      setData((await response.json()) as RatesResponse);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching rates on mount is external-system synchronisation.
    void load();
  }, [load]);

  const options: ComboboxOption[] = React.useMemo(
    () =>
      currencies.map((currency) => ({
        value: currency.code,
        label: `${currency.code} — ${currency.name}`,
        keywords: currency.name,
      })),
    []
  );

  // Rates are all quoted against USD, so cross-rates go via the base.
  const rate = React.useMemo(() => {
    if (!data) return null;
    const fromRate = data.rates[from];
    const toRate = data.rates[to];
    if (!fromRate || !toRate) return null;
    return toRate / fromRate;
  }, [data, from, to]);

  const parsedAmount = Number.parseFloat(amount);
  const validAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;

  const converted = rate === null ? null : validAmount * rate;
  const inverse = rate === null ? null : validAmount / rate;

  // The field the user isn't editing shows the derived value.
  const fromValue = source === "from" ? amount : formatAmount(inverse);
  const toValue = source === "to" ? amount : formatAmount(converted);

  const swap = () => {
    setFrom(to);
    setTo(from);
    // Keep the number the user typed anchored to the field they typed it in.
    setAmount(
      source === "from" ? formatAmount(converted) : formatAmount(inverse)
    );
    setSource(source === "from" ? "to" : "from");
  };

  const summary =
    rate === null
      ? ""
      : `${formatAmount(validAmount)} ${source === "from" ? from : to} = ${
          source === "from" ? formatAmount(converted) : formatAmount(inverse)
        } ${source === "from" ? to : from}`;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription className="flex flex-wrap items-center gap-3">
            Couldn&apos;t load today&apos;s exchange rates.
            <Button size="sm" variant="outline" onClick={() => void load()}>
              <RefreshCw className="size-3.5" aria-hidden />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="flex flex-col gap-4">
          <CurrencyRow
            id="from"
            label="From"
            amount={fromValue}
            onAmountChange={(value) => {
              setAmount(value);
              setSource("from");
            }}
            currency={from}
            onCurrencyChange={setFrom}
            options={options}
            loading={status === "loading"}
          />

          <div className="relative flex items-center">
            <span aria-hidden className="bg-border h-px flex-1" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swap}
              aria-label="Swap currencies"
              className="mx-3 shrink-0 rounded-full transition-transform hover:rotate-180"
            >
              <ArrowUpDown className="size-4" />
            </Button>
            <span aria-hidden className="bg-border h-px flex-1" />
          </div>

          <CurrencyRow
            id="to"
            label="To"
            amount={toValue}
            onAmountChange={(value) => {
              setAmount(value);
              setSource("to");
            }}
            currency={to}
            onCurrencyChange={setTo}
            options={options}
            loading={status === "loading"}
            emphasis
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div className="flex flex-col gap-0.5" aria-live="polite">
              {status === "loading" ? (
                <Skeleton className="h-5 w-48" />
              ) : rate === null ? (
                <p className="text-muted-foreground text-sm">
                  Rate unavailable for this pair.
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium tabular-nums">
                    1 {from} = {formatRate(rate)} {to}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    1 {to} = {formatRate(1 / rate)} {from}
                    {data?.updatedAt
                      ? ` · updated ${shortDate(data.updatedAt)}`
                      : ""}
                  </p>
                </>
              )}
            </div>
            <CopyButton value={summary} label="Copy" />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          Quick pairs:
        </span>
        {POPULAR.filter((code) => code !== from).map((code) => (
          <Button
            key={code}
            variant="outline"
            size="sm"
            onClick={() => setTo(code)}
            aria-pressed={to === code}
            className={to === code ? "border-primary text-primary" : undefined}
          >
            {from}/{code}
          </Button>
        ))}
      </div>
    </div>
  );
}

function CurrencyRow({
  id,
  label,
  amount,
  onAmountChange,
  currency,
  onCurrencyChange,
  options,
  loading,
  emphasis,
}: {
  id: string;
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
  options: ComboboxOption[];
  loading: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${id}-amount`}>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-[1fr_minmax(0,15rem)]">
        <Input
          id={`${id}-amount`}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          disabled={loading}
          className={
            emphasis
              ? "h-12 text-lg font-semibold tabular-nums"
              : "h-12 text-lg tabular-nums"
          }
        />
        <Combobox
          label={`${label} currency`}
          options={options}
          value={currency}
          onValueChange={onCurrencyChange}
          searchPlaceholder="Search currency…"
          emptyMessage="No currency found."
          disabled={loading}
          className="h-12"
        />
      </div>
    </div>
  );
}

function formatAmount(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "";
  return value.toFixed(2);
}

function formatRate(rate: number) {
  // Very small rates (e.g. IDR→USD) need more places to stay meaningful.
  return rate < 0.01 ? rate.toPrecision(4) : rate.toFixed(4);
}

function shortDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

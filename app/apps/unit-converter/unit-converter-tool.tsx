"use client";

import { ArrowRightLeft } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  convert,
  formatResult,
  getCategory,
  getUnit,
  unitCategories,
  type Unit,
} from "./units";

export function UnitConverterTool() {
  const [categoryId, setCategoryId] = React.useState("length");
  const category = getCategory(categoryId);

  const [fromId, setFromId] = React.useState(category.defaults[0]);
  const [toId, setToId] = React.useState(category.defaults[1]);
  const [amount, setAmount] = React.useState("1");

  const from = getUnit(category, fromId);
  const to = getUnit(category, toId);

  const parsed = Number.parseFloat(amount.replace(/,/g, ""));
  const hasInput = amount.trim() !== "";
  const isValid = hasInput && Number.isFinite(parsed);
  const result = isValid ? convert(parsed, from, to) : null;

  const switchCategory = (nextId: string) => {
    const next = getCategory(nextId);
    setCategoryId(nextId);
    setFromId(next.defaults[0]);
    setToId(next.defaults[1]);
  };

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div
            role="tablist"
            aria-label="Unit category"
            className="-mx-1 flex flex-wrap gap-2 px-1"
          >
            {unitCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === categoryId}
                onClick={() => switchCategory(item.id)}
                className={cn(
                  "focus-visible:ring-ring/45 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]",
                  item.id === categoryId
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <div className="flex flex-col gap-2">
              <Label htmlFor="unit-amount">From</Label>
              <Input
                id="unit-amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-invalid={hasInput && !isValid}
                aria-describedby={
                  hasInput && !isValid ? "unit-amount-error" : undefined
                }
                className="h-11 text-base tabular-nums"
                placeholder="Enter a value"
              />
              <UnitSelect
                label="Convert from"
                units={category.units}
                value={fromId}
                onChange={setFromId}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              aria-label="Swap units"
              className="mb-9 justify-self-center md:mb-[3.25rem]"
            >
              <ArrowRightLeft className="size-4" aria-hidden />
            </Button>

            <div className="flex flex-col gap-2">
              <Label htmlFor="unit-result">To</Label>
              <div className="relative">
                <output
                  id="unit-result"
                  htmlFor="unit-amount"
                  className={cn(
                    "border-input bg-muted/40 flex h-11 items-center rounded-md border px-3 pr-11 text-base tabular-nums",
                    result === null && "text-muted-foreground"
                  )}
                >
                  <span className="truncate">
                    {result === null ? "—" : formatResult(result)}
                  </span>
                </output>
                <CopyButton
                  value={result === null ? "" : formatResult(result)}
                  className="absolute top-1/2 right-1.5 -translate-y-1/2"
                />
              </div>
              <UnitSelect
                label="Convert to"
                units={category.units}
                value={toId}
                onChange={setToId}
              />
            </div>
          </div>

          {hasInput && !isValid ? (
            <p
              id="unit-amount-error"
              role="alert"
              className="text-destructive text-sm"
            >
              Enter a number to convert.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {isValid ? (
                <>
                  <span className="text-foreground font-medium tabular-nums">
                    {formatResult(parsed)} {from.symbol}
                  </span>{" "}
                  ={" "}
                  <span className="text-foreground font-medium tabular-nums">
                    {formatResult(result!)} {to.symbol}
                  </span>
                </>
              ) : (
                <>Enter a value to see the conversion.</>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {isValid ? (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">
              {formatResult(parsed)} {from.symbol} in every{" "}
              {category.name.toLowerCase()} unit
            </h2>
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {category.units.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "border-border/50 flex items-baseline justify-between gap-3 border-b py-1.5 text-sm last:border-0",
                    item.id === to.id && "text-foreground font-medium"
                  )}
                >
                  <span className="text-muted-foreground truncate">
                    {item.name}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatResult(convert(parsed, from, item))}{" "}
                    <span className="text-muted-foreground">{item.symbol}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function UnitSelect({
  label,
  units,
  value,
  onChange,
}: {
  label: string;
  units: Unit[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {units.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name} ({item.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

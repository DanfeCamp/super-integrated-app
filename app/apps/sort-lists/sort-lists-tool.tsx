"use client";

import { ArrowDownUp, Download } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { downloadBlob, pluralize } from "@/lib/utils";

type SortMode = "alpha" | "numeric" | "length" | "shuffle";
type Direction = "asc" | "desc";

const MODES: { value: SortMode; label: string }[] = [
  { value: "alpha", label: "Alphabetical" },
  { value: "numeric", label: "Numeric" },
  { value: "length", label: "By length" },
  { value: "shuffle", label: "Shuffle" },
];

const SAMPLE = "banana\nApple\ncherry\nbanana\n  date  \nelderberry";

export function SortListsTool() {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<SortMode>("alpha");
  const [direction, setDirection] = React.useState<Direction>("asc");
  const [trim, setTrim] = React.useState(true);
  const [removeBlank, setRemoveBlank] = React.useState(true);
  const [dedupe, setDedupe] = React.useState(false);
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  // Shuffling can't happen during render (Math.random is impure and would
  // produce a different order on every pass), so the order lives in state and
  // is recomputed only when the user asks for it.
  const [shuffleOrder, setShuffleOrder] = React.useState<number[]>([]);

  const { output, stats } = React.useMemo(() => {
    let lines = input.split("\n");
    const originalCount = lines.length;

    if (trim) lines = lines.map((line) => line.trim());
    if (removeBlank) lines = lines.filter((line) => line.trim() !== "");

    let duplicatesRemoved = 0;
    if (dedupe) {
      const seen = new Set<string>();
      const unique: string[] = [];
      for (const line of lines) {
        const key = caseSensitive ? line : line.toLowerCase();
        if (seen.has(key)) {
          duplicatesRemoved += 1;
          continue;
        }
        seen.add(key);
        unique.push(line);
      }
      lines = unique;
    }

    const sorted = [...lines];

    if (mode === "shuffle") {
      // Apply the stored permutation, falling back to input order for any
      // lines added since the last shuffle.
      const permuted = shuffleOrder
        .filter((index) => index < sorted.length)
        .map((index) => sorted[index]!);
      const used = new Set(shuffleOrder);
      sorted.forEach((line, index) => {
        if (!used.has(index)) permuted.push(line);
      });
      sorted.splice(0, sorted.length, ...permuted);
    } else {
      sorted.sort((a, b) => {
        if (mode === "numeric") {
          const numberA = Number.parseFloat(a);
          const numberB = Number.parseFloat(b);
          // Non-numeric lines sink to the bottom rather than sorting randomly.
          if (Number.isNaN(numberA) && Number.isNaN(numberB)) {
            return a.localeCompare(b);
          }
          if (Number.isNaN(numberA)) return 1;
          if (Number.isNaN(numberB)) return -1;
          return numberA - numberB;
        }
        if (mode === "length") return a.length - b.length;
        return caseSensitive
          ? a < b
            ? -1
            : a > b
              ? 1
              : 0
          : a.localeCompare(b, undefined, { sensitivity: "base" });
      });

      if (direction === "desc") sorted.reverse();
    }

    return {
      output: sorted.join("\n"),
      stats: {
        originalCount: input.trim() === "" ? 0 : originalCount,
        resultCount: sorted.length,
        duplicatesRemoved,
      },
    };
  }, [
    input,
    mode,
    direction,
    trim,
    removeBlank,
    dedupe,
    caseSensitive,
    shuffleOrder,
  ]);

  const reshuffle = React.useCallback(() => {
    const count = input.split("\n").filter((line) => line.trim() !== "").length;
    const order = Array.from({ length: count }, (_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    setShuffleOrder(order);
  }, [input]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_auto_1fr] sm:items-end">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sort-mode">Sort by</Label>
              <Select
                value={mode}
                onValueChange={(value) => {
                  const next = value as SortMode;
                  setMode(next);
                  if (next === "shuffle") reshuffle();
                }}
              >
                <SelectTrigger id="sort-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {mode === "shuffle" ? (
              <Button variant="outline" onClick={reshuffle}>
                <ArrowDownUp className="size-4" aria-hidden />
                Reshuffle
              </Button>
            ) : (
              <ToggleGroup
                type="single"
                value={direction}
                onValueChange={(value) =>
                  value && setDirection(value as Direction)
                }
                aria-label="Sort direction"
              >
                <ToggleGroupItem value="asc">A → Z</ToggleGroupItem>
                <ToggleGroupItem value="desc">Z → A</ToggleGroupItem>
              </ToggleGroup>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-3 sm:justify-end">
              <Option
                id="trim"
                label="Trim spaces"
                checked={trim}
                onChange={setTrim}
              />
              <Option
                id="remove-blank"
                label="Drop blanks"
                checked={removeBlank}
                onChange={setRemoveBlank}
              />
              <Option
                id="dedupe"
                label="Remove duplicates"
                checked={dedupe}
                onChange={setDedupe}
              />
              <Option
                id="case-sensitive"
                label="Case sensitive"
                checked={caseSensitive}
                onChange={setCaseSensitive}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="sort-input">Input</Label>
                {input ? (
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {stats.originalCount}{" "}
                    {pluralize(stats.originalCount, "line")}
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(SAMPLE)}
                  >
                    Load sample
                  </Button>
                )}
              </div>
              <Textarea
                id="sort-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={"One item per line…\nbanana\napple\ncherry"}
                rows={14}
                spellCheck={false}
                className="resize-none font-mono text-[0.8125rem]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="sort-output">Result</Label>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {stats.resultCount} {pluralize(stats.resultCount, "line")}
                  {stats.duplicatesRemoved > 0
                    ? ` · ${stats.duplicatesRemoved} removed`
                    : ""}
                </span>
              </div>
              <Textarea
                id="sort-output"
                value={output}
                readOnly
                rows={14}
                spellCheck={false}
                placeholder="Sorted output appears here."
                className="bg-muted/40 resize-none font-mono text-[0.8125rem]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <CopyButton value={output} label="Copy result" />
            <Button
              variant="outline"
              disabled={!output}
              onClick={() =>
                downloadBlob(
                  new Blob([output], { type: "text/plain;charset=utf-8" }),
                  "sorted-list.txt"
                )
              }
            >
              <Download className="size-4" aria-hidden />
              Download .txt
            </Button>
            <Button
              variant="ghost"
              disabled={!input}
              onClick={() => setInput("")}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Option({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}

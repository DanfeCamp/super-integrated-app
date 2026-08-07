"use client";

import { ArrowRightLeft, Columns2, Rows3, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn, pluralize } from "@/lib/utils";

import {
  diffSequences,
  diffWords,
  normalizeLine,
  toRows,
  type DiffOptions,
  type Row,
  type WordPart,
} from "./diff";

type View = "split" | "unified";

const SAMPLE_LEFT = `function greet(name) {
  const greeting = "Hello";
  console.log(greeting + ", " + name);
  return true;
}`;

const SAMPLE_RIGHT = `function greet(name, punctuation = "!") {
  const greeting = "Hi";
  console.log(\`\${greeting}, \${name}\${punctuation}\`);
  return true;
}`;

export function DiffCheckerTool() {
  const [left, setLeft] = React.useState("");
  const [right, setRight] = React.useState("");
  const [view, setView] = React.useState<View>("split");
  const [options, setOptions] = React.useState<DiffOptions>({
    ignoreCase: false,
    ignoreWhitespace: false,
    trimLines: false,
  });

  const debouncedLeft = useDebouncedValue(left, 200);
  const debouncedRight = useDebouncedValue(right, 200);

  const { rows, stats, truncated } = React.useMemo(() => {
    const leftLines = debouncedLeft === "" ? [] : debouncedLeft.split("\n");
    const rightLines = debouncedRight === "" ? [] : debouncedRight.split("\n");

    const outcome = diffSequences(
      leftLines.map((line) => normalizeLine(line, options)),
      rightLines.map((line) => normalizeLine(line, options))
    );
    const built = toRows(outcome.ops, leftLines, rightLines);

    return {
      rows: built,
      truncated: outcome.truncated,
      stats: {
        added: built.filter((row) => row.type === "added").length,
        removed: built.filter((row) => row.type === "removed").length,
        changed: built.filter((row) => row.type === "changed").length,
        unchanged: built.filter((row) => row.type === "equal").length,
      },
    };
  }, [debouncedLeft, debouncedRight, options]);

  const hasInput = debouncedLeft !== "" || debouncedRight !== "";
  const identical =
    hasInput && stats.added + stats.removed + stats.changed === 0;

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  const patch = React.useMemo(() => toUnifiedText(rows), [rows]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Pane
              id="diff-left"
              label="Original"
              value={left}
              onChange={setLeft}
              placeholder="Paste the original text here."
            />
            <Pane
              id="diff-right"
              label="Changed"
              value={right}
              onChange={setRight}
              placeholder="Paste the changed text here."
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={swap}
              disabled={!hasInput}
            >
              <ArrowRightLeft className="size-4" aria-hidden />
              Swap sides
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLeft(SAMPLE_LEFT);
                setRight(SAMPLE_RIGHT);
              }}
            >
              Load sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasInput}
              onClick={() => {
                setLeft("");
                setRight("");
              }}
            >
              Clear
            </Button>

            <div className="flex flex-wrap gap-x-5 gap-y-3 sm:ms-auto">
              <Option
                id="ignore-case"
                label="Ignore case"
                checked={options.ignoreCase}
                onChange={(ignoreCase) =>
                  setOptions((current) => ({ ...current, ignoreCase }))
                }
              />
              <Option
                id="ignore-whitespace"
                label="Ignore whitespace"
                checked={options.ignoreWhitespace}
                onChange={(ignoreWhitespace) =>
                  setOptions((current) => ({ ...current, ignoreWhitespace }))
                }
              />
              <Option
                id="trim-lines"
                label="Trim lines"
                checked={options.trimLines}
                onChange={(trimLines) =>
                  setOptions((current) => ({ ...current, trimLines }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">Differences</h2>
              {hasInput ? (
                <span
                  className="flex flex-wrap gap-2 text-xs"
                  aria-live="polite"
                >
                  <Chip tone="added">+{stats.added + stats.changed}</Chip>
                  <Chip tone="removed">−{stats.removed + stats.changed}</Chip>
                  <Chip tone="equal">
                    {stats.unchanged} unchanged{" "}
                    {pluralize(stats.unchanged, "line")}
                  </Chip>
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <CopyButton value={patch} label="Copy diff" />
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(value) => value && setView(value as View)}
                aria-label="Diff view"
              >
                <ToggleGroupItem value="split" aria-label="Side by side">
                  <Columns2 className="size-4" aria-hidden />
                  <span className="max-sm:sr-only">Split</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="unified" aria-label="Unified">
                  <Rows3 className="size-4" aria-hidden />
                  <span className="max-sm:sr-only">Unified</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {truncated ? (
            <Alert variant="warning">
              <TriangleAlert />
              <AlertDescription>
                These documents are too large to align line by line, so
                everything after the shared opening is shown as replaced.
                Compare smaller sections for a precise diff.
              </AlertDescription>
            </Alert>
          ) : null}

          {!hasInput ? (
            <EmptyState
              icon={Columns2}
              title="Nothing to compare yet"
              description="Paste text into both panes — the comparison runs as you type and never leaves your browser."
            />
          ) : identical ? (
            <EmptyState
              icon={Columns2}
              title="The two texts are identical"
              description={
                options.ignoreCase ||
                options.ignoreWhitespace ||
                options.trimLines
                  ? "No differences remain once the ignore options are applied."
                  : "Every line matches, including whitespace and case."
              }
            />
          ) : view === "split" ? (
            <SplitView rows={rows} />
          ) : (
            <UnifiedView rows={rows} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* --------------------------------- views ---------------------------------- */

/**
 * Removals tint the left column, additions the right, and a cell with no
 * counterpart is greyed so the gap reads as "nothing here" rather than "an
 * empty line".
 */
function cellTone(row: Row, side: "left" | "right"): string {
  if (row.type === "equal") return "";
  const content = side === "left" ? row.left : row.right;
  if (!content) return "bg-muted/40";
  return side === "left" ? "bg-destructive/10" : "bg-success/10";
}

function SplitView({ rows }: { rows: Row[] }) {
  return (
    <div className="border-border/60 overflow-x-auto rounded-lg border">
      <table className="w-full min-w-160 border-collapse font-mono text-[0.8125rem]">
        <caption className="sr-only">
          The original on the left and the changed text on the right, aligned
          line by line.
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Original line number</th>
            <th scope="col">Original</th>
            <th scope="col">Changed line number</th>
            <th scope="col">Changed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const inline =
              row.type === "changed" && row.left && row.right
                ? diffWords(row.left.text, row.right.text)
                : null;

            return (
              <tr key={index} className="align-top">
                <Gutter number={row.left?.number} />
                <Cell
                  tone={cellTone(row, "left")}
                  parts={inline?.left}
                  text={row.left?.text}
                  side="left"
                />
                <Gutter
                  number={row.right?.number}
                  className="border-border/60 border-l"
                />
                <Cell
                  tone={cellTone(row, "right")}
                  parts={inline?.right}
                  text={row.right?.text}
                  side="right"
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function UnifiedView({ rows }: { rows: Row[] }) {
  const lines: {
    marker: string;
    tone: string;
    number: number | undefined;
    text: string;
    parts?: WordPart[];
  }[] = [];

  rows.forEach((row) => {
    if (row.type === "equal") {
      lines.push({
        marker: " ",
        tone: "",
        number: row.left?.number,
        text: row.left?.text ?? "",
      });
      return;
    }
    const inline =
      row.type === "changed" && row.left && row.right
        ? diffWords(row.left.text, row.right.text)
        : null;
    if (row.left) {
      lines.push({
        marker: "−",
        tone: "bg-destructive/10",
        number: row.left.number,
        text: row.left.text,
        parts: inline?.left,
      });
    }
    if (row.right) {
      lines.push({
        marker: "+",
        tone: "bg-success/10",
        number: row.right.number,
        text: row.right.text,
        parts: inline?.right,
      });
    }
  });

  return (
    <div className="border-border/60 overflow-x-auto rounded-lg border">
      <ol className="font-mono text-[0.8125rem]">
        {lines.map((line, index) => (
          <li key={index} className={cn("flex gap-3 px-3 py-0.5", line.tone)}>
            <span className="text-muted-foreground w-10 shrink-0 text-right tabular-nums select-none">
              {line.number ?? ""}
            </span>
            <span
              aria-hidden
              className={cn(
                "w-3 shrink-0 select-none",
                line.marker === "+" && "text-success",
                line.marker === "−" && "text-destructive"
              )}
            >
              {line.marker}
            </span>
            <span className="min-w-0 flex-1 wrap-break-word whitespace-pre-wrap">
              {line.parts ? <Parts parts={line.parts} /> : line.text || " "}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Gutter({
  number,
  className,
}: {
  number: number | undefined;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "text-muted-foreground bg-muted/30 w-12 px-2 py-0.5 text-right align-top tabular-nums select-none",
        className
      )}
    >
      {number ?? ""}
    </td>
  );
}

function Cell({
  tone,
  parts,
  text,
  side,
}: {
  tone: string;
  parts?: WordPart[];
  text?: string;
  side: "left" | "right";
}) {
  return (
    <td
      className={cn(
        "w-1/2 px-3 py-0.5 align-top wrap-break-word whitespace-pre-wrap",
        tone
      )}
    >
      {parts ? <Parts parts={parts} /> : (text ?? "")}
      {text === "" ? " " : null}
      {text === undefined ? (
        <span className="sr-only">No matching {side} line</span>
      ) : null}
    </td>
  );
}

function Parts({ parts }: { parts: WordPart[] }) {
  return (
    <>
      {parts.map((part, index) =>
        part.type === "equal" ? (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        ) : (
          <mark
            key={index}
            className={cn(
              "rounded-sm px-0.5",
              part.type === "insert"
                ? "bg-success/30 text-foreground"
                : "bg-destructive/30 text-foreground"
            )}
          >
            {part.text}
          </mark>
        )
      )}
    </>
  );
}

function toUnifiedText(rows: Row[]): string {
  return rows
    .flatMap((row) => {
      if (row.type === "equal") return [`  ${row.left?.text ?? ""}`];
      const out: string[] = [];
      if (row.left) out.push(`- ${row.left.text}`);
      if (row.right) out.push(`+ ${row.right.text}`);
      return out;
    })
    .join("\n");
}

/* -------------------------------- controls -------------------------------- */

function Pane({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const lines = value === "" ? 0 : value.split("\n").length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-muted-foreground text-xs tabular-nums">
          {lines} {pluralize(lines, "line")}
        </span>
      </div>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={12}
        spellCheck={false}
        className="resize-y font-mono text-[0.8125rem]"
      />
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

function Chip({
  tone,
  children,
}: {
  tone: "added" | "removed" | "equal";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-medium tabular-nums",
        tone === "added" && "bg-success/12 text-success",
        tone === "removed" && "bg-destructive/12 text-destructive",
        tone === "equal" && "bg-muted text-muted-foreground"
      )}
    >
      {children}
    </span>
  );
}

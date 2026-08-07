"use client";

import { Braces, CircleCheck, Download, Minimize2 } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { downloadBlob, formatBytes } from "@/lib/utils";

import { inspect, parseJson, sortKeys } from "./json";
import { JsonTree } from "./json-tree";

const INDENTS = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tab" },
] as const;

const SAMPLE = `{"id":42,"name":"Ada Lovelace","active":true,"roles":["admin","author"],"profile":{"joined":"1843-10-01","score":99.5,"bio":null}}`;

export function JsonFormatterTool() {
  const [input, setInput] = React.useState("");
  const [indent, setIndent] = React.useState<string>("2");
  const [sort, setSort] = React.useState(false);
  const debounced = useDebouncedValue(input, 200);

  const { output, error, stats, minified, value } = React.useMemo(() => {
    const empty = {
      output: "",
      error: null,
      stats: null,
      minified: "",
      value: null,
    };
    if (debounced.trim() === "") return empty;

    const parsed = parseJson(debounced);
    if (parsed.error) return { ...empty, error: parsed.error };

    const normalised = sort ? sortKeys(parsed.value) : parsed.value;
    const space = indent === "tab" ? "\t" : Number(indent);

    return {
      output: JSON.stringify(normalised, null, space),
      minified: JSON.stringify(normalised),
      error: null,
      stats: inspect(parsed.value),
      value: normalised,
    };
  }, [debounced, indent, sort]);

  const inputBytes = new TextEncoder().encode(debounced).length;
  const minifiedBytes = new TextEncoder().encode(minified).length;
  const isEmpty = debounced.trim() === "";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="json-indent">Indentation</Label>
                <Select value={indent} onValueChange={setIndent}>
                  <SelectTrigger id="json-indent" className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDENTS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  id="json-sort"
                  checked={sort}
                  onCheckedChange={setSort}
                />
                <Label htmlFor="json-sort" className="text-sm font-normal">
                  Sort keys
                </Label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!minified}
                onClick={() => setInput(minified)}
              >
                <Minimize2 className="size-4" aria-hidden />
                Minify
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!output}
                onClick={() => setInput(output)}
              >
                <Braces className="size-4" aria-hidden />
                Format in place
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput(isEmpty ? SAMPLE : "")}
              >
                {isEmpty ? "Load sample" : "Clear"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="json-input">Input</Label>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {formatBytes(inputBytes)}
                </span>
              </div>
              <Textarea
                id="json-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder='{"paste": "your JSON here"}'
                rows={18}
                spellCheck={false}
                aria-invalid={error !== null}
                aria-describedby={error ? "json-error" : undefined}
                className="resize-y font-mono text-[0.8125rem]"
              />
              {error ? (
                <Alert variant="destructive" id="json-error">
                  <AlertTitle>Invalid JSON</AlertTitle>
                  <AlertDescription>
                    {error.message}
                    {error.line !== undefined
                      ? ` — line ${error.line}${error.column !== undefined ? `, column ${error.column}` : ""}.`
                      : "."}
                  </AlertDescription>
                </Alert>
              ) : !isEmpty ? (
                <Alert variant="success">
                  <CircleCheck />
                  <AlertDescription>
                    Valid JSON · {formatBytes(minifiedBytes)} minified
                    {inputBytes > minifiedBytes
                      ? ` (${Math.round(((inputBytes - minifiedBytes) / inputBytes) * 100)}% smaller)`
                      : ""}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Result</Label>
                <div className="flex gap-1">
                  <CopyButton value={output} />
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={!output}
                    aria-label="Download JSON"
                    onClick={() =>
                      downloadBlob(
                        new Blob([output], { type: "application/json" }),
                        "formatted.json"
                      )
                    }
                  >
                    <Download className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="formatted" className="flex flex-col gap-2">
                <TabsList>
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="tree">Tree</TabsTrigger>
                </TabsList>

                <TabsContent value="formatted">
                  <Textarea
                    value={output}
                    readOnly
                    rows={16}
                    spellCheck={false}
                    aria-label="Formatted JSON"
                    placeholder="Formatted JSON appears here."
                    className="bg-muted/40 h-full resize-y font-mono text-[0.8125rem]"
                  />
                </TabsContent>

                <TabsContent value="tree">
                  <div className="border-input bg-muted/40 h-98 overflow-auto rounded-md border p-3">
                    {output !== "" ? (
                      <JsonTree value={value} />
                    ) : (
                      <EmptyState
                        icon={Braces}
                        title="Nothing to explore"
                        description="Paste valid JSON to browse it as a collapsible tree."
                        className="py-12"
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {stats ? (
            <dl className="border-border/60 grid grid-cols-3 gap-4 border-t pt-4 sm:grid-cols-7">
              <Stat label="Objects" value={stats.objects} />
              <Stat label="Arrays" value={stats.arrays} />
              <Stat label="Strings" value={stats.strings} />
              <Stat label="Numbers" value={stats.numbers} />
              <Stat label="Booleans" value={stats.booleans} />
              <Stat label="Nulls" value={stats.nulls} />
              <Stat label="Max depth" value={stats.depth} />
            </dl>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="text-base font-semibold tabular-nums">
        {value.toLocaleString()}
      </dd>
    </div>
  );
}

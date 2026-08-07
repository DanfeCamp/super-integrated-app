"use client";

import { Download, FileSpreadsheet, TriangleAlert, Upload } from "lucide-react";
import Papa from "papaparse";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { downloadBlob, pluralize } from "@/lib/utils";

const DELIMITERS = [
  { value: "auto", label: "Detect automatically", character: "" },
  { value: ",", label: "Comma", character: "," },
  { value: ";", label: "Semicolon", character: ";" },
  { value: "\t", label: "Tab", character: "\t" },
  { value: "|", label: "Pipe", character: "|" },
] as const;

const PREVIEW_ROWS = 15;

const SAMPLE_CSV = `name,role,city,joined
Ada Lovelace,Mathematician,London,1833
Grace Hopper,Rear Admiral,New York,1944
Katherine Johnson,Physicist,Hampton,1953`;

const SAMPLE_JSON = `[
  { "name": "Ada Lovelace", "role": "Mathematician", "city": "London" },
  { "name": "Grace Hopper", "role": "Rear Admiral", "city": "New York" }
]`;

export function CsvConverterTool() {
  return (
    <Tabs defaultValue="to-json" className="flex flex-col gap-4">
      <TabsList>
        <TabsTrigger value="to-json">CSV → JSON</TabsTrigger>
        <TabsTrigger value="to-csv">JSON → CSV</TabsTrigger>
      </TabsList>
      <TabsContent value="to-json">
        <CsvToJson />
      </TabsContent>
      <TabsContent value="to-csv">
        <JsonToCsv />
      </TabsContent>
    </Tabs>
  );
}

/* ------------------------------- CSV → JSON ------------------------------- */

function CsvToJson() {
  const [input, setInput] = React.useState("");
  const [delimiter, setDelimiter] = React.useState<string>("auto");
  const [header, setHeader] = React.useState(true);
  const [dynamicTyping, setDynamicTyping] = React.useState(true);
  const [pretty, setPretty] = React.useState(true);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { json, rows, columns, problems } = React.useMemo(() => {
    if (input.trim() === "") {
      return { json: "", rows: [], columns: [], problems: [] as string[] };
    }

    const result = Papa.parse<Record<string, unknown> | unknown[]>(input, {
      header,
      dynamicTyping,
      skipEmptyLines: "greedy",
      delimiter: delimiter === "auto" ? "" : delimiter,
    });

    const data = result.data;
    const headers = header
      ? (result.meta.fields ?? [])
      : ((data[0] as unknown[] | undefined) ?? []).map((_, index) =>
          String(index + 1)
        );

    return {
      json: JSON.stringify(data, null, pretty ? 2 : 0),
      rows: data,
      columns: headers.map(String),
      // Papa reports recoverable issues rather than throwing; surfacing them
      // is the difference between "worked" and "silently dropped a column".
      problems: result.errors
        .slice(0, 5)
        .map((problem) =>
          problem.row === undefined
            ? problem.message
            : `Row ${problem.row + 1}: ${problem.message}`
        ),
    };
  }, [input, header, dynamicTyping, pretty, delimiter]);

  const readFile = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    void file.text().then(setInput);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="csv-delimiter">Delimiter</Label>
              <Select value={delimiter} onValueChange={setDelimiter}>
                <SelectTrigger id="csv-delimiter" className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIMITERS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 pb-2">
              <Toggle
                id="csv-header"
                label="First row is a header"
                checked={header}
                onChange={setHeader}
              />
              <Toggle
                id="csv-typing"
                label="Convert numbers and booleans"
                checked={dynamicTyping}
                onChange={setDynamicTyping}
              />
              <Toggle
                id="csv-pretty"
                label="Pretty print"
                checked={pretty}
                onChange={setPretty}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="csv-input">CSV</Label>
                <div className="flex gap-1">
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,.tsv,.txt,text/csv,text/plain"
                    className="sr-only"
                    onChange={(event) => readFile(event.target.files?.[0])}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="size-4" aria-hidden />
                    Open file
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setInput(input ? "" : SAMPLE_CSV);
                      setFileName(null);
                    }}
                  >
                    {input ? "Clear" : "Load sample"}
                  </Button>
                </div>
              </div>
              <Textarea
                id="csv-input"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setFileName(null);
                }}
                rows={14}
                spellCheck={false}
                placeholder={"name,role\nAda,Mathematician"}
                className="resize-y font-mono text-[0.8125rem]"
              />
              {fileName ? (
                <p className="text-muted-foreground text-xs">
                  Loaded {fileName} — parsed in your browser, never uploaded.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="csv-json-output">JSON</Label>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground mr-1 text-xs tabular-nums">
                    {rows.length} {pluralize(rows.length, "row")}
                  </span>
                  <CopyButton value={json} />
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={!json}
                    aria-label="Download JSON"
                    onClick={() =>
                      downloadBlob(
                        new Blob([json], { type: "application/json" }),
                        "converted.json"
                      )
                    }
                  >
                    <Download className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
              <Textarea
                id="csv-json-output"
                value={json}
                readOnly
                rows={14}
                spellCheck={false}
                placeholder="The JSON output appears here."
                className="bg-muted/40 resize-y font-mono text-[0.8125rem]"
              />
            </div>
          </div>

          {problems.length > 0 ? (
            <Alert variant="warning">
              <TriangleAlert />
              <AlertDescription>
                <ul className="flex flex-col gap-0.5">
                  {problems.map((problem, index) => (
                    <li key={index}>{problem}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <PreviewTable columns={columns} rows={rows} header={header} />
    </div>
  );
}

/* ------------------------------- JSON → CSV ------------------------------- */

function JsonToCsv() {
  const [input, setInput] = React.useState("");
  const [delimiter, setDelimiter] = React.useState<string>(",");
  const [header, setHeader] = React.useState(true);

  const { csv, error, rows, columns } = React.useMemo(() => {
    if (input.trim() === "") {
      return { csv: "", error: null, rows: [], columns: [] as string[] };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch (caught) {
      return {
        csv: "",
        rows: [],
        columns: [],
        error:
          caught instanceof Error ? caught.message : "That isn't valid JSON.",
      };
    }

    if (!Array.isArray(parsed)) {
      return {
        csv: "",
        rows: [],
        columns: [],
        error: "CSV needs an array — wrap your object in [ ] or export a list.",
      };
    }
    if (parsed.length === 0) {
      return { csv: "", rows: [], columns: [], error: "That array is empty." };
    }

    try {
      const character =
        DELIMITERS.find((item) => item.value === delimiter)?.character ?? ",";
      const output = Papa.unparse(parsed as object[], {
        delimiter: character,
        header,
      });

      const first = parsed[0];
      const columnNames =
        first !== null && typeof first === "object" && !Array.isArray(first)
          ? Object.keys(first as Record<string, unknown>)
          : (first as unknown[]).map((_, index) => String(index + 1));

      return {
        csv: output,
        error: null,
        rows: parsed as (Record<string, unknown> | unknown[])[],
        columns: columnNames,
      };
    } catch (caught) {
      return {
        csv: "",
        rows: [],
        columns: [],
        error:
          caught instanceof Error
            ? caught.message
            : "That JSON couldn't be turned into CSV.",
      };
    }
  }, [input, delimiter, header]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="json-delimiter">Delimiter</Label>
              <Select value={delimiter} onValueChange={setDelimiter}>
                <SelectTrigger id="json-delimiter" className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIMITERS.filter((item) => item.value !== "auto").map(
                    (option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="pb-2">
              <Toggle
                id="json-header"
                label="Include header row"
                checked={header}
                onChange={setHeader}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="json-input">JSON</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput(input ? "" : SAMPLE_JSON)}
                >
                  {input ? "Clear" : "Load sample"}
                </Button>
              </div>
              <Textarea
                id="json-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={14}
                spellCheck={false}
                aria-invalid={error !== null}
                placeholder='[{ "name": "Ada", "role": "Mathematician" }]'
                className="resize-y font-mono text-[0.8125rem]"
              />
              {error ? (
                <Alert variant="destructive">
                  <TriangleAlert />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="csv-output">CSV</Label>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground mr-1 text-xs tabular-nums">
                    {rows.length} {pluralize(rows.length, "row")}
                  </span>
                  <CopyButton value={csv} />
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={!csv}
                    aria-label="Download CSV"
                    onClick={() =>
                      downloadBlob(
                        new Blob([csv], { type: "text/csv;charset=utf-8" }),
                        "converted.csv"
                      )
                    }
                  >
                    <Download className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
              <Textarea
                id="csv-output"
                value={csv}
                readOnly
                rows={14}
                spellCheck={false}
                placeholder="The CSV output appears here."
                className="bg-muted/40 resize-y font-mono text-[0.8125rem]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <PreviewTable columns={columns} rows={rows} header />
    </div>
  );
}

/* --------------------------------- shared --------------------------------- */

function PreviewTable({
  columns,
  rows,
  header,
}: {
  columns: string[];
  rows: (Record<string, unknown> | unknown[])[];
  header: boolean;
}) {
  const visible = rows.slice(0, PREVIEW_ROWS);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">Preview</h2>
          {rows.length > PREVIEW_ROWS ? (
            <span className="text-muted-foreground text-xs">
              First {PREVIEW_ROWS} of {rows.length.toLocaleString()} rows
            </span>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={FileSpreadsheet}
            title="Nothing to preview"
            description="Paste or open some data and the parsed table appears here."
          />
        ) : (
          <div className="border-border/60 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  {columns.map((column, index) => (
                    <th
                      key={`${column}-${index}`}
                      scope="col"
                      className="border-border/60 border-b px-3 py-2 font-medium whitespace-nowrap"
                    >
                      {header ? column : `Column ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-border/40 border-b last:border-0"
                  >
                    {columns.map((column, columnIndex) => (
                      <td
                        key={`${column}-${columnIndex}`}
                        className="max-w-64 truncate px-3 py-1.5"
                        title={cellText(row, column, columnIndex)}
                      >
                        {cellText(row, column, columnIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function cellText(
  row: Record<string, unknown> | unknown[],
  column: string,
  index: number
): string {
  const value = Array.isArray(row)
    ? row[index]
    : (row as Record<string, unknown>)[column];
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function Toggle({
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

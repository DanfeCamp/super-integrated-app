"use client";

import { Link2, Plus, TriangleAlert, X } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const SAMPLE =
  "https://user:secret@shop.example.co.uk:8443/catalogue/shoes?colour=red&size=42&utm_source=newsletter#reviews";

interface Param {
  key: string;
  value: string;
}

export function UrlParserTool() {
  return (
    <Tabs defaultValue="parse" className="flex flex-col gap-4">
      <TabsList>
        <TabsTrigger value="parse">Parse a URL</TabsTrigger>
        <TabsTrigger value="encode">Encode &amp; decode</TabsTrigger>
      </TabsList>
      <TabsContent value="parse">
        <ParsePanel />
      </TabsContent>
      <TabsContent value="encode">
        <EncodePanel />
      </TabsContent>
    </Tabs>
  );
}

/* --------------------------------- parsing -------------------------------- */

/**
 * Parses leniently: a bare host is the most common paste, so it is retried as
 * https before the input is called invalid.
 */
function parseUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  try {
    return new URL(trimmed);
  } catch {
    if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      try {
        return new URL(`https://${trimmed}`);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function ParsePanel() {
  const [input, setInput] = React.useState("");
  // Params are editable, so they get their own state, seeded whenever the URL
  // in the box changes.
  const [params, setParams] = React.useState<Param[]>([]);

  const url = React.useMemo(() => parseUrl(input), [input]);
  const error =
    input.trim() !== "" && url === null
      ? "That isn't a URL this browser can parse."
      : null;

  const applyInput = (value: string) => {
    setInput(value);
    const parsed = parseUrl(value);
    setParams(
      parsed
        ? [...parsed.searchParams.entries()].map(([key, entry]) => ({
            key,
            value: entry,
          }))
        : []
    );
  };

  const rebuilt = React.useMemo(() => {
    if (!url) return "";
    const next = new URL(url.href);
    next.search = "";
    const search = new URLSearchParams();
    params.forEach(({ key, value }) => {
      if (key !== "") search.append(key, value);
    });
    const query = search.toString();
    return `${next.origin}${next.pathname}${query ? `?${query}` : ""}${next.hash}`;
  }, [url, params]);

  const segments = url
    ? url.pathname.split("/").filter((segment) => segment !== "")
    : [];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="url-input">URL</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => applyInput(input ? "" : SAMPLE)}
            >
              {input ? "Clear" : "Load sample"}
            </Button>
          </div>
          <Input
            id="url-input"
            value={input}
            onChange={(event) => applyInput(event.target.value)}
            placeholder="https://example.com/path?query=value#fragment"
            spellCheck={false}
            aria-invalid={error !== null}
            className="font-mono"
          />
          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {!url ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Link2}
              title="No URL yet"
              description="Paste a URL to break it into its parts, inspect its query string and rebuild it."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Components</h2>
              <dl className="flex flex-col">
                <Component label="Protocol" value={url.protocol} />
                <Component label="Username" value={url.username} />
                <Component label="Password" value={url.password} secret />
                <Component label="Hostname" value={url.hostname} />
                <Component
                  label="Port"
                  value={url.port || defaultPort(url.protocol)}
                />
                <Component label="Origin" value={url.origin} />
                <Component label="Path" value={url.pathname} />
                <Component label="Query" value={url.search} />
                <Component label="Fragment" value={url.hash} />
              </dl>

              {segments.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold">Path segments</h3>
                  <ol className="flex flex-wrap items-center gap-1.5">
                    {segments.map((segment, index) => (
                      <li
                        key={`${segment}-${index}`}
                        className="flex items-center gap-1.5"
                      >
                        <Badge variant="outline" className="font-mono">
                          {safeDecode(segment)}
                        </Badge>
                        {index < segments.length - 1 ? (
                          <span aria-hidden className="text-muted-foreground">
                            /
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Query parameters</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setParams((current) => [...current, { key: "", value: "" }])
                  }
                >
                  <Plus className="size-4" aria-hidden />
                  Add
                </Button>
              </div>

              {params.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  This URL has no query string. Add a parameter to build one.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {params.map((param, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Input
                        value={param.key}
                        aria-label={`Parameter ${index + 1} name`}
                        placeholder="name"
                        onChange={(event) =>
                          setParams((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, key: event.target.value }
                                : item
                            )
                          )
                        }
                        className="font-mono text-[0.8125rem]"
                      />
                      <span aria-hidden className="text-muted-foreground">
                        =
                      </span>
                      <Input
                        value={param.value}
                        aria-label={`Parameter ${index + 1} value`}
                        placeholder="value"
                        onChange={(event) =>
                          setParams((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, value: event.target.value }
                                : item
                            )
                          )
                        }
                        className="font-mono text-[0.8125rem]"
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${param.key || "parameter"}`}
                        onClick={() =>
                          setParams((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index
                            )
                          )
                        }
                      >
                        <X className="size-4" aria-hidden />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="url-rebuilt">Rebuilt URL</Label>
                  <CopyButton value={rebuilt} />
                </div>
                <Textarea
                  id="url-rebuilt"
                  value={rebuilt}
                  readOnly
                  rows={3}
                  spellCheck={false}
                  className="bg-muted/40 resize-none font-mono text-[0.8125rem]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Component({
  label,
  value,
  secret,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const empty = value === "";
  return (
    <div className="border-border/40 flex items-baseline gap-4 border-b py-2 last:border-0">
      <dt className="text-muted-foreground w-24 shrink-0 text-xs font-medium">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 font-mono text-[0.8125rem] wrap-anywhere">
        {empty ? (
          <span className="text-muted-foreground font-sans italic">none</span>
        ) : secret ? (
          "•".repeat(Math.min(value.length, 12))
        ) : (
          value
        )}
      </dd>
      {!empty && !secret ? <CopyButton value={value} /> : null}
    </div>
  );
}

const DEFAULT_PORTS: Record<string, string> = {
  "http:": "80",
  "https:": "443",
  "ws:": "80",
  "wss:": "443",
  "ftp:": "21",
};

function defaultPort(protocol: string): string {
  const port = DEFAULT_PORTS[protocol];
  return port ? `${port} (default)` : "";
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/* -------------------------------- encoding -------------------------------- */

type EncodeMode = "component" | "full" | "strict";

function EncodePanel() {
  const [value, setValue] = React.useState("");
  const [mode, setMode] = React.useState<EncodeMode>("component");

  const { encoded, decoded, decodeError } = React.useMemo(() => {
    if (value === "") return { encoded: "", decoded: "", decodeError: null };

    const encode = () => {
      if (mode === "component") return encodeURIComponent(value);
      if (mode === "full") return encodeURI(value);
      return value.replace(
        /[^A-Za-z0-9\-._~]/g,
        (character) =>
          `%${character.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`
      );
    };

    let decodedValue = "";
    let error: string | null = null;
    try {
      decodedValue =
        mode === "full" ? decodeURI(value) : decodeURIComponent(value);
    } catch {
      error = "This text contains a percent sign that isn't a valid escape.";
    }

    return { encoded: encode(), decoded: decodedValue, decodeError: error };
  }, [value, mode]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="encode-input">Text or URL</Label>
            <p className="text-muted-foreground text-sm">
              Percent-encoding for query values, whole URLs, or the strict RFC
              3986 unreserved set.
            </p>
          </div>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(next) => next && setMode(next as EncodeMode)}
            aria-label="Encoding style"
          >
            <ToggleGroupItem value="component">Component</ToggleGroupItem>
            <ToggleGroupItem value="full">Whole URL</ToggleGroupItem>
            <ToggleGroupItem value="strict">Strict</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Textarea
          id="encode-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={5}
          spellCheck={false}
          placeholder="search terms & symbols?"
          className="resize-y font-mono text-[0.8125rem]"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="encoded-output">Encoded</Label>
              <CopyButton value={encoded} />
            </div>
            <Textarea
              id="encoded-output"
              value={encoded}
              readOnly
              rows={5}
              spellCheck={false}
              placeholder="The percent-encoded version appears here."
              className="bg-muted/40 resize-y font-mono text-[0.8125rem]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="decoded-output">Decoded</Label>
              <CopyButton value={decoded} />
            </div>
            <Textarea
              id="decoded-output"
              value={decodeError ? "" : decoded}
              readOnly
              rows={5}
              spellCheck={false}
              aria-invalid={decodeError !== null}
              placeholder="The decoded version appears here."
              className="bg-muted/40 resize-y font-mono text-[0.8125rem]"
            />
            {decodeError ? (
              <p role="alert" className="text-destructive text-sm">
                {decodeError}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

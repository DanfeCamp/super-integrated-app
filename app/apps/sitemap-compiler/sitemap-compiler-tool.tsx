"use client";

import { Download, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { downloadBlob, pluralize } from "@/lib/utils";

const FREQUENCIES = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const;

const PRIORITIES = ["1.0", "0.9", "0.8", "0.7", "0.5", "0.3", "0.1"] as const;

/** XML text nodes must escape these five characters. */
function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function SitemapCompilerTool() {
  const [input, setInput] = React.useState(
    "https://example.com\nhttps://example.com/about\nhttps://example.com/contact"
  );
  const [frequency, setFrequency] = React.useState<string>("weekly");
  const [priority, setPriority] = React.useState<string>("0.8");
  const [lastmod, setLastmod] = React.useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [includeLastmod, setIncludeLastmod] = React.useState(true);

  const { valid, invalid, duplicates } = React.useMemo(() => {
    const lines = input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const validUrls: string[] = [];
    const invalidLines: string[] = [];
    let duplicateCount = 0;

    for (const line of lines) {
      if (!isValidUrl(line)) {
        invalidLines.push(line);
        continue;
      }
      if (seen.has(line)) {
        duplicateCount += 1;
        continue;
      }
      seen.add(line);
      validUrls.push(line);
    }

    return {
      valid: validUrls,
      invalid: invalidLines,
      duplicates: duplicateCount,
    };
  }, [input]);

  const xml = React.useMemo(() => {
    const entries = valid
      .map((url) =>
        [
          "  <url>",
          `    <loc>${escapeXml(url)}</loc>`,
          includeLastmod && lastmod
            ? `    <lastmod>${lastmod}</lastmod>`
            : null,
          `    <changefreq>${frequency}</changefreq>`,
          `    <priority>${priority}</priority>`,
          "  </url>",
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n");

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      entries,
      "</urlset>",
    ]
      .filter((section) => section !== "")
      .join("\n");
  }, [valid, frequency, priority, lastmod, includeLastmod]);

  // Sitemaps are capped at 50,000 URLs / 50 MB by the protocol.
  const overLimit = valid.length > 50_000;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="changefreq">Change frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="changefreq">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="lastmod">Last modified</Label>
                <label className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={includeLastmod}
                    onChange={(event) =>
                      setIncludeLastmod(event.target.checked)
                    }
                    className="accent-primary size-3.5"
                  />
                  include
                </label>
              </div>
              <Input
                id="lastmod"
                type="date"
                value={lastmod}
                onChange={(event) => setLastmod(event.target.value)}
                disabled={!includeLastmod}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="sitemap-input">URLs</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={valid.length > 0 ? "success" : "muted"}>
                    {valid.length} valid
                  </Badge>
                  {invalid.length > 0 ? (
                    <Badge variant="destructive">
                      {invalid.length} invalid
                    </Badge>
                  ) : null}
                  {duplicates > 0 ? (
                    <Badge variant="warning">{duplicates} duplicate</Badge>
                  ) : null}
                </div>
              </div>
              <Textarea
                id="sitemap-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={"https://example.com\nhttps://example.com/about"}
                rows={16}
                spellCheck={false}
                className="resize-none font-mono text-[0.8125rem]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="sitemap-output">sitemap.xml</Label>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {new Blob([xml]).size.toLocaleString()} bytes
                </span>
              </div>
              <pre
                id="sitemap-output"
                tabIndex={0}
                className="bg-muted/50 focus-visible:ring-ring/40 h-[24.5rem] overflow-auto rounded-md border p-3 font-mono text-[0.75rem] leading-relaxed focus-visible:ring-[3px] focus-visible:outline-none"
              >
                <code>{xml}</code>
              </pre>
            </div>
          </div>

          {invalid.length > 0 ? (
            <Alert variant="warning">
              <TriangleAlert />
              <AlertTitle>
                {invalid.length} {pluralize(invalid.length, "line")} skipped
              </AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  These aren&apos;t valid http(s) URLs and were left out:
                </p>
                <ul className="flex flex-col gap-0.5 font-mono text-xs">
                  {invalid.slice(0, 5).map((line, index) => (
                    <li key={`${line}-${index}`} className="truncate">
                      {line}
                    </li>
                  ))}
                  {invalid.length > 5 ? (
                    <li className="text-muted-foreground">
                      …and {invalid.length - 5} more
                    </li>
                  ) : null}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          {overLimit ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>
                A single sitemap can hold at most 50,000 URLs. Split this into
                multiple files and reference them from a sitemap index.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <CopyButton value={xml} label="Copy XML" />
            <Button
              variant="outline"
              disabled={valid.length === 0}
              onClick={() =>
                downloadBlob(
                  new Blob([xml], { type: "application/xml;charset=utf-8" }),
                  "sitemap.xml"
                )
              }
            >
              <Download className="size-4" aria-hidden />
              Download sitemap.xml
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

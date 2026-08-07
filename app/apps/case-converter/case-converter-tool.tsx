"use client";

import { CornerUpLeft, Download } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { downloadBlob, pluralize } from "@/lib/utils";

import { caseDefinitions } from "./cases";

const SAMPLE = "the quick brown fox jumps over the lazy dog";

export function CaseConverterTool() {
  const [input, setInput] = React.useState("");

  const results = React.useMemo(
    () =>
      caseDefinitions.map((definition) => ({
        definition,
        value: input ? definition.convert(input) : "",
      })),
    [input]
  );

  const characters = input.length;
  const wordCount = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="case-input">Your text</Label>
            <span className="text-muted-foreground text-xs tabular-nums">
              {characters.toLocaleString()} {pluralize(characters, "character")}{" "}
              · {wordCount.toLocaleString()} {pluralize(wordCount, "word")}
            </span>
          </div>
          <Textarea
            id="case-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type or paste text — every case is converted at once."
            rows={5}
            className="resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput(SAMPLE)}
              disabled={input === SAMPLE}
            >
              Load sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
              disabled={!input}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map(({ definition, value }) => (
          <Card key={definition.id} className="overflow-hidden">
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <h2 className="text-sm font-semibold">{definition.name}</h2>
                  <p className="text-muted-foreground truncate text-xs">
                    {definition.example}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={!value}
                    aria-label={`Replace the input with ${definition.name}`}
                    title="Use as input"
                    onClick={() => setInput(value)}
                  >
                    <CornerUpLeft className="size-4" aria-hidden />
                  </Button>
                  <CopyButton value={value} />
                </div>
              </div>
              <p
                className="bg-muted/40 max-h-32 min-h-11 overflow-y-auto rounded-md px-3 py-2 font-mono text-[0.8125rem] wrap-anywhere whitespace-pre-wrap"
                aria-label={`${definition.name} result`}
              >
                {value || (
                  <span className="text-muted-foreground font-sans italic">
                    Waiting for text…
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={!input}
          onClick={() =>
            downloadBlob(
              new Blob(
                [
                  results
                    .map(
                      ({ definition, value }) =>
                        `${definition.name}\n${value}\n`
                    )
                    .join("\n"),
                ],
                { type: "text/plain;charset=utf-8" }
              ),
              "case-conversions.txt"
            )
          }
        >
          <Download className="size-4" aria-hidden />
          Download all
        </Button>
      </div>
    </div>
  );
}

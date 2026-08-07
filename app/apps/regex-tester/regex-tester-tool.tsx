"use client";

import { Regex, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn, pluralize } from "@/lib/utils";

/** Matching stops here so a runaway global pattern can't lock the tab up. */
const MAX_MATCHES = 2000;

const FLAGS: { flag: string; label: string; hint: string }[] = [
  { flag: "g", label: "global", hint: "Find every match, not just the first" },
  { flag: "i", label: "ignore case", hint: "Match regardless of letter case" },
  { flag: "m", label: "multiline", hint: "^ and $ match at each line break" },
  { flag: "s", label: "dotall", hint: ". also matches newlines" },
  {
    flag: "u",
    label: "unicode",
    hint: "Treat the pattern as Unicode code points",
  },
  { flag: "y", label: "sticky", hint: "Match only from lastIndex" },
];

const CHEATSHEET: { token: string; meaning: string }[] = [
  { token: ".", meaning: "Any character except a newline" },
  { token: "\\d \\w \\s", meaning: "Digit, word character, whitespace" },
  { token: "\\D \\W \\S", meaning: "The negation of each" },
  { token: "[abc]", meaning: "Any one of a, b or c" },
  { token: "[^abc]", meaning: "Anything except a, b or c" },
  { token: "a? a* a+", meaning: "Zero or one, zero or more, one or more" },
  { token: "a{2,4}", meaning: "Between two and four times" },
  { token: "a+?", meaning: "Lazy — match as few as possible" },
  { token: "^ $", meaning: "Start and end of the string (or line with m)" },
  { token: "\\b", meaning: "Word boundary" },
  { token: "(abc)", meaning: "Capture group" },
  { token: "(?:abc)", meaning: "Group without capturing" },
  { token: "(?<name>abc)", meaning: "Named capture group" },
  { token: "a|b", meaning: "Either a or b" },
  { token: "(?=abc)", meaning: "Lookahead — followed by" },
  { token: "(?<=abc)", meaning: "Lookbehind — preceded by" },
];

const SAMPLE_PATTERN = "(\\w+)@(\\w+\\.[a-z]{2,})";
const SAMPLE_TEXT = `Contact ada@example.com or grace@navy.mil for access.
Invalid: not-an-email, another@bad.
Support: help@sia.tools`;

interface MatchInfo {
  index: number;
  value: string;
  groups: (string | undefined)[];
  named: Record<string, string | undefined>;
}

export function RegexTesterTool() {
  const [pattern, setPattern] = React.useState("");
  const [flags, setFlags] = React.useState<string[]>(["g"]);
  const [text, setText] = React.useState("");
  const [replacement, setReplacement] = React.useState("");

  const debouncedPattern = useDebouncedValue(pattern, 200);
  const debouncedText = useDebouncedValue(text, 200);
  const flagString = flags.join("");

  const { matches, error, truncated, regex } = React.useMemo(() => {
    if (debouncedPattern === "") {
      return { matches: [], error: null, truncated: false, regex: null };
    }

    let compiled: RegExp;
    try {
      compiled = new RegExp(debouncedPattern, flagString);
    } catch (caught) {
      return {
        matches: [],
        truncated: false,
        regex: null,
        error: caught instanceof Error ? caught.message : "Invalid pattern.",
      };
    }

    if (debouncedText === "") {
      return { matches: [], error: null, truncated: false, regex: compiled };
    }

    const found: MatchInfo[] = [];
    let hitLimit = false;

    if (compiled.global || compiled.sticky) {
      const scanner = new RegExp(debouncedPattern, flagString);
      let match: RegExpExecArray | null;
      while ((match = scanner.exec(debouncedText)) !== null) {
        found.push(toMatchInfo(match));
        // A zero-length match would otherwise spin forever on one index.
        if (match[0] === "") scanner.lastIndex += 1;
        if (found.length >= MAX_MATCHES) {
          hitLimit = true;
          break;
        }
      }
    } else {
      const match = compiled.exec(debouncedText);
      if (match) found.push(toMatchInfo(match));
    }

    return {
      matches: found,
      error: null,
      truncated: hitLimit,
      regex: compiled,
    };
  }, [debouncedPattern, debouncedText, flagString]);

  const replaced = React.useMemo(() => {
    if (!regex || debouncedText === "") return "";
    try {
      return debouncedText.replace(regex, replacement);
    } catch {
      return "";
    }
  }, [regex, debouncedText, replacement]);

  const toggleFlag = (flag: string) =>
    setFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag]
    );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="regex-pattern">Pattern</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPattern(SAMPLE_PATTERN);
                  setText(SAMPLE_TEXT);
                  setFlags(["g"]);
                }}
              >
                Load sample
              </Button>
            </div>
            <div className="border-input bg-background focus-within:border-ring focus-within:ring-ring/40 flex items-center rounded-md border shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]">
              <span
                aria-hidden
                className="text-muted-foreground pl-3 font-mono"
              >
                /
              </span>
              <Input
                id="regex-pattern"
                value={pattern}
                onChange={(event) => setPattern(event.target.value)}
                placeholder="\\b\\w+@\\w+\\.\\w{2,}\\b"
                spellCheck={false}
                aria-invalid={error !== null}
                className="border-0 font-mono shadow-none focus-visible:ring-0"
              />
              <span
                aria-hidden
                className="text-muted-foreground pr-3 font-mono"
              >
                /{flagString}
              </span>
            </div>
          </div>

          <fieldset className="flex flex-wrap gap-x-5 gap-y-3">
            <legend className="sr-only">Flags</legend>
            {FLAGS.map((item) => (
              <div key={item.flag} className="flex items-center gap-2">
                <Switch
                  id={`flag-${item.flag}`}
                  checked={flags.includes(item.flag)}
                  onCheckedChange={() => toggleFlag(item.flag)}
                />
                <Label
                  htmlFor={`flag-${item.flag}`}
                  className="text-sm font-normal"
                  title={item.hint}
                >
                  <code className="font-mono font-semibold">{item.flag}</code>
                  <span className="text-muted-foreground max-sm:hidden">
                    {item.label}
                  </span>
                </Label>
              </div>
            ))}
          </fieldset>

          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="regex-text">Test string</Label>
              <span className="text-muted-foreground text-xs tabular-nums">
                {matches.length}
                {truncated ? "+" : ""}{" "}
                {pluralize(matches.length, "match", "matches")}
              </span>
            </div>
            <Textarea
              id="regex-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={10}
              spellCheck={false}
              placeholder="Paste the text you want to test the pattern against."
              className="resize-y font-mono text-[0.8125rem]"
            />

            <Label>Highlighted</Label>
            <div className="border-input bg-muted/40 max-h-72 overflow-auto rounded-md border p-3 font-mono text-[0.8125rem] whitespace-pre-wrap">
              {debouncedText === "" ? (
                <span className="text-muted-foreground font-sans italic">
                  Matches are highlighted here as you type.
                </span>
              ) : (
                <Highlighted text={debouncedText} matches={matches} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Tabs defaultValue="matches" className="flex flex-col gap-3">
              <TabsList>
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="replace">Replace</TabsTrigger>
                <TabsTrigger value="reference">Reference</TabsTrigger>
              </TabsList>

              <TabsContent value="matches" className="flex flex-col gap-3">
                {truncated ? (
                  <Alert variant="warning">
                    <TriangleAlert />
                    <AlertDescription>
                      Stopped after {MAX_MATCHES} matches to keep the page
                      responsive.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {matches.length === 0 ? (
                  <EmptyState
                    icon={Regex}
                    title={
                      debouncedPattern === ""
                        ? "No pattern yet"
                        : debouncedText === ""
                          ? "No test string yet"
                          : "No matches"
                    }
                    description={
                      debouncedPattern === ""
                        ? "Write a pattern above to start matching."
                        : debouncedText === ""
                          ? "Add some text to test the pattern against."
                          : "The pattern is valid but doesn't match anything in this text."
                    }
                  />
                ) : (
                  <ol className="flex max-h-120 flex-col gap-3 overflow-y-auto">
                    {matches.map((match, index) => (
                      <li
                        key={`${match.index}-${index}`}
                        className="border-border/60 flex flex-col gap-2 rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="muted">#{index + 1}</Badge>
                          <span className="text-muted-foreground text-xs tabular-nums">
                            index {match.index}–
                            {match.index + match.value.length}
                          </span>
                          <CopyButton value={match.value} className="ml-auto" />
                        </div>
                        <code className="bg-muted/60 rounded px-2 py-1 font-mono text-[0.8125rem] wrap-anywhere">
                          {match.value || "(empty match)"}
                        </code>

                        {match.groups.length > 0 ? (
                          <dl className="flex flex-col gap-1 text-xs">
                            {match.groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="flex gap-2">
                                <dt className="text-muted-foreground w-16 shrink-0">
                                  Group {groupIndex + 1}
                                </dt>
                                <dd className="font-mono wrap-anywhere">
                                  {group === undefined ? (
                                    <span className="text-muted-foreground italic">
                                      undefined
                                    </span>
                                  ) : (
                                    group
                                  )}
                                </dd>
                              </div>
                            ))}
                            {Object.entries(match.named).map(
                              ([name, value]) => (
                                <div key={name} className="flex gap-2">
                                  <dt className="text-muted-foreground w-16 shrink-0 truncate">
                                    {name}
                                  </dt>
                                  <dd className="font-mono wrap-anywhere">
                                    {value ?? (
                                      <span className="text-muted-foreground italic">
                                        undefined
                                      </span>
                                    )}
                                  </dd>
                                </div>
                              )
                            )}
                          </dl>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                )}
              </TabsContent>

              <TabsContent value="replace" className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="regex-replacement">Replacement</Label>
                  <Input
                    id="regex-replacement"
                    value={replacement}
                    onChange={(event) => setReplacement(event.target.value)}
                    placeholder="$1 at $2"
                    spellCheck={false}
                    className="font-mono"
                  />
                  <p className="text-muted-foreground text-xs">
                    Use <code className="font-mono">$1</code>,{" "}
                    <code className="font-mono">$2</code> for numbered groups,{" "}
                    <code className="font-mono">$&lt;name&gt;</code> for named
                    ones and <code className="font-mono">$&amp;</code> for the
                    whole match.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Label>Result</Label>
                  <CopyButton value={replaced} />
                </div>
                <div className="border-input bg-muted/40 max-h-80 overflow-auto rounded-md border p-3 font-mono text-[0.8125rem] whitespace-pre-wrap">
                  {replaced || (
                    <span className="text-muted-foreground font-sans italic">
                      The replaced text appears here.
                    </span>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reference">
                <dl className="max-h-120 overflow-y-auto">
                  {CHEATSHEET.map((entry) => (
                    <div
                      key={entry.token}
                      className="border-border/40 flex gap-4 border-b py-2 text-sm last:border-0"
                    >
                      <dt className="w-32 shrink-0 font-mono text-[0.8125rem]">
                        {entry.token}
                      </dt>
                      <dd className="text-muted-foreground">{entry.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function toMatchInfo(match: RegExpExecArray): MatchInfo {
  return {
    index: match.index,
    value: match[0],
    groups: match.slice(1),
    named: { ...(match.groups ?? {}) },
  };
}

function Highlighted({
  text,
  matches,
}: {
  text: string;
  matches: MatchInfo[];
}) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    // Overlapping or out-of-order matches can't happen with exec, but a stale
    // render could still hand us one — skip rather than render garbage.
    if (match.index < cursor) return;
    if (match.index > cursor) {
      parts.push(
        <React.Fragment key={`text-${cursor}`}>
          {text.slice(cursor, match.index)}
        </React.Fragment>
      );
    }
    parts.push(
      <mark
        key={`match-${index}`}
        className={cn(
          "bg-primary/25 text-foreground rounded-sm",
          match.value === "" && "border-primary border-l-2"
        )}
      >
        {match.value}
      </mark>
    );
    cursor = match.index + match.value.length;
  });

  if (cursor < text.length) {
    parts.push(
      <React.Fragment key="tail">{text.slice(cursor)}</React.Fragment>
    );
  }

  return <>{parts}</>;
}

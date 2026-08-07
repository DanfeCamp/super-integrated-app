"use client";

import { FileText } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

import {
  analyze,
  formatDuration,
  readingEaseLabel,
  type TextStats,
} from "./analyze";

const SAMPLE = `The best writing is rewriting. A first draft exists to be cut, reordered and sharpened — nobody gets it right in one pass.

Read what you wrote out loud. Sentences that make you run out of breath are too long, and words you stumble over are usually the wrong words. Trust that reaction; it is faster than any style guide.`;

export function WordCounterTool() {
  const [text, setText] = React.useState("");
  // Typing stays instant while the heavier per-word analysis trails slightly.
  const debounced = useDebouncedValue(text, 150);
  const stats = React.useMemo(() => analyze(debounced), [debounced]);

  const hasText = debounced.trim() !== "";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="word-counter-input">Your text</Label>
            <div className="flex items-center gap-1">
              {!text ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setText(SAMPLE)}
                >
                  Load sample
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setText("")}>
                  Clear
                </Button>
              )}
              <CopyButton value={text} />
            </div>
          </div>
          <Textarea
            id="word-counter-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste or type your text — the counts update as you go."
            rows={20}
            className="resize-y leading-relaxed"
          />
          <p className="text-muted-foreground text-xs">
            Nothing is uploaded. The text stays in this tab and is gone when you
            close it.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Headline label="Words" value={stats.words} />
              <Headline label="Characters" value={stats.characters} />
              <Small
                label="Characters (no spaces)"
                value={stats.charactersNoSpaces}
              />
              <Small label="Unique words" value={stats.uniqueWords} />
              <Small label="Sentences" value={stats.sentences} />
              <Small label="Paragraphs" value={stats.paragraphs} />
              <Small label="Lines" value={stats.lines} />
              <Small label="Syllables" value={stats.syllables} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Reading</h2>
            <dl className="grid grid-cols-2 gap-4">
              <Small
                label="Reading time"
                text={formatDuration(stats.readingMinutes)}
              />
              <Small
                label="Speaking time"
                text={formatDuration(stats.speakingMinutes)}
              />
              <Small
                label="Avg. word length"
                text={`${stats.averageWordLength.toFixed(1)} chars`}
              />
              <Small
                label="Avg. sentence"
                text={`${stats.averageSentenceLength.toFixed(1)} words`}
              />
            </dl>
            <Readability stats={stats} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Top keywords</h2>
            {stats.keywords.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {stats.keywords.map((keyword) => (
                  <li key={keyword.word} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="truncate font-medium">
                        {keyword.word}
                      </span>
                      <span className="text-muted-foreground shrink-0 tabular-nums">
                        {keyword.count} · {keyword.density.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (keyword.count / stats.keywords[0]!.count) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={FileText}
                title={hasText ? "No keywords yet" : "Nothing to count"}
                description={
                  hasText
                    ? "Common filler words are excluded, so short text often has none."
                    : "Start typing and the breakdown appears here."
                }
                className="py-8"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Readability({ stats }: { stats: TextStats }) {
  if (stats.readingEase === null) {
    return (
      <p className="text-muted-foreground border-border/60 border-t pt-4 text-xs">
        Readability scores need at least 25 words and one full sentence.
      </p>
    );
  }

  const score = Math.max(0, Math.min(100, stats.readingEase));

  return (
    <div className="border-border/60 flex flex-col gap-2 border-t pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground text-xs font-medium">
          Reading ease
        </span>
        <span className="text-sm font-semibold tabular-nums">
          {Math.round(stats.readingEase)}/100
        </span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            score >= 60
              ? "bg-success"
              : score >= 30
                ? "bg-warning"
                : "bg-destructive"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        {readingEaseLabel(stats.readingEase)} · Flesch–Kincaid grade{" "}
        {Math.max(0, stats.gradeLevel ?? 0).toFixed(1)}
      </p>
    </div>
  );
}

function Headline({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col-reverse gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="text-3xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </dd>
    </div>
  );
}

function Small({
  label,
  value,
  text,
}: {
  label: string;
  value?: number;
  text?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="text-base font-semibold tabular-nums">
        {text ?? (value ?? 0).toLocaleString()}
      </dd>
    </div>
  );
}

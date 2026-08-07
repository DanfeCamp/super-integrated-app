"use client";

import { CalendarClock, RefreshCw, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

import {
  describeCron,
  FIELD_ORDER,
  nextRuns,
  parseCron,
  PRESETS,
  summariseValues,
  type ParsedCron,
} from "./cron";

const RUN_COUNT = 8;

export function CronHelperTool() {
  const mounted = useMounted();
  const [expression, setExpression] = React.useState("*/15 9-17 * * 1-5");
  // Bumping this recomputes the schedule against the current clock.
  const [tick, setTick] = React.useState(0);

  const { cron, error } = React.useMemo(() => {
    if (expression.trim() === "") return { cron: null, error: null };
    try {
      return { cron: parseCron(expression), error: null };
    } catch (caught) {
      return {
        cron: null,
        error:
          caught instanceof Error
            ? caught.message
            : "That expression can't be read.",
      };
    }
  }, [expression]);

  const runs = React.useMemo(() => {
    if (!cron || !mounted) return [];
    void tick;
    return nextRuns(cron, RUN_COUNT);
  }, [cron, mounted, tick]);

  const timezone = mounted
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="cron-expression">Cron expression</Label>
              <CopyButton value={expression} />
            </div>
            <Input
              id="cron-expression"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              placeholder="*/5 * * * *"
              spellCheck={false}
              aria-invalid={error !== null}
              aria-describedby="cron-format"
              className="h-11 font-mono text-base"
            />
            <p id="cron-format" className="text-muted-foreground text-xs">
              Five fields (minute hour day-of-month month day-of-week), or six
              with a leading seconds field. Aliases like{" "}
              <code className="font-mono">@daily</code> work too.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.expression}
                type="button"
                onClick={() => setExpression(preset.expression)}
                className={cn(
                  "focus-visible:ring-ring/45 rounded-full border px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-[3px]",
                  preset.expression === expression.trim()
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : cron ? (
            <div className="bg-primary/5 border-primary/15 flex flex-col gap-1 rounded-xl border p-5">
              <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                In plain English
              </span>
              <p aria-live="polite" className="text-lg font-medium text-pretty">
                {describeCron(cron)}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {cron ? (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Next {RUN_COUNT} runs</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTick((value) => value + 1)}
                >
                  <RefreshCw className="size-4" aria-hidden />
                  Refresh
                </Button>
              </div>

              {!mounted ? (
                <ul className="flex flex-col gap-2">
                  {Array.from({ length: RUN_COUNT }, (_, index) => (
                    <li key={index}>
                      <Skeleton className="h-8 w-full" />
                    </li>
                  ))}
                </ul>
              ) : runs.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="This expression never fires"
                  description="No matching date was found in the next eight years — check the day-of-month and month fields."
                />
              ) : (
                <ol className="flex flex-col">
                  {runs.map((run, index) => (
                    <li
                      key={run.toISOString()}
                      className="border-border/40 flex items-baseline justify-between gap-3 border-b py-2 last:border-0"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="text-muted-foreground w-5 text-xs tabular-nums">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium tabular-nums">
                          {run.toLocaleString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            ...(cron.hasSeconds ? { second: "2-digit" } : {}),
                          })}
                        </span>
                      </span>
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {formatGap(run)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {timezone ? (
                <p className="text-muted-foreground text-xs">
                  Times are shown in your timezone ({timezone}). A server
                  running this job may use UTC instead.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Field breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/60 text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Field
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Value
                      </th>
                      <th scope="col" className="py-2 font-medium">
                        Matches
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIELD_ORDER.filter(
                      (field) => cron.hasSeconds || field.key !== "second"
                    ).map((field) => (
                      <tr
                        key={field.key}
                        className="border-border/40 border-b last:border-0"
                      >
                        <th
                          scope="row"
                          className="py-2 pr-4 text-left align-top font-medium"
                        >
                          {field.label}
                          <span className="text-muted-foreground block text-xs font-normal">
                            {field.range}
                          </span>
                        </th>
                        <td className="py-2 pr-4 align-top">
                          <Badge variant="muted" className="font-mono">
                            {cronField(cron, field.key).raw}
                          </Badge>
                        </td>
                        <td className="text-muted-foreground py-2 align-top text-xs">
                          {summariseValues(
                            cronField(cron, field.key),
                            field.key
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function cronField(cron: ParsedCron, key: (typeof FIELD_ORDER)[number]["key"]) {
  return cron[key];
}

const GAP_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
  ["second", 1000],
];

function formatGap(date: Date): string {
  const delta = date.getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, size] of GAP_UNITS) {
    if (Math.abs(delta) >= size || unit === "second") {
      return formatter.format(Math.round(delta / size), unit);
    }
  }
  return "now";
}

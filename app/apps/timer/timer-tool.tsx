"use client";

import { Flag, Pause, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

interface Lap {
  index: number;
  /** Time since the previous lap. */
  split: number;
  /** Time since the stopwatch started. */
  total: number;
}

function format(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
    centis: String(Math.floor((ms % 1000) / 10)).padStart(2, "0"),
  };
}

function formatFlat(ms: number) {
  const { hours, minutes, seconds, centis } = format(ms);
  return `${hours}:${minutes}:${seconds}.${centis}`;
}

export function TimerTool() {
  const [elapsed, setElapsed] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [laps, setLaps] = React.useState<Lap[]>([]);

  // Anchor on wall-clock time rather than accumulating interval ticks: a
  // `setInterval` counter drifts badly and stalls entirely in background tabs.
  const startedAt = React.useRef(0);
  const offset = React.useRef(0);
  const frame = React.useRef<number>(0);

  React.useEffect(() => {
    if (!running) return;

    startedAt.current = performance.now();
    const tick = () => {
      setElapsed(offset.current + (performance.now() - startedAt.current));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame.current);
  }, [running]);

  const toggle = React.useCallback(() => {
    setRunning((wasRunning) => {
      if (wasRunning) {
        offset.current += performance.now() - startedAt.current;
        setElapsed(offset.current);
      }
      return !wasRunning;
    });
  }, []);

  const reset = React.useCallback(() => {
    setRunning(false);
    offset.current = 0;
    setElapsed(0);
    setLaps([]);
  }, []);

  const recordLap = React.useCallback(() => {
    if (!running) return;
    setLaps((previous) => {
      const last = previous[0];
      return [
        {
          index: previous.length + 1,
          split: elapsed - (last?.total ?? 0),
          total: elapsed,
        },
        ...previous,
      ];
    });
  }, [running, elapsed]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "BUTTON"].includes(target?.tagName ?? "")
      ) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      } else if (event.key.toLowerCase() === "l") {
        event.preventDefault();
        recordLap();
      } else if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        reset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, recordLap, reset]);

  const time = format(elapsed);

  const fastest =
    laps.length > 1
      ? Math.min(...laps.map((lap) => lap.split))
      : Number.NEGATIVE_INFINITY;
  const slowest =
    laps.length > 1
      ? Math.max(...laps.map((lap) => lap.split))
      : Number.POSITIVE_INFINITY;

  const lapsAsText = laps
    .slice()
    .reverse()
    .map(
      (lap) =>
        `Lap ${lap.index}\t${formatFlat(lap.split)}\t${formatFlat(lap.total)}`
    )
    .join("\n");

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-start">
      <Card>
        <CardContent className="flex flex-col items-center gap-8 py-12 sm:py-16">
          <div
            className="flex items-baseline gap-1 font-mono tabular-nums"
            role="timer"
            aria-live="off"
            aria-label={`Elapsed time ${time.hours} hours ${time.minutes} minutes ${time.seconds} seconds`}
          >
            <Digit value={time.hours} label="hr" />
            <Colon />
            <Digit value={time.minutes} label="min" />
            <Colon />
            <Digit value={time.seconds} label="sec" />
            <span className="text-muted-foreground text-2xl font-medium sm:text-4xl">
              .{time.centis}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={toggle} className="min-w-32">
              {running ? (
                <>
                  <Pause className="size-4" aria-hidden />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" aria-hidden />
                  {elapsed > 0 ? "Resume" : "Start"}
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={recordLap}
              disabled={!running}
            >
              <Flag className="size-4" aria-hidden />
              Lap
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={reset}
              disabled={elapsed === 0 && laps.length === 0}
            >
              <RotateCcw className="size-4" aria-hidden />
              Reset
            </Button>
          </div>

          <p className="text-muted-foreground hidden text-xs sm:block">
            <Kbd>Space</Kbd> start/pause · <Kbd>L</Kbd> lap · <Kbd>R</Kbd> reset
          </p>
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-24">
        <CardContent className="flex max-h-[30rem] flex-col p-0">
          <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
            <h2 className="text-sm font-semibold">
              Laps{laps.length > 0 ? ` (${laps.length})` : ""}
            </h2>
            {laps.length > 0 ? (
              <CopyButton value={lapsAsText} label="Copy" />
            ) : null}
          </div>

          {laps.length === 0 ? (
            <EmptyState
              icon={TimerIcon}
              title="No laps recorded"
              description="Start the stopwatch and press Lap to capture split times."
              className="py-10"
            />
          ) : (
            <div className="overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                  <tr>
                    <th scope="col" className="px-5 py-2 text-left font-medium">
                      Lap
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-2 text-right font-medium"
                    >
                      Split
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-2 text-right font-medium"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {laps.map((lap) => (
                    <tr key={lap.index} className="border-t">
                      <th
                        scope="row"
                        className="px-5 py-2.5 text-left font-normal"
                      >
                        {lap.index}
                        {lap.split === fastest ? (
                          <span className="text-success ml-1.5 text-xs">
                            fastest
                          </span>
                        ) : null}
                        {lap.split === slowest ? (
                          <span className="text-destructive ml-1.5 text-xs">
                            slowest
                          </span>
                        ) : null}
                      </th>
                      <td
                        className={cn(
                          "px-5 py-2.5 text-right font-mono tabular-nums",
                          lap.split === fastest && "text-success",
                          lap.split === slowest && "text-destructive"
                        )}
                      >
                        {formatFlat(lap.split)}
                      </td>
                      <td className="text-muted-foreground px-5 py-2.5 text-right font-mono tabular-nums">
                        {formatFlat(lap.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Digit({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex flex-col items-center">
      <span className="text-5xl font-semibold sm:text-7xl">{value}</span>
      <span className="text-muted-foreground mt-1 font-sans text-[0.625rem] tracking-[0.2em] uppercase">
        {label}
      </span>
    </span>
  );
}

function Colon() {
  return (
    <span
      aria-hidden
      className="text-muted-foreground/50 -translate-y-3 text-4xl font-light sm:text-6xl"
    >
      :
    </span>
  );
}

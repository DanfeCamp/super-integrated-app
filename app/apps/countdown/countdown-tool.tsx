"use client";

import { Bell, Pause, Play, RotateCcw } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "1 min", ms: 60_000 },
  { label: "5 min", ms: 5 * 60_000 },
  { label: "10 min", ms: 10 * 60_000 },
  { label: "25 min", ms: 25 * 60_000 },
  { label: "1 hour", ms: 60 * 60_000 },
] as const;

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Parts {
  hours: number;
  minutes: number;
  seconds: number;
}

function toParts(ms: number): Parts {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** A short two-tone chime built with the Web Audio API — no asset to load. */
function playChime() {
  try {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return;

    const context = new AudioCtor();
    [880, 1174.7].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      const start = context.currentTime + index * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);

      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.55);
    });

    setTimeout(() => void context.close(), 1500);
  } catch {
    // Autoplay policy or unsupported browser — the toast still fires.
  }
}

export function CountdownTool() {
  const [duration, setDuration] = React.useState(5 * 60_000);
  const [remaining, setRemaining] = React.useState(5 * 60_000);
  const [running, setRunning] = React.useState(false);
  const [finished, setFinished] = React.useState(false);

  // Deadline-based, so the countdown stays accurate across tab throttling.
  const deadline = React.useRef(0);
  const frame = React.useRef<number>(0);

  React.useEffect(() => {
    if (!running) return;

    deadline.current = Date.now() + remaining;

    const tick = () => {
      const next = deadline.current - Date.now();
      if (next <= 0) {
        setRemaining(0);
        setRunning(false);
        setFinished(true);
        playChime();
        toast.success("Time's up!", {
          description: "Your countdown has finished.",
          duration: 8000,
        });
        return;
      }
      setRemaining(next);
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // `remaining` is read once to set the deadline; re-running on every tick
    // would reset it continuously.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Mirror the countdown in the tab title so it's visible while backgrounded.
  React.useEffect(() => {
    const original = document.title;
    if (running) {
      const { hours, minutes, seconds } = toParts(remaining);
      document.title = `${hours > 0 ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds)} — Countdown`;
    }
    return () => {
      document.title = original;
    };
  }, [running, remaining]);

  const parts = toParts(remaining);
  const progress = duration > 0 ? remaining / duration : 0;

  const setField = (field: keyof Parts, value: string) => {
    const parsed = Math.max(0, Number.parseInt(value, 10) || 0);
    const next = { ...toParts(duration), [field]: parsed };
    const ms =
      (next.hours * 3600 +
        Math.min(next.minutes, 59) * 60 +
        Math.min(next.seconds, 59)) *
      1000;
    setDuration(ms);
    setRemaining(ms);
    setFinished(false);
  };

  const applyPreset = (ms: number) => {
    setRunning(false);
    setDuration(ms);
    setRemaining(ms);
    setFinished(false);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(duration);
    setFinished(false);
  };

  const canStart = remaining > 0;
  const editing = !running;
  const editParts = toParts(
    running || remaining !== duration ? duration : duration
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col items-center gap-8 py-10 sm:py-14">
          <div className="relative grid place-items-center">
            <svg
              width="280"
              height="280"
              viewBox="0 0 280 280"
              className="-rotate-90"
              aria-hidden
            >
              <circle
                cx="140"
                cy="140"
                r={RADIUS}
                fill="none"
                strokeWidth="10"
                className="stroke-muted"
              />
              <circle
                cx="140"
                cy="140"
                r={RADIUS}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                className={cn(
                  "transition-[stroke-dashoffset,stroke] duration-200 ease-linear",
                  finished
                    ? "stroke-success"
                    : remaining <= 10_000 && running
                      ? "stroke-destructive"
                      : "stroke-primary"
                )}
              />
            </svg>

            <div
              className="absolute flex flex-col items-center gap-1"
              role="timer"
              aria-live="off"
            >
              <span
                className={cn(
                  "font-mono text-4xl font-semibold tabular-nums sm:text-5xl",
                  remaining <= 10_000 && running && "text-destructive"
                )}
              >
                {parts.hours > 0 ? `${pad(parts.hours)}:` : ""}
                {pad(parts.minutes)}:{pad(parts.seconds)}
              </span>
              <span className="text-muted-foreground text-xs">
                {finished
                  ? "Finished"
                  : running
                    ? "Counting down"
                    : remaining === duration
                      ? "Ready"
                      : "Paused"}
              </span>
            </div>
          </div>

          {editing ? (
            <fieldset className="flex items-end gap-2">
              <legend className="sr-only">Countdown duration</legend>
              <TimeField
                id="hours"
                label="Hours"
                value={editParts.hours}
                max={99}
                onChange={(value) => setField("hours", value)}
              />
              <Separator />
              <TimeField
                id="minutes"
                label="Minutes"
                value={editParts.minutes}
                max={59}
                onChange={(value) => setField("minutes", value)}
              />
              <Separator />
              <TimeField
                id="seconds"
                label="Seconds"
                value={editParts.seconds}
                max={59}
                onChange={(value) => setField("seconds", value)}
              />
            </fieldset>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => {
                setFinished(false);
                setRunning((previous) => !previous);
              }}
              disabled={!canStart}
              className="min-w-32"
            >
              {running ? (
                <>
                  <Pause className="size-4" aria-hidden />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" aria-hidden />
                  {remaining === duration ? "Start" : "Resume"}
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={reset}
              disabled={remaining === duration && !finished}
            >
              <RotateCcw className="size-4" aria-hidden />
              Reset
            </Button>
          </div>

          {finished ? (
            <p
              role="status"
              className="text-success flex items-center gap-2 text-sm font-medium"
            >
              <Bell className="animate-pop size-4" aria-hidden />
              Countdown complete
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          Presets:
        </span>
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset.ms)}
            aria-pressed={duration === preset.ms}
            className={
              duration === preset.ms ? "border-primary text-primary" : undefined
            }
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function TimeField({
  id,
  label,
  value,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  max: number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Label htmlFor={id} className="text-muted-foreground text-xs">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={pad(value)}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-18 text-center font-mono text-lg tabular-nums"
      />
    </div>
  );
}

function Separator() {
  return (
    <span
      aria-hidden
      className="text-muted-foreground/50 pb-3 text-xl font-light"
    >
      :
    </span>
  );
}

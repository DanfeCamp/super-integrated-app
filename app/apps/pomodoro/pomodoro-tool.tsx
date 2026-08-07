"use client";

import { Pause, Play, RotateCcw, Settings2, SkipForward } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMounted } from "@/hooks/use-mounted";
import { clamp, cn } from "@/lib/utils";

type Phase = "focus" | "short" | "long";

interface Settings {
  focus: number;
  short: number;
  long: number;
  /** Focus sessions completed before a long break is offered. */
  roundsBeforeLong: number;
  autoStart: boolean;
}

interface DailyLog {
  /** Local `YYYY-MM-DD`, so the counter resets at the user's midnight. */
  date: string;
  completed: number;
}

const DEFAULTS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  roundsBeforeLong: 4,
  autoStart: false,
};

const PHASES: Record<
  Phase,
  { label: string; blurb: string; ring: string; tint: string }
> = {
  focus: {
    label: "Focus",
    blurb: "One task, no tabs.",
    ring: "stroke-primary",
    tint: "bg-primary/5 border-primary/15",
  },
  short: {
    label: "Short break",
    blurb: "Stand up, look away from the screen.",
    ring: "stroke-success",
    tint: "bg-success/5 border-success/20",
  },
  long: {
    label: "Long break",
    blurb: "You've earned a proper pause.",
    ring: "stroke-warning",
    tint: "bg-warning/5 border-warning/20",
  },
};

const RADIUS = 116;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatClock(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** Two short tones — a rising pair to start work, a falling pair to stop. */
function playChime(rising: boolean) {
  try {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return;

    const context = new AudioCtor();
    const notes = rising ? [660, 990] : [990, 660];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      const start = context.currentTime + index * 0.2;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);

      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.6);
    });

    setTimeout(() => void context.close(), 1600);
  } catch {
    // Autoplay blocked or Web Audio unavailable — the toast still fires.
  }
}

export function PomodoroTool() {
  const mounted = useMounted();
  const [settings, setSettings] = useLocalStorage<Settings>(
    "sia:pomodoro:settings",
    DEFAULTS
  );
  const [log, setLog] = useLocalStorage<DailyLog>("sia:pomodoro:log", {
    date: todayKey(),
    completed: 0,
  });

  const [phase, setPhase] = React.useState<Phase>("focus");
  const [remaining, setRemaining] = React.useState(DEFAULTS.focus * 60_000);
  const [running, setRunning] = React.useState(false);
  const [round, setRound] = React.useState(1);
  const [task, setTask] = React.useState("");
  const [showSettings, setShowSettings] = React.useState(false);

  const deadline = React.useRef(0);
  const frame = React.useRef(0);
  // The advance callback is stored in a ref so the rAF loop can call the latest
  // version without restarting the timer on every render.
  const onComplete = React.useRef<() => void>(() => {});

  const duration = settings[phase] * 60_000;
  const completedToday = log.date === todayKey() ? log.completed : 0;

  // A stale counter from a previous day is rewritten once, after hydration.
  React.useEffect(() => {
    if (log.date !== todayKey()) setLog({ date: todayKey(), completed: 0 });
  }, [log.date, setLog]);

  /**
   * Editing the duration of the phase you're sitting on should move the clock
   * with it — otherwise the setting looks like it did nothing. Only while
   * paused: nobody wants their running session silently restarted.
   */
  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
    if (!running && key === phase && typeof value === "number") {
      setRemaining(value * 60_000);
    }
  };

  const advance = React.useCallback(() => {
    if (phase === "focus") {
      const completed = completedToday + 1;
      setLog({ date: todayKey(), completed });

      const isLong = round % settings.roundsBeforeLong === 0;
      const next: Phase = isLong ? "long" : "short";
      setPhase(next);
      setRemaining(settings[next] * 60_000);
      setRunning(settings.autoStart);
      playChime(false);
      toast.success("Focus session complete", {
        description: isLong
          ? `Round ${round} done — take a ${settings.long} minute break.`
          : `Take ${settings.short} minutes.`,
      });
      return;
    }

    setRound((current) => (phase === "long" ? 1 : current + 1));
    setPhase("focus");
    setRemaining(settings.focus * 60_000);
    setRunning(settings.autoStart);
    playChime(true);
    toast("Break over", { description: "Back to it." });
  }, [phase, round, settings, completedToday, setLog]);

  React.useEffect(() => {
    onComplete.current = advance;
  }, [advance]);

  React.useEffect(() => {
    if (!running) return;

    // Deadline-based rather than decrementing, so background tab throttling
    // can't make the timer drift.
    deadline.current = Date.now() + remaining;

    const tick = () => {
      const next = deadline.current - Date.now();
      if (next <= 0) {
        setRemaining(0);
        onComplete.current();
        return;
      }
      setRemaining(next);
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // `remaining` seeds the deadline once; re-running each tick would reset it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  React.useEffect(() => {
    const original = document.title;
    if (running) {
      document.title = `${formatClock(remaining)} — ${PHASES[phase].label}`;
    }
    return () => {
      document.title = original;
    };
  }, [running, remaining, phase]);

  const reset = () => {
    setRunning(false);
    setRemaining(settings[phase] * 60_000);
  };

  const skip = () => {
    setRunning(false);
    advance();
  };

  const selectPhase = (next: Phase) => {
    setRunning(false);
    setPhase(next);
    setRemaining(settings[next] * 60_000);
  };

  const progress = duration > 0 ? clamp(1 - remaining / duration, 0, 1) : 0;
  const active = PHASES[phase];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col items-center gap-7">
          <div
            role="tablist"
            aria-label="Session type"
            className="bg-muted flex gap-1 rounded-lg p-1"
          >
            {(Object.keys(PHASES) as Phase[]).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={id === phase}
                onClick={() => selectPhase(id)}
                className={cn(
                  "focus-visible:ring-ring/45 rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]",
                  id === phase
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {PHASES[id].label}
              </button>
            ))}
          </div>

          <div className="relative grid place-items-center">
            <svg
              width="272"
              height="272"
              viewBox="0 0 272 272"
              className="-rotate-90"
              aria-hidden
            >
              <circle
                cx="136"
                cy="136"
                r={RADIUS}
                fill="none"
                strokeWidth="10"
                className="stroke-muted"
              />
              <circle
                cx="136"
                cy="136"
                r={RADIUS}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                className={cn(
                  active.ring,
                  "transition-[stroke-dashoffset] duration-200"
                )}
              />
            </svg>

            <div className="absolute flex flex-col items-center gap-1">
              <output
                aria-live="off"
                className="text-6xl font-semibold tabular-nums sm:text-7xl"
              >
                {formatClock(remaining)}
              </output>
              <p className="text-muted-foreground text-sm">{active.blurb}</p>
              <p className="sr-only" role="status" aria-live="polite">
                {active.label}, {formatClock(remaining)} remaining
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              size="lg"
              onClick={() => setRunning((value) => !value)}
              className="w-32"
            >
              {running ? (
                <>
                  <Pause className="size-4" aria-hidden />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" aria-hidden />
                  Start
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden />
              Reset
            </Button>
            <Button variant="ghost" size="lg" onClick={skip}>
              <SkipForward className="size-4" aria-hidden />
              Skip
            </Button>
          </div>

          <div className={cn("w-full rounded-xl border p-4", active.tint)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="pomodoro-task">Working on</Label>
                <Input
                  id="pomodoro-task"
                  value={task}
                  placeholder="What's this session for?"
                  onChange={(event) => setTask(event.target.value)}
                  className="bg-background"
                />
              </div>
              <dl className="flex gap-6 sm:pb-1">
                <div className="flex flex-col">
                  <dt className="text-muted-foreground text-xs font-medium">
                    Round
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {round}/{settings.roundsBeforeLong}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-muted-foreground text-xs font-medium">
                    Done today
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {mounted ? completedToday : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="-mx-2 w-fit"
            onClick={() => setShowSettings((value) => !value)}
            aria-expanded={showSettings}
            aria-controls="pomodoro-settings"
          >
            <Settings2 className="size-4" aria-hidden />
            {showSettings ? "Hide settings" : "Timer settings"}
          </Button>

          {showSettings ? (
            <div
              id="pomodoro-settings"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Duration
                id="focus-length"
                label="Focus (min)"
                value={settings.focus}
                max={180}
                onChange={(value) => updateSetting("focus", value)}
              />
              <Duration
                id="short-length"
                label="Short break (min)"
                value={settings.short}
                max={60}
                onChange={(value) => updateSetting("short", value)}
              />
              <Duration
                id="long-length"
                label="Long break (min)"
                value={settings.long}
                max={120}
                onChange={(value) => updateSetting("long", value)}
              />
              <Duration
                id="rounds"
                label="Rounds before long break"
                value={settings.roundsBeforeLong}
                max={12}
                onChange={(value) => updateSetting("roundsBeforeLong", value)}
              />
              <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
                <Switch
                  id="auto-start"
                  checked={settings.autoStart}
                  onCheckedChange={(value) => updateSetting("autoStart", value)}
                />
                <Label htmlFor="auto-start" className="text-sm font-normal">
                  Start the next session automatically
                </Label>
              </div>
              <p className="text-muted-foreground text-xs sm:col-span-2 lg:col-span-4">
                Settings and your daily count are saved in this browser only.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Duration({
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
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={1}
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number.parseInt(event.target.value, 10);
          if (Number.isFinite(next)) onChange(clamp(next, 1, max));
        }}
        className="tabular-nums"
      />
    </div>
  );
}

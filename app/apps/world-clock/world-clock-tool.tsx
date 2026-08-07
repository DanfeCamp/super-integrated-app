"use client";

import { Globe, Plus, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { timezones } from "@/data/timezones";
import { useInterval } from "@/hooks/use-interval";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

import { AnalogClock } from "./analog-clock";

const STORAGE_KEY = "sia:world-clock";

interface ZoneParts {
  hours: number;
  minutes: number;
  seconds: number;
  time: string;
  date: string;
  offsetLabel: string;
  isDaytime: boolean;
}

/**
 * Reads the wall-clock parts for one IANA zone. `Intl.DateTimeFormat` is the
 * only correct way to do this — it handles DST transitions and historical
 * offsets that a fixed numeric offset cannot.
 */
function readZone(
  zone: string,
  now: Date,
  localOffsetMinutes: number
): ZoneParts | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(now);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);

    const hours = get("hour") % 24;
    const minutes = get("minute");
    const seconds = get("second");

    const time = new Intl.DateTimeFormat(undefined, {
      timeZone: zone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(now);

    const date = new Intl.DateTimeFormat(undefined, {
      timeZone: zone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(now);

    // Difference against the viewer's own zone, derived from the same instant.
    const zoneOffsetMinutes = getOffsetMinutes(zone, now);
    const delta = zoneOffsetMinutes - localOffsetMinutes;
    const sign = delta === 0 ? "" : delta > 0 ? "+" : "−";
    const absolute = Math.abs(delta);
    const offsetLabel =
      delta === 0
        ? "Same as you"
        : `${sign}${Math.floor(absolute / 60)}${absolute % 60 ? `:${String(absolute % 60).padStart(2, "0")}` : ""}h`;

    return {
      hours,
      minutes,
      seconds,
      time,
      date,
      offsetLabel,
      isDaytime: hours >= 6 && hours < 18,
    };
  } catch {
    return null;
  }
}

function getOffsetMinutes(zone: string, at: Date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "longOffset",
  })
    .formatToParts(at)
    .find((part) => part.type === "timeZoneName")?.value;

  // "GMT+05:30" | "GMT-08:00" | "GMT"
  const match = formatted?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const [, sign, hours, minutes] = match;
  const total = Number(hours) * 60 + Number(minutes);
  return sign === "-" ? -total : total;
}

export function WorldClockTool() {
  const mounted = useMounted();
  const [zones, setZones, hydrated] = useLocalStorage<string[]>(
    STORAGE_KEY,
    []
  );
  const [now, setNow] = React.useState(() => new Date());

  useInterval(() => setNow(new Date()), 1000);

  // Seed with the viewer's own timezone the first time they arrive.
  React.useEffect(() => {
    if (!hydrated || zones.length > 0) return;
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (local) setZones([local]);
  }, [hydrated, zones.length, setZones]);

  const options: ComboboxOption[] = React.useMemo(
    () =>
      timezones.map((zone) => ({
        value: zone.id,
        label: `${zone.city}, ${zone.country}`,
        keywords: zone.id.replace(/[_/]/g, " "),
      })),
    []
  );

  const localOffset = React.useMemo(
    () =>
      getOffsetMinutes(Intl.DateTimeFormat().resolvedOptions().timeZone, now),
    [now]
  );

  const addZone = (zone: string) => {
    if (!zone || zones.includes(zone)) return;
    setZones((previous) => [...previous, zone]);
  };

  const removeZone = (zone: string) => {
    setZones((previous) => previous.filter((item) => item !== zone));
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center">
          <Combobox
            label="Add a city or timezone"
            options={options}
            value=""
            onValueChange={addZone}
            placeholder="Add a city or timezone…"
            searchPlaceholder="Search 290+ cities…"
            emptyMessage="No matching timezone."
            className="h-10 flex-1"
          />
          <Button
            variant="outline"
            onClick={() =>
              addZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
            }
            className="shrink-0"
          >
            <Plus className="size-4" aria-hidden />
            Add my timezone
          </Button>
        </CardContent>
      </Card>

      {!mounted || !hydrated ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : zones.length === 0 ? (
        <Card>
          <EmptyState
            icon={Globe}
            title="No cities on your board"
            description="Add a city above to start tracking its local time. Your board is saved in this browser."
          />
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => {
            const parts = readZone(zone, now, localOffset);
            const meta = timezones.find((item) => item.id === zone);
            if (!parts) return null;

            return (
              <li key={zone}>
                <Card className="group relative h-full">
                  <CardContent className="flex flex-col items-center gap-4 py-6">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${meta?.city ?? zone}`}
                      onClick={() => removeZone(zone)}
                      className="text-muted-foreground absolute top-3 right-3 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
                    >
                      <X className="size-4" />
                    </Button>

                    <div className="size-36">
                      <AnalogClock
                        hours={parts.hours}
                        minutes={parts.minutes}
                        seconds={parts.seconds}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1 text-center">
                      <h2 className="leading-tight font-semibold">
                        {meta?.city ??
                          zone.split("/").pop()?.replace(/_/g, " ")}
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        {meta?.country ?? zone}
                      </p>
                      <time
                        dateTime={now.toISOString()}
                        className="mt-1 text-2xl font-semibold tabular-nums"
                      >
                        {parts.time}
                      </time>
                      <p className="text-muted-foreground text-sm">
                        {parts.date}
                      </p>
                      <span
                        className={cn(
                          "mt-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium",
                          parts.offsetLabel === "Same as you"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {parts.offsetLabel}
                        {parts.offsetLabel !== "Same as you" ? " from you" : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Cron expression parsing, description and scheduling.
 *
 * Supports the standard five-field format and the six-field variant whose
 * leading field is seconds. Ranges, steps, lists, month/day names, `?` and the
 * `@daily`-style aliases are all understood.
 *
 * Next-run times are computed in the visitor's own timezone by walking forward
 * day by day and only expanding the allowed hours/minutes on days that match —
 * which is why a "29 February only" expression resolves instantly instead of
 * scanning every minute of the next four years.
 */

export interface CronField {
  /** Every value this field permits, ascending. */
  values: number[];
  /** True when the field was `*` or `?`. */
  wildcard: boolean;
  raw: string;
}

export interface ParsedCron {
  second: CronField;
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
  /** True when the expression carried an explicit seconds field. */
  hasSeconds: boolean;
}

export class CronError extends Error {}

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ALIASES: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

interface FieldSpec {
  name: string;
  min: number;
  max: number;
  names?: string[];
  /** Offset applied to name lookups, e.g. JAN is 1 not 0. */
  nameOffset?: number;
}

const SPECS: Record<string, FieldSpec> = {
  second: { name: "Seconds", min: 0, max: 59 },
  minute: { name: "Minutes", min: 0, max: 59 },
  hour: { name: "Hours", min: 0, max: 23 },
  dayOfMonth: { name: "Day of month", min: 1, max: 31 },
  month: { name: "Month", min: 1, max: 12, names: MONTH_NAMES, nameOffset: 1 },
  dayOfWeek: {
    name: "Day of week",
    min: 0,
    max: 6,
    names: DAY_NAMES,
    nameOffset: 0,
  },
};

function parseValue(token: string, spec: FieldSpec): number {
  const upper = token.toUpperCase();
  if (spec.names) {
    const index = spec.names.indexOf(upper);
    if (index !== -1) return index + (spec.nameOffset ?? 0);
  }
  if (!/^\d+$/.test(token)) {
    throw new CronError(
      `"${token}" isn't a valid ${spec.name.toLowerCase()} value.`
    );
  }
  let value = Number.parseInt(token, 10);
  // Both 0 and 7 mean Sunday in every cron implementation worth matching.
  if (spec === SPECS.dayOfWeek && value === 7) value = 0;
  if (value < spec.min || value > spec.max) {
    throw new CronError(
      `${spec.name} must be between ${spec.min} and ${spec.max} — got ${token}.`
    );
  }
  return value;
}

function parseField(raw: string, spec: FieldSpec): CronField {
  const trimmed = raw.trim();
  if (trimmed === "") throw new CronError(`${spec.name} is empty.`);

  const wildcard = trimmed === "*" || trimmed === "?";
  const values = new Set<number>();

  trimmed.split(",").forEach((part) => {
    const [rangePart, stepPart] = part.split("/") as [string, string?];

    let step = 1;
    if (stepPart !== undefined) {
      if (!/^\d+$/.test(stepPart) || Number.parseInt(stepPart, 10) === 0) {
        throw new CronError(`"${part}" has an invalid step.`);
      }
      step = Number.parseInt(stepPart, 10);
    }

    let start: number;
    let end: number;

    if (rangePart === "*" || rangePart === "?") {
      start = spec.min;
      end = spec.max;
    } else if (rangePart.includes("-")) {
      const [from, to] = rangePart.split("-") as [string, string?];
      if (to === undefined)
        throw new CronError(`"${part}" is an incomplete range.`);
      start = parseValue(from, spec);
      end = parseValue(to, spec);
      if (end < start) {
        // Wrapping ranges (FRI-MON) are common enough to be worth supporting.
        for (let value = start; value <= spec.max; value += step)
          values.add(value);
        for (let value = spec.min; value <= end; value += step)
          values.add(value);
        return;
      }
    } else {
      start = parseValue(rangePart, spec);
      end = stepPart === undefined ? start : spec.max;
    }

    for (let value = start; value <= end; value += step) values.add(value);
  });

  if (values.size === 0) throw new CronError(`${spec.name} matches nothing.`);

  return {
    values: [...values].sort((a, b) => a - b),
    wildcard,
    raw: trimmed,
  };
}

export function parseCron(expression: string): ParsedCron {
  const trimmed = expression.trim().toLowerCase();
  const resolved = ALIASES[trimmed] ?? expression.trim();

  if (resolved.startsWith("@")) {
    throw new CronError(
      `"${trimmed}" isn't a recognised alias. Try @hourly, @daily, @weekly, @monthly or @yearly.`
    );
  }

  const parts = resolved.split(/\s+/).filter(Boolean);
  if (parts.length !== 5 && parts.length !== 6) {
    throw new CronError(
      `A cron expression has five fields (or six with seconds) — this one has ${parts.length}.`
    );
  }

  const hasSeconds = parts.length === 6;
  const [second, minute, hour, dayOfMonth, month, dayOfWeek] = hasSeconds
    ? (parts as [string, string, string, string, string, string])
    : (["0", ...parts] as [string, string, string, string, string, string]);

  return {
    second: parseField(second, SPECS.second!),
    minute: parseField(minute, SPECS.minute!),
    hour: parseField(hour, SPECS.hour!),
    dayOfMonth: parseField(dayOfMonth, SPECS.dayOfMonth!),
    month: parseField(month, SPECS.month!),
    dayOfWeek: parseField(dayOfWeek, SPECS.dayOfWeek!),
    hasSeconds,
  };
}

/* ------------------------------- next runs -------------------------------- */

function matchesDay(date: Date, cron: ParsedCron): boolean {
  if (!cron.month.values.includes(date.getMonth() + 1)) return false;

  const domMatch = cron.dayOfMonth.values.includes(date.getDate());
  const dowMatch = cron.dayOfWeek.values.includes(date.getDay());

  // The classic cron rule: when both day fields are restricted, either one
  // matching is enough.
  if (cron.dayOfMonth.wildcard && cron.dayOfWeek.wildcard) return true;
  if (cron.dayOfMonth.wildcard) return dowMatch;
  if (cron.dayOfWeek.wildcard) return domMatch;
  return domMatch || dowMatch;
}

/** How far ahead to look before giving up on an expression that never fires. */
const SEARCH_DAYS = 366 * 8;

export function nextRuns(
  cron: ParsedCron,
  count: number,
  from = new Date()
): Date[] {
  const results: Date[] = [];
  const after = new Date(from.getTime());
  after.setMilliseconds(0);
  after.setSeconds(after.getSeconds() + 1);

  const cursor = new Date(
    after.getFullYear(),
    after.getMonth(),
    after.getDate()
  );

  for (
    let offset = 0;
    offset < SEARCH_DAYS && results.length < count;
    offset += 1
  ) {
    const day = new Date(
      cursor.getFullYear(),
      cursor.getMonth(),
      cursor.getDate() + offset
    );
    if (!matchesDay(day, cron)) continue;

    for (const hour of cron.hour.values) {
      for (const minute of cron.minute.values) {
        for (const second of cron.second.values) {
          const candidate = new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate(),
            hour,
            minute,
            second
          );
          // A DST spring-forward can skip the requested hour entirely; the
          // Date constructor rolls it to the next real instant, which would
          // otherwise land the run on the wrong day.
          if (candidate.getDate() !== day.getDate()) continue;
          if (candidate >= after) {
            results.push(candidate);
            if (results.length >= count) return results;
          }
        }
      }
    }
  }

  return results;
}

/* ------------------------------- description ------------------------------ */

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function list(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

/** Detects `*​/n` style fields so they can be described as "every n". */
function stepOf(field: CronField, min: number, max: number): number | null {
  if (field.values.length < 2) return null;
  const step = field.values[1]! - field.values[0]!;
  if (step < 2) return null;
  const expected: number[] = [];
  for (let value = field.values[0]!; value <= max; value += step)
    expected.push(value);
  if (field.values[0] !== min) return null;
  return expected.length === field.values.length &&
    expected.every((value, index) => value === field.values[index])
    ? step
    : null;
}

export function describeCron(cron: ParsedCron): string {
  const { second, minute, hour, dayOfMonth, month, dayOfWeek } = cron;

  const parts: string[] = [];

  /* --- time of day --- */
  const secondStep = stepOf(second, 0, 59);
  const minuteStep = stepOf(minute, 0, 59);

  if (cron.hasSeconds && second.wildcard) {
    parts.push("Every second");
  } else if (cron.hasSeconds && secondStep) {
    parts.push(`Every ${secondStep} seconds`);
  } else if (minute.wildcard && hour.wildcard) {
    parts.push("Every minute");
  } else if (minuteStep && hour.wildcard) {
    parts.push(`Every ${minuteStep} minutes`);
  } else if (minute.wildcard) {
    parts.push("Every minute");
  } else if (hour.wildcard) {
    parts.push(`At minute ${list(minute.values.map(String))} of every hour`);
  } else if (minute.values.length * hour.values.length <= 12) {
    const times: string[] = [];
    hour.values.forEach((h) => {
      minute.values.forEach((m) => times.push(`${pad(h)}:${pad(m)}`));
    });
    parts.push(`At ${list(times)}`);
  } else {
    const hourStep = stepOf(hour, 0, 23);
    parts.push(
      hourStep
        ? `At minute ${list(minute.values.map(String))}, every ${hourStep} hours`
        : `At minute ${list(minute.values.map(String))} past hour ${list(hour.values.map(String))}`
    );
  }

  if (
    !minute.wildcard &&
    !hour.wildcard &&
    cron.hasSeconds &&
    !second.wildcard &&
    !secondStep
  ) {
    parts[0] = `${parts[0]}:${pad(second.values[0]!)}`;
  }

  /* --- which days --- */
  if (!dayOfWeek.wildcard) {
    const days = dayOfWeek.values.map((value) => DAY_LABELS[value]!);
    const consecutive =
      dayOfWeek.values.length > 2 &&
      dayOfWeek.values.every(
        (value, index) =>
          index === 0 || value === dayOfWeek.values[index - 1]! + 1
      );
    parts.push(
      consecutive
        ? `${DAY_LABELS[dayOfWeek.values[0]!]} through ${DAY_LABELS[dayOfWeek.values.at(-1)!]}`
        : `on ${list(days)}`
    );
  }

  if (!dayOfMonth.wildcard) {
    const step = stepOf(dayOfMonth, 1, 31);
    parts.push(
      step
        ? `every ${step} days`
        : `on day ${list(dayOfMonth.values.map(String))} of the month`
    );
  }

  if (!month.wildcard) {
    parts.push(
      `in ${list(month.values.map((value) => MONTH_LABELS[value - 1]!))}`
    );
  }

  const sentence = parts.join(", ");
  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`;
}

/** Compact rendering of a field's resolved values for the breakdown table. */
export function summariseValues(
  field: CronField,
  spec: "second" | "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek"
): string {
  if (field.wildcard) return "Every value";
  if (spec === "month") {
    return field.values.map((value) => MONTH_LABELS[value - 1]!).join(", ");
  }
  if (spec === "dayOfWeek") {
    return field.values.map((value) => DAY_LABELS[value]!).join(", ");
  }
  if (field.values.length > 12) {
    return `${field.values.length} values (${field.values[0]}–${field.values.at(-1)})`;
  }
  return field.values.join(", ");
}

export const FIELD_ORDER = [
  { key: "second", label: "Second", range: "0–59" },
  { key: "minute", label: "Minute", range: "0–59" },
  { key: "hour", label: "Hour", range: "0–23" },
  { key: "dayOfMonth", label: "Day of month", range: "1–31" },
  { key: "month", label: "Month", range: "1–12" },
  { key: "dayOfWeek", label: "Day of week", range: "0–6 (Sun–Sat)" },
] as const;

export const PRESETS: { label: string; expression: string }[] = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Every 5 minutes", expression: "*/5 * * * *" },
  { label: "Every 15 minutes", expression: "*/15 * * * *" },
  { label: "Hourly, on the hour", expression: "0 * * * *" },
  { label: "Every day at 09:00", expression: "0 9 * * *" },
  { label: "Weekdays at 09:00", expression: "0 9 * * 1-5" },
  { label: "Every Monday at 08:30", expression: "30 8 * * MON" },
  { label: "First of the month", expression: "0 0 1 * *" },
  { label: "Quarterly", expression: "0 0 1 1,4,7,10 *" },
  { label: "Every New Year", expression: "0 0 1 1 *" },
];

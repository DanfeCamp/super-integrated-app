/**
 * JSON parsing helpers.
 *
 * `JSON.parse` gives one unhelpful message and, depending on the engine, either
 * a character offset or nothing at all. This turns whatever it throws into a
 * line/column the editor can point at.
 */

export interface ParseError {
  message: string;
  /** 1-based, when the engine gave us enough to work it out. */
  line?: number;
  column?: number;
}

export interface ParseResult {
  value: unknown;
  error: null;
}

export type ParseOutcome = ParseResult | { value: null; error: ParseError };

export function parseJson(text: string): ParseOutcome {
  try {
    return { value: JSON.parse(text) as unknown, error: null };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Invalid JSON.";

    // V8/Firefox: "… at position 42". Firefox also gives "line 3 column 5".
    const position = /position (\d+)/i.exec(message)?.[1];
    if (position !== undefined) {
      const offset = Math.min(Number(position), text.length);
      const before = text.slice(0, offset);
      const lines = before.split("\n");
      return {
        value: null,
        error: {
          message: cleanMessage(message),
          line: lines.length,
          column: (lines.at(-1)?.length ?? 0) + 1,
        },
      };
    }

    const lineMatch = /line (\d+)/i.exec(message)?.[1];
    const columnMatch = /column (\d+)/i.exec(message)?.[1];
    return {
      value: null,
      error: {
        message: cleanMessage(message),
        line: lineMatch ? Number(lineMatch) : undefined,
        column: columnMatch ? Number(columnMatch) : undefined,
      },
    };
  }
}

function cleanMessage(message: string): string {
  return message
    .replace(/^JSON\.parse: /, "")
    .replace(/^Unexpected token/, "Unexpected token")
    .replace(/ in JSON at position \d+.*$/, "")
    .replace(/ at position \d+.*$/, "")
    .trim()
    .replace(/^\w/, (character) => character.toUpperCase());
}

/** Recursively sort object keys so two documents can be compared by eye. */
export function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, sortKeys(entry)])
    );
  }
  return value;
}

export interface JsonStats {
  objects: number;
  arrays: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  /** Deepest nesting level, where a scalar at the root is 1. */
  depth: number;
}

export function inspect(value: unknown): JsonStats {
  const stats: JsonStats = {
    objects: 0,
    arrays: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    depth: 0,
  };

  const walk = (node: unknown, depth: number) => {
    stats.depth = Math.max(stats.depth, depth);
    if (node === null) {
      stats.nulls += 1;
      return;
    }
    if (Array.isArray(node)) {
      stats.arrays += 1;
      node.forEach((child) => walk(child, depth + 1));
      return;
    }
    switch (typeof node) {
      case "object":
        stats.objects += 1;
        Object.values(node as Record<string, unknown>).forEach((child) =>
          walk(child, depth + 1)
        );
        break;
      case "string":
        stats.strings += 1;
        break;
      case "number":
        stats.numbers += 1;
        break;
      case "boolean":
        stats.booleans += 1;
        break;
      default:
        break;
    }
  };

  walk(value, 1);
  return stats;
}

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Short label for a collapsed node, e.g. `{3 keys}` or `[12 items]`. */
export function summarise(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.length} ${value.length === 1 ? "item" : "items"}]`;
  }
  if (value !== null && typeof value === "object") {
    const size = Object.keys(value as object).length;
    return `{${size} ${size === 1 ? "key" : "keys"}}`;
  }
  return "";
}

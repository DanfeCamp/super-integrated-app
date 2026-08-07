/**
 * Line and word diffing.
 *
 * A classic LCS table, with the common prefix and suffix trimmed off first —
 * that trimming is what keeps the quadratic table small for the usual case of
 * two nearly-identical documents.
 */

export type OpType = "equal" | "delete" | "insert";

export interface Op {
  type: OpType;
  /** Index into the left sequence, for `equal` and `delete`. */
  a?: number;
  /** Index into the right sequence, for `equal` and `insert`. */
  b?: number;
}

/**
 * Above this many cells the table costs more memory than the result is worth,
 * so we degrade to "everything changed" and say so in the UI.
 */
const MAX_CELLS = 4_000_000;

export const DIFF_CELL_LIMIT = MAX_CELLS;

export interface DiffOutcome {
  ops: Op[];
  /** True when the inputs were too large for a real LCS pass. */
  truncated: boolean;
}

export function diffSequences(a: string[], b: string[]): DiffOutcome {
  const ops: Op[] = [];

  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    ops.push({ type: "equal", a: start, b: start });
    start += 1;
  }

  let endA = a.length;
  let endB = b.length;
  const suffix: Op[] = [];
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA -= 1;
    endB -= 1;
    suffix.unshift({ type: "equal", a: endA, b: endB });
  }

  const lenA = endA - start;
  const lenB = endB - start;

  if (lenA === 0 || lenB === 0) {
    for (let i = start; i < endA; i += 1) ops.push({ type: "delete", a: i });
    for (let j = start; j < endB; j += 1) ops.push({ type: "insert", b: j });
    return { ops: [...ops, ...suffix], truncated: false };
  }

  if (lenA * lenB > MAX_CELLS) {
    for (let i = start; i < endA; i += 1) ops.push({ type: "delete", a: i });
    for (let j = start; j < endB; j += 1) ops.push({ type: "insert", b: j });
    return { ops: [...ops, ...suffix], truncated: true };
  }

  // table[i][j] = length of the LCS of a[start+i…] and b[start+j…].
  const cols = lenB + 1;
  const table = new Uint32Array((lenA + 1) * cols);
  for (let i = lenA - 1; i >= 0; i -= 1) {
    for (let j = lenB - 1; j >= 0; j -= 1) {
      table[i * cols + j] =
        a[start + i] === b[start + j]
          ? table[(i + 1) * cols + j + 1]! + 1
          : Math.max(table[(i + 1) * cols + j]!, table[i * cols + j + 1]!);
    }
  }

  let i = 0;
  let j = 0;
  while (i < lenA && j < lenB) {
    if (a[start + i] === b[start + j]) {
      ops.push({ type: "equal", a: start + i, b: start + j });
      i += 1;
      j += 1;
    } else if (table[(i + 1) * cols + j]! >= table[i * cols + j + 1]!) {
      ops.push({ type: "delete", a: start + i });
      i += 1;
    } else {
      ops.push({ type: "insert", b: start + j });
      j += 1;
    }
  }
  while (i < lenA) {
    ops.push({ type: "delete", a: start + i });
    i += 1;
  }
  while (j < lenB) {
    ops.push({ type: "insert", b: start + j });
    j += 1;
  }

  return { ops: [...ops, ...suffix], truncated: false };
}

/* ------------------------------ line pairing ------------------------------ */

export interface Side {
  /** 1-based line number in its own document. */
  number: number;
  text: string;
}

export interface Row {
  type: "equal" | "changed" | "added" | "removed";
  left: Side | null;
  right: Side | null;
}

/**
 * Turns the flat op list into aligned rows. Runs of deletions and insertions
 * that sit next to each other are zipped into "changed" rows, which is what
 * makes a side-by-side view readable — otherwise an edited line shows as a
 * deletion far above its replacement.
 */
export function toRows(ops: Op[], a: string[], b: string[]): Row[] {
  const rows: Row[] = [];
  let index = 0;

  while (index < ops.length) {
    const op = ops[index]!;

    if (op.type === "equal") {
      rows.push({
        type: "equal",
        left: { number: op.a! + 1, text: a[op.a!]! },
        right: { number: op.b! + 1, text: b[op.b!]! },
      });
      index += 1;
      continue;
    }

    const deletions: number[] = [];
    const insertions: number[] = [];
    while (index < ops.length && ops[index]!.type !== "equal") {
      const current = ops[index]!;
      if (current.type === "delete") deletions.push(current.a!);
      else insertions.push(current.b!);
      index += 1;
    }

    const pairs = Math.max(deletions.length, insertions.length);
    for (let k = 0; k < pairs; k += 1) {
      const left = deletions[k];
      const right = insertions[k];
      rows.push({
        type:
          left !== undefined && right !== undefined
            ? "changed"
            : left !== undefined
              ? "removed"
              : "added",
        left: left === undefined ? null : { number: left + 1, text: a[left]! },
        right:
          right === undefined ? null : { number: right + 1, text: b[right]! },
      });
    }
  }

  return rows;
}

/* ------------------------------- word diff -------------------------------- */

export interface WordPart {
  type: OpType;
  text: string;
}

/** Split into words and the whitespace between them, so spacing survives. */
function tokenize(text: string): string[] {
  return text.match(/\s+|[^\s]+/g) ?? [];
}

/** Intra-line highlighting for a pair of lines that were matched as "changed". */
export function diffWords(
  left: string,
  right: string
): { left: WordPart[]; right: WordPart[] } {
  const a = tokenize(left);
  const b = tokenize(right);
  const { ops } = diffSequences(a, b);

  const leftParts: WordPart[] = [];
  const rightParts: WordPart[] = [];

  const push = (parts: WordPart[], type: OpType, text: string) => {
    const last = parts.at(-1);
    if (last && last.type === type) last.text += text;
    else parts.push({ type, text });
  };

  ops.forEach((op) => {
    if (op.type === "equal") {
      push(leftParts, "equal", a[op.a!]!);
      push(rightParts, "equal", b[op.b!]!);
    } else if (op.type === "delete") {
      push(leftParts, "delete", a[op.a!]!);
    } else {
      push(rightParts, "insert", b[op.b!]!);
    }
  });

  return { left: leftParts, right: rightParts };
}

/* ------------------------------ normalisation ----------------------------- */

export interface DiffOptions {
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  trimLines: boolean;
}

/** The comparison key for a line — the display text is always the original. */
export function normalizeLine(line: string, options: DiffOptions): string {
  let value = line;
  if (options.trimLines) value = value.trim();
  if (options.ignoreWhitespace) value = value.replace(/\s+/g, "");
  if (options.ignoreCase) value = value.toLowerCase();
  return value;
}

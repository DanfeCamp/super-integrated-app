/**
 * A small shunting-yard evaluator.
 *
 * The previous implementation called `eval()` on the display string, which
 * executes arbitrary JavaScript — anything pasted or deep-linked into the
 * field would run. This parses a fixed grammar instead: digits, `. ( ) + - * /
 * %` and nothing else.
 */

type TokenType = "number" | "operator" | "paren";

interface Token {
  type: TokenType;
  value: string;
}

const PRECEDENCE: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

export class ExpressionError extends Error {}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index]!;

    if (char === " ") {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let number = "";
      while (index < input.length && /[0-9.]/.test(input[index]!)) {
        number += input[index];
        index += 1;
      }
      if ((number.match(/\./g) ?? []).length > 1) {
        throw new ExpressionError("Malformed number");
      }
      tokens.push({ type: "number", value: number });
      continue;
    }

    if ("+-*/".includes(char)) {
      tokens.push({ type: "operator", value: char });
      index += 1;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      index += 1;
      continue;
    }

    // `%` is postfix here ("50%" → 0.5), matching how phone calculators behave.
    if (char === "%") {
      tokens.push({ type: "operator", value: "%" });
      index += 1;
      continue;
    }

    throw new ExpressionError(`Unexpected character "${char}"`);
  }

  return tokens;
}

/** Rewrites postfix `%` and unary +/- into ordinary binary operations. */
function normalize(tokens: Token[]): Token[] {
  const output: Token[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    const previous = output[output.length - 1];

    if (token.value === "%") {
      // Applies to whatever expression just closed: `x %` → `x / 100`.
      output.push({ type: "operator", value: "/" });
      output.push({ type: "number", value: "100" });
      continue;
    }

    const isUnary =
      token.type === "operator" &&
      (token.value === "-" || token.value === "+") &&
      (!previous ||
        (previous.type === "operator" && previous.value !== "%") ||
        previous.value === "(");

    if (isUnary) {
      // `-x` → `(0 - x)`; the explicit parens keep precedence intact.
      const inner: Token[] = [];
      let depth = 0;
      let j = i + 1;
      while (j < tokens.length) {
        const next = tokens[j]!;
        if (next.value === "(") depth += 1;
        if (next.value === ")") {
          if (depth === 0) break;
          depth -= 1;
        }
        if (depth === 0 && next.type === "operator" && next.value !== "%")
          break;
        inner.push(next);
        j += 1;
      }
      if (inner.length === 0) throw new ExpressionError("Dangling sign");

      output.push({ type: "paren", value: "(" });
      output.push({ type: "number", value: "0" });
      output.push({ type: "operator", value: token.value });
      output.push(...normalize(inner));
      output.push({ type: "paren", value: ")" });
      i = j - 1;
      continue;
    }

    output.push(token);
  }

  return output;
}

function toRpn(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
      continue;
    }

    if (token.type === "operator") {
      while (operators.length > 0) {
        const top = operators[operators.length - 1]!;
        if (
          top.type === "operator" &&
          PRECEDENCE[top.value]! >= PRECEDENCE[token.value]!
        ) {
          output.push(operators.pop()!);
        } else break;
      }
      operators.push(token);
      continue;
    }

    if (token.value === "(") {
      operators.push(token);
      continue;
    }

    // ")"
    let matched = false;
    while (operators.length > 0) {
      const top = operators.pop()!;
      if (top.value === "(") {
        matched = true;
        break;
      }
      output.push(top);
    }
    if (!matched) throw new ExpressionError("Unbalanced brackets");
  }

  while (operators.length > 0) {
    const top = operators.pop()!;
    if (top.value === "(") throw new ExpressionError("Unbalanced brackets");
    output.push(top);
  }

  return output;
}

function evaluateRpn(rpn: Token[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === "number") {
      const value = Number(token.value);
      if (!Number.isFinite(value))
        throw new ExpressionError("Malformed number");
      stack.push(value);
      continue;
    }

    const right = stack.pop();
    const left = stack.pop();
    if (right === undefined || left === undefined) {
      throw new ExpressionError("Incomplete expression");
    }

    switch (token.value) {
      case "+":
        stack.push(left + right);
        break;
      case "-":
        stack.push(left - right);
        break;
      case "*":
        stack.push(left * right);
        break;
      case "/":
        if (right === 0) throw new ExpressionError("Cannot divide by zero");
        stack.push(left / right);
        break;
      default:
        throw new ExpressionError(`Unknown operator "${token.value}"`);
    }
  }

  if (stack.length !== 1) throw new ExpressionError("Incomplete expression");
  return stack[0]!;
}

/** Evaluates an infix expression, throwing `ExpressionError` on bad input. */
export function evaluate(expression: string): number {
  const trimmed = expression.trim();
  if (!trimmed) throw new ExpressionError("Nothing to calculate");

  const result = evaluateRpn(toRpn(normalize(tokenize(trimmed))));

  if (!Number.isFinite(result))
    throw new ExpressionError("Result is undefined");
  // Kill binary-float noise: 0.1 + 0.2 reads as 0.3, not 0.30000000000000004.
  return Number(result.toPrecision(12));
}

/** Formats a result with thousands separators, without losing precision. */
export function formatResult(value: number): string {
  if (Number.isInteger(value) && Math.abs(value) < 1e15) {
    return value.toLocaleString("en-US");
  }
  if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(6);
  }
  return value.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

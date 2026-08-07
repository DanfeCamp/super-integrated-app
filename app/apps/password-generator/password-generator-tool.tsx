"use client";

import { RefreshCw, ShieldCheck } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?",
} as const;

type SetKey = keyof typeof SETS;

/** Easily confused glyphs, excluded on request. */
const AMBIGUOUS = new Set("il1Lo0O".split(""));

const OPTIONS: { key: SetKey; label: string }[] = [
  { key: "lowercase", label: "Lowercase (a–z)" },
  { key: "uppercase", label: "Uppercase (A–Z)" },
  { key: "numbers", label: "Numbers (0–9)" },
  { key: "symbols", label: "Symbols (!@#…)" },
];

/**
 * Uniformly random index in `[0, max)` using `crypto.getRandomValues`.
 *
 * `Math.random()` is not a CSPRNG, and a naive `% max` on random bytes skews
 * toward low indices — so oversized draws are rejected and retried.
 */
function randomIndex(max: number) {
  const limit = Math.floor(0xffffffff / max) * max;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0]!;
  } while (value >= limit);
  return value % max;
}

function shuffle<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
  return items;
}

function strengthOf(entropy: number) {
  if (entropy < 40) return { label: "Weak", tone: "destructive", value: 25 };
  if (entropy < 60) return { label: "Fair", tone: "warning", value: 50 };
  if (entropy < 80) return { label: "Strong", tone: "success", value: 75 };
  return { label: "Very strong", tone: "success", value: 100 };
}

/** Rough offline-cracking estimate at 10^11 guesses/second. */
function crackTime(entropy: number) {
  const seconds = 2 ** entropy / 1e11 / 2;
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [365, "day"],
    [1000, "year"],
  ];

  let value = seconds;
  let unit = "second";
  for (const [factor, name] of units) {
    unit = name;
    if (value < factor) break;
    value /= factor;
  }

  if (unit === "year" && value >= 1000) return "longer than the universe";
  if (value < 1 && unit === "second") return "instantly";
  return `about ${Math.round(value).toLocaleString()} ${unit}${Math.round(value) === 1 ? "" : "s"}`;
}

export function PasswordGeneratorTool() {
  const [length, setLength] = React.useState(20);
  const [enabled, setEnabled] = React.useState<Record<SetKey, boolean>>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [excludeAmbiguous, setExcludeAmbiguous] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const activeKeys = OPTIONS.filter((option) => enabled[option.key]).map(
    (option) => option.key
  );

  const pools = React.useMemo(() => {
    return activeKeys.map((key) => {
      const characters = SETS[key].split("");
      return excludeAmbiguous
        ? characters.filter((character) => !AMBIGUOUS.has(character))
        : characters;
    });
    // `activeKeys` is derived from `enabled`; depending on it directly would
    // rebuild the pools on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, excludeAmbiguous]);

  const alphabet = React.useMemo(() => pools.flat(), [pools]);

  const generate = React.useCallback(() => {
    if (alphabet.length === 0) {
      setPassword("");
      return;
    }

    // Guarantee at least one character from each selected set, then fill.
    const characters = pools
      .filter((pool) => pool.length > 0)
      .slice(0, length)
      .map((pool) => pool[randomIndex(pool.length)]!);

    while (characters.length < length) {
      characters.push(alphabet[randomIndex(alphabet.length)]!);
    }

    setPassword(shuffle(characters).join(""));
  }, [alphabet, pools, length]);

  // Regenerate whenever the recipe changes so the output always matches it.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the password must track the recipe, and CSPRNG output is impure so it cannot be derived during render.
  React.useEffect(() => generate(), [generate]);

  const entropy = alphabet.length > 0 ? Math.log2(alphabet.length) * length : 0;
  const strength = strengthOf(entropy);
  const noSetsSelected = activeKeys.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="bg-muted/50 flex min-h-20 items-center gap-3 rounded-lg px-4 py-4">
            <output
              className="flex-1 font-mono text-lg break-all sm:text-xl"
              aria-label="Generated password"
              aria-live="polite"
            >
              {password || (
                <span className="text-muted-foreground text-base">
                  Select at least one character set
                </span>
              )}
            </output>
            <div className="flex shrink-0 gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={generate}
                disabled={noSetsSelected}
                aria-label="Generate a new password"
              >
                <RefreshCw className="size-4" />
              </Button>
              <CopyButton value={password} size="icon" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Strength</span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  strength.tone === "destructive" && "text-destructive",
                  strength.tone === "warning" && "text-warning",
                  strength.tone === "success" && "text-success"
                )}
              >
                {noSetsSelected ? "—" : strength.label}
              </span>
            </div>
            <div
              className="bg-muted h-2 overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={Math.round(entropy)}
              aria-valuemin={0}
              aria-valuemax={128}
              aria-label="Password entropy in bits"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  strength.tone === "destructive" && "bg-destructive",
                  strength.tone === "warning" && "bg-warning",
                  strength.tone === "success" && "bg-success"
                )}
                style={{ width: noSetsSelected ? "0%" : `${strength.value}%` }}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {noSetsSelected
                ? "Turn on a character set to generate a password."
                : `${Math.round(entropy)} bits of entropy · would take ${crackTime(entropy)} to crack offline.`}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor="length">Length</Label>
              <span className="text-2xl font-semibold tabular-nums">
                {length}
              </span>
            </div>
            <Slider
              id="length"
              value={[length]}
              onValueChange={([next]) => setLength(next ?? 20)}
              min={6}
              max={64}
              step={1}
              aria-label="Password length"
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>6</span>
              <span>64</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Length adds more security than complexity. A 20-character password
              from two sets beats a 10-character one from four.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Include</h2>
            <div className="flex flex-col gap-3.5">
              {OPTIONS.map((option) => {
                const isOnlyActive =
                  enabled[option.key] && activeKeys.length === 1;
                return (
                  <div
                    key={option.key}
                    className="flex items-center justify-between gap-3"
                  >
                    <Label htmlFor={option.key} className="text-sm font-normal">
                      {option.label}
                    </Label>
                    <Switch
                      id={option.key}
                      checked={enabled[option.key]}
                      // Never let the user turn off the last remaining set.
                      disabled={isOnlyActive}
                      onCheckedChange={(checked) =>
                        setEnabled((previous) => ({
                          ...previous,
                          [option.key]: checked,
                        }))
                      }
                    />
                  </div>
                );
              })}

              <div className="flex items-center justify-between gap-3 border-t pt-3.5">
                <Label
                  htmlFor="exclude-ambiguous"
                  className="text-sm font-normal"
                >
                  Exclude look-alikes
                  <span className="text-muted-foreground ml-1 font-mono text-xs">
                    il1Lo0O
                  </span>
                </Label>
                <Switch
                  id="exclude-ambiguous"
                  checked={excludeAmbiguous}
                  onCheckedChange={setExcludeAmbiguous}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-muted-foreground flex items-center justify-center gap-2 text-center text-xs">
        <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
        Generated in your browser with the Web Crypto API. Nothing is sent
        anywhere.
      </p>
    </div>
  );
}

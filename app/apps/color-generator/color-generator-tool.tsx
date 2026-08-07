"use client";

import { Check, Copy, Palette, Shuffle, Star, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

import {
  buildHarmonies,
  contrastRatio,
  type Format,
  formatColor,
  hexToRgb,
  luminance,
  randomHex,
} from "./color";

const STORAGE_KEY = "sia:color-palette";
const FORMATS: Format[] = ["hex", "rgb", "hsl", "oklch"];

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

export function ColorGeneratorTool() {
  const [color, setColor] = React.useState("#7c5cff");
  const [draft, setDraft] = React.useState("#7c5cff");
  const [format, setFormat] = React.useState<Format>("hex");
  const [saved, setSaved, hydrated] = useLocalStorage<string[]>(
    STORAGE_KEY,
    []
  );

  const rgb = hexToRgb(color);
  const harmonies = React.useMemo(() => buildHarmonies(color), [color]);

  const commitDraft = (value: string) => {
    setDraft(value);
    const withHash = value.startsWith("#") ? value : `#${value}`;
    if (hexToRgb(withHash)) setColor(withHash.toLowerCase());
  };

  const randomise = () => {
    const next = randomHex();
    setColor(next);
    setDraft(next);
  };

  const save = () => {
    if (saved.includes(color)) {
      toast("Already in your gallery");
      return;
    }
    setSaved((previous) => [color, ...previous].slice(0, 60));
    toast.success("Saved to gallery");
  };

  // Contrast against white and black tells you which text colour is legible.
  const onWhite = rgb ? contrastRatio(rgb, WHITE) : 0;
  const onBlack = rgb ? contrastRatio(rgb, BLACK) : 0;
  const isLight = rgb ? luminance(rgb) > 0.45 : false;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
        <Card>
          <CardContent className="flex flex-col gap-5">
            <div
              className="relative grid h-40 place-items-center rounded-lg border transition-colors duration-300"
              style={{ backgroundColor: color }}
            >
              <span
                className={cn(
                  "font-mono text-2xl font-semibold tracking-tight",
                  isLight ? "text-black/80" : "text-white/90"
                )}
              >
                {color.toUpperCase()}
              </span>
              <label className="absolute inset-0 cursor-pointer">
                <span className="sr-only">Pick a colour</span>
                <input
                  type="color"
                  value={color}
                  onChange={(event) => {
                    setColor(event.target.value);
                    setDraft(event.target.value);
                  }}
                  className="size-full opacity-0"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hex-input">Hex value</Label>
              <div className="flex gap-2">
                <Input
                  id="hex-input"
                  value={draft}
                  onChange={(event) => commitDraft(event.target.value)}
                  onBlur={() => setDraft(color)}
                  spellCheck={false}
                  maxLength={7}
                  aria-invalid={!hexToRgb(draft)}
                  className="font-mono uppercase"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={randomise}
                  aria-label="Random colour"
                >
                  <Shuffle className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="format">Copy format</Label>
              <ToggleGroup
                id="format"
                type="single"
                value={format}
                onValueChange={(value) => value && setFormat(value as Format)}
                aria-label="Colour format"
                className="w-full"
              >
                {FORMATS.map((item) => (
                  <ToggleGroupItem
                    key={item}
                    value={item}
                    className="flex-1 uppercase"
                  >
                    {item}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border p-3">
              <p className="text-muted-foreground text-xs font-medium">
                Current value
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate font-mono text-sm">
                  {formatColor(color, format)}
                </code>
                <SwatchCopy value={formatColor(color, format)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <ContrastBadge label="On white" ratio={onWhite} />
              <ContrastBadge label="On black" ratio={onBlack} />
            </div>

            <Button onClick={save}>
              <Star className="size-4" aria-hidden />
              Save to gallery
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {harmonies.map((harmony) => (
            <Card key={harmony.name}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-semibold">{harmony.name}</h2>
                  <p className="text-muted-foreground text-xs">
                    {harmony.description}
                  </p>
                </div>
                {/* Tracks are bounded at both ends so a two-swatch harmony
                    renders the same size as a nine-swatch ramp. */}
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(4rem,5.5rem))] gap-2">
                  {harmony.swatches.map((swatch, index) => (
                    <li
                      key={`${swatch.hex}-${index}`}
                      className="flex flex-col gap-1"
                    >
                      <SwatchButton
                        hex={swatch.hex}
                        format={format}
                        onSelect={() => {
                          setColor(swatch.hex);
                          setDraft(swatch.hex);
                        }}
                      />
                      {/* Labelled underneath rather than over the colour: on an
                          arbitrary user-picked hue no overlay opacity can be
                          guaranteed to clear 4.5:1. */}
                      <span className="text-muted-foreground text-center font-mono text-[0.625rem]">
                        {swatch.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">
              Your gallery
              {saved.length > 0 ? (
                <span className="text-muted-foreground ml-2 font-normal">
                  {saved.length}
                </span>
              ) : null}
            </h2>
            {saved.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSaved([]);
                  toast.success("Gallery cleared");
                }}
              >
                <Trash2 className="size-3.5" aria-hidden />
                Clear all
              </Button>
            ) : null}
          </div>

          {!hydrated ? null : saved.length === 0 ? (
            <EmptyState
              icon={Palette}
              title="No saved colours"
              description="Save colours you like and they'll stay here between visits."
              className="py-8"
            />
          ) : (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(4rem,5.5rem))] gap-2">
              {saved.map((hex) => (
                <li key={hex} className="group relative">
                  <SwatchButton
                    hex={hex}
                    format={format}
                    onSelect={() => {
                      setColor(hex);
                      setDraft(hex);
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    aria-label={`Remove ${hex}`}
                    onClick={() =>
                      setSaved((previous) =>
                        previous.filter((item) => item !== hex)
                      )
                    }
                    className="absolute -top-1.5 -right-1.5 size-6 rounded-full opacity-0 shadow-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SwatchButton({
  hex,
  format,
  onSelect,
}: {
  hex: string;
  format: Format;
  onSelect: () => void;
}) {
  const { copied, copy } = useCopyToClipboard();
  const rgb = hexToRgb(hex);
  const isLight = rgb ? luminance(rgb) > 0.45 : false;

  return (
    <button
      type="button"
      onClick={() => {
        void copy(formatColor(hex, format));
        onSelect();
      }}
      title={`${hex.toUpperCase()} — click to copy`}
      className="focus-visible:ring-ring/40 group/swatch relative flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border transition-transform hover:scale-[1.04] focus-visible:ring-[3px] focus-visible:outline-none"
      style={{ backgroundColor: hex }}
    >
      <span
        className={cn(
          "opacity-0 transition-opacity group-hover/swatch:opacity-100",
          isLight ? "text-black/70" : "text-white/80"
        )}
      >
        {copied ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
      </span>
      <span className="sr-only">
        {copied ? "Copied" : `Copy ${hex.toUpperCase()}`}
      </span>
    </button>
  );
}

function SwatchCopy({ value }: { value: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => void copy(value)}
      aria-label={copied ? "Copied" : "Copy value"}
    >
      {copied ? (
        <Check className="text-success animate-pop size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
}

function ContrastBadge({ label, ratio }: { label: string; ratio: number }) {
  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7;

  return (
    <div className="flex flex-col gap-0.5 rounded-lg border p-2.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-semibold tabular-nums">{ratio.toFixed(2)}:1</span>
      <span
        className={cn(
          "text-[0.6875rem] font-medium",
          passesAA ? "text-success" : "text-destructive"
        )}
      >
        {passesAAA ? "AAA" : passesAA ? "AA" : "Fails AA"}
      </span>
    </div>
  );
}

/** Colour-space conversions and palette generation, all pure functions. */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): Rgb | null {
  const normalised = hex.replace("#", "").trim();
  const expanded =
    normalised.length === 3
      ? normalised
          .split("")
          .map((character) => character + character)
          .join("")
      : normalised;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) return null;

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb) {
  const channel = (value: number) =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * sRGB → OKLCH. Modern CSS supports `oklch()` natively, and it's the space our
 * own design tokens are authored in — so it belongs in the copy menu.
 */
export function rgbToOklch({ r, g, b }: Rgb) {
  const toLinear = (channel: number) => {
    const v = channel / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  );

  const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const chroma = Math.sqrt(okA ** 2 + okB ** 2);
  let hue = (Math.atan2(okB, okA) * 180) / Math.PI;
  if (hue < 0) hue += 360;

  return { l: okL, c: chroma, h: hue };
}

/** WCAG relative luminance, used to pick readable label colours. */
export function luminance({ r, g, b }: Rgb) {
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb) {
  const lighter = Math.max(luminance(a), luminance(b));
  const darker = Math.min(luminance(a), luminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

export type Format = "hex" | "rgb" | "hsl" | "oklch";

export function formatColor(hex: string, format: Format) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  switch (format) {
    case "rgb":
      return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
    case "hsl": {
      const { h, s, l } = rgbToHsl(rgb);
      return `hsl(${h} ${s}% ${l}%)`;
    }
    case "oklch": {
      const { l, c, h } = rgbToOklch(rgb);
      return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
    }
    default:
      return hex.toUpperCase();
  }
}

export interface Swatch {
  hex: string;
  label: string;
}

export interface Harmony {
  name: string;
  description: string;
  swatches: Swatch[];
}

function shift(hex: string, delta: Partial<Hsl>) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  return rgbToHex(
    hslToRgb({
      h: (hsl.h + (delta.h ?? 0) + 360) % 360,
      s: Math.min(100, Math.max(0, hsl.s + (delta.s ?? 0))),
      l: Math.min(100, Math.max(0, hsl.l + (delta.l ?? 0))),
    })
  );
}

/** Builds tint/shade ramps and the standard colour-wheel harmonies. */
export function buildHarmonies(hex: string): Harmony[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const base = rgbToHsl(rgb);

  const scale = [95, 85, 75, 60, 50, 40, 30, 20, 12].map((lightness) => ({
    hex: rgbToHex(hslToRgb({ ...base, l: lightness })),
    label: String(lightness),
  }));

  return [
    {
      name: "Tints & shades",
      description: "The same hue across the full lightness range.",
      swatches: scale,
    },
    {
      name: "Complementary",
      description: "Opposite on the colour wheel — maximum contrast.",
      swatches: [
        { hex, label: "Base" },
        { hex: shift(hex, { h: 180 }), label: "Complement" },
      ],
    },
    {
      name: "Analogous",
      description: "Neighbouring hues — calm and cohesive.",
      swatches: [
        { hex: shift(hex, { h: -30 }), label: "−30°" },
        { hex, label: "Base" },
        { hex: shift(hex, { h: 30 }), label: "+30°" },
      ],
    },
    {
      name: "Triadic",
      description: "Three hues evenly spaced — vivid and balanced.",
      swatches: [
        { hex, label: "Base" },
        { hex: shift(hex, { h: 120 }), label: "+120°" },
        { hex: shift(hex, { h: 240 }), label: "+240°" },
      ],
    },
    {
      name: "Split complementary",
      description: "Softer contrast than a straight complement.",
      swatches: [
        { hex, label: "Base" },
        { hex: shift(hex, { h: 150 }), label: "+150°" },
        { hex: shift(hex, { h: 210 }), label: "+210°" },
      ],
    },
  ];
}

export function randomHex() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return rgbToHex({ r: bytes[0]!, g: bytes[1]!, b: bytes[2]! });
}

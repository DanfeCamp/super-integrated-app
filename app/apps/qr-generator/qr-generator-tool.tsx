"use client";

import { Download, QrCode, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { downloadBlob, downloadUrl } from "@/lib/utils";

const LEVELS = [
  { value: "L", label: "Low — 7%" },
  { value: "M", label: "Medium — 15%" },
  { value: "Q", label: "Quartile — 25%" },
  { value: "H", label: "High — 30%" },
] as const;

type Level = (typeof LEVELS)[number]["value"];

/**
 * The encoder is ~30 KB and isn't needed to paint the page, so it is pulled in
 * on demand. The module cache makes every call after the first a no-op.
 */
const loadQRCode = () => import("qrcode").then((module) => module.default);

const PRESETS = [
  { label: "URL", value: "https://superintegrateapp.com" },
  { label: "Email", value: "mailto:hello@example.com?subject=Hello" },
  { label: "Phone", value: "tel:+15551234567" },
  { label: "Wi-Fi", value: "WIFI:T:WPA;S:NetworkName;P:password;;" },
  {
    label: "Contact",
    value:
      "BEGIN:VCARD\nVERSION:3.0\nN:Lovelace;Ada\nTEL:+15551234567\nEMAIL:ada@example.com\nEND:VCARD",
  },
] as const;

export function QrGeneratorTool() {
  const [text, setText] = React.useState("https://superintegrateapp.com");
  const [size, setSize] = React.useState(320);
  const [margin, setMargin] = React.useState(2);
  const [level, setLevel] = React.useState<Level>("M");
  const [dark, setDark] = React.useState("#111116");
  const [light, setLight] = React.useState("#ffffff");
  const [dataUrl, setDataUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const debouncedText = useDebouncedValue(text, 200);
  const options = React.useMemo(
    () => ({
      errorCorrectionLevel: level,
      margin,
      color: { dark, light },
    }),
    [level, margin, dark, light]
  );

  React.useEffect(() => {
    if (!debouncedText.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clears the previous encode when the input empties.
      setDataUrl("");
      setError(null);
      return;
    }

    let cancelled = false;
    loadQRCode()
      .then((QRCode) =>
        QRCode.toDataURL(debouncedText, { ...options, width: 1024 })
      )
      .then((url) => {
        if (cancelled) return;
        setDataUrl(url);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setDataUrl("");
        setError(
          caught instanceof Error
            ? // The library's own message is the useful one here (usually
              // "data too long" at the chosen error-correction level).
              caught.message
            : "Couldn't generate a QR code for this input."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedText, options]);

  const downloadPng = async () => {
    if (!debouncedText.trim()) return;
    const QRCode = await loadQRCode();
    const url = await QRCode.toDataURL(debouncedText, {
      ...options,
      width: 1024,
    });
    downloadUrl(url, "qr-code.png");
  };

  const downloadSvg = async () => {
    if (!debouncedText.trim()) return;
    const QRCode = await loadQRCode();
    const svg = await QRCode.toString(debouncedText, {
      ...options,
      type: "svg",
      width: size,
    });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start">
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="qr-content">Content</Label>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              id="qr-content"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="A URL, some text, a phone number, Wi-Fi credentials…"
              rows={6}
              spellCheck={false}
              className="resize-none font-mono text-[0.8125rem]"
            />
            <p className="text-muted-foreground text-xs tabular-nums">
              {text.length} characters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-5 py-8">
            {error ? (
              <Alert variant="destructive" className="w-full">
                <TriangleAlert />
                <AlertDescription>
                  {error}. Try shortening the content or lowering the
                  error-correction level.
                </AlertDescription>
              </Alert>
            ) : dataUrl ? (
              <>
                <div
                  className="rounded-xl p-4 shadow-sm ring-1 ring-black/5"
                  style={{ backgroundColor: light }}
                >
                  {/* Rendered client-side to a data URL; not a static asset. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dataUrl}
                    alt={`QR code encoding: ${debouncedText.slice(0, 80)}`}
                    width={size}
                    height={size}
                    style={{ width: size, height: size }}
                    className="max-w-full"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button onClick={() => void downloadPng()}>
                    <Download className="size-4" aria-hidden />
                    PNG
                  </Button>
                  <Button variant="outline" onClick={() => void downloadSvg()}>
                    <Download className="size-4" aria-hidden />
                    SVG
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-3 py-14 text-center">
                <QrCode className="size-8 opacity-40" aria-hidden />
                <p className="text-sm">
                  Enter some content above to generate a QR code.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="lg:sticky lg:top-24">
        <CardContent className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold">Appearance</h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="qr-size">Preview size</Label>
              <span className="text-muted-foreground text-xs tabular-nums">
                {size}px
              </span>
            </div>
            <Slider
              id="qr-size"
              value={[size]}
              onValueChange={([next]) => setSize(next ?? 320)}
              min={160}
              max={480}
              step={16}
              aria-label="Preview size"
            />
            <p className="text-muted-foreground text-xs">
              Downloads are always exported at 1024px (PNG) or as scalable SVG.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="qr-margin">Quiet zone</Label>
              <span className="text-muted-foreground text-xs tabular-nums">
                {margin}
              </span>
            </div>
            <Slider
              id="qr-margin"
              value={[margin]}
              onValueChange={([next]) => setMargin(next ?? 2)}
              min={0}
              max={8}
              step={1}
              aria-label="Quiet zone size"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qr-level">Error correction</Label>
            <Select
              value={level}
              onValueChange={(value) => setLevel(value as Level)}
            >
              <SelectTrigger id="qr-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Higher levels stay scannable when damaged or partly covered, but
              hold less data.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorField
              id="qr-dark"
              label="Foreground"
              value={dark}
              onChange={setDark}
            />
            <ColorField
              id="qr-light"
              label="Background"
              value={light}
              onChange={setLight}
            />
          </div>

          <p className="text-muted-foreground text-xs leading-relaxed">
            Keep strong contrast between the two colours — scanners need it, and
            a light foreground on a dark background often fails to read.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="border-border size-9 shrink-0 rounded-md border"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} hex value`}
          spellCheck={false}
          className="font-mono text-xs uppercase"
        />
      </div>
    </div>
  );
}

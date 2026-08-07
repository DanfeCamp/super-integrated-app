"use client";

import { Download, Link2, Loader2, TriangleAlert, Unlink } from "lucide-react";
import * as React from "react";

import { FileDropzone } from "@/components/tools/file-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useObjectUrl } from "@/hooks/use-object-url";
import { cn, downloadBlob, formatBytes, replaceExtension } from "@/lib/utils";

import {
  loadImage,
  PRESETS,
  resize,
  type Fit,
  type OutputFormat,
} from "./resize";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp";
const MAX_SIZE = 25 * 1024 * 1024;

const FORMATS: {
  value: OutputFormat;
  label: string;
  extension: string;
  lossy: boolean;
}[] = [
  { value: "image/webp", label: "WebP", extension: "webp", lossy: true },
  { value: "image/jpeg", label: "JPG", extension: "jpg", lossy: true },
  { value: "image/png", label: "PNG", extension: "png", lossy: false },
];

const FITS: { value: Fit; label: string; hint: string }[] = [
  { value: "contain", label: "Contain", hint: "Fit inside, padding the rest" },
  {
    value: "cover",
    label: "Cover",
    hint: "Fill the frame, cropping the overflow",
  },
  {
    value: "stretch",
    label: "Stretch",
    hint: "Ignore the original proportions",
  },
];

interface Result {
  blob: Blob;
  width: number;
  height: number;
  filename: string;
}

export function ImageResizerTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [lockAspect, setLockAspect] = React.useState(true);
  const [fit, setFit] = React.useState<Fit>("contain");
  const [format, setFormat] = React.useState<OutputFormat>("image/webp");
  const [quality, setQuality] = React.useState(85);
  const [background, setBackground] = React.useState("#ffffff");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  const sourcePreview = useObjectUrl(file);
  const resultPreview = useObjectUrl(result?.blob ?? null);

  const selectedFormat = FORMATS.find((item) => item.value === format)!;

  // Everything the previous file produced is cleared alongside the change
  // itself, so the effect only has to handle decoding the new one.
  const chooseFile = (next: File | null) => {
    setFile(next);
    setImage(null);
    setResult(null);
    setError(null);
    setWidth("");
    setHeight("");
  };

  React.useEffect(() => {
    if (!file) return;

    let cancelled = false;

    void loadImage(file)
      .then((loaded) => {
        if (cancelled) return;
        setImage(loaded);
        setWidth(String(loaded.naturalWidth));
        setHeight(String(loaded.naturalHeight));
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const ratio =
    image && image.naturalHeight > 0
      ? image.naturalWidth / image.naturalHeight
      : 1;

  const setWidthLinked = (value: string) => {
    setWidth(value);
    const parsed = Number.parseInt(value, 10);
    if (lockAspect && Number.isFinite(parsed) && parsed > 0) {
      setHeight(String(Math.max(1, Math.round(parsed / ratio))));
    }
  };

  const setHeightLinked = (value: string) => {
    setHeight(value);
    const parsed = Number.parseInt(value, 10);
    if (lockAspect && Number.isFinite(parsed) && parsed > 0) {
      setWidth(String(Math.max(1, Math.round(parsed * ratio))));
    }
  };

  const scaleBy = (percent: number) => {
    if (!image) return;
    setWidth(
      String(Math.max(1, Math.round((image.naturalWidth * percent) / 100)))
    );
    setHeight(
      String(Math.max(1, Math.round((image.naturalHeight * percent) / 100)))
    );
  };

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(String(presetWidth));
    setHeight(String(presetHeight));
    // A preset states both dimensions, so honouring the lock would immediately
    // overwrite one of them.
    setLockAspect(false);
  };

  const targetWidth = Number.parseInt(width, 10);
  const targetHeight = Number.parseInt(height, 10);
  const dimensionsValid =
    Number.isFinite(targetWidth) &&
    Number.isFinite(targetHeight) &&
    targetWidth > 0 &&
    targetHeight > 0 &&
    targetWidth <= 12000 &&
    targetHeight <= 12000;

  const run = async () => {
    if (!image || !file || !dimensionsValid) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await resize(image, {
        width: targetWidth,
        height: targetHeight,
        fit,
        background,
        format,
        quality: quality / 100,
      });
      setResult({
        blob,
        width: targetWidth,
        height: targetHeight,
        filename: replaceExtension(
          `${file.name.replace(/\.[^./\\]+$/, "")}-${targetWidth}x${targetHeight}`,
          selectedFormat.extension
        ),
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The image couldn't be resized."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <FileDropzone
            id="resize-file"
            file={file}
            onFileChange={chooseFile}
            accept={ACCEPT}
            maxSize={MAX_SIZE}
            hint="JPG, PNG, WebP, AVIF, GIF or BMP"
            preview={sourcePreview}
          />

          {image ? (
            <>
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="resize-width">Width</Label>
                  <Input
                    id="resize-width"
                    type="number"
                    min={1}
                    max={12000}
                    value={width}
                    onChange={(event) => setWidthLinked(event.target.value)}
                    className="tabular-nums"
                  />
                </div>
                <Button
                  variant={lockAspect ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setLockAspect((value) => !value)}
                  aria-pressed={lockAspect}
                  aria-label={
                    lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"
                  }
                  title={
                    lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"
                  }
                >
                  {lockAspect ? (
                    <Link2 className="size-4" aria-hidden />
                  ) : (
                    <Unlink className="size-4" aria-hidden />
                  )}
                </Button>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="resize-height">Height</Label>
                  <Input
                    id="resize-height"
                    type="number"
                    min={1}
                    max={12000}
                    value={height}
                    onChange={(event) => setHeightLinked(event.target.value)}
                    className="tabular-nums"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <Button
                    key={percent}
                    variant="outline"
                    size="sm"
                    onClick={() => scaleBy(percent)}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Presets</span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset.width, preset.height)}
                      title={preset.note}
                      className="border-border text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/45 rounded-full border px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-[3px]"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Fit</span>
                <ToggleGroup
                  type="single"
                  value={fit}
                  onValueChange={(value) => value && setFit(value as Fit)}
                  aria-label="Fit mode"
                  className="w-full"
                >
                  {FITS.map((item) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      title={item.hint}
                      className="flex-1"
                    >
                      {item.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <p className="text-muted-foreground text-xs">
                  {FITS.find((item) => item.value === fit)?.hint}
                </p>
              </div>

              {fit === "contain" || format === "image/jpeg" ? (
                <div className="flex items-center gap-3">
                  <Label htmlFor="resize-background">Background</Label>
                  <input
                    id="resize-background"
                    type="color"
                    value={background}
                    onChange={(event) => setBackground(event.target.value)}
                    className="border-input h-9 w-14 cursor-pointer rounded-md border bg-transparent p-1"
                  />
                  <span className="text-muted-foreground text-xs">
                    Fills any area the image doesn&apos;t cover.
                  </span>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Output format</span>
                <ToggleGroup
                  type="single"
                  value={format}
                  onValueChange={(value) =>
                    value && setFormat(value as OutputFormat)
                  }
                  aria-label="Output format"
                  className="w-full"
                >
                  {FORMATS.map((item) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      className="flex-1"
                    >
                      {item.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {selectedFormat.lossy ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resize-quality">Quality</Label>
                    <span className="text-muted-foreground text-sm tabular-nums">
                      {quality}%
                    </span>
                  </div>
                  <Slider
                    id="resize-quality"
                    min={30}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={([value]) => setQuality(value ?? 85)}
                  />
                </div>
              ) : null}

              <Button
                onClick={() => void run()}
                disabled={busy || !dimensionsValid}
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                {busy ? "Resizing…" : "Resize image"}
              </Button>

              {!dimensionsValid ? (
                <p role="alert" className="text-destructive text-sm">
                  Enter a width and height between 1 and 12000 pixels.
                </p>
              ) : null}
            </>
          ) : null}

          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Result</h2>

          {!file ? (
            <p className="text-muted-foreground text-sm">
              Choose an image to get started. It is decoded, resized and
              re-encoded entirely in this tab — the file never leaves your
              device.
            </p>
          ) : null}

          {image ? (
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat
                label="Original"
                value={`${image.naturalWidth} × ${image.naturalHeight}`}
              />
              <Stat
                label="Original size"
                value={formatBytes(file?.size ?? 0)}
              />
              <Stat
                label="New size"
                value={result ? `${result.width} × ${result.height}` : "—"}
              />
              <Stat
                label="New file"
                value={result ? formatBytes(result.blob.size) : "—"}
              />
            </dl>
          ) : null}

          {result && resultPreview ? (
            <>
              <div className="bg-muted/30 border-border/60 grid place-items-center overflow-auto rounded-xl border p-4">
                {/* A blob from the user's own file — next/image can't optimise
                    an in-memory source. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultPreview}
                  alt={`Resized to ${result.width} by ${result.height} pixels`}
                  className="max-h-112 max-w-full object-contain"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => downloadBlob(result.blob, result.filename)}
                  className="grow sm:grow-0"
                >
                  <Download className="size-4" aria-hidden />
                  Download {selectedFormat.label}
                </Button>
                <span
                  className={cn(
                    "text-sm",
                    result.blob.size < (file?.size ?? 0)
                      ? "text-success"
                      : "text-muted-foreground"
                  )}
                >
                  {file && result.blob.size < file.size
                    ? `${Math.round((1 - result.blob.size / file.size) * 100)}% smaller than the original`
                    : "Larger than the original — try a lower quality or WebP"}
                </span>
              </div>
            </>
          ) : image ? (
            <p className="text-muted-foreground text-sm">
              Set the dimensions you want and press Resize.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="text-base font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

"use client";

import { Download, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import * as React from "react";

import { FileDropzone } from "@/components/tools/file-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useObjectUrl } from "@/hooks/use-object-url";
import { cn, downloadBlob, formatBytes, replaceExtension } from "@/lib/utils";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,image/tiff";
const MAX_SIZE = 25 * 1024 * 1024;

const FORMATS = [
  {
    value: "webp",
    label: "WebP",
    hint: "Best all-round for the web — smaller than JPG at the same quality.",
  },
  {
    value: "avif",
    label: "AVIF",
    hint: "Smallest files, slower to encode. Supported by all modern browsers.",
  },
  {
    value: "jpeg",
    label: "JPG",
    hint: "Universal support. No transparency.",
  },
  {
    value: "png",
    label: "PNG",
    hint: "Lossless with transparency. Larger files.",
  },
] as const;

type FormatValue = (typeof FORMATS)[number]["value"];

interface Result {
  blob: Blob;
  filename: string;
  originalSize: number;
  outputSize: number;
  dimensions: string;
}

export function ImageConverterTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [format, setFormat] = React.useState<FormatValue>("webp");
  const [quality, setQuality] = React.useState(85);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  const preview = useObjectUrl(file);
  const resultPreview = useObjectUrl(result?.blob ?? null);

  const selected = FORMATS.find((item) => item.value === format)!;

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);

    try {
      const body = new FormData();
      body.set("file", file);
      body.set("format", format);
      body.set("quality", String(quality));

      const response = await fetch("/api/image", { method: "POST", body });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Conversion failed.");
      }

      const blob = await response.blob();
      const width = response.headers.get("X-Image-Width");
      const height = response.headers.get("X-Image-Height");

      setResult({
        blob,
        filename: replaceExtension(
          file.name,
          format === "jpeg" ? "jpg" : format
        ),
        originalSize: file.size,
        outputSize: blob.size,
        dimensions: width && height ? `${width} × ${height}` : "",
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  };

  const delta = result ? result.outputSize - result.originalSize : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <FileDropzone
            id="converter-file"
            file={file}
            onFileChange={(next) => {
              setFile(next);
              setResult(null);
              setError(null);
            }}
            accept={ACCEPT}
            maxSize={MAX_SIZE}
            hint="JPG, PNG, WebP, AVIF, GIF or TIFF"
            preview={preview}
          />

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm leading-none font-medium">
              Convert to
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((item) => (
                <label
                  key={item.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                    "has-[:focus-visible]:ring-ring/40 has-[:focus-visible]:ring-[3px]",
                    format === item.value
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border hover:border-primary/40 hover:bg-accent/40"
                  )}
                >
                  <input
                    type="radio"
                    name="format"
                    value={item.value}
                    checked={format === item.value}
                    onChange={() => {
                      setFormat(item.value);
                      setResult(null);
                    }}
                    className="sr-only"
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {selected.hint}
            </p>
          </fieldset>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor="convert-quality">Quality</Label>
              <span className="text-muted-foreground text-sm tabular-nums">
                {quality}
              </span>
            </div>
            <Slider
              id="convert-quality"
              value={[quality]}
              onValueChange={([next]) => setQuality(next ?? 85)}
              min={10}
              max={100}
              step={1}
              aria-label="Output quality"
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button onClick={() => void convert()} disabled={!file || busy}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Converting…
              </>
            ) : (
              <>
                <RefreshCw className="size-4" aria-hidden />
                Convert to {selected.label}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className={cn(!result && "border-dashed")}>
        <CardContent className="flex min-h-72 flex-col gap-5">
          <h2 className="text-sm font-semibold">Result</h2>

          {busy ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <Loader2
                className="text-muted-foreground size-6 animate-spin"
                aria-hidden
              />
              <p className="text-muted-foreground text-sm">
                Converting to {selected.label}…
              </p>
            </div>
          ) : result ? (
            <div className="flex flex-1 flex-col gap-5">
              {resultPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resultPreview}
                  alt={`Converted ${selected.label} result`}
                  className="bg-muted/40 max-h-56 w-full rounded-lg object-contain"
                />
              ) : null}

              <dl className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
                <div className="flex flex-col">
                  <dt className="text-muted-foreground text-xs">Original</dt>
                  <dd className="font-medium tabular-nums">
                    {formatBytes(result.originalSize)}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-muted-foreground text-xs">
                    {selected.label}
                  </dt>
                  <dd
                    className={cn(
                      "font-medium tabular-nums",
                      delta < 0 ? "text-success" : "text-warning"
                    )}
                  >
                    {formatBytes(result.outputSize)}
                    <span className="ml-1.5 text-xs">
                      ({delta < 0 ? "−" : "+"}
                      {Math.abs(
                        Math.round((delta / result.originalSize) * 100)
                      )}
                      %)
                    </span>
                  </dd>
                </div>
                {result.dimensions ? (
                  <div className="col-span-2 flex flex-col">
                    <dt className="text-muted-foreground text-xs">
                      Dimensions
                    </dt>
                    <dd className="font-medium tabular-nums">
                      {result.dimensions}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <Button
                onClick={() => downloadBlob(result.blob, result.filename)}
                className="mt-auto"
              >
                <Download className="size-4" aria-hidden />
                Download {result.filename}
              </Button>
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm">
              <p>Your converted image will appear here.</p>
              <p className="text-xs">
                Uploads are processed and returned immediately — nothing is
                stored.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

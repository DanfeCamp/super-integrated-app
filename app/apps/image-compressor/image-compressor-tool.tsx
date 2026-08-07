"use client";

import { Download, Loader2, Sparkles, TriangleAlert } from "lucide-react";
import * as React from "react";

import { FileDropzone } from "@/components/tools/file-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useObjectUrl } from "@/hooks/use-object-url";
import { cn, downloadBlob, formatBytes, replaceExtension } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_SIZE = 25 * 1024 * 1024;

interface Result {
  blob: Blob;
  filename: string;
  originalSize: number;
  outputSize: number;
}

export function ImageCompressorTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [quality, setQuality] = React.useState(70);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  const preview = useObjectUrl(file);
  const resultPreview = useObjectUrl(result?.blob ?? null);

  const reset = (next: File | null) => {
    setFile(next);
    setResult(null);
    setError(null);
  };

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);

    try {
      const body = new FormData();
      body.set("file", file);
      body.set("quality", String(quality));

      const response = await fetch("/api/image", { method: "POST", body });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Compression failed.");
      }

      const blob = await response.blob();
      const format = response.headers.get("X-Output-Format") ?? "jpeg";

      setResult({
        blob,
        filename: replaceExtension(
          file.name,
          format === "jpeg" ? "jpg" : format
        ),
        originalSize: file.size,
        outputSize: blob.size,
      });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Compression failed."
      );
    } finally {
      setBusy(false);
    }
  };

  const saved = result ? result.originalSize - result.outputSize : 0;
  const savedPercent = result
    ? Math.round((saved / result.originalSize) * 100)
    : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <FileDropzone
            id="compressor-file"
            file={file}
            onFileChange={reset}
            accept={ACCEPT}
            maxSize={MAX_SIZE}
            hint="JPG, PNG, WebP or AVIF"
            preview={preview}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor="quality">Quality</Label>
              <span className="text-muted-foreground text-sm tabular-nums">
                {quality}
                <span className="ml-1.5 text-xs">
                  {quality >= 85
                    ? "near-lossless"
                    : quality >= 60
                      ? "balanced"
                      : "aggressive"}
                </span>
              </span>
            </div>
            <Slider
              id="quality"
              value={[quality]}
              onValueChange={([next]) => setQuality(next ?? 70)}
              min={10}
              max={100}
              step={1}
              aria-label="Compression quality"
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button onClick={() => void compress()} disabled={!file || busy}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Compressing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden />
                Compress image
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
                Optimising your image…
              </p>
            </div>
          ) : result ? (
            <div className="flex flex-1 flex-col gap-5">
              {resultPreview ? (
                // Object URL for a locally produced blob — not optimisable.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resultPreview}
                  alt="Compressed result"
                  className="bg-muted/40 max-h-56 w-full rounded-lg object-contain"
                />
              ) : null}

              <div
                className={cn(
                  "flex flex-col gap-3 rounded-lg border p-4",
                  saved > 0
                    ? "border-success/25 bg-success/8"
                    : "border-warning/25 bg-warning/8"
                )}
              >
                <p className="text-2xl font-semibold tabular-nums">
                  {saved > 0 ? `${savedPercent}% smaller` : "No size reduction"}
                </p>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground text-xs">Original</dt>
                    <dd className="font-medium tabular-nums">
                      {formatBytes(result.originalSize)}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground text-xs">
                      Compressed
                    </dt>
                    <dd className="font-medium tabular-nums">
                      {formatBytes(result.outputSize)}
                    </dd>
                  </div>
                </dl>
                {saved <= 0 ? (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    This image is already well optimised. Try a lower quality
                    setting, or convert it to WebP or AVIF instead.
                  </p>
                ) : null}
              </div>

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
              <p>Your compressed image will appear here.</p>
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

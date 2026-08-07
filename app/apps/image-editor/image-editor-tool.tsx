"use client";

import {
  Download,
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import * as React from "react";

import { FileDropzone } from "@/components/tools/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { downloadBlob, replaceExtension } from "@/lib/utils";

interface Adjustments {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  blur: number;
  sepia: number;
}

const DEFAULTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  blur: 0,
  sepia: 0,
};

const CONTROLS: {
  key: keyof Adjustments;
  label: string;
  min: number;
  max: number;
  unit: string;
}[] = [
  { key: "brightness", label: "Brightness", min: 0, max: 200, unit: "%" },
  { key: "contrast", label: "Contrast", min: 0, max: 200, unit: "%" },
  { key: "saturate", label: "Saturation", min: 0, max: 200, unit: "%" },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%" },
  { key: "blur", label: "Blur", min: 0, max: 20, unit: "px" },
];

const PRESETS: { name: string; values: Partial<Adjustments> }[] = [
  { name: "Original", values: DEFAULTS },
  { name: "Vivid", values: { saturate: 145, contrast: 112 } },
  { name: "Mono", values: { grayscale: 100, contrast: 110 } },
  { name: "Warm", values: { sepia: 35, saturate: 115, brightness: 104 } },
  { name: "Faded", values: { saturate: 72, brightness: 108, contrast: 88 } },
];

function toFilterString(adjustments: Adjustments) {
  return [
    `brightness(${adjustments.brightness}%)`,
    `contrast(${adjustments.contrast}%)`,
    `saturate(${adjustments.saturate}%)`,
    `grayscale(${adjustments.grayscale}%)`,
    `sepia(${adjustments.sepia}%)`,
    `blur(${adjustments.blur}px)`,
  ].join(" ");
}

/**
 * Entirely client-side: the file is decoded into an `Image`, previewed with CSS
 * filters, and only rasterised through a canvas at export time. Nothing is
 * uploaded, and the preview stays cheap because filters are GPU-composited
 * rather than redrawn per slider tick.
 */
export function ImageEditorTool() {
  const [file, setFile] = React.useState<File | null>(null);
  // Keyed by the File it was decoded from, so a stale image can never be
  // rendered against a newly chosen file.
  const [loaded, setLoaded] = React.useState<{
    file: File;
    element: HTMLImageElement;
  } | null>(null);
  const [adjustments, setAdjustments] = React.useState<Adjustments>(DEFAULTS);
  const [rotation, setRotation] = React.useState(0);
  const [flipX, setFlipX] = React.useState(false);
  const [flipY, setFlipY] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const element = new Image();
    element.onload = () => setLoaded({ file, element });
    element.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const image = loaded?.file === file ? loaded.element : null;

  const reset = () => {
    setAdjustments(DEFAULTS);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  };

  const filter = toFilterString(adjustments);
  const quarterTurned = rotation % 180 !== 0;

  const exportImage = async () => {
    if (!image || !file) return;
    setExporting(true);

    try {
      const canvas = document.createElement("canvas");
      // A quarter turn swaps the output's width and height.
      canvas.width = quarterTurned ? image.naturalHeight : image.naturalWidth;
      canvas.height = quarterTurned ? image.naturalWidth : image.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");

      context.filter = filter;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotation * Math.PI) / 180);
      context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      context.drawImage(
        image,
        -image.naturalWidth / 2,
        -image.naturalHeight / 2
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (blob) downloadBlob(blob, replaceExtension(file.name, "png"));
    } finally {
      setExporting(false);
    }
  };

  const isDirty =
    rotation !== 0 ||
    flipX ||
    flipY ||
    CONTROLS.some(
      (control) => adjustments[control.key] !== DEFAULTS[control.key]
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-start">
      <Card>
        <CardContent className="flex min-h-96 flex-col items-center justify-center gap-4 p-4 sm:p-6">
          {!image ? (
            <FileDropzone
              id="editor-file"
              file={file}
              onFileChange={setFile}
              accept="image/*"
              maxSize={25 * 1024 * 1024}
              hint="Any image format your browser can open"
              className="w-full"
            />
          ) : (
            <>
              <div className="bg-muted/30 grid w-full place-items-center overflow-hidden rounded-lg p-4">
                {/* Object URL of a user-chosen file — next/image can't help. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt="Preview of the image being edited"
                  className="max-h-[26rem] max-w-full transition-[filter,transform] duration-200"
                  style={{
                    filter,
                    transform: `rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
                  }}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <p className="text-muted-foreground truncate text-xs">
                  {file?.name} · {image.naturalWidth} × {image.naturalHeight}
                </p>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                  Choose another
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-24">
        <CardContent className="flex flex-col gap-6">
          <fieldset
            disabled={!image}
            className="flex flex-col gap-3 disabled:opacity-50"
          >
            <legend className="mb-2 text-sm font-semibold">Transform</legend>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Rotate left"
                onClick={() =>
                  setRotation((previous) => (previous + 270) % 360)
                }
              >
                <RotateCcw className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Rotate right"
                onClick={() => setRotation((previous) => (previous + 90) % 360)}
              >
                <RotateCw className="size-4" />
              </Button>
              <Button
                variant={flipX ? "default" : "outline"}
                size="icon"
                aria-label="Flip horizontally"
                aria-pressed={flipX}
                onClick={() => setFlipX((previous) => !previous)}
              >
                <FlipHorizontal2 className="size-4" />
              </Button>
              <Button
                variant={flipY ? "default" : "outline"}
                size="icon"
                aria-label="Flip vertically"
                aria-pressed={flipY}
                onClick={() => setFlipY((previous) => !previous)}
              >
                <FlipVertical2 className="size-4" />
              </Button>
            </div>
          </fieldset>

          <fieldset
            disabled={!image}
            className="flex flex-col gap-2 disabled:opacity-50"
          >
            <legend className="mb-2 text-sm font-semibold">Presets</legend>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAdjustments({ ...DEFAULTS, ...preset.values })
                  }
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset
            disabled={!image}
            className="flex flex-col gap-5 disabled:opacity-50"
          >
            <legend className="mb-1 text-sm font-semibold">Adjustments</legend>
            {CONTROLS.map((control) => (
              <div key={control.key} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <Label htmlFor={control.key} className="text-sm font-normal">
                    {control.label}
                  </Label>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {adjustments[control.key]}
                    {control.unit}
                  </span>
                </div>
                <Slider
                  id={control.key}
                  value={[adjustments[control.key]]}
                  onValueChange={([next]) =>
                    setAdjustments((previous) => ({
                      ...previous,
                      [control.key]: next ?? DEFAULTS[control.key],
                    }))
                  }
                  min={control.min}
                  max={control.max}
                  step={1}
                  aria-label={control.label}
                />
              </div>
            ))}
          </fieldset>

          <div className="flex flex-col gap-2 border-t pt-5">
            <Button
              onClick={() => void exportImage()}
              disabled={!image || exporting}
            >
              <Download className="size-4" aria-hidden />
              {exporting ? "Exporting…" : "Download PNG"}
            </Button>
            <Button variant="ghost" onClick={reset} disabled={!isDirty}>
              Reset adjustments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

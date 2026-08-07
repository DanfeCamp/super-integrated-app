"use client";

import { AudioLines, Download, Loader2, TriangleAlert, X } from "lucide-react";
import * as React from "react";

import { FileDropzone } from "@/components/tools/file-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useObjectUrl } from "@/hooks/use-object-url";
import { cn, downloadBlob, formatBytes, replaceExtension } from "@/lib/utils";

import {
  ACCEPTED_TYPES,
  encodeWav,
  formatDuration,
  MAX_DURATION_SECONDS,
  peakAmplitude,
  processAudio,
  resolveSampleRate,
  SAMPLE_RATES,
  wavByteLength,
  type BitDepth,
  type ConvertOptions,
} from "./wav";

const MAX_FILE_SIZE = 60 * 1024 * 1024;

/** What we learn about the file once it has been decoded. */
interface Source {
  buffer: AudioBuffer;
  peak: number;
  name: string;
  size: number;
}

interface Result {
  blob: Blob;
  filename: string;
  sourceSize: number;
  sampleRate: number;
  channels: number;
  duration: number;
}

type Stage = "idle" | "decoding" | "rendering" | "encoding";

export function AudioConverterTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [source, setSource] = React.useState<Source | null>(null);
  const [stage, setStage] = React.useState<Stage>("idle");
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  const [sampleRate, setSampleRate] = React.useState<string>("original");
  const [channels, setChannels] = React.useState<string>("original");
  const [bitDepth, setBitDepth] = React.useState<string>("16");
  const [normalise, setNormalise] = React.useState(false);
  const [range, setRange] = React.useState<[number, number]>([0, 0]);

  const abortRef = React.useRef<AbortController | null>(null);
  const resultUrl = useObjectUrl(result?.blob ?? null);

  // Abandoning a decode mid-flight would otherwise resolve into stale state.
  React.useEffect(() => () => abortRef.current?.abort(), []);

  const reset = React.useCallback((next: File | null) => {
    abortRef.current?.abort();
    setFile(next);
    setSource(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setStage(next ? "decoding" : "idle");
  }, []);

  /* ------------------------------ decoding ------------------------------ */

  React.useEffect(() => {
    if (!file) return;

    let cancelled = false;

    const decode = async () => {
      // Constructed per decode and closed straight after: a page holding an
      // open AudioContext keeps the audio hardware awake for no reason.
      const context = new AudioContext();

      try {
        const bytes = await file.arrayBuffer();
        const buffer = await context.decodeAudioData(bytes);
        if (cancelled) return;

        if (buffer.duration > MAX_DURATION_SECONDS) {
          setError(
            `That track is ${formatDuration(buffer.duration)} long. Decoding happens in memory, so anything over ${MAX_DURATION_SECONDS / 60} minutes risks crashing the tab — trim it first.`
          );
          setStage("idle");
          return;
        }

        setSource({
          buffer,
          peak: peakAmplitude(buffer),
          name: file.name,
          size: file.size,
        });
        setRange([0, buffer.duration]);
        setStage("idle");
      } catch {
        if (cancelled) return;
        setError(
          "Your browser couldn't decode that file. It may be a format it doesn't support, or the file may be damaged."
        );
        setStage("idle");
      } finally {
        void context.close();
      }
    };

    void decode();
    return () => {
      cancelled = true;
    };
  }, [file]);

  /* ----------------------------- converting ----------------------------- */

  const options: ConvertOptions = React.useMemo(
    () => ({
      sampleRate: sampleRate === "original" ? null : Number(sampleRate),
      channels: channels === "original" ? null : (Number(channels) as 1 | 2),
      bitDepth: Number(bitDepth) as BitDepth,
      start: range[0],
      end: range[1],
      normalise,
    }),
    [sampleRate, channels, bitDepth, range, normalise]
  );

  const convert = async () => {
    if (!source) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setStage("rendering");
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const rendered = await processAudio(source.buffer, options, source.peak);
      if (controller.signal.aborted) return;

      setStage("encoding");
      const blob = await encodeWav(
        rendered,
        options.bitDepth,
        setProgress,
        controller.signal
      );

      setResult({
        blob,
        filename: replaceExtension(source.name, "wav"),
        sourceSize: source.size,
        sampleRate: rendered.sampleRate,
        channels: rendered.numberOfChannels,
        duration: rendered.duration,
      });
    } catch (caught) {
      if ((caught as Error)?.name === "AbortError") return;
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong while converting."
      );
    } finally {
      if (!controller.signal.aborted) setStage("idle");
      abortRef.current = null;
    }
  };

  const busy = stage !== "idle";
  const selection = range[1] - range[0];

  // Live estimate, so the size implication of every control is visible before
  // committing to a conversion — 24-bit 48 kHz stereo is 4× a 16-bit mono 22 k.
  const estimatedBytes = source
    ? Math.round(
        44 +
          selection *
            resolveSampleRate(options.sampleRate ?? source.buffer.sampleRate) *
            (options.channels ?? source.buffer.numberOfChannels) *
            (options.bitDepth / 8)
      )
    : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <FileDropzone
            id="audio-file"
            file={file}
            onFileChange={reset}
            accept={ACCEPTED_TYPES}
            maxSize={MAX_FILE_SIZE}
            hint="MP3, M4A, AAC, FLAC, OGG, Opus or WAV"
            disabled={busy}
          />

          {stage === "decoding" ? (
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Decoding audio…
            </p>
          ) : null}

          {source ? (
            <>
              <SourceSummary source={source} />

              <fieldset
                disabled={busy}
                className="flex flex-col gap-6 disabled:opacity-60"
              >
                <legend className="sr-only">Output settings</legend>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Sample rate" htmlFor="sample-rate">
                    <Select value={sampleRate} onValueChange={setSampleRate}>
                      <SelectTrigger id="sample-rate">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">
                          Original (
                          {(source.buffer.sampleRate / 1000).toFixed(1)}
                          kHz)
                        </SelectItem>
                        {SAMPLE_RATES.map((rate) => (
                          <SelectItem key={rate} value={String(rate)}>
                            {(rate / 1000).toFixed(rate % 1000 === 0 ? 0 : 1)}{" "}
                            kHz
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Channels" htmlFor="channels">
                    <Select value={channels} onValueChange={setChannels}>
                      <SelectTrigger id="channels">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">
                          Original (
                          {source.buffer.numberOfChannels === 1
                            ? "mono"
                            : `${source.buffer.numberOfChannels}ch`}
                          )
                        </SelectItem>
                        <SelectItem value="1">Mono</SelectItem>
                        <SelectItem value="2">Stereo</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Bit depth" htmlFor="bit-depth">
                    <Select value={bitDepth} onValueChange={setBitDepth}>
                      <SelectTrigger id="bit-depth">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16">16-bit PCM</SelectItem>
                        <SelectItem value="24">24-bit PCM</SelectItem>
                        <SelectItem value="32">32-bit float</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <Label htmlFor="trim">Trim</Label>
                    <span className="text-muted-foreground text-sm tabular-nums">
                      {formatDuration(range[0])} – {formatDuration(range[1])}
                      <span className="ml-2 text-xs">
                        ({formatDuration(selection)} selected)
                      </span>
                    </span>
                  </div>
                  {/* Radix renders the slider as spans, not form controls, so
                      the enclosing disabled fieldset doesn't reach it. */}
                  <Slider
                    id="trim"
                    disabled={busy}
                    value={range}
                    onValueChange={([start, end]) =>
                      setRange([start ?? 0, end ?? source.buffer.duration])
                    }
                    min={0}
                    max={source.buffer.duration}
                    step={0.1}
                    minStepsBetweenThumbs={1}
                    aria-label="Trim range in seconds"
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="normalise">Normalise volume</Label>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Lifts the loudest peak to full scale.{" "}
                      {source.peak > 0
                        ? `This track peaks at ${Math.round(source.peak * 100)}%.`
                        : "This track is silent."}
                    </p>
                  </div>
                  <Switch
                    id="normalise"
                    checked={normalise}
                    onCheckedChange={setNormalise}
                  />
                </div>
              </fieldset>
            </>
          ) : null}

          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => void convert()}
              disabled={!source || busy || selection < 0.1}
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  {stage === "encoding" ? "Writing WAV…" : "Processing…"}
                </>
              ) : (
                <>
                  <AudioLines className="size-4" aria-hidden />
                  Convert to WAV
                </>
              )}
            </Button>
            {busy && stage !== "decoding" ? (
              <Button
                variant="outline"
                onClick={() => {
                  abortRef.current?.abort();
                  setStage("idle");
                  setProgress(0);
                }}
              >
                <X className="size-4" aria-hidden />
                Cancel
              </Button>
            ) : null}
            {source ? (
              <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                ≈ {formatBytes(estimatedBytes)} output
              </span>
            ) : null}
          </div>

          {stage === "encoding" ? (
            <Progress
              value={Math.round(progress * 100)}
              aria-label="Encoding progress"
            />
          ) : null}
        </CardContent>
      </Card>

      <Card className={cn(!result && "border-dashed")}>
        <CardContent
          role="status"
          aria-live="polite"
          aria-busy={busy}
          className="flex min-h-72 flex-col gap-5"
        >
          <h2 className="text-sm font-semibold">Result</h2>

          {result ? (
            <div className="flex flex-1 flex-col gap-5">
              {resultUrl ? (
                <audio
                  key={resultUrl}
                  src={resultUrl}
                  controls
                  preload="metadata"
                  className="w-full"
                />
              ) : null}

              <div className="border-success/25 bg-success/8 flex flex-col gap-3 rounded-lg border p-4">
                <p className="text-2xl font-semibold tabular-nums">
                  {formatBytes(result.blob.size)}
                </p>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <Stat label="Source" value={formatBytes(result.sourceSize)} />
                  <Stat
                    label="Length"
                    value={formatDuration(result.duration)}
                  />
                  <Stat
                    label="Sample rate"
                    value={`${(result.sampleRate / 1000).toFixed(1)} kHz`}
                  />
                  <Stat
                    label="Channels"
                    value={result.channels === 1 ? "Mono" : "Stereo"}
                  />
                </dl>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  WAV is uncompressed, so the file is usually larger than the
                  source — that is the point of it.
                </p>
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
              <p>Your converted audio will appear here.</p>
              <p className="text-xs">
                Decoding and encoding both run in this tab — the file never
                leaves your device.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SourceSummary({ source }: { source: Source }) {
  const { buffer } = source;

  return (
    <dl className="bg-muted/40 grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm sm:grid-cols-4">
      <Stat label="Length" value={formatDuration(buffer.duration)} />
      <Stat
        label="Sample rate"
        value={`${(buffer.sampleRate / 1000).toFixed(1)} kHz`}
      />
      <Stat
        label="Channels"
        value={buffer.numberOfChannels === 1 ? "Mono" : "Stereo"}
      />
      <Stat
        label="Uncompressed"
        value={formatBytes(wavByteLength(buffer, 16))}
      />
    </dl>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

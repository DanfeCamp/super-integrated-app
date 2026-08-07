"use client";

import { FileUp, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** `accept` attribute value, e.g. `"image/png,image/jpeg"`. */
  accept?: string;
  /** Rejected above this size, in bytes. */
  maxSize?: number;
  /** Human-readable hint, e.g. `"PNG, JPG, WebP or AVIF"`. */
  hint?: string;
  /** Preview thumbnail rendered in place of the icon once a file is chosen. */
  preview?: string | null;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Shared upload surface for every file-based tool. Handles drag state,
 * client-side type/size validation and keyboard activation, and reports
 * rejections inline instead of silently ignoring the file (which is what the
 * previous per-tool implementations did).
 */
export function FileDropzone({
  file,
  onFileChange,
  accept,
  maxSize = 25 * 1024 * 1024,
  hint,
  preview,
  disabled,
  className,
  id = "file-dropzone",
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragDepth = React.useRef(0);

  const accepts = React.useMemo(
    () =>
      accept
        ?.split(",")
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean) ?? [],
    [accept]
  );

  const matchesAccept = React.useCallback(
    (candidate: File) => {
      if (accepts.length === 0) return true;
      const type = candidate.type.toLowerCase();
      const name = candidate.name.toLowerCase();
      return accepts.some((rule) => {
        if (rule.startsWith(".")) return name.endsWith(rule);
        if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
        return type === rule;
      });
    },
    [accepts]
  );

  const accept_ = React.useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return;

      if (!matchesAccept(candidate)) {
        setError(`${candidate.name} isn't a supported file type.`);
        return;
      }
      if (candidate.size > maxSize) {
        setError(
          `${candidate.name} is ${formatBytes(candidate.size)} — the limit is ${formatBytes(maxSize)}.`
        );
        return;
      }

      setError(null);
      onFileChange(candidate);
    },
    [matchesAccept, maxSize, onFileChange]
  );

  const clear = () => {
    setError(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* The label *is* the control (it wraps the file input), so the drag
          handlers belong here rather than on a separate wrapper. */}
      <label
        htmlFor={id}
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current += 1;
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setIsDragging(false);
          if (!disabled) accept_(event.dataTransfer.files[0]);
        }}
        className={cn(
          "group relative flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          "hover:border-primary/50 hover:bg-accent/40",
          "has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/40 has-[:focus-visible]:ring-[3px]",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30",
          error && "border-destructive/50",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => accept_(event.target.files?.[0])}
        />

        {preview ? (
          // Blob/data URL of a user-selected file — next/image can't optimise
          // an in-memory source, so a plain img is correct here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="max-h-36 max-w-full rounded-lg object-contain shadow-sm"
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              "grid size-12 place-items-center rounded-full transition-colors",
              isDragging
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <FileUp className="size-5" />
          </span>
        )}

        {file ? (
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium break-all">{file.name}</span>
            <span className="text-muted-foreground text-xs">
              {formatBytes(file.size)} · click to replace
            </span>
          </span>
        ) : (
          <span className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              <span className="text-primary">Click to upload</span>
              <span className="text-muted-foreground hidden sm:inline">
                {" "}
                or drag and drop
              </span>
            </span>
            {hint ? (
              <span className="text-muted-foreground text-xs">
                {hint} · up to {formatBytes(maxSize)}
              </span>
            ) : null}
          </span>
        )}

        {file ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove file"
            className="absolute top-2 right-2"
            onClick={(event) => {
              event.preventDefault();
              clear();
            }}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </label>

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Human-readable byte size, e.g. `1.4 MB`. */
export function formatBytes(bytes: number, decimals = 1) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${parseFloat((bytes / 1024 ** i).toFixed(decimals))} ${units[i]}`;
}

/** Clamp `value` into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** `slugify("Knock Knock")` → `"knock-knock"`. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Title-cases a slug segment: `"world-clock"` → `"World Clock"`. */
export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Trigger a client-side download for arbitrary content without leaking the
 * object URL (Safari needs the anchor attached to the document first).
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  downloadUrl(url, filename);
  // Revoke on the next frame so Safari has committed the navigation.
  requestAnimationFrame(() => URL.revokeObjectURL(url));
}

export function downloadUrl(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/** Decode a base64 payload into a Blob without an intermediate data: URL. */
export function base64ToBlob(
  base64: string,
  type = "application/octet-stream"
) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}

/** Swap a filename's extension, preserving the stem. */
export function replaceExtension(filename: string, extension: string) {
  const stem = filename.replace(/\.[^./\\]+$/, "");
  return `${stem}.${extension.toLowerCase()}`;
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

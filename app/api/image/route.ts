import sharp from "sharp";

import { jsonError, MAX_UPLOAD_BYTES, withErrorHandling } from "@/lib/api";

export const runtime = "nodejs";
// Image work is per-request and streams a binary body back; never cache it.
export const dynamic = "force-dynamic";

const FORMATS = ["jpeg", "png", "webp", "avif"] as const;
type Format = (typeof FORMATS)[number];

const MIME: Record<Format, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

function isFormat(value: string): value is Format {
  return (FORMATS as readonly string[]).includes(value);
}

/**
 * One endpoint serves both the compressor and the converter — they differ only
 * in whether the output format is inherited or chosen. It streams the encoded
 * image back as binary with the original/compressed sizes in headers, which
 * avoids the base64 round-trip the old routes used (a third larger, and it
 * forced the whole file through JSON).
 */
export const POST = withErrorHandling(async (request: Request) => {
  const form = await request.formData();

  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError("No image was uploaded.");
  }
  if (file.size === 0) {
    return jsonError("The uploaded file is empty.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError(
      `Images must be ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB or smaller.`,
      413
    );
  }

  const requestedFormat = String(form.get("format") ?? "").toLowerCase();
  const qualityRaw = Number(form.get("quality") ?? 80);
  const quality = Number.isFinite(qualityRaw)
    ? Math.min(100, Math.max(1, Math.round(qualityRaw)))
    : 80;

  const input = Buffer.from(await file.arrayBuffer());

  let pipeline = sharp(input, { failOn: "error" });
  let metadata;
  try {
    metadata = await pipeline.metadata();
  } catch {
    return jsonError("That file doesn't look like a supported image.", 415);
  }

  // No explicit format means "compress in place" — keep the source encoding.
  const sourceFormat: string = metadata.format;
  const target =
    requestedFormat && isFormat(requestedFormat)
      ? requestedFormat
      : sourceFormat && isFormat(sourceFormat)
        ? sourceFormat
        : null;

  if (!target) {
    return jsonError(
      "Unsupported image format. Use JPG, PNG, WebP or AVIF.",
      415
    );
  }

  // Strip metadata (EXIF can carry GPS coordinates) and normalise rotation.
  pipeline = pipeline.rotate();

  switch (target) {
    case "jpeg":
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case "png":
      // PNG is lossless: map quality onto the palette/effort knobs instead.
      pipeline = pipeline.png({
        compressionLevel: 9,
        palette: quality < 90,
        quality,
        effort: 7,
      });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality, effort: 4 });
      break;
    case "avif":
      pipeline = pipeline.avif({ quality, effort: 4 });
      break;
  }

  const output = await pipeline.toBuffer();

  return new Response(new Uint8Array(output), {
    status: 200,
    headers: {
      "Content-Type": MIME[target],
      "Content-Length": String(output.byteLength),
      "Cache-Control": "no-store",
      "X-Original-Size": String(file.size),
      "X-Output-Size": String(output.byteLength),
      "X-Output-Format": target,
      "X-Image-Width": String(metadata.width ?? 0),
      "X-Image-Height": String(metadata.height ?? 0),
      // Required so the browser can read the custom headers above.
      "Access-Control-Expose-Headers":
        "X-Original-Size, X-Output-Size, X-Output-Format, X-Image-Width, X-Image-Height",
    },
  });
});

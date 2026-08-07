/**
 * Canvas resizing.
 *
 * Everything happens on the user's device: the file is decoded into an
 * `HTMLImageElement`, drawn into a canvas at the requested size and re-encoded.
 * Nothing is uploaded.
 */

export type Fit = "contain" | "cover" | "stretch";
export type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

export interface ResizeOptions {
  width: number;
  height: number;
  fit: Fit;
  /** Used to fill the letterbox in `contain`, and behind transparent JPEGs. */
  background: string;
  format: OutputFormat;
  /** 0–1, ignored for PNG. */
  quality: number;
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image couldn't be decoded by this browser."));
    };
    image.src = url;
  });
}

/**
 * Where the source should land inside the destination canvas for a given fit.
 * `cover` crops around the centre; `contain` letterboxes.
 */
function placement(
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
  fit: Fit
) {
  if (fit === "stretch") {
    return {
      sx: 0,
      sy: 0,
      sw: sourceWidth,
      sh: sourceHeight,
      dx: 0,
      dy: 0,
      dw: width,
      dh: height,
    };
  }

  const scale =
    fit === "cover"
      ? Math.max(width / sourceWidth, height / sourceHeight)
      : Math.min(width / sourceWidth, height / sourceHeight);

  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;

  if (fit === "cover") {
    // Crop the source rather than overflowing the canvas.
    const sw = width / scale;
    const sh = height / scale;
    return {
      sx: (sourceWidth - sw) / 2,
      sy: (sourceHeight - sh) / 2,
      sw,
      sh,
      dx: 0,
      dy: 0,
      dw: width,
      dh: height,
    };
  }

  return {
    sx: 0,
    sy: 0,
    sw: sourceWidth,
    sh: sourceHeight,
    dx: (width - drawWidth) / 2,
    dy: (height - drawHeight) / 2,
    dw: drawWidth,
    dh: drawHeight,
  };
}

/**
 * Halve repeatedly before the final draw. A single large downscale in canvas
 * aliases badly; stepping down keeps detail without pulling in a resampling
 * library.
 */
function downscaleInSteps(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): { source: CanvasImageSource; width: number; height: number } {
  let currentWidth = sourceWidth;
  let currentHeight = sourceHeight;
  let current = source;

  while (currentWidth / 2 >= targetWidth && currentHeight / 2 >= targetHeight) {
    const nextWidth = Math.max(1, Math.floor(currentWidth / 2));
    const nextHeight = Math.max(1, Math.floor(currentHeight / 2));

    const canvas = document.createElement("canvas");
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    const context = canvas.getContext("2d");
    if (!context) break;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(current, 0, 0, nextWidth, nextHeight);

    current = canvas;
    currentWidth = nextWidth;
    currentHeight = nextHeight;
  }

  return { source: current, width: currentWidth, height: currentHeight };
}

export async function resize(
  image: HTMLImageElement,
  options: ResizeOptions
): Promise<Blob> {
  const width = Math.max(1, Math.round(options.width));
  const height = Math.max(1, Math.round(options.height));

  const stepped = downscaleInSteps(
    image,
    image.naturalWidth,
    image.naturalHeight,
    width,
    height
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context)
    throw new Error("This browser wouldn't give us a canvas to draw on.");

  // JPEG has no alpha channel, so transparency must be flattened onto a colour
  // or it renders as black.
  if (options.fit === "contain" || options.format === "image/jpeg") {
    context.fillStyle = options.background;
    context.fillRect(0, 0, width, height);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const box = placement(
    stepped.width,
    stepped.height,
    width,
    height,
    options.fit
  );
  context.drawImage(
    stepped.source,
    box.sx,
    box.sy,
    box.sw,
    box.sh,
    box.dx,
    box.dy,
    box.dw,
    box.dh
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, options.format, options.quality)
  );
  if (!blob) throw new Error("The resized image couldn't be encoded.");
  return blob;
}

export const PRESETS: {
  label: string;
  width: number;
  height: number;
  note: string;
}[] = [
  { label: "Full HD", width: 1920, height: 1080, note: "1920 × 1080" },
  { label: "HD", width: 1280, height: 720, note: "1280 × 720" },
  { label: "Blog header", width: 1200, height: 630, note: "1200 × 630" },
  { label: "Square post", width: 1080, height: 1080, note: "1080 × 1080" },
  { label: "Story", width: 1080, height: 1920, note: "1080 × 1920" },
  { label: "Thumbnail", width: 400, height: 400, note: "400 × 400" },
  { label: "Avatar", width: 128, height: 128, note: "128 × 128" },
  { label: "Favicon", width: 32, height: 32, note: "32 × 32" },
];

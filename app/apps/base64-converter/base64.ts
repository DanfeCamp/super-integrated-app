/**
 * Base64 helpers.
 *
 * `btoa`/`atob` only speak Latin-1, so anything non-ASCII has to be marshalled
 * through `TextEncoder`/`TextDecoder` first — encoding a string with an emoji
 * in it directly throws `InvalidCharacterError`.
 */

/** Bytes per `btoa` call. Spreading a whole megabyte blows the call stack. */
const CHUNK = 0x8000;

export function bytesToBase64(bytes: Uint8Array, urlSafe = false): string {
  let binary = "";
  for (let index = 0; index < bytes.length; index += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK));
  }
  const encoded = btoa(binary);
  return urlSafe
    ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    : encoded;
}

export function base64ToBytes(input: string): Uint8Array {
  // Accept URL-safe alphabets, embedded newlines and missing padding, all of
  // which turn up in real tokens and copied output.
  let normalised = input
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const remainder = normalised.length % 4;
  if (remainder === 1) throw new Error("That isn't a complete Base64 string.");
  if (remainder > 0) normalised += "=".repeat(4 - remainder);

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalised)) {
    throw new Error("Contains characters that aren't valid Base64.");
  }

  const binary = atob(normalised);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function encodeText(text: string, urlSafe = false): string {
  return bytesToBase64(new TextEncoder().encode(text), urlSafe);
}

export function decodeText(input: string): string {
  const bytes = base64ToBytes(input);
  // `fatal` matters: without it invalid UTF-8 silently becomes replacement
  // characters and the user thinks the decode worked.
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

/** Break a Base64 string into fixed-width lines, as MIME and PEM expect. */
export function wrap(value: string, width = 76): string {
  if (width <= 0) return value;
  const lines: string[] = [];
  for (let index = 0; index < value.length; index += width) {
    lines.push(value.slice(index, index + width));
  }
  return lines.join("\n");
}

export interface DataUrlParts {
  mediaType: string;
  data: string;
}

/** Pull the payload out of `data:image/png;base64,…`, if that's what this is. */
export function parseDataUrl(input: string): DataUrlParts | null {
  const match = /^data:([^;,]*)(;[^,]*)?,(.*)$/s.exec(input.trim());
  if (!match) return null;
  return {
    mediaType: match[1] || "text/plain",
    data: (match[3] ?? "").replace(/\s+/g, ""),
  };
}

/** Common signatures, so a decoded file downloads with a sensible extension. */
const SIGNATURES: { bytes: number[]; type: string; extension: string }[] = [
  { bytes: [0x89, 0x50, 0x4e, 0x47], type: "image/png", extension: "png" },
  { bytes: [0xff, 0xd8, 0xff], type: "image/jpeg", extension: "jpg" },
  { bytes: [0x47, 0x49, 0x46, 0x38], type: "image/gif", extension: "gif" },
  {
    bytes: [0x25, 0x50, 0x44, 0x46],
    type: "application/pdf",
    extension: "pdf",
  },
  {
    bytes: [0x50, 0x4b, 0x03, 0x04],
    type: "application/zip",
    extension: "zip",
  },
  { bytes: [0x1f, 0x8b], type: "application/gzip", extension: "gz" },
  { bytes: [0x4f, 0x67, 0x67, 0x53], type: "audio/ogg", extension: "ogg" },
  { bytes: [0x49, 0x44, 0x33], type: "audio/mpeg", extension: "mp3" },
];

export function sniff(bytes: Uint8Array): { type: string; extension: string } {
  for (const signature of SIGNATURES) {
    if (signature.bytes.every((byte, index) => bytes[index] === byte)) {
      return { type: signature.type, extension: signature.extension };
    }
  }
  // WebP and other RIFF containers need a second marker at offset 8.
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { type: "image/webp", extension: "webp" };
  }
  return { type: "application/octet-stream", extension: "bin" };
}

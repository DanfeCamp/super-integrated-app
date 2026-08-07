/**
 * Checksum and digest functions.
 *
 * SHA-1/256/384/512 come from `crypto.subtle`, which is both faster and safer
 * than any hand-rolled version. MD5 and CRC32 are implemented here because the
 * Web Crypto API deliberately omits them — they are still what most download
 * pages publish, so a checksum tool without them can't do its job.
 */

export type Algorithm =
  "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "CRC32";

export const ALGORITHMS: { id: Algorithm; note: string }[] = [
  {
    id: "MD5",
    note: "Fast, but broken for security. Fine for file integrity.",
  },
  { id: "SHA-1", note: "Deprecated for signatures; still used by Git." },
  { id: "SHA-256", note: "The current default for checksums and signatures." },
  { id: "SHA-384", note: "SHA-2 family, truncated 512." },
  { id: "SHA-512", note: "SHA-2 family, 64-bit words." },
  { id: "CRC32", note: "Error detection only — not a cryptographic hash." },
];

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

async function subtleDigest(
  algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512",
  bytes: Uint8Array
): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, bytes as BufferSource);
  return toHex(new Uint8Array(digest));
}

export async function hash(
  algorithm: Algorithm,
  bytes: Uint8Array
): Promise<string> {
  switch (algorithm) {
    case "MD5":
      return md5(bytes);
    case "CRC32":
      return crc32(bytes).toString(16).padStart(8, "0");
    default:
      return subtleDigest(algorithm, bytes);
  }
}

/* ---------------------------------- CRC32 --------------------------------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[index]!) & 0xff]!;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/* ----------------------------------- MD5 ---------------------------------- */

const SHIFTS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
  9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
  16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
  21,
];

/** K[i] = floor(2^32 × |sin(i + 1)|), per RFC 1321. */
const SINES = (() => {
  const table = new Uint32Array(64);
  for (let index = 0; index < 64; index += 1) {
    table[index] = Math.floor(Math.abs(Math.sin(index + 1)) * 2 ** 32);
  }
  return table;
})();

function rotateLeft(value: number, amount: number): number {
  return (value << amount) | (value >>> (32 - amount));
}

export function md5(bytes: Uint8Array): string {
  const bitLength = bytes.length * 8;
  // Pad to a multiple of 64 bytes, leaving 8 bytes for the length.
  const paddedLength = (((bytes.length + 8) >> 6) + 1) * 64;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[bytes.length] = 0x80;

  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 2 ** 32), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const words = new Uint32Array(16);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      let f: number;
      let g: number;

      if (index < 16) {
        f = (b & c) | (~b & d);
        g = index;
      } else if (index < 32) {
        f = (d & b) | (~d & c);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        g = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * index) % 16;
      }

      f = (f + a + SINES[index]! + words[g]!) | 0;
      a = d;
      d = c;
      c = b;
      b = (b + rotateLeft(f, SHIFTS[index]!)) | 0;
    }

    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, a0 >>> 0, true);
  outView.setUint32(4, b0 >>> 0, true);
  outView.setUint32(8, c0 >>> 0, true);
  outView.setUint32(12, d0 >>> 0, true);
  return toHex(out);
}

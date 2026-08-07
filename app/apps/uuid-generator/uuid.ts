/**
 * UUID generation and inspection.
 *
 * Randomness always comes from `crypto.getRandomValues` — `Math.random` is not
 * suitable for identifiers that may end up as keys or tokens.
 */

export const NIL_UUID = "00000000-0000-0000-0000-000000000000";
export const MAX_UUID = "ffffffff-ffff-ffff-ffff-ffffffffffff";

/** Well-known namespaces from RFC 4122, for name-based v5 UUIDs. */
export const NAMESPACES = [
  { id: "dns", label: "DNS", uuid: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" },
  { id: "url", label: "URL", uuid: "6ba7b811-9dad-11d1-80b4-00c04fd430c8" },
  { id: "oid", label: "OID", uuid: "6ba7b812-9dad-11d1-80b4-00c04fd430c8" },
  { id: "x500", label: "X.500", uuid: "6ba7b814-9dad-11d1-80b4-00c04fd430c8" },
] as const;

const HEX = Array.from({ length: 256 }, (_, index) =>
  index.toString(16).padStart(2, "0")
);

function format(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (byte) => HEX[byte]!);
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export function uuidV4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return format(bytes);
}

/**
 * Version 7: a 48-bit millisecond timestamp followed by randomness, so IDs
 * sort chronologically — which is what makes them pleasant as database keys.
 */
export function uuidV7(timestamp: number = Date.now()): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let remaining = Math.floor(timestamp);
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = remaining % 256;
    remaining = Math.floor(remaining / 256);
  }

  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return format(bytes);
}

function parseHex(uuid: string): Uint8Array | null {
  const hex = uuid.replace(/[^0-9a-f]/gi, "").toLowerCase();
  if (hex.length !== 32) return null;
  const bytes = new Uint8Array(16);
  for (let index = 0; index < 16; index += 1) {
    const byte = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    if (Number.isNaN(byte)) return null;
    bytes[index] = byte;
  }
  return bytes;
}

/**
 * Version 5: SHA-1 over the namespace and name, so the same inputs always give
 * the same UUID. Async because `crypto.subtle` is.
 */
export async function uuidV5(namespace: string, name: string): Promise<string> {
  const namespaceBytes = parseHex(namespace);
  if (!namespaceBytes) throw new Error("The namespace isn't a valid UUID.");

  const nameBytes = new TextEncoder().encode(name);
  const input = new Uint8Array(namespaceBytes.length + nameBytes.length);
  input.set(namespaceBytes, 0);
  input.set(nameBytes, namespaceBytes.length);

  const digest = new Uint8Array(
    await crypto.subtle.digest("SHA-1", input as BufferSource)
  );
  const bytes = digest.slice(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x50;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return format(bytes);
}

/* -------------------------------- formatting ------------------------------- */

export interface FormatOptions {
  uppercase: boolean;
  hyphens: boolean;
  braces: boolean;
}

export function applyFormat(uuid: string, options: FormatOptions): string {
  let value = options.hyphens ? uuid : uuid.replace(/-/g, "");
  if (options.uppercase) value = value.toUpperCase();
  if (options.braces) value = `{${value}}`;
  return value;
}

/* -------------------------------- inspection ------------------------------- */

export interface UuidInfo {
  valid: boolean;
  version: number | null;
  versionLabel: string;
  variant: string;
  /** Extracted from v1, v6 and v7 identifiers, which embed a clock. */
  timestamp: Date | null;
  isNil: boolean;
  isMax: boolean;
}

const VERSION_LABELS: Record<number, string> = {
  1: "Version 1 — time and MAC address",
  2: "Version 2 — DCE security",
  3: "Version 3 — name-based (MD5)",
  4: "Version 4 — random",
  5: "Version 5 — name-based (SHA-1)",
  6: "Version 6 — reordered time",
  7: "Version 7 — Unix time and random",
  8: "Version 8 — custom",
};

/** Gregorian epoch (1582-10-15) offset from the Unix epoch, in milliseconds. */
const GREGORIAN_OFFSET_MS = 12_219_292_800_000;

export function inspectUuid(input: string): UuidInfo {
  const cleaned = input.trim().replace(/^[{(]|[})]$/g, "");
  const canonical =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      cleaned
    );
  const compact = /^[0-9a-f]{32}$/i.test(cleaned);

  if (!canonical && !compact) {
    return {
      valid: false,
      version: null,
      versionLabel: "",
      variant: "",
      timestamp: null,
      isNil: false,
      isMax: false,
    };
  }

  const hex = cleaned.replace(/-/g, "").toLowerCase();
  const version = Number.parseInt(hex[12]!, 16);
  const variantNibble = Number.parseInt(hex[16]!, 16);

  const variant =
    variantNibble >= 0x8 && variantNibble <= 0xb
      ? "RFC 4122"
      : variantNibble <= 0x7
        ? "Reserved — NCS"
        : variantNibble <= 0xd
          ? "Reserved — Microsoft"
          : "Reserved — future";

  let timestamp: Date | null = null;
  if (version === 7) {
    timestamp = new Date(Number.parseInt(hex.slice(0, 12), 16));
  } else if (version === 1) {
    // time_low + time_mid + time_hi, in 100-nanosecond intervals.
    const ticks = BigInt(
      `0x${hex.slice(13, 16)}${hex.slice(8, 12)}${hex.slice(0, 8)}`
    );
    timestamp = new Date(Number(ticks / 10_000n) - GREGORIAN_OFFSET_MS);
  } else if (version === 6) {
    const ticks = BigInt(`0x${hex.slice(0, 12)}${hex.slice(13, 16)}`);
    timestamp = new Date(Number(ticks / 10_000n) - GREGORIAN_OFFSET_MS);
  }

  if (timestamp !== null && !Number.isFinite(timestamp.getTime())) {
    timestamp = null;
  }

  return {
    valid: true,
    version: Number.isNaN(version) ? null : version,
    versionLabel: VERSION_LABELS[version] ?? `Version ${version} — unassigned`,
    variant,
    timestamp,
    isNil: hex === "0".repeat(32),
    isMax: hex === "f".repeat(32),
  };
}

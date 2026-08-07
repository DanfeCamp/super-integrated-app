/**
 * JWT decoding and HMAC verification.
 *
 * Decoding a JWT is just base64url + JSON — the security-relevant part is the
 * signature, which this can only check for HS256/384/512, because those are the
 * algorithms whose key is a secret the user can paste. RS/ES/PS tokens are
 * decoded and clearly marked as unverified.
 */

export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  /** Raw base64url signature segment, empty for unsecured tokens. */
  signature: string;
  /** `header.payload` — the bytes that were actually signed. */
  signingInput: string;
}

export class JwtError extends Error {}

function base64UrlDecode(segment: string): string {
  let normalised = segment.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalised.length % 4;
  if (remainder === 1) throw new JwtError("A segment is malformed.");
  if (remainder > 0) normalised += "=".repeat(4 - remainder);

  let binary: string;
  try {
    binary = atob(normalised);
  } catch {
    throw new JwtError("A segment isn't valid base64url.");
  }

  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim().replace(/^Bearer\s+/i, "");
  if (trimmed === "") throw new JwtError("Paste a token to decode it.");

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new JwtError(
      `A JWT has three dot-separated parts — this one has ${parts.length}.`
    );
  }

  const [headerPart, payloadPart, signature] = parts as [
    string,
    string,
    string,
  ];

  const parseSegment = (segment: string, name: string) => {
    const json = base64UrlDecode(segment);
    try {
      const value = JSON.parse(json) as unknown;
      if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("not an object");
      }
      return value as Record<string, unknown>;
    } catch {
      throw new JwtError(`The ${name} isn't valid JSON.`);
    }
  };

  return {
    header: parseSegment(headerPart, "header"),
    payload: parseSegment(payloadPart, "payload"),
    signature,
    signingInput: `${headerPart}.${payloadPart}`,
  };
}

/* ------------------------------ verification ------------------------------ */

const HMAC_HASHES: Record<string, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

export type VerifyOutcome =
  | { status: "valid" }
  | { status: "invalid" }
  | { status: "unsupported"; algorithm: string }
  | { status: "error"; message: string };

export async function verifyHmac(
  decoded: DecodedJwt,
  secret: string,
  secretIsBase64: boolean
): Promise<VerifyOutcome> {
  const algorithm = String(decoded.header.alg ?? "");
  const hash = HMAC_HASHES[algorithm];
  if (!hash) return { status: "unsupported", algorithm: algorithm || "none" };

  try {
    const keyBytes = secretIsBase64
      ? base64UrlToBytes(secret)
      : new TextEncoder().encode(secret);

    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes as BufferSource,
      { name: "HMAC", hash },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlToBytes(decoded.signature);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      new TextEncoder().encode(decoded.signingInput)
    );

    return { status: valid ? "valid" : "invalid" };
  } catch (caught) {
    return {
      status: "error",
      message:
        caught instanceof Error
          ? caught.message
          : "The signature couldn't be checked.",
    };
  }
}

function base64UrlToBytes(segment: string): Uint8Array {
  let normalised = segment.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalised.length % 4;
  if (remainder > 0) normalised += "=".repeat(4 - remainder);
  const binary = atob(normalised);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

/* --------------------------------- claims --------------------------------- */

/** Registered claim names, so the payload table can explain itself. */
export const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: "Issuer — who created the token",
  sub: "Subject — who the token is about",
  aud: "Audience — who the token is for",
  exp: "Expires at",
  nbf: "Not valid before",
  iat: "Issued at",
  jti: "Token ID",
  scope: "Granted scopes",
  scp: "Granted scopes",
  azp: "Authorised party",
  typ: "Token type",
  alg: "Signing algorithm",
  kid: "Key ID",
  cty: "Content type",
  nonce: "Replay-protection nonce",
  email: "Email address",
  name: "Display name",
};

export const TIME_CLAIMS = new Set([
  "exp",
  "nbf",
  "iat",
  "auth_time",
  "updated_at",
]);

export interface Validity {
  expired: boolean;
  notYetValid: boolean;
  expiresAt: Date | null;
  notBefore: Date | null;
  issuedAt: Date | null;
}

export function checkValidity(
  payload: Record<string, unknown>,
  now = Date.now()
): Validity {
  const toDate = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value)
      ? new Date(value * 1000)
      : null;

  const expiresAt = toDate(payload.exp);
  const notBefore = toDate(payload.nbf);

  return {
    expired: expiresAt !== null && expiresAt.getTime() <= now,
    notYetValid: notBefore !== null && notBefore.getTime() > now,
    expiresAt,
    notBefore,
    issuedAt: toDate(payload.iat),
  };
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
  ["second", 1000],
];

/** `"in 3 hours"` / `"2 days ago"`. */
export function relativeTime(date: Date, now = Date.now()): string {
  const delta = date.getTime() - now;
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(delta) >= size || unit === "second") {
      return formatter.format(Math.round(delta / size), unit);
    }
  }
  return "now";
}

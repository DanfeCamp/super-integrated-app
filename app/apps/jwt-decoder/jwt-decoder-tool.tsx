"use client";

import {
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  TriangleAlert,
} from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

import {
  CLAIM_DESCRIPTIONS,
  checkValidity,
  decodeJwt,
  relativeTime,
  TIME_CLAIMS,
  verifyHmac,
  type DecodedJwt,
  type VerifyOutcome,
} from "./jwt";

/**
 * A throwaway HS256 token signed with the secret `sia-demo-secret`, so the
 * verification panel has something that actually verifies. It carries no real
 * credential and expires in 2100.
 */
const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6NDEwMjQ0NDgwMH0.rMfzx7Uy4OVVKcWWDEx4kKiOY_4sFiP_wavbEv3hKoc";

export function JwtDecoderTool() {
  const mounted = useMounted();
  const [token, setToken] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [secretIsBase64, setSecretIsBase64] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);
  const [verification, setVerification] = React.useState<VerifyOutcome | null>(
    null
  );

  const { decoded, error } = React.useMemo(() => {
    if (token.trim() === "") return { decoded: null, error: null };
    try {
      return { decoded: decodeJwt(token), error: null };
    } catch (caught) {
      return {
        decoded: null,
        error:
          caught instanceof Error
            ? caught.message
            : "That token can't be read.",
      };
    }
  }, [token]);

  // Re-check whenever the token or the secret changes, but never block typing.
  React.useEffect(() => {
    if (!decoded || secret === "") return;

    let cancelled = false;
    void verifyHmac(decoded, secret, secretIsBase64).then((outcome) => {
      if (!cancelled) setVerification(outcome);
    });
    return () => {
      cancelled = true;
    };
  }, [decoded, secret, secretIsBase64]);

  // Derived, so a stale verdict can't survive the token or secret being
  // cleared while the next check is still in flight.
  const currentVerification = decoded && secret !== "" ? verification : null;

  const validity = decoded ? checkValidity(decoded.payload) : null;
  const algorithm = decoded ? String(decoded.header.alg ?? "none") : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start">
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="jwt-token">Token</Label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setToken(token ? "" : SAMPLE)}
                >
                  {token ? "Clear" : "Load sample"}
                </Button>
                <CopyButton value={token} />
              </div>
            </div>
            <Textarea
              id="jwt-token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              rows={8}
              spellCheck={false}
              aria-invalid={error !== null}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
              className="resize-y font-mono text-[0.8125rem] wrap-anywhere"
            />
            {decoded ? <TokenParts decoded={decoded} /> : null}
            {error ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Verify signature</h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="jwt-secret">Shared secret</Label>
              <div className="relative">
                <Input
                  id="jwt-secret"
                  type={showSecret ? "text" : "password"}
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  placeholder="Your HMAC secret"
                  autoComplete="off"
                  className="pr-10 font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-1/2 right-1 -translate-y-1/2"
                  aria-label={showSecret ? "Hide secret" : "Show secret"}
                  onClick={() => setShowSecret((value) => !value)}
                >
                  {showSecret ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="secret-base64"
                checked={secretIsBase64}
                onCheckedChange={setSecretIsBase64}
              />
              <Label htmlFor="secret-base64" className="text-sm font-normal">
                Secret is base64-encoded
              </Label>
            </div>

            <VerificationStatus
              outcome={currentVerification}
              hasSecret={secret !== ""}
              algorithm={algorithm}
            />

            <p className="text-muted-foreground text-xs">
              The token and secret stay in this tab. Even so, avoid pasting
              production credentials into any online decoder.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        {!decoded ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={ShieldQuestion}
                title="No token yet"
                description="Paste a JSON Web Token to see its header, claims and expiry. Decoding happens entirely in your browser."
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {validity && mounted ? (
              <Card>
                <CardContent className="flex flex-wrap items-center gap-3">
                  {validity.expired ? (
                    <Badge variant="destructive">Expired</Badge>
                  ) : validity.notYetValid ? (
                    <Badge variant="warning">Not valid yet</Badge>
                  ) : validity.expiresAt ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="muted">No expiry set</Badge>
                  )}
                  <Badge variant="outline">{algorithm}</Badge>
                  {validity.expiresAt ? (
                    <span className="text-muted-foreground text-sm">
                      {validity.expired ? "Expired" : "Expires"}{" "}
                      {relativeTime(validity.expiresAt)} ·{" "}
                      {validity.expiresAt.toLocaleString()}
                    </span>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            <Section title="Header" data={decoded.header} />
            <Section title="Payload" data={decoded.payload} showClaims />
          </>
        )}
      </div>
    </div>
  );
}

function TokenParts({ decoded }: { decoded: DecodedJwt }) {
  const [header, payload] = decoded.signingInput.split(".") as [string, string];
  return (
    <p className="font-mono text-xs leading-relaxed wrap-anywhere">
      <span className="text-destructive">{header}</span>
      <span className="text-muted-foreground">.</span>
      <span className="text-primary">{payload}</span>
      <span className="text-muted-foreground">.</span>
      <span className="text-success">{decoded.signature}</span>
    </p>
  );
}

function VerificationStatus({
  outcome,
  hasSecret,
  algorithm,
}: {
  outcome: VerifyOutcome | null;
  hasSecret: boolean;
  algorithm: string | null;
}) {
  if (algorithm && !algorithm.startsWith("HS")) {
    return (
      <Alert variant="info">
        <ShieldQuestion />
        <AlertTitle>Signature not checked</AlertTitle>
        <AlertDescription>
          {algorithm} signatures need the issuer&apos;s public key. Only HS256,
          HS384 and HS512 can be verified with a pasted secret.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasSecret || !outcome) {
    return (
      <p className="text-muted-foreground text-sm">
        Enter the secret to check whether the signature matches.
      </p>
    );
  }

  if (outcome.status === "valid") {
    return (
      <Alert variant="success">
        <ShieldCheck />
        <AlertDescription>
          Signature verified — this token was signed with that secret.
        </AlertDescription>
      </Alert>
    );
  }

  if (outcome.status === "invalid") {
    return (
      <Alert variant="destructive">
        <ShieldAlert />
        <AlertDescription>
          Signature does not match. The secret is wrong, or the token was
          altered.
        </AlertDescription>
      </Alert>
    );
  }

  if (outcome.status === "unsupported") {
    return (
      <Alert variant="info">
        <ShieldQuestion />
        <AlertDescription>
          {outcome.algorithm === "none"
            ? "This token is unsecured — it carries no signature at all."
            : `${outcome.algorithm} can't be verified with a shared secret.`}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="warning">
      <TriangleAlert />
      <AlertDescription>{outcome.message}</AlertDescription>
    </Alert>
  );
}

function Section({
  title,
  data,
  showClaims,
}: {
  title: string;
  data: Record<string, unknown>;
  showClaims?: boolean;
}) {
  const json = JSON.stringify(data, null, 2);
  const entries = Object.entries(data);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <CopyButton value={json} label="Copy JSON" />
        </div>

        {entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">No fields.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border/60 text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Claim
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Value
                  </th>
                  {showClaims ? (
                    <th scope="col" className="py-2 font-medium">
                      Meaning
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {entries.map(([key, value]) => (
                  <tr
                    key={key}
                    className="border-border/40 border-b last:border-0"
                  >
                    <th
                      scope="row"
                      className="py-2 pr-4 text-left align-top font-mono text-[0.8125rem] font-medium"
                    >
                      {key}
                    </th>
                    <td className="py-2 pr-4 align-top font-mono text-[0.8125rem] wrap-anywhere">
                      {renderValue(key, value)}
                    </td>
                    {showClaims ? (
                      <td className="text-muted-foreground py-2 align-top text-xs">
                        {CLAIM_DESCRIPTIONS[key] ?? ""}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <details className="group">
          <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm select-none">
            Raw JSON
          </summary>
          <pre className="bg-muted/40 mt-2 overflow-x-auto rounded-md p-3 font-mono text-[0.8125rem]">
            {json}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}

function renderValue(key: string, value: unknown) {
  if (TIME_CLAIMS.has(key) && typeof value === "number") {
    const date = new Date(value * 1000);
    return (
      <span className="flex flex-col gap-0.5">
        <span className="tabular-nums">{value}</span>
        <span className={cn("text-muted-foreground font-sans text-xs")}>
          {date.toLocaleString()} · {relativeTime(date)}
        </span>
      </span>
    );
  }
  if (typeof value === "string") return `"${value}"`;
  if (value === null) return "null";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

"use client";

import { Download, Fingerprint, RefreshCw, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { clamp, downloadBlob, pluralize } from "@/lib/utils";

import {
  applyFormat,
  inspectUuid,
  MAX_UUID,
  NAMESPACES,
  NIL_UUID,
  uuidV4,
  uuidV5,
  uuidV7,
  type FormatOptions,
} from "./uuid";

type Version = "v4" | "v7" | "v5" | "nil" | "max";

const VERSIONS: { value: Version; label: string; blurb: string }[] = [
  { value: "v4", label: "Version 4", blurb: "Random. The default choice." },
  {
    value: "v7",
    label: "Version 7",
    blurb: "Time-ordered — sorts by creation.",
  },
  {
    value: "v5",
    label: "Version 5",
    blurb: "Deterministic from a namespace and name.",
  },
  {
    value: "nil",
    label: "Nil UUID",
    blurb: "All zeros — the null identifier.",
  },
  {
    value: "max",
    label: "Max UUID",
    blurb: "All ones — the maximum identifier.",
  },
];

export function UuidGeneratorTool() {
  const [version, setVersion] = React.useState<Version>("v4");
  const [count, setCount] = React.useState(5);
  const [namespace, setNamespace] = React.useState<string>(NAMESPACES[0].uuid);
  const [name, setName] = React.useState("");
  const [options, setOptions] = React.useState<FormatOptions>({
    uppercase: false,
    hyphens: true,
    braces: false,
  });
  const [uuids, setUuids] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const generate = React.useCallback(async () => {
    setError(null);
    try {
      if (version === "nil") {
        setUuids([NIL_UUID]);
        return;
      }
      if (version === "max") {
        setUuids([MAX_UUID]);
        return;
      }
      if (version === "v5") {
        if (name.trim() === "") {
          setUuids([]);
          setError("Enter a name to hash against the namespace.");
          return;
        }
        setUuids([await uuidV5(namespace, name)]);
        return;
      }

      const generator = version === "v7" ? uuidV7 : uuidV4;
      setUuids(Array.from({ length: count }, () => generator()));
    } catch (caught) {
      setUuids([]);
      setError(
        caught instanceof Error
          ? caught.message
          : "Those UUIDs couldn't be generated."
      );
    }
  }, [version, count, namespace, name]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random values must be produced after hydration, never during render, or the server and client HTML disagree.
    void generate();
    // Deliberately mount-only: later batches come from the Generate button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatted = uuids.map((uuid) => applyFormat(uuid, options));
  const allText = formatted.join("\n");
  const single = version === "v5" || version === "nil" || version === "max";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,16rem)_minmax(0,9rem)_1fr] lg:items-end">
            <div className="flex flex-col gap-2">
              <Label htmlFor="uuid-version">Version</Label>
              <Select
                value={version}
                onValueChange={(value) => setVersion(value as Version)}
              >
                <SelectTrigger id="uuid-version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VERSIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="uuid-count">How many</Label>
              <Input
                id="uuid-count"
                type="number"
                min={1}
                max={500}
                value={count}
                disabled={single}
                onChange={(event) => {
                  const next = Number.parseInt(event.target.value, 10);
                  if (Number.isFinite(next)) setCount(clamp(next, 1, 500));
                }}
                className="tabular-nums"
              />
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 sm:col-span-2 lg:col-span-1 lg:justify-end lg:pb-2">
              <Toggle
                id="uuid-uppercase"
                label="Uppercase"
                checked={options.uppercase}
                onChange={(uppercase) =>
                  setOptions((current) => ({ ...current, uppercase }))
                }
              />
              <Toggle
                id="uuid-hyphens"
                label="Hyphens"
                checked={options.hyphens}
                onChange={(hyphens) =>
                  setOptions((current) => ({ ...current, hyphens }))
                }
              />
              <Toggle
                id="uuid-braces"
                label="Braces"
                checked={options.braces}
                onChange={(braces) =>
                  setOptions((current) => ({ ...current, braces }))
                }
              />
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            {VERSIONS.find((item) => item.value === version)?.blurb}
          </p>

          {version === "v5" ? (
            <div className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr]">
              <div className="flex flex-col gap-2">
                <Label htmlFor="uuid-namespace">Namespace</Label>
                <Select value={namespace} onValueChange={setNamespace}>
                  <SelectTrigger id="uuid-namespace">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NAMESPACES.map((item) => (
                      <SelectItem key={item.id} value={item.uuid}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="uuid-name">Name</Label>
                <Input
                  id="uuid-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="example.com"
                  className="font-mono"
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void generate()}>
              <RefreshCw className="size-4" aria-hidden />
              Generate
            </Button>
            <CopyButton
              value={allText}
              label={`Copy ${formatted.length > 1 ? "all" : ""}`.trim()}
            />
            <Button
              variant="outline"
              disabled={!allText}
              onClick={() =>
                downloadBlob(
                  new Blob([`${allText}\n`], {
                    type: "text/plain;charset=utf-8",
                  }),
                  "uuids.txt"
                )
              }
            >
              <Download className="size-4" aria-hidden />
              Download
            </Button>
          </div>

          {error ? (
            <Alert variant="warning">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Generated</h2>
            <span className="text-muted-foreground text-xs tabular-nums">
              {formatted.length} {pluralize(formatted.length, "UUID")}
            </span>
          </div>

          {formatted.length === 0 ? (
            <EmptyState
              icon={Fingerprint}
              title="Nothing generated yet"
              description="Choose a version and press Generate."
            />
          ) : (
            <ul className="flex flex-col gap-1">
              {formatted.map((uuid, index) => (
                <li
                  key={`${uuid}-${index}`}
                  className="hover:bg-accent/50 group flex items-center justify-between gap-3 rounded-md px-3 py-1.5 transition-colors"
                >
                  <code className="font-mono text-[0.8125rem] wrap-anywhere select-all">
                    {uuid}
                  </code>
                  <CopyButton
                    value={uuid}
                    className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Inspector />
    </div>
  );
}

function Inspector() {
  const [value, setValue] = React.useState("");
  const info = React.useMemo(
    () => (value.trim() === "" ? null : inspectUuid(value)),
    [value]
  );

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Inspect a UUID</h2>
          <p className="text-muted-foreground text-sm">
            Paste an existing identifier to see its version, variant and — for
            time-based versions — when it was created.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="uuid-inspect">UUID</Label>
          <Input
            id="uuid-inspect"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="0189f4e9-4b8e-7c3a-9a1f-1c2d3e4f5a6b"
            spellCheck={false}
            aria-invalid={info !== null && !info.valid}
            className="font-mono"
          />
        </div>

        {info === null ? null : !info.valid ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>
              That isn&apos;t a UUID — expected 32 hexadecimal characters, with
              or without hyphens.
            </AlertDescription>
          </Alert>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs font-medium">
                Version
              </dt>
              <dd className="text-sm font-medium">
                {info.isNil
                  ? "Nil UUID"
                  : info.isMax
                    ? "Max UUID"
                    : info.versionLabel}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs font-medium">
                Variant
              </dt>
              <dd className="text-sm font-medium">{info.variant}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs font-medium">
                Created
              </dt>
              <dd className="text-sm font-medium">
                {info.timestamp ? (
                  info.timestamp.toLocaleString()
                ) : (
                  <Badge variant="muted">No embedded time</Badge>
                )}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}

"use client";

import { CircleCheck, Hash, TriangleAlert } from "lucide-react";
import * as React from "react";

import { FileDropzone } from "@/components/tools/file-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatBytes } from "@/lib/utils";

import { ALGORITHMS, hash, type Algorithm } from "./hash";

type Digests = Partial<Record<Algorithm, string>>;

const MAX_FILE = 250 * 1024 * 1024;

export function HashGeneratorTool() {
  const [uppercase, setUppercase] = React.useState(false);
  const [expected, setExpected] = React.useState("");

  return (
    <Tabs defaultValue="text" className="flex flex-col gap-4">
      <TabsList>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="file">File</TabsTrigger>
      </TabsList>

      <TabsContent value="text">
        <TextPanel
          uppercase={uppercase}
          onUppercaseChange={setUppercase}
          expected={expected}
          onExpectedChange={setExpected}
        />
      </TabsContent>
      <TabsContent value="file">
        <FilePanel
          uppercase={uppercase}
          onUppercaseChange={setUppercase}
          expected={expected}
          onExpectedChange={setExpected}
        />
      </TabsContent>
    </Tabs>
  );
}

interface PanelProps {
  uppercase: boolean;
  onUppercaseChange: (value: boolean) => void;
  expected: string;
  onExpectedChange: (value: string) => void;
}

function TextPanel({
  uppercase,
  onUppercaseChange,
  expected,
  onExpectedChange,
}: PanelProps) {
  const [text, setText] = React.useState("");
  const debounced = useDebouncedValue(text, 200);
  // The input that produced the digests is stored with them, which is what
  // makes "are we still working?" a derived question rather than extra state.
  const [computed, setComputed] = React.useState<{
    input: string;
    digests: Digests;
  }>({ input: "", digests: {} });

  React.useEffect(() => {
    if (debounced === "") return;

    let cancelled = false;
    const bytes = new TextEncoder().encode(debounced);

    void computeAll(bytes).then((result) => {
      if (!cancelled) setComputed({ input: debounced, digests: result });
    });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const fresh = computed.input === debounced;
  const digests = debounced === "" || !fresh ? {} : computed.digests;
  const pending = debounced !== "" && !fresh;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <Label htmlFor="hash-text">Text to hash</Label>
          <Textarea
            id="hash-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={14}
            spellCheck={false}
            placeholder="Type or paste anything. Hashes update as you type."
            className="resize-y font-mono text-[0.8125rem]"
          />
          <p className="text-muted-foreground text-xs">
            The text is hashed in this tab. It is never sent to a server.
          </p>
        </CardContent>
      </Card>

      <Results
        digests={digests}
        pending={pending && Object.keys(digests).length === 0}
        empty={debounced === ""}
        uppercase={uppercase}
        onUppercaseChange={onUppercaseChange}
        expected={expected}
        onExpectedChange={onExpectedChange}
      />
    </div>
  );
}

function FilePanel({
  uppercase,
  onUppercaseChange,
  expected,
  onExpectedChange,
}: PanelProps) {
  const [file, setFile] = React.useState<File | null>(null);
  // Keyed by the file it came from, so "still hashing" is derived rather than
  // tracked in a separate flag that can fall out of step.
  const [computed, setComputed] = React.useState<{
    file: File | null;
    digests: Digests;
  }>({ file: null, digests: {} });
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) return;

    let cancelled = false;

    file
      .arrayBuffer()
      .then((buffer) => computeAll(new Uint8Array(buffer)))
      .then((result) => {
        if (!cancelled) setComputed({ file, digests: result });
      })
      .catch(() => {
        if (!cancelled) setError("That file couldn't be read or hashed.");
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const fresh = computed.file === file;
  const digests = file && fresh ? computed.digests : {};
  const pending = file !== null && !fresh && error === null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <Label htmlFor="hash-file">File to hash</Label>
          <FileDropzone
            id="hash-file"
            file={file}
            onFileChange={(next) => {
              setFile(next);
              setError(null);
            }}
            maxSize={MAX_FILE}
            hint="Any file type"
          />
          {file ? (
            <p className="text-muted-foreground text-xs">
              {formatBytes(file.size)} read locally — nothing is uploaded.
            </p>
          ) : null}
          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Results
        digests={digests}
        pending={pending}
        empty={!file}
        uppercase={uppercase}
        onUppercaseChange={onUppercaseChange}
        expected={expected}
        onExpectedChange={onExpectedChange}
      />
    </div>
  );
}

function Results({
  digests,
  pending,
  empty,
  uppercase,
  onUppercaseChange,
  expected,
  onExpectedChange,
}: PanelProps & {
  digests: Digests;
  pending: boolean;
  empty: boolean;
}) {
  const normalisedExpected = expected.trim().toLowerCase();
  const matched = ALGORITHMS.find(
    ({ id }) => digests[id] !== undefined && digests[id] === normalisedExpected
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Digests</h2>
            <div className="flex items-center gap-2">
              <Switch
                id="hash-uppercase"
                checked={uppercase}
                onCheckedChange={onUppercaseChange}
              />
              <Label htmlFor="hash-uppercase" className="text-sm font-normal">
                Uppercase
              </Label>
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            {ALGORITHMS.map(({ id, note }) => {
              const value = digests[id];
              const display = value
                ? uppercase
                  ? value.toUpperCase()
                  : value
                : "";
              const isMatch = matched?.id === id;

              return (
                <li key={id} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{id}</span>
                    {isMatch ? (
                      <Badge variant="success">
                        <CircleCheck aria-hidden />
                        Matches
                      </Badge>
                    ) : null}
                    <span className="text-muted-foreground truncate text-xs max-sm:hidden">
                      {note}
                    </span>
                    <CopyButton value={display} className="ml-auto shrink-0" />
                  </div>
                  {pending ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <code
                      className={
                        "bg-muted/40 block rounded-md px-3 py-2 font-mono text-[0.8125rem] wrap-anywhere" +
                        (isMatch ? " ring-success/40 ring-2" : "")
                      }
                    >
                      {display || (
                        <span className="text-muted-foreground font-sans italic">
                          {empty ? "Waiting for input…" : "—"}
                        </span>
                      )}
                    </code>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Compare with a known hash</h2>
            <p className="text-muted-foreground text-sm">
              Paste a published checksum to confirm a download hasn&apos;t been
              tampered with or truncated.
            </p>
          </div>
          <Label htmlFor="hash-expected" className="sr-only">
            Expected hash
          </Label>
          <Input
            id="hash-expected"
            value={expected}
            onChange={(event) => onExpectedChange(event.target.value)}
            placeholder="Paste the expected hash"
            spellCheck={false}
            className="font-mono"
          />
          {normalisedExpected === "" ? null : matched ? (
            <Alert variant="success">
              <CircleCheck />
              <AlertDescription>
                Match — this is the {matched.id} hash of your input.
              </AlertDescription>
            </Alert>
          ) : Object.keys(digests).length > 0 ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>
                No match against any of the digests above.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="info">
              <Hash />
              <AlertDescription>
                Add some input and the comparison runs automatically.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function computeAll(bytes: Uint8Array): Promise<Digests> {
  const entries = await Promise.all(
    ALGORITHMS.map(async ({ id }) => [id, await hash(id, bytes)] as const)
  );
  return Object.fromEntries(entries) as Digests;
}

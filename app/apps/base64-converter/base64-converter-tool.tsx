"use client";

import { ArrowRightLeft, Download, TriangleAlert } from "lucide-react";
import * as React from "react";

import { FileDropzone } from "@/components/tools/file-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { downloadBlob, formatBytes, replaceExtension } from "@/lib/utils";

import {
  base64ToBytes,
  bytesToBase64,
  decodeText,
  encodeText,
  parseDataUrl,
  sniff,
  wrap,
} from "./base64";

type Direction = "encode" | "decode";

const MAX_FILE = 25 * 1024 * 1024;

export function Base64ConverterTool() {
  return (
    <Tabs defaultValue="text" className="flex flex-col gap-4">
      <TabsList>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="file">File</TabsTrigger>
      </TabsList>
      <TabsContent value="text">
        <TextPanel />
      </TabsContent>
      <TabsContent value="file">
        <FilePanel />
      </TabsContent>
    </Tabs>
  );
}

/* ---------------------------------- text ---------------------------------- */

function TextPanel() {
  const [direction, setDirection] = React.useState<Direction>("encode");
  const [input, setInput] = React.useState("");
  const [urlSafe, setUrlSafe] = React.useState(false);
  const [lineWrap, setLineWrap] = React.useState(false);

  const { output, error } = React.useMemo(() => {
    if (input === "") return { output: "", error: null };
    try {
      if (direction === "encode") {
        const encoded = encodeText(input, urlSafe);
        return { output: lineWrap ? wrap(encoded) : encoded, error: null };
      }
      return { output: decodeText(input), error: null };
    } catch (caught) {
      return {
        output: "",
        error:
          caught instanceof Error
            ? caught.message
            : "That input couldn't be decoded.",
      };
    }
  }, [input, direction, urlSafe, lineWrap]);

  const swap = () => {
    setDirection((current) => (current === "encode" ? "decode" : "encode"));
    setInput(output);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ToggleGroup
            type="single"
            value={direction}
            onValueChange={(value) => value && setDirection(value as Direction)}
            aria-label="Direction"
          >
            <ToggleGroupItem value="encode">Text → Base64</ToggleGroupItem>
            <ToggleGroupItem value="decode">Base64 → Text</ToggleGroupItem>
          </ToggleGroup>

          {direction === "encode" ? (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="url-safe"
                  checked={urlSafe}
                  onCheckedChange={setUrlSafe}
                />
                <Label htmlFor="url-safe" className="text-sm font-normal">
                  URL-safe alphabet
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="line-wrap"
                  checked={lineWrap}
                  onCheckedChange={setLineWrap}
                />
                <Label htmlFor="line-wrap" className="text-sm font-normal">
                  Wrap at 76 chars
                </Label>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex flex-col gap-2">
            <Label htmlFor="b64-input">
              {direction === "encode" ? "Plain text" : "Base64"}
            </Label>
            <Textarea
              id="b64-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={12}
              spellCheck={false}
              aria-invalid={error !== null}
              placeholder={
                direction === "encode"
                  ? "Type or paste anything — emoji and accents included."
                  : "Paste Base64 here. Padding and line breaks are optional."
              }
              className="resize-y font-mono text-[0.8125rem]"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={swap}
            disabled={!output}
            aria-label="Swap input and output"
            className="justify-self-center max-lg:my-1"
          >
            <ArrowRightLeft className="size-4" aria-hidden />
          </Button>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="b64-output">
                {direction === "encode" ? "Base64" : "Plain text"}
              </Label>
              <CopyButton value={output} />
            </div>
            <Textarea
              id="b64-output"
              value={output}
              readOnly
              rows={12}
              spellCheck={false}
              placeholder="The result appears here."
              className="bg-muted/40 resize-y font-mono text-[0.8125rem]"
            />
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-muted-foreground text-xs">
            Encoding and decoding happen in this tab — nothing is sent anywhere.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------------------------- file ---------------------------------- */

function FilePanel() {
  const [file, setFile] = React.useState<File | null>(null);
  // Stored with the file it came from, so a stale payload can never be shown
  // against a newly chosen file.
  const [computed, setComputed] = React.useState<{
    file: File | null;
    base64: string;
  }>({ file: null, base64: "" });
  const [asDataUrl, setAsDataUrl] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const [decodeInput, setDecodeInput] = React.useState("");

  React.useEffect(() => {
    if (!file) return;

    let cancelled = false;

    file
      .arrayBuffer()
      .then((buffer) => {
        if (cancelled) return;
        setComputed({ file, base64: bytesToBase64(new Uint8Array(buffer)) });
      })
      .catch(() => {
        if (!cancelled) setFileError("That file couldn't be read.");
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const encoded = file && computed.file === file ? computed.base64 : "";
  const busy = file !== null && encoded === "" && fileError === null;

  const output = React.useMemo(() => {
    if (!encoded) return "";
    return asDataUrl
      ? `data:${file?.type || "application/octet-stream"};base64,${encoded}`
      : encoded;
  }, [encoded, asDataUrl, file]);

  const decodeToFile = () => {
    try {
      const dataUrl = parseDataUrl(decodeInput);
      const payload = dataUrl ? dataUrl.data : decodeInput;
      const bytes = base64ToBytes(payload);
      const sniffed = sniff(bytes);
      const type = dataUrl?.mediaType ?? sniffed.type;
      const blobPart = new Uint8Array(bytes);
      downloadBlob(
        new Blob([blobPart], { type }),
        `decoded.${sniffed.extension}`
      );
    } catch (caught) {
      setFileError(
        caught instanceof Error
          ? caught.message
          : "That Base64 couldn't be decoded."
      );
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">File → Base64</h2>
            <p className="text-muted-foreground text-sm">
              The file is read in your browser. Nothing is uploaded.
            </p>
          </div>

          <FileDropzone
            id="b64-file"
            file={file}
            onFileChange={(next) => {
              setFile(next);
              setFileError(null);
            }}
            maxSize={MAX_FILE}
            hint="Any file type"
          />

          <div className="flex items-center gap-2">
            <Switch
              id="as-data-url"
              checked={asDataUrl}
              onCheckedChange={setAsDataUrl}
              disabled={!encoded}
            />
            <Label htmlFor="as-data-url" className="text-sm font-normal">
              Output as a data: URL
            </Label>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="b64-file-output">Base64</Label>
              <div className="flex items-center gap-2">
                {output ? (
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {formatBytes(output.length)}
                  </span>
                ) : null}
                <CopyButton value={output} />
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={!output}
                  aria-label="Download as text file"
                  onClick={() =>
                    downloadBlob(
                      new Blob([output], { type: "text/plain;charset=utf-8" }),
                      replaceExtension(file?.name ?? "encoded", "txt")
                    )
                  }
                >
                  <Download className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
            <Textarea
              id="b64-file-output"
              value={busy ? "Reading file…" : output}
              readOnly
              rows={8}
              spellCheck={false}
              placeholder="Choose a file to see its Base64."
              className="bg-muted/40 resize-y font-mono text-[0.8125rem]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Base64 → File</h2>
            <p className="text-muted-foreground text-sm">
              Paste Base64 or a data: URL and download it as a real file. The
              type is detected from the content.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="b64-decode">Base64</Label>
            <Textarea
              id="b64-decode"
              value={decodeInput}
              onChange={(event) => {
                setDecodeInput(event.target.value);
                setFileError(null);
              }}
              rows={12}
              spellCheck={false}
              placeholder="data:image/png;base64,iVBORw0KGgo…"
              className="resize-y font-mono text-[0.8125rem]"
            />
          </div>

          <Button onClick={decodeToFile} disabled={!decodeInput.trim()}>
            <Download className="size-4" aria-hidden />
            Decode and download
          </Button>

          {fileError ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import {
  ArrowRight,
  Languages as LanguagesIcon,
  Loader2,
  TriangleAlert,
  X,
} from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { languages } from "@/data/languages";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 5000;
const POPULAR = ["es", "fr", "de", "ja", "zh-CN", "hi", "ar", "pt"];

interface TranslateResponse {
  translatedText: string;
  detectedLanguage: string | null;
}

export function TranslatorTool() {
  const [text, setText] = React.useState("");
  const [target, setTarget] = React.useState("es");
  const [result, setResult] = React.useState<TranslateResponse | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const options: ComboboxOption[] = React.useMemo(
    () =>
      languages.map((language) => ({
        value: language.code,
        label: language.name,
        keywords: language.code,
      })),
    []
  );

  const targetName =
    languages.find((language) => language.code === target)?.name ?? target;

  const detectedName = result?.detectedLanguage
    ? (languages.find((language) => language.code === result.detectedLanguage)
        ?.name ?? result.detectedLanguage)
    : null;

  const translate = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, language: target }),
      });

      const payload = (await response.json()) as TranslateResponse & {
        error?: string;
      };

      if (!response.ok) throw new Error(payload.error ?? "Translation failed.");
      setResult(payload);
    } catch (caught) {
      setResult(null);
      setError(
        caught instanceof Error ? caught.message : "Translation failed."
      );
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  const overLimit = text.length > MAX_LENGTH;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground text-sm">
              {detectedName ? `Detected: ${detectedName}` : "Detect language"}
            </span>
            <ArrowRight className="text-muted-foreground size-4" aria-hidden />
            <div className="min-w-52 flex-1 sm:max-w-72">
              <Label htmlFor="target-language" className="sr-only">
                Target language
              </Label>
              <Combobox
                id="target-language"
                label="Target language"
                options={options}
                value={target}
                onValueChange={setTarget}
                searchPlaceholder="Search 100+ languages…"
                emptyMessage="No language found."
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="source-text">Your text</Label>
                {text ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={clear}
                    aria-label="Clear text"
                  >
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
              <Textarea
                id="source-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  // ⌘/Ctrl+Enter translates without leaving the keyboard.
                  if (
                    (event.metaKey || event.ctrlKey) &&
                    event.key === "Enter"
                  ) {
                    event.preventDefault();
                    void translate();
                  }
                }}
                placeholder="Type or paste the text you want to translate…"
                rows={9}
                aria-invalid={overLimit}
                aria-describedby="source-count"
                className="resize-none"
              />
              <p
                id="source-count"
                className={cn(
                  "text-xs tabular-nums",
                  overLimit ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {text.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
                {overLimit ? " — too long to translate" : ""}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="translated-text">{targetName}</Label>
                {result ? <CopyButton value={result.translatedText} /> : null}
              </div>
              <div
                id="translated-text"
                aria-live="polite"
                className="bg-muted/40 relative min-h-[13.5rem] rounded-md border p-3 text-sm leading-relaxed"
              >
                {busy ? (
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Translating…
                  </span>
                ) : result ? (
                  <p className="whitespace-pre-wrap">{result.translatedText}</p>
                ) : (
                  <span className="text-muted-foreground">
                    The translation will appear here.
                  </span>
                )}
              </div>
            </div>
          </div>

          {error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => void translate()}
              disabled={!text.trim() || busy || overLimit}
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Translating…
                </>
              ) : (
                <>
                  <LanguagesIcon className="size-4" aria-hidden />
                  Translate
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clear} disabled={!text}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          Popular:
        </span>
        {POPULAR.map((code) => {
          const language = languages.find((item) => item.code === code);
          if (!language) return null;
          return (
            <Button
              key={code}
              variant="outline"
              size="sm"
              onClick={() => setTarget(code)}
              aria-pressed={target === code}
              className={
                target === code ? "border-primary text-primary" : undefined
              }
            >
              {language.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

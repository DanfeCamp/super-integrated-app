import { translate } from "@vitalets/google-translate-api";

import { languages } from "@/data/languages";
import { jsonError, jsonOk, readJson, withErrorHandling } from "@/lib/api";

const MAX_LENGTH = 5000;
const validCodes = new Set(languages.map((language) => language.code));

interface Body {
  text?: unknown;
  language?: unknown;
}

export const POST = withErrorHandling(async (request: Request) => {
  const body = await readJson<Body>(request);
  if (!body) return jsonError("Invalid request body.");

  const { text, language } = body;

  if (typeof text !== "string" || !text.trim()) {
    return jsonError("Enter some text to translate.");
  }
  if (text.length > MAX_LENGTH) {
    return jsonError(`Text must be ${MAX_LENGTH} characters or fewer.`);
  }
  if (typeof language !== "string" || !validCodes.has(language)) {
    return jsonError("Choose a target language.");
  }

  try {
    const result = await translate(text, { to: language });
    return jsonOk({
      translatedText: result.text,
      detectedLanguage: result.raw?.src ?? null,
    });
  } catch (error) {
    console.error("[translate]", error);
    return jsonError(
      "The translation service is unavailable right now. Please try again shortly.",
      502
    );
  }
});

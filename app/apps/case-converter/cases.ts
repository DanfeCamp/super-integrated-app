/**
 * Case transformations.
 *
 * Everything programmer-facing (camel, snake, kebab…) goes through `words()`,
 * which is the only part that has to be clever: it has to split
 * `parseHTTPResponse2XML` into `parse HTTP Response 2 XML` without mangling
 * text that is already prose.
 */

/** Words that stay lowercase in title case unless they lead the string. */
const MINOR_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "nor",
  "of",
  "on",
  "onto",
  "or",
  "over",
  "per",
  "so",
  "the",
  "to",
  "up",
  "via",
  "vs",
  "with",
  "yet",
]);

/** Split any casing convention into its constituent lowercase words. */
export function words(input: string): string[] {
  return (
    input
      // acronym followed by a word: HTTPResponse → HTTP Response
      .replace(/([\p{Lu}]+)([\p{Lu}][\p{Ll}])/gu, "$1 $2")
      // lower/digit followed by upper: parseXml → parse Xml
      .replace(/([\p{Ll}\p{N}])([\p{Lu}])/gu, "$1 $2")
      // letter followed by digit and vice versa: v2Item → v 2 Item
      .replace(/([\p{L}])([\p{N}])/gu, "$1 $2")
      .replace(/([\p{N}])([\p{L}])/gu, "$1 $2")
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
      .map((word) => word.toLowerCase())
  );
}

const upperFirst = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export interface CaseDefinition {
  id: string;
  name: string;
  /** Shown under the name so the effect is obvious before you look. */
  example: string;
  convert: (input: string) => string;
}

export const caseDefinitions: CaseDefinition[] = [
  {
    id: "lower",
    name: "lowercase",
    example: "the quick brown fox",
    convert: (input) => input.toLowerCase(),
  },
  {
    id: "upper",
    name: "UPPERCASE",
    example: "THE QUICK BROWN FOX",
    convert: (input) => input.toUpperCase(),
  },
  {
    id: "title",
    name: "Title Case",
    example: "The Quick Brown Fox",
    convert: (input) =>
      // Operates on the original string so punctuation and line breaks survive.
      input.replace(/[\p{L}\p{N}']+/gu, (word, offset: number) => {
        const lower = word.toLowerCase();
        const isFirst = /^\s*$/.test(
          input.slice(0, offset).split("\n").pop() ?? ""
        );
        const isLast = /^[^\p{L}\p{N}]*$/u.test(
          input.slice(offset + word.length)
        );
        if (!isFirst && !isLast && MINOR_WORDS.has(lower)) return lower;
        return upperFirst(lower);
      }),
  },
  {
    id: "sentence",
    name: "Sentence case",
    example: "The quick brown fox. Jumps over.",
    convert: (input) => {
      const lowered = input.toLowerCase();
      // Capitalise the first letter after the start, a line break, or
      // sentence-ending punctuation.
      return lowered.replace(
        /(^|[.!?…]\s+|\n\s*)(\p{Ll})/gu,
        (_match, prefix: string, letter: string) =>
          prefix + letter.toUpperCase()
      );
    },
  },
  {
    id: "camel",
    name: "camelCase",
    example: "theQuickBrownFox",
    convert: (input) =>
      words(input)
        .map((word, index) => (index === 0 ? word : upperFirst(word)))
        .join(""),
  },
  {
    id: "pascal",
    name: "PascalCase",
    example: "TheQuickBrownFox",
    convert: (input) => words(input).map(upperFirst).join(""),
  },
  {
    id: "snake",
    name: "snake_case",
    example: "the_quick_brown_fox",
    convert: (input) => words(input).join("_"),
  },
  {
    id: "constant",
    name: "CONSTANT_CASE",
    example: "THE_QUICK_BROWN_FOX",
    convert: (input) => words(input).join("_").toUpperCase(),
  },
  {
    id: "kebab",
    name: "kebab-case",
    example: "the-quick-brown-fox",
    convert: (input) => words(input).join("-"),
  },
  {
    id: "train",
    name: "Train-Case",
    example: "The-Quick-Brown-Fox",
    convert: (input) => words(input).map(upperFirst).join("-"),
  },
  {
    id: "dot",
    name: "dot.case",
    example: "the.quick.brown.fox",
    convert: (input) => words(input).join("."),
  },
  {
    id: "path",
    name: "path/case",
    example: "the/quick/brown/fox",
    convert: (input) => words(input).join("/"),
  },
  {
    id: "alternating",
    name: "aLtErNaTiNg",
    example: "tHe QuIcK bRoWn FoX",
    convert: (input) => {
      let index = 0;
      return input.replace(/\p{L}/gu, (letter) => {
        const result =
          index % 2 === 0 ? letter.toLowerCase() : letter.toUpperCase();
        index += 1;
        return result;
      });
    },
  },
  {
    id: "inverse",
    name: "InVeRsE cAsE",
    example: "tHE qUICK bROWN fOX",
    convert: (input) =>
      input.replace(/\p{L}/gu, (letter) =>
        letter === letter.toUpperCase()
          ? letter.toLowerCase()
          : letter.toUpperCase()
      ),
  },
];

export function getCase(id: string): CaseDefinition {
  return caseDefinitions.find((item) => item.id === id) ?? caseDefinitions[0]!;
}

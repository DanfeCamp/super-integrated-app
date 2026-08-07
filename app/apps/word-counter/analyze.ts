/**
 * Text statistics for the word counter. Pure functions over a string so the
 * whole analysis can run in a `useMemo` on every keystroke.
 */

export interface KeywordCount {
  word: string;
  count: number;
  /** Share of all counted words, 0–100. */
  density: number;
}

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  syllables: number;
  averageWordLength: number;
  averageSentenceLength: number;
  longestWord: string;
  /** Minutes, at 238 wpm. */
  readingMinutes: number;
  /** Minutes, at 150 wpm. */
  speakingMinutes: number;
  /** Flesch Reading Ease, 0–100. `null` when there isn't enough text. */
  readingEase: number | null;
  /** Flesch–Kincaid grade level. `null` when there isn't enough text. */
  gradeLevel: number | null;
  keywords: KeywordCount[];
}

const READING_WPM = 238;
const SPEAKING_WPM = 150;

/**
 * Words that would otherwise dominate every density table. Deliberately short —
 * a bigger list starts hiding words that are genuinely the topic.
 */
const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "all",
  "also",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "him",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "just",
  "me",
  "more",
  "most",
  "my",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "out",
  "over",
  "own",
  "same",
  "she",
  "so",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
  "yours",
]);

/**
 * Vowel-group heuristic. It is not a dictionary lookup and will be wrong on
 * individual words, but it is accurate enough in aggregate for readability
 * scores, which is all it feeds.
 */
export function countSyllables(input: string): number {
  const word = input.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;

  const trimmed = word
    .replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, "")
    .replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

export function analyze(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  // Unicode-aware: keeps accented and non-Latin words in one piece, and treats
  // internal apostrophes and hyphens as part of the word.
  const wordMatches =
    text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? [];
  const words = wordMatches.length;

  const sentences =
    text.trim() === ""
      ? 0
      : (text.match(/[^.!?…]+[.!?…]+(?:["'”’)\]]+)?|[^.!?…]+$/g) ?? []).filter(
          (sentence) => sentence.trim() !== ""
        ).length;

  const paragraphs =
    text.trim() === ""
      ? 0
      : text.split(/\n{2,}/).filter((block) => block.trim() !== "").length;

  const lines = text === "" ? 0 : text.split("\n").length;

  const lowered = wordMatches.map((word) => word.toLowerCase());
  const frequency = new Map<string, number>();
  let totalLength = 0;
  let syllables = 0;
  let longestWord = "";

  wordMatches.forEach((word, index) => {
    totalLength += word.length;
    syllables += countSyllables(word);
    if (word.length > longestWord.length) longestWord = word;
    const key = lowered[index]!;
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  });

  const keywords: KeywordCount[] = [...frequency.entries()]
    .filter(([word]) => word.length > 2 && !STOP_WORDS.has(word))
    .map(([word, count]) => ({
      word,
      count,
      density: words > 0 ? (count / words) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, 10);

  const wordsPerSentence = sentences > 0 ? words / sentences : 0;
  const syllablesPerWord = words > 0 ? syllables / words : 0;

  // Readability formulas are meaningless on a handful of words, so they only
  // report once there's a paragraph's worth of text.
  const scorable = words >= 25 && sentences > 0;

  return {
    characters,
    charactersNoSpaces,
    words,
    uniqueWords: frequency.size,
    sentences,
    paragraphs,
    lines,
    syllables,
    averageWordLength: words > 0 ? totalLength / words : 0,
    averageSentenceLength: wordsPerSentence,
    longestWord,
    readingMinutes: words / READING_WPM,
    speakingMinutes: words / SPEAKING_WPM,
    readingEase: scorable
      ? 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord
      : null,
    gradeLevel: scorable
      ? 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59
      : null,
    keywords,
  };
}

/** Plain-English band for a Flesch Reading Ease score. */
export function readingEaseLabel(score: number): string {
  if (score >= 90) return "Very easy — 5th grade";
  if (score >= 80) return "Easy — 6th grade";
  if (score >= 70) return "Fairly easy — 7th grade";
  if (score >= 60) return "Plain English — 8th–9th grade";
  if (score >= 50) return "Fairly difficult — 10th–12th grade";
  if (score >= 30) return "Difficult — university";
  return "Very difficult — graduate";
}

/** `0.4` → `"under a minute"`, `3.2` → `"3 min"`. */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 min";
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  return `${Math.round(minutes)} min`;
}

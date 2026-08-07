/**
 * Name generation, kept out of the component so each style's construction can
 * be read (and tuned) on its own.
 *
 * Every style builds names a different way rather than reshuffling one word
 * list — a codename and a brandable coinage have almost nothing in common
 * phonetically, and blurring them is what makes most generators feel same-y.
 */

export type StyleId =
  "brandable" | "startup" | "codename" | "fantasy" | "username";

export interface Style {
  id: StyleId;
  name: string;
  description: string;
  /** Shown under the picker so the output is never a surprise. */
  examples: string;
}

export const styles: Style[] = [
  {
    id: "brandable",
    name: "Brandable",
    description:
      "Invented, pronounceable coinages built from a root and a classical ending.",
    examples: "Lumira · Novix · Velora",
  },
  {
    id: "startup",
    name: "Startup",
    description:
      "A real word joined to a modern product suffix — the .com-era house style.",
    examples: "Sendly · Forgekit · Driftbase",
  },
  {
    id: "codename",
    name: "Codename",
    description:
      "Adjective and noun, hyphenated. Good for releases, servers and internal projects.",
    examples: "amber-falcon · slate-harbour",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description:
      "Character names assembled from an elvish-leaning set of syllables.",
    examples: "Aeldrin · Morvath · Sylwyn",
  },
  {
    id: "username",
    name: "Username",
    description:
      "Adjective and noun run together, optionally with a separator and digits.",
    examples: "quietfalcon · brisk_wren17",
  },
];

/* ------------------------------- word pools ------------------------------- */

/** Consonant-final roots, so a vowel ending always joins cleanly. */
const brandRoots = [
  "alt",
  "arc",
  "aur",
  "brev",
  "cal",
  "cirr",
  "corv",
  "cred",
  "dex",
  "dorn",
  "ember",
  "fen",
  "fer",
  "flor",
  "glim",
  "hal",
  "iris",
  "kai",
  "lum",
  "lyr",
  "mir",
  "mon",
  "nim",
  "nov",
  "nyx",
  "onyx",
  "orb",
  "pol",
  "pyr",
  "quin",
  "rune",
  "sab",
  "sol",
  "ster",
  "tal",
  "ter",
  "thal",
  "tid",
  "ult",
  "val",
  "ver",
  "vex",
  "vir",
  "vox",
  "wren",
  "xen",
  "zen",
  "zeph",
];

/** Vowel-initial endings. Pairing rule lives in `brandable`. */
const brandEndings = [
  "a",
  "ia",
  "io",
  "is",
  "us",
  "ex",
  "ix",
  "ax",
  "on",
  "or",
  "ar",
  "um",
  "ea",
  "ora",
  "ova",
  "eon",
  "ary",
  "yn",
  "os",
  "an",
];

const startupRoots = [
  "atlas",
  "beacon",
  "bright",
  "cedar",
  "clear",
  "cobalt",
  "craft",
  "drift",
  "ember",
  "flint",
  "forge",
  "harbor",
  "keel",
  "lantern",
  "loop",
  "north",
  "orbit",
  "pixel",
  "quartz",
  "ridge",
  "river",
  "send",
  "ship",
  "signal",
  "spark",
  "stack",
  "summit",
  "swift",
  "tide",
  "vault",
  "vector",
  "willow",
];

const startupSuffixes = [
  "base",
  "bench",
  "core",
  "deck",
  "flow",
  "grid",
  "hub",
  "ify",
  "kit",
  "lab",
  "labs",
  "loop",
  "path",
  "pilot",
  "scale",
  "sync",
  "wise",
  "works",
  "ly",
];

const adjectives = [
  "amber",
  "brisk",
  "calm",
  "cobalt",
  "crimson",
  "dusky",
  "eager",
  "fern",
  "gilded",
  "granite",
  "hazel",
  "indigo",
  "ivory",
  "jade",
  "keen",
  "lucid",
  "marble",
  "midnight",
  "nimble",
  "olive",
  "opal",
  "pale",
  "quiet",
  "russet",
  "saffron",
  "silent",
  "slate",
  "solar",
  "steady",
  "teal",
  "umber",
  "velvet",
  "vivid",
  "warm",
  "wild",
  "zinc",
];

const nouns = [
  "albatross",
  "anchor",
  "arrow",
  "aspen",
  "badger",
  "basin",
  "beacon",
  "bison",
  "bramble",
  "canyon",
  "cedar",
  "comet",
  "coral",
  "crane",
  "delta",
  "dune",
  "ember",
  "falcon",
  "fjord",
  "forge",
  "glacier",
  "harbour",
  "heron",
  "ibis",
  "juniper",
  "kestrel",
  "lantern",
  "lynx",
  "meadow",
  "mesa",
  "monsoon",
  "orchid",
  "otter",
  "pike",
  "quarry",
  "quill",
  "raven",
  "reef",
  "ridge",
  "sable",
  "sparrow",
  "spire",
  "summit",
  "tundra",
  "vale",
  "vertex",
  "willow",
  "wren",
  "yarrow",
  "zenith",
];

const fantasyOnsets = [
  "Ae",
  "Al",
  "Ar",
  "Bal",
  "Bran",
  "Cae",
  "Cor",
  "Dae",
  "Dar",
  "Dor",
  "El",
  "Er",
  "Fae",
  "Fen",
  "Gal",
  "Gor",
  "Hal",
  "Il",
  "Kae",
  "Kor",
  "Lor",
  "Mor",
  "Nar",
  "Nim",
  "Ol",
  "Rho",
  "Sil",
  "Syl",
  "Tal",
  "Thal",
  "Thra",
  "Ul",
  "Vae",
  "Val",
  "Vor",
  "Yr",
  "Zar",
];

/** Single consonants — safe after a consonant-final onset. */
const softBridges = ["l", "m", "n", "r", "th", "v", "w"];

/** Clusters — only ever used after a vowel-final onset, never after "Val". */
const clusterBridges = ["br", "dr", "gr", "ldr", "ndr", "rth", "thr", "vr"];

const fantasyCodas = [
  "a",
  "ael",
  "ain",
  "an",
  "ar",
  "ath",
  "as",
  "dor",
  "eth",
  "iel",
  "ien",
  "in",
  "ion",
  "ir",
  "is",
  "ith",
  "lin",
  "mir",
  "nor",
  "oth",
  "ra",
  "rian",
  "ric",
  "rin",
  "ros",
  "us",
  "wyn",
  "yr",
  "ys",
];

const usernameSeparators = ["", "", "", "_", "."];

/* -------------------------------- helpers -------------------------------- */

function pick<T>(pool: readonly T[]): T {
  return pool[Math.floor(Math.random() * pool.length)] as T;
}

function capitalise(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const VOWELS = "aeiouy";

/* --------------------------------- styles -------------------------------- */

/** Consonant-initial endings, for roots that already end in a vowel. */
const brandConsonantEndings = [
  "ndra",
  "rix",
  "lux",
  "nova",
  "mos",
  "ven",
  "ric",
  "las",
  "then",
  "dis",
];

function brandable() {
  const root = pick(brandRoots);
  const tail = root.at(-1) as string;

  // A vowel-final root plus a vowel-initial ending stacks three vowels
  // ("Kai" + "eon") and stops being sayable.
  if (VOWELS.includes(tail)) {
    return capitalise(root + pick(brandConsonantEndings));
  }

  // Reusing the root's final consonant in the ending gives you "Vexex" and
  // "Lumum". Re-draw a few times, then fall back to a plain vowel ending.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const ending = pick(brandEndings);
    if (!ending.includes(tail)) return capitalise(root + ending);
  }

  return capitalise(root + pick(["a", "ia", "o"]));
}

function startup() {
  const root = pick(startupRoots);
  let suffix = pick(startupSuffixes);
  // "Looploop" and "Forgeforge" are the only collisions the pools can produce.
  while (suffix === root) suffix = pick(startupSuffixes);

  // "Craftify" not "Craftifiy": drop a trailing vowel before -ify and -ly.
  const trimmed =
    (suffix === "ify" || suffix === "ly") &&
    VOWELS.includes(root.at(-1) as string)
      ? root.slice(0, -1)
      : root;

  return capitalise(trimmed + suffix);
}

function codename() {
  return `${pick(adjectives)}-${pick(nouns)}`;
}

function fantasy() {
  const onset = pick(fantasyOnsets);
  const coda = pick(fantasyCodas);

  // A consonant-initial coda already supplies the join, so bridging as well is
  // what produced "Zarvrrin" and "Korwdor" — attach it directly instead.
  if (!VOWELS.includes(coda.charAt(0))) return onset + coda;

  // Vowel-initial coda. After a vowel-final onset a bridge is mandatory
  // ("Ae" + "in" → "Aein"); after a consonant it is optional and must stay
  // simple, or "Val" picks up a cluster and becomes "Valvrys".
  const bridge = VOWELS.includes(onset.at(-1) as string)
    ? pick([...clusterBridges, ...softBridges])
    : pick(["", ...softBridges]);

  return onset + bridge + coda;
}

function username() {
  const separator = pick(usernameSeparators);
  const digits =
    Math.random() < 0.3 ? String(Math.floor(Math.random() * 90) + 10) : "";
  return `${pick(adjectives)}${separator}${pick(nouns)}${digits}`;
}

const generators: Record<StyleId, () => string> = {
  brandable,
  startup,
  codename,
  fantasy,
  username,
};

/* -------------------------------- batching ------------------------------- */

export interface GenerateOptions {
  style: StyleId;
  count: number;
  minLength: number;
  maxLength: number;
  /** Single letter, case-insensitive. Empty means no constraint. */
  startsWith: string;
}

export const MIN_LENGTH = 3;
export const MAX_LENGTH = 20;

/**
 * Rejection sampling: the generators can't be steered to a length or an
 * initial letter directly, so produce candidates and discard the misses.
 *
 * The attempt ceiling is what keeps a narrow filter (say, names starting with
 * X between 3 and 4 characters) from spinning forever — callers get a short
 * batch and can tell the user the filter is too tight.
 */
export function generateNames(options: GenerateOptions): string[] {
  const { style, count, minLength, maxLength, startsWith } = options;
  const make = generators[style];
  const prefix = startsWith.trim().toLowerCase();

  const results: string[] = [];
  const seen = new Set<string>();
  const maxAttempts = count * 200;

  for (
    let attempt = 0;
    attempt < maxAttempts && results.length < count;
    attempt += 1
  ) {
    const candidate = make();
    const key = candidate.toLowerCase();

    if (seen.has(key)) continue;
    // Length is measured on the visible name, separators included.
    if (candidate.length < minLength || candidate.length > maxLength) continue;
    if (prefix && !key.startsWith(prefix)) continue;

    seen.add(key);
    results.push(candidate);
  }

  return results;
}

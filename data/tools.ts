/**
 * The tool registry is the single source of truth for the whole app: it drives
 * navigation, search, the category pages, breadcrumbs, per-page metadata,
 * JSON-LD and the sitemap. Adding a tool means adding an entry here plus a
 * route at `app/apps/<slug>/page.tsx` — nothing else.
 *
 * Kept free of JSX/functions so entries stay serialisable across the
 * server/client boundary (icons live in `./tool-icons`).
 */

export type ToolStatus = "live" | "planned";

/**
 * Seven groups, each named after what someone is trying to *do* rather than
 * what the tool is built from. Sized deliberately: every group holds enough
 * tools to be worth opening, and none is so specific that the next tool has
 * nowhere to go. New tools join an existing group — adding an id here should be
 * rare, and only when a group has outgrown itself.
 */
export type ToolCategoryId =
  | "calculators"
  | "productivity"
  | "text"
  | "media"
  | "developer"
  | "generators"
  | "fun";

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  /**
   * One or two words, used where the full name won't fit or would read badly:
   * filter chips, the navigation rail and "N free <short> tools" in metadata.
   */
  shortName: string;
  /** Shown on category cards and as the category page's meta description. */
  description: string;
  /** Gradient applied to icon tiles so each category reads as a family. */
  gradient: string;
  /** Tinted foreground used for the icon glyph itself. */
  foreground: string;
}

export interface Tool {
  slug: string;
  name: string;
  /** One line, used on cards. Keep under ~90 characters. */
  tagline: string;
  /** Two-to-three sentences, used as the page meta description. */
  description: string;
  category: ToolCategoryId;
  status: ToolStatus;
  /** Extra search terms that should match this tool but aren't in its name. */
  keywords: string[];
  /** Surfaced on the homepage "most used" rail. */
  featured?: boolean;
  /** Bullet list rendered in the "How to use it" panel. */
  usage: string[];
  /** Optional attribution for third-party data sources. */
  sources?: { label: string; href: string }[];
}

/**
 * Order matters: this is the order categories appear in the navigation menu, on
 * the homepage, in the footer and on the category index. Broadest first,
 * specialist last.
 */
export const toolCategories: ToolCategory[] = [
  {
    id: "calculators",
    name: "Calculators & Converters",
    shortName: "Calculators",
    description:
      "Work out a number, or turn it into another unit — percentages, loans, interest, currencies and measurements.",
    gradient: "from-violet-500/15 to-indigo-500/10",
    foreground: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "productivity",
    name: "Productivity & Time",
    shortName: "Productivity",
    description:
      "Keep track of the day — task lists, focus sessions, timers, countdowns and clocks across timezones.",
    gradient: "from-indigo-500/15 to-blue-500/10",
    foreground: "text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "text",
    name: "Text & Writing",
    shortName: "Text",
    description:
      "Count, compare, reshape and translate text — for anyone who writes or edits for a living.",
    gradient: "from-emerald-500/15 to-teal-500/10",
    foreground: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "media",
    name: "Images & Media",
    shortName: "Images",
    description:
      "Resize, compress, convert and edit images and audio on your own device — nothing is uploaded.",
    gradient: "from-sky-500/15 to-cyan-500/10",
    foreground: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "developer",
    name: "Developer Tools",
    shortName: "Developer",
    description:
      "Format, decode and inspect what you work with daily — JSON, CSV, tokens, hashes, patterns and schedules.",
    gradient: "from-amber-500/15 to-orange-500/10",
    foreground: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "generators",
    name: "Generators",
    shortName: "Generators",
    description:
      "Produce something new from nothing — identifiers, passwords, QR codes, palettes, names and sitemaps.",
    gradient: "from-fuchsia-500/15 to-purple-500/10",
    foreground: "text-fuchsia-700 dark:text-fuchsia-300",
  },
  {
    id: "fun",
    name: "Fun & Games",
    shortName: "Fun",
    description: "Quotes and games for when you need a break or a spark.",
    gradient: "from-rose-500/15 to-pink-500/10",
    foreground: "text-rose-700 dark:text-rose-300",
  },
];

export const tools: Tool[] = [
  /* ----------------------- calculators & converters ----------------------- */
  {
    slug: "calculator",
    name: "Calculator",
    tagline: "A keyboard-friendly calculator with a running history.",
    description:
      "Run arithmetic, percentages and bracketed expressions with full keyboard support. Every result is kept in a history strip so you can reuse earlier answers without retyping them.",
    category: "calculators",
    status: "live",
    featured: true,
    keywords: ["maths", "arithmetic", "percentage", "sum", "calc"],
    usage: [
      "Type an expression directly — the whole keypad is mapped to your keyboard.",
      "Use brackets for grouping and % for percentages of the preceding value.",
      "Press Enter or = to evaluate, Backspace to delete, Escape to clear.",
      "Click any entry in the history strip to load that result back into the display.",
    ],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    tagline: "Six percentage questions, answered with the working shown.",
    description:
      "Work out a percentage of a number, what share one number is of another, percentage change, reverse percentages and increases or decreases. Each answer comes with the arithmetic behind it so you can check it at a glance.",
    category: "calculators",
    status: "live",
    keywords: [
      "percent",
      "discount",
      "increase",
      "decrease",
      "change",
      "tip",
      "vat",
      "margin",
    ],
    usage: [
      "Choose the question you're trying to answer from the tabs.",
      "Fill in the two numbers — the sentence reads as the question itself.",
      "The answer updates live, with the calculation shown underneath.",
      "Switching tabs keeps what you typed, so you can try another angle.",
    ],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    tagline: "Convert length, mass, temperature, data and more.",
    description:
      "Convert between more than a hundred units across ten categories — length, mass, temperature, area, volume, speed, data, time, pressure and energy. Every conversion is calculated in your browser, and the same value is shown in every unit of the category at once.",
    category: "calculators",
    status: "live",
    featured: true,
    keywords: [
      "convert",
      "metric",
      "imperial",
      "kg to lbs",
      "celsius",
      "fahrenheit",
      "miles",
      "inches",
      "measurement",
    ],
    usage: [
      "Pick a category — the units and a sensible default pair load with it.",
      "Type an amount and choose what to convert from and to.",
      "Use the swap button to reverse the direction without retyping.",
      "The table underneath shows your value in every other unit at once.",
    ],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    tagline: "Convert between 160+ currencies at today's mid-market rate.",
    description:
      "Convert any amount between more than 160 world currencies using daily mid-market reference rates. Swap directions in a click and see the exact rate used for the conversion.",
    category: "calculators",
    status: "live",
    featured: true,
    keywords: ["exchange", "forex", "rate", "money", "usd", "eur"],
    usage: [
      "Enter an amount in either field — the other side updates as you type.",
      "Search a currency by name or ISO code in the picker.",
      "Use the swap button to reverse the conversion direction.",
      "The exact rate and its publication time are shown beneath the result.",
    ],
    sources: [
      { label: "ExchangeRate-API", href: "https://www.exchangerate-api.com" },
    ],
  },
  {
    slug: "interest-calculator",
    name: "Interest Calculator",
    tagline: "Compare simple and compound interest side by side.",
    description:
      "Work out what a loan will cost or what savings will grow to, with simple and compound interest calculated together. Adjust the compounding frequency and see the year-by-year breakdown.",
    category: "calculators",
    status: "live",
    keywords: ["loan", "savings", "compound", "investment", "finance", "apr"],
    usage: [
      "Enter the principal, the annual rate and the term in years.",
      "Pick a compounding frequency to model compound growth.",
      "Simple and compound totals are calculated together for comparison.",
      "Expand the schedule to see the balance at the end of each year.",
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    tagline:
      "Monthly payments, total interest and a full amortisation schedule.",
    description:
      "Work out the monthly payment on a mortgage, car loan or personal loan, and see exactly how much of it is interest. Add an overpayment to see how much interest it saves and how much sooner the loan clears, then export the schedule as CSV.",
    category: "calculators",
    status: "live",
    featured: true,
    keywords: [
      "mortgage",
      "emi",
      "repayment",
      "amortisation",
      "amortization",
      "interest",
      "borrow",
      "finance",
    ],
    usage: [
      "Enter the amount borrowed, the annual rate and the term.",
      "Pick your currency — the figures are formatted to match.",
      "Add an optional overpayment to see the interest and time it saves.",
      "Expand any year for the month-by-month detail, or download the CSV.",
    ],
  },

  /* ------------------------- productivity & time -------------------------- */
  {
    slug: "to-do",
    name: "To-Do List",
    tagline: "A focused task list that stays on your device.",
    description:
      "Capture tasks, reorder them, mark them done and filter by state. Everything is stored in your browser, so the list survives reloads without an account.",
    category: "productivity",
    status: "live",
    featured: true,
    keywords: ["task", "checklist", "productivity", "notes", "reminder"],
    usage: [
      "Type a task and press Enter to add it to the list.",
      "Click the checkbox to complete a task, or the title to rename it inline.",
      "Filter between all, active and completed tasks with the tabs.",
      "Clear completed removes finished tasks; the list is saved in your browser.",
    ],
  },
  {
    slug: "pomodoro",
    name: "Pomodoro Timer",
    tagline: "Focus sessions and breaks, with a count of what you finished.",
    description:
      "Work in timed focus sessions separated by short breaks, with a longer break after every few rounds. Durations are yours to set, the timer stays accurate in a background tab, and your daily count is kept on your device.",
    category: "productivity",
    status: "live",
    keywords: [
      "focus",
      "productivity",
      "tomato",
      "deep work",
      "study",
      "break",
      "timer",
    ],
    usage: [
      "Press Start — the ring and the tab title both track the time left.",
      "A chime and a toast mark the end of every focus session and break.",
      "Adjust the focus, break and round lengths under Timer settings.",
      "Turn on auto-start to chain sessions together without touching it.",
    ],
  },
  {
    slug: "timer",
    name: "Stopwatch",
    tagline: "A precise stopwatch with lap times.",
    description:
      "A drift-free stopwatch that keeps accurate time even when the tab is backgrounded. Record laps, see the split between each one, and copy the whole session in one click.",
    category: "productivity",
    status: "live",
    keywords: ["stopwatch", "lap", "split", "time", "elapsed"],
    usage: [
      "Press Start, or hit Space at any time, to begin timing.",
      "Record a lap with the Lap button or the L key while running.",
      "Laps show both the split since the previous lap and the total elapsed time.",
      "Reset clears the session; copy exports every lap as plain text.",
    ],
  },
  {
    slug: "countdown",
    name: "Countdown",
    tagline: "Count down to zero with a visual progress ring.",
    description:
      "Set a countdown in hours, minutes and seconds and watch it run down against a progress ring. It keeps accurate time in the background and alerts you the moment it finishes.",
    category: "productivity",
    status: "live",
    keywords: ["timer", "alarm", "pomodoro", "egg timer", "reminder"],
    usage: [
      "Set the duration with the fields, or pick one of the quick presets.",
      "Start, pause and resume without losing the remaining time.",
      "The ring and the page title both track the remaining time.",
      "A toast and a sound fire when the countdown reaches zero.",
    ],
  },
  {
    slug: "world-clock",
    name: "World Clock",
    tagline: "Track the time across as many cities as you need.",
    description:
      "Follow the current time in any number of cities at once, with a live analogue face and the offset from your own timezone. Your selection is remembered between visits.",
    category: "productivity",
    status: "live",
    featured: true,
    keywords: ["timezone", "utc", "gmt", "clock", "cities", "meeting"],
    usage: [
      "Your local timezone is added automatically on first load.",
      "Search for a city or timezone and add it to the board.",
      "Each card shows local time, the date and the offset from your timezone.",
      "Remove a city with the button on its card; the board is saved locally.",
    ],
  },

  /* ---------------------------- text & writing ---------------------------- */
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Counts, reading time and readability, live as you type.",
    description:
      "Count words, characters, sentences and paragraphs while you write, with reading and speaking times and a Flesch–Kincaid readability score. A keyword breakdown shows what your text is actually about. Nothing is uploaded.",
    category: "text",
    status: "live",
    featured: true,
    keywords: [
      "character count",
      "word count",
      "reading time",
      "readability",
      "flesch",
      "keyword density",
      "essay",
      "seo",
    ],
    usage: [
      "Type or paste your text — every count updates as you go.",
      "Reading and speaking times assume 238 and 150 words per minute.",
      "Readability scores appear once there are at least 25 words.",
      "The keyword list ignores filler words so the topic stands out.",
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "Fourteen cases at once — camel, snake, kebab, title and more.",
    description:
      "Convert text into every casing convention at the same time: sentence and title case for prose, camel, Pascal, snake, kebab, constant and dot case for code, plus alternating and inverse for fun. Copy any one of them, or push it back into the input to chain conversions.",
    category: "text",
    status: "live",
    keywords: [
      "uppercase",
      "lowercase",
      "camelcase",
      "snake_case",
      "kebab-case",
      "title case",
      "pascalcase",
      "slug",
    ],
    usage: [
      "Type or paste text into the box at the top.",
      "Every conversion is produced at once — no need to pick one first.",
      "Copy any result, or send it back to the input to convert again.",
      "Download all fourteen conversions as a single text file.",
    ],
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    tagline: "Compare two texts and see exactly what changed.",
    description:
      "Compare two versions of anything — code, contracts, configuration — and see additions, deletions and edits highlighted down to the word. View them side by side or as a unified patch, and ignore case or whitespace when they don't matter.",
    category: "text",
    status: "live",
    featured: true,
    keywords: [
      "compare",
      "difference",
      "text diff",
      "patch",
      "merge",
      "changes",
      "side by side",
    ],
    usage: [
      "Paste the original on the left and the changed version on the right.",
      "Edited lines are paired up and highlighted word by word.",
      "Switch between the side-by-side and unified views.",
      "Turn on the ignore options when case or whitespace isn't meaningful.",
    ],
  },
  {
    slug: "sort-lists",
    name: "Sort Lists",
    tagline: "Sort, dedupe and clean up any list of lines.",
    description:
      "Paste a list and sort it alphabetically, numerically or by length, in either direction. Remove duplicates, strip blank lines and trim whitespace in the same pass.",
    category: "text",
    status: "live",
    keywords: ["sort", "alphabetical", "dedupe", "unique", "lines", "order"],
    usage: [
      "Paste your list into the input pane, one item per line.",
      "Choose how to sort: alphabetically, numerically, by length or randomly.",
      "Toggle deduplication, case sensitivity and whitespace trimming.",
      "Copy the result or download it as a text file.",
    ],
  },
  {
    slug: "translator",
    name: "Translator",
    tagline: "Translate text into more than 100 languages.",
    description:
      "Translate text into over 100 languages, with a live character count and one-click copy of the result. Detects the source language automatically.",
    category: "text",
    status: "live",
    featured: true,
    keywords: ["translate", "language", "spanish", "french", "japanese"],
    usage: [
      "Type or paste the text you want to translate.",
      "Pick a target language from the searchable list.",
      "Translate, then copy the result with the copy button.",
      "Clear resets both panes so you can start again.",
    ],
    sources: [
      {
        label: "Google Translate",
        href: "https://github.com/vitalets/google-translate-api",
      },
    ],
  },

  /* ---------------------------- images & media ---------------------------- */
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Shrink JPG, PNG, WebP and AVIF files without visible loss.",
    description:
      "Reduce image file size with a quality slider and see exactly how many bytes you saved before downloading. Supports JPG, PNG, WebP and AVIF up to 25 MB.",
    category: "media",
    status: "live",
    featured: true,
    keywords: ["compress", "optimise", "optimize", "shrink", "jpg", "png"],
    usage: [
      "Drop an image onto the upload area, or click to browse for one.",
      "Move the quality slider — lower quality means a smaller file.",
      "Compress to see the before/after size and the percentage saved.",
      "Download the result, or adjust the slider and compress again.",
    ],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Resize images to any size, entirely on your device.",
    description:
      "Scale an image to exact pixel dimensions or a percentage of its original size, with presets for the sizes the web actually asks for. Choose how it fits the frame, export as WebP, JPG or PNG, and keep the file on your machine the whole time.",
    category: "media",
    status: "live",
    keywords: [
      "resize",
      "scale",
      "dimensions",
      "thumbnail",
      "avatar",
      "crop",
      "pixels",
      "downscale",
    ],
    usage: [
      "Drop an image onto the upload area, or click to browse for one.",
      "Set a width and height, use a percentage, or pick a preset size.",
      "Choose whether to pad, crop or stretch the image into that frame.",
      "Resize, compare the file sizes, then download the result.",
    ],
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    tagline: "Convert between JPG, PNG, WebP and AVIF.",
    description:
      "Change an image from one format to another while keeping quality high. Useful for producing WebP or AVIF versions of existing assets for the web.",
    category: "media",
    status: "live",
    keywords: ["convert", "format", "webp", "avif", "jpeg", "png"],
    usage: [
      "Drop an image onto the upload area, or click to browse for one.",
      "Pick the format you want to convert to.",
      "Convert, then compare the original and converted file sizes.",
      "Download the converted image with its new extension.",
    ],
  },
  {
    slug: "image-editor",
    name: "Image Editor",
    tagline: "Crop, rotate and tune images right in the browser.",
    description:
      "Rotate, flip and adjust brightness, contrast and saturation, then export the result. All processing happens on your device — the image never leaves your browser.",
    category: "media",
    status: "live",
    keywords: ["crop", "rotate", "filter", "brightness", "contrast", "resize"],
    usage: [
      "Drop an image onto the canvas, or click to browse for one.",
      "Rotate and flip with the transform controls.",
      "Adjust brightness, contrast, saturation, blur and grayscale with the sliders.",
      "Reset returns to the original; export downloads a PNG of the edited image.",
    ],
  },
  {
    slug: "audio-converter",
    name: "Audio to WAV Converter",
    tagline: "Turn any audio file into lossless WAV, entirely on your device.",
    description:
      "Decode MP3, M4A, AAC, FLAC, OGG or Opus and export uncompressed WAV, with control over sample rate, bit depth, channels and trim. Everything runs through the Web Audio API in your browser — the file is never uploaded.",
    category: "media",
    status: "live",
    keywords: [
      "mp3 to wav",
      "m4a to wav",
      "audio",
      "convert",
      "pcm",
      "resample",
      "sound",
      "music",
    ],
    usage: [
      "Drop an audio file onto the upload area, or click to browse for one.",
      "Set the sample rate, bit depth and channel layout you need — or leave them on Original.",
      "Drag the trim handles to export just part of the track, and normalise if it's quiet.",
      "Convert, preview the result, then download the WAV.",
    ],
  },

  /* ------------------------------ developer ------------------------------- */
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, minify and validate JSON with a browsable tree.",
    description:
      "Pretty-print messy JSON, minify it again, or find out exactly which line broke it. Sort keys to compare two documents by eye, explore the structure as a collapsible tree, and see how many objects, arrays and values it contains.",
    category: "developer",
    status: "live",
    featured: true,
    keywords: [
      "json",
      "beautify",
      "pretty print",
      "minify",
      "validate",
      "parse",
      "lint",
      "api",
    ],
    usage: [
      "Paste JSON into the input — validation runs as you type.",
      "Errors report the line and column so you can go straight to them.",
      "Choose your indentation, or sort keys to make two files comparable.",
      "Switch to the tree view to explore large documents by collapsing them.",
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "Test regular expressions with live highlighting and groups.",
    description:
      "Write a regular expression and watch it match against your text in real time, with every capture group broken out and named groups labelled. Preview a replacement before you run it, and keep the syntax reference open beside you.",
    category: "developer",
    status: "live",
    featured: true,
    keywords: [
      "regex",
      "regexp",
      "regular expression",
      "pattern",
      "match",
      "capture group",
      "replace",
      "javascript",
    ],
    usage: [
      "Write your pattern — flags are toggles, so no slashes to escape.",
      "Matches are highlighted in the test string as you type.",
      "Open a match to see its position and every capture group.",
      "Use the replace tab to preview a substitution before committing to it.",
    ],
  },
  {
    slug: "csv-converter",
    name: "CSV to JSON Converter",
    tagline: "Convert CSV to JSON and back, with a live preview table.",
    description:
      "Turn a spreadsheet export into JSON your code can use, or flatten JSON back into CSV. Delimiters are detected automatically, numbers and booleans can be typed, and a preview table shows what was actually parsed before you copy anything.",
    category: "developer",
    status: "live",
    keywords: [
      "csv",
      "json",
      "convert",
      "spreadsheet",
      "excel",
      "tsv",
      "delimiter",
      "parse",
    ],
    usage: [
      "Paste your CSV, or open a .csv file from your device.",
      "Set the delimiter, or leave it on automatic detection.",
      "Check the preview table — parse warnings are listed, never hidden.",
      "Copy the JSON, or switch tabs to go the other way.",
    ],
  },
  {
    slug: "base64-converter",
    name: "Base64 Encoder & Decoder",
    tagline: "Encode and decode Base64 text, files and data URLs.",
    description:
      "Convert text to Base64 and back with full Unicode support, or turn a file into a data URL for embedding. Decoding accepts URL-safe alphabets, missing padding and line breaks, and can hand you a real file back at the end.",
    category: "developer",
    status: "live",
    keywords: [
      "base64",
      "encode",
      "decode",
      "data url",
      "btoa",
      "atob",
      "url-safe",
      "binary",
    ],
    usage: [
      "Switch between text and file mode with the tabs.",
      "Use the URL-safe alphabet for tokens that travel in a query string.",
      "Decoding tolerates missing padding, line breaks and data: prefixes.",
      "In file mode, encode any file or decode Base64 back into a download.",
    ],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    tagline: "Read a JSON Web Token's claims and check its signature.",
    description:
      "Decode the header and payload of any JWT, with registered claims explained and expiry times shown in plain language. HS256, HS384 and HS512 signatures can be verified against a secret — all of it in your browser, with nothing sent anywhere.",
    category: "developer",
    status: "live",
    keywords: [
      "jwt",
      "token",
      "json web token",
      "claims",
      "oauth",
      "bearer",
      "hmac",
      "expiry",
    ],
    usage: [
      "Paste a token — the header and payload decode immediately.",
      "Standard claims are explained, and timestamps become readable dates.",
      "A badge shows whether the token is active, expired or not yet valid.",
      "Add the shared secret to verify an HS256, HS384 or HS512 signature.",
    ],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    tagline: "MD5, SHA and CRC32 checksums for text or any file.",
    description:
      "Produce MD5, SHA-1, SHA-256, SHA-384, SHA-512 and CRC32 digests of text or a file, all at once. Paste a published checksum and the matching algorithm is highlighted, so verifying a download takes one step instead of three.",
    category: "developer",
    status: "live",
    keywords: [
      "hash",
      "checksum",
      "md5",
      "sha256",
      "sha1",
      "crc32",
      "digest",
      "verify",
      "integrity",
    ],
    usage: [
      "Type text, or switch to the file tab and choose a file.",
      "Every digest is computed at once — nothing is uploaded.",
      "Paste an expected checksum to see which algorithm it matches.",
      "Use SHA-256 for anything security-related; MD5 only for integrity.",
    ],
  },
  {
    slug: "url-parser",
    name: "URL Parser",
    tagline: "Break a URL apart, edit its query string, encode and decode.",
    description:
      "Split any URL into protocol, host, port, path, query and fragment, then add, edit or remove query parameters and copy the rebuilt result. A second tab handles percent-encoding for query values, whole URLs or the strict unreserved set.",
    category: "developer",
    status: "live",
    keywords: [
      "url",
      "query string",
      "parameters",
      "encode",
      "decode",
      "percent encoding",
      "uri",
      "utm",
    ],
    usage: [
      "Paste a URL — a bare hostname is upgraded to https automatically.",
      "Every component is listed with its own copy button.",
      "Edit, add or remove query parameters and copy the rebuilt URL.",
      "Switch to the second tab to percent-encode or decode any text.",
    ],
  },
  {
    slug: "cron-helper",
    name: "Cron Expression Helper",
    tagline: "Translate a cron expression into English and its next runs.",
    description:
      "Turn a cron schedule into a sentence you can check, then see the next eight times it will actually fire in your own timezone. Field-by-field breakdown, common presets, and support for six-field expressions and @daily-style aliases.",
    category: "developer",
    status: "live",
    keywords: [
      "cron",
      "crontab",
      "schedule",
      "expression",
      "next run",
      "job",
      "quartz",
      "timer",
    ],
    usage: [
      "Type a cron expression, or start from one of the presets.",
      "The plain-English description updates as you type.",
      "Check the next eight run times — they use your local timezone.",
      "The breakdown table shows exactly what each field resolves to.",
    ],
  },
  {
    slug: "cookie-details",
    name: "Cookie Inspector",
    tagline: "Look up what a browser cookie actually does.",
    description:
      "Search the Open Cookie Database by cookie name or domain to find out what a cookie stores, who controls it, how long it lives and which category it belongs to.",
    category: "developer",
    status: "live",
    keywords: ["cookie", "gdpr", "privacy", "tracking", "consent"],
    usage: [
      "Enter a cookie name, a domain, or both to narrow the search.",
      "Results show the controller, category, retention period and purpose.",
      "Searching by domain alone lists every known cookie for that site.",
      "Data comes from the community-maintained Open Cookie Database.",
    ],
    sources: [
      {
        label: "Open Cookie Database",
        href: "https://github.com/jkwakman/Open-Cookie-Database",
      },
    ],
  },

  /* ------------------------------ generators ------------------------------ */
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    tagline: "Generate v4, v7 and v5 UUIDs, and inspect existing ones.",
    description:
      "Generate cryptographically random version 4 UUIDs, time-ordered version 7 UUIDs for database keys, or deterministic version 5 UUIDs from a namespace and name. Paste an existing identifier to see its version, variant and embedded timestamp.",
    category: "generators",
    status: "live",
    keywords: [
      "uuid",
      "guid",
      "identifier",
      "v4",
      "v7",
      "random",
      "unique id",
      "primary key",
    ],
    usage: [
      "Pick a version — v4 for random, v7 when IDs should sort by time.",
      "Generate up to 500 at once, then copy or download the whole batch.",
      "Adjust the formatting with the uppercase, hyphen and brace switches.",
      "Paste any UUID into the inspector to see what it actually encodes.",
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Generate strong passwords with a live strength estimate.",
    description:
      "Generate cryptographically random passwords with full control over length and character sets, plus a live entropy-based strength estimate. Generated entirely on your device.",
    category: "generators",
    status: "live",
    featured: true,
    keywords: ["password", "random", "secure", "entropy", "passphrase"],
    usage: [
      "Set the length with the slider — longer is stronger than more complex.",
      "Choose which character sets to include; ambiguous characters can be excluded.",
      "The strength meter shows the entropy in bits and an estimated crack time.",
      "Copy the password, or regenerate until you get one you like.",
    ],
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    tagline: "Create customisable QR codes and download them as PNG or SVG.",
    description:
      "Turn any text, URL, phone number or Wi-Fi credential into a QR code. Tune the colours, size and error-correction level, then export as PNG or scalable SVG.",
    category: "generators",
    status: "live",
    featured: true,
    keywords: ["qr", "barcode", "scan", "url", "wifi", "vcard"],
    usage: [
      "Type or paste the content you want to encode — the preview updates live.",
      "Adjust size, margin, colours and error-correction level.",
      "Higher error correction survives more damage but stores less data.",
      "Download as PNG for sharing, or SVG for print and large formats.",
    ],
  },
  {
    slug: "color-generator",
    name: "Colour Generator",
    tagline: "Build palettes and copy colours in HEX, RGB, HSL or OKLCH.",
    description:
      "Pick or randomise a colour, generate a harmonious palette from it, and copy any swatch in HEX, RGB, HSL or OKLCH. Saved palettes stay in your browser.",
    category: "generators",
    status: "live",
    keywords: ["colour", "color", "palette", "hex", "rgb", "hsl", "swatch"],
    usage: [
      "Pick a colour with the swatch, type a HEX value, or press Randomise.",
      "The generated palette shows tints, shades and harmonies of that colour.",
      "Switch the format to copy values as HEX, RGB, HSL or OKLCH.",
      "Save colours to your gallery — it persists in your browser.",
    ],
  },
  {
    slug: "name-generator",
    name: "Name Generator",
    tagline: "Invent names for brands, projects, characters and usernames.",
    description:
      "Generate names in five distinct styles — brandable coinages, startup-style words, project codenames, fantasy characters and usernames. Filter by length and starting letter, keep the ones you like, and copy the shortlist in one go.",
    category: "generators",
    status: "live",
    keywords: [
      "names",
      "brand",
      "startup",
      "character",
      "username",
      "codename",
      "random",
      "generator",
    ],
    usage: [
      "Pick a style — each one uses a different construction, not the same list reshuffled.",
      "Narrow the results by length or by the letter they start with.",
      "Press Generate, or hit Space, for a fresh batch.",
      "Star the ones worth keeping — your shortlist is saved in this browser.",
    ],
  },
  {
    slug: "sitemap-compiler",
    name: "Sitemap Compiler",
    tagline: "Build a valid sitemap.xml from a list of URLs.",
    description:
      "Paste a list of URLs and get a standards-compliant sitemap.xml, with per-URL change frequency and priority. Invalid URLs are flagged rather than silently dropped.",
    category: "generators",
    status: "live",
    keywords: ["sitemap", "xml", "seo", "crawl", "google", "index"],
    usage: [
      "Paste your URLs into the input pane, one per line.",
      "Invalid lines are listed separately so nothing disappears silently.",
      "Set a change frequency, priority and last-modified date for the whole set.",
      "Copy the XML or download it as sitemap.xml.",
    ],
  },

  /* ----------------------------- fun & games ------------------------------ */
  {
    slug: "quotes",
    name: "Quotes",
    tagline: "A quote for whatever you need right now.",
    description:
      "Pull a quote from a curated collection, filtered by theme — motivation, wisdom, happiness and more. Copy or share the ones worth keeping.",
    category: "fun",
    status: "live",
    featured: true,
    keywords: ["quote", "inspiration", "motivation", "wisdom", "saying"],
    usage: [
      "A random quote loads as soon as you open the page.",
      "Filter by theme to narrow the pool it draws from.",
      "Press New quote, or hit Space, for another one.",
      "Copy the quote and its attribution with the copy button.",
    ],
    sources: [
      {
        label: "Garden of Quotes",
        href: "https://github.com/nirajgiriXD/garden-of-quotes",
      },
    ],
  },
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    tagline: "Play a friend or take on the computer.",
    description:
      "Classic tic-tac-toe with a two-player mode and three computer difficulties, including an unbeatable one. Step back through the move history at any point.",
    category: "fun",
    status: "live",
    keywords: ["game", "noughts", "crosses", "xo", "play", "board"],
    usage: [
      "Choose two players, or play the computer at easy, medium or impossible.",
      "Click or use the arrow keys and Enter to place your mark.",
      "The winning line is highlighted when the game ends.",
      "Jump back to any earlier move using the history list.",
    ],
  },
];

/* --------------------------------- lookups -------------------------------- */

const toolsBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
const categoriesById = new Map(
  toolCategories.map((category) => [category.id, category])
);

export function getTool(slug: string): Tool | undefined {
  return toolsBySlug.get(slug);
}

export function getCategory(id: ToolCategoryId): ToolCategory {
  const category = categoriesById.get(id);
  if (!category) throw new Error(`Unknown tool category: ${id}`);
  return category;
}

/** Live tools only — planned ones are listed but not linked as products. */
export const liveTools = tools.filter((tool) => tool.status === "live");
export const plannedTools = tools.filter((tool) => tool.status === "planned");

export const featuredTools = liveTools.filter((tool) => tool.featured);

/**
 * The featured tools dealt out one category at a time, so the first handful
 * spans the site rather than emptying whichever category sorts first. Used
 * wherever only a few slots exist — the palette's resting state, the hero rail,
 * the footer's shortlist.
 */
export const spotlightTools: Tool[] = (() => {
  const groups = toolCategories.map((category) =>
    featuredTools.filter((tool) => tool.category === category.id)
  );
  const depth = Math.max(0, ...groups.map((group) => group.length));
  const ordered: Tool[] = [];

  for (let round = 0; round < depth; round++) {
    for (const group of groups) {
      const tool = group[round];
      if (tool) ordered.push(tool);
    }
  }

  return ordered;
})();

export function getToolsByCategory(id: ToolCategoryId) {
  return tools.filter((tool) => tool.category === id);
}

export function getLiveToolsByCategory(id: ToolCategoryId) {
  return liveTools.filter((tool) => tool.category === id);
}

/**
 * Sibling tools from the same category, used for internal linking at the
 * bottom of every tool page. Falls back to featured tools for small
 * categories so the rail is never sparse.
 */
export function getRelatedTools(slug: string, limit = 4): Tool[] {
  const tool = getTool(slug);
  if (!tool) return featuredTools.slice(0, limit);

  const siblings = getLiveToolsByCategory(tool.category).filter(
    (candidate) => candidate.slug !== slug
  );
  if (siblings.length >= limit) return siblings.slice(0, limit);

  const filler = liveTools.filter(
    (candidate) =>
      candidate.slug !== slug &&
      !siblings.some((sibling) => sibling.slug === candidate.slug)
  );
  return [...siblings, ...filler].slice(0, limit);
}

/**
 * Ranked substring search over name, tagline and keywords. Deliberately simple:
 * the corpus is ~30 items, so exact-prefix beats fuzzy matching for precision.
 */
export function searchTools(query: string, pool: Tool[] = tools): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return pool;

  const scored = pool
    .map((tool) => {
      const name = tool.name.toLowerCase();
      let score = 0;

      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80;
      else if (name.includes(q)) score = 60;
      else if (tool.slug.includes(q)) score = 55;
      else if (tool.tagline.toLowerCase().includes(q)) score = 35;
      else if (tool.keywords.some((keyword) => keyword.includes(q))) score = 30;
      else if (tool.description.toLowerCase().includes(q)) score = 15;

      // Live tools should always outrank a planned tool of equal relevance.
      if (score > 0 && tool.status === "live") score += 5;

      return { tool, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name)
    );

  return scored.map((entry) => entry.tool);
}

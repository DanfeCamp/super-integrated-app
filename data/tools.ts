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

export type ToolCategoryId =
  "everyday" | "media" | "text" | "developer" | "fun";

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
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

export const toolCategories: ToolCategory[] = [
  {
    id: "everyday",
    name: "Everyday",
    description:
      "Calculators, converters, timers and clocks for the small tasks that come up every day.",
    gradient: "from-violet-500/15 to-indigo-500/10",
    foreground: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "media",
    name: "Images & Media",
    description:
      "Compress, convert and edit images, audio and video without installing anything.",
    gradient: "from-sky-500/15 to-cyan-500/10",
    foreground: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "text",
    name: "Text & Language",
    description:
      "Translate, sort and tidy up text with tools built for writers.",
    gradient: "from-emerald-500/15 to-teal-500/10",
    foreground: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "developer",
    name: "Web & Developer",
    description:
      "Generators and inspectors for the web — QR codes, sitemaps, colours, cookies and passwords.",
    gradient: "from-amber-500/15 to-orange-500/10",
    foreground: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "fun",
    name: "Fun & Inspiration",
    description: "Quotes and games for when you need a break or a spark.",
    gradient: "from-rose-500/15 to-pink-500/10",
    foreground: "text-rose-700 dark:text-rose-300",
  },
];

export const tools: Tool[] = [
  /* ------------------------------- everyday ------------------------------ */
  {
    slug: "calculator",
    name: "Calculator",
    tagline: "A keyboard-friendly calculator with a running history.",
    description:
      "Run arithmetic, percentages and bracketed expressions with full keyboard support. Every result is kept in a history strip so you can reuse earlier answers without retyping them.",
    category: "everyday",
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
    slug: "currency-converter",
    name: "Currency Converter",
    tagline: "Convert between 160+ currencies at today's mid-market rate.",
    description:
      "Convert any amount between more than 160 world currencies using daily mid-market reference rates. Swap directions in a click and see the exact rate used for the conversion.",
    category: "everyday",
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
    category: "everyday",
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
    slug: "timer",
    name: "Stopwatch",
    tagline: "A precise stopwatch with lap times.",
    description:
      "A drift-free stopwatch that keeps accurate time even when the tab is backgrounded. Record laps, see the split between each one, and copy the whole session in one click.",
    category: "everyday",
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
    category: "everyday",
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
    category: "everyday",
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
  {
    slug: "to-do",
    name: "To-Do List",
    tagline: "A focused task list that stays on your device.",
    description:
      "Capture tasks, reorder them, mark them done and filter by state. Everything is stored in your browser, so the list survives reloads without an account.",
    category: "everyday",
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

  /* -------------------------------- media -------------------------------- */
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
    name: "Audio Converter",
    tagline: "Convert audio files between common formats.",
    description:
      "Convert audio files between MP3, WAV, OGG and other common formats without installing software.",
    category: "media",
    status: "planned",
    keywords: ["mp3", "wav", "ogg", "sound", "music"],
    usage: [],
  },
  {
    slug: "audio-downloader",
    name: "Audio Downloader",
    tagline: "Save audio for offline listening.",
    description:
      "Download audio from supported sources so you can listen to music and podcasts offline.",
    category: "media",
    status: "planned",
    keywords: ["download", "music", "podcast", "offline"],
    usage: [],
  },
  {
    slug: "video-converter",
    name: "Video Converter",
    tagline: "Convert video between MP4, MOV, AVI and more.",
    description:
      "Convert video files between MP4, MOV, AVI, WebM and other common container formats.",
    category: "media",
    status: "planned",
    keywords: ["mp4", "mov", "avi", "webm", "transcode"],
    usage: [],
  },
  {
    slug: "video-downloader",
    name: "Video Downloader",
    tagline: "Save videos for offline viewing.",
    description:
      "Download videos from supported sources for offline viewing on any device.",
    category: "media",
    status: "planned",
    keywords: ["download", "offline", "save video"],
    usage: [],
  },
  {
    slug: "video-editor",
    name: "Video Editor",
    tagline: "Trim, crop and export video in the browser.",
    description:
      "Trim, crop and export video clips directly in your browser, with no upload and no install.",
    category: "media",
    status: "planned",
    keywords: ["trim", "cut", "clip", "edit video"],
    usage: [],
  },
  {
    slug: "document-converter",
    name: "Document Converter",
    tagline: "Convert documents between PDF, DOCX and ODT.",
    description:
      "Convert documents between PDF, DOCX, ODT and other common office formats.",
    category: "media",
    status: "planned",
    keywords: ["pdf", "docx", "odt", "word", "office"],
    usage: [],
  },

  /* --------------------------------- text -------------------------------- */
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
    slug: "name-generator",
    name: "Name Generator",
    tagline: "Generate names for characters, products and projects.",
    description:
      "Generate names for characters, products, projects and brands from a set of style presets.",
    category: "text",
    status: "planned",
    keywords: ["names", "brand", "character", "random", "generator"],
    usage: [],
  },

  /* ------------------------------ developer ------------------------------ */
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    tagline: "Create customisable QR codes and download them as PNG or SVG.",
    description:
      "Turn any text, URL, phone number or Wi-Fi credential into a QR code. Tune the colours, size and error-correction level, then export as PNG or scalable SVG.",
    category: "developer",
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
    slug: "sitemap-compiler",
    name: "Sitemap Compiler",
    tagline: "Build a valid sitemap.xml from a list of URLs.",
    description:
      "Paste a list of URLs and get a standards-compliant sitemap.xml, with per-URL change frequency and priority. Invalid URLs are flagged rather than silently dropped.",
    category: "developer",
    status: "live",
    keywords: ["sitemap", "xml", "seo", "crawl", "google", "index"],
    usage: [
      "Paste your URLs into the input pane, one per line.",
      "Invalid lines are listed separately so nothing disappears silently.",
      "Set a change frequency, priority and last-modified date for the whole set.",
      "Copy the XML or download it as sitemap.xml.",
    ],
  },
  {
    slug: "color-generator",
    name: "Colour Generator",
    tagline: "Build palettes and copy colours in HEX, RGB, HSL or OKLCH.",
    description:
      "Pick or randomise a colour, generate a harmonious palette from it, and copy any swatch in HEX, RGB, HSL or OKLCH. Saved palettes stay in your browser.",
    category: "developer",
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
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Generate strong passwords with a live strength estimate.",
    description:
      "Generate cryptographically random passwords with full control over length and character sets, plus a live entropy-based strength estimate. Generated entirely on your device.",
    category: "developer",
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

  /* --------------------------------- fun --------------------------------- */
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

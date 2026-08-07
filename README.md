# Super Integrated App (SIA)

Every everyday tool, in one place — a fast, free, privacy-friendly collection of
online utilities. No accounts, no adverts, no limits.

Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

| Script                 | Does                                            |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Development server                              |
| `npm run build`        | Production build                                |
| `npm run start`        | Serve the production build                      |
| `npm run typecheck`    | `tsc --noEmit`                                  |
| `npm run lint`         | ESLint                                          |
| `npm run format`       | Prettier, writing changes                       |
| `npm run check`        | Types + lint + format check (what CI runs)      |

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so canonical URLs, Open Graph
tags, the sitemap and JSON-LD all resolve correctly. It defaults to
`https://superintegrateapp.com`.

## The tools

**Everyday** — Calculator · Currency Converter · Interest Calculator ·
Stopwatch · Countdown · World Clock · To-Do List

**Images & Media** — Image Compressor · Image Converter · Image Editor

**Text & Language** — Translator · Sort Lists

**Web & Developer** — QR Code Generator · Sitemap Compiler · Colour Generator ·
Password Generator · Cookie Inspector

**Fun & Inspiration** — Quotes · Tic-Tac-Toe

On the roadmap: Audio Converter, Audio Downloader, Video Converter, Video
Downloader, Video Editor, Document Converter, Name Generator. Each already has
a route and a placeholder page.

Most tools run entirely in your browser — nothing is uploaded. The rest call a
first-party API route that processes the request and returns the result without
storing it.

## Architecture

```
app/
  apps/<slug>/           one folder per tool: page.tsx + <slug>-tool.tsx
  api/                   route handlers (image, translate, quotes, rates, …)
  categories/            category index and per-category pages
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx
components/
  ui/                    shadcn/ui primitives over Radix
  layout/                header, footer, command menu, theme, breadcrumbs
  tools/                 ToolShell, ToolCard, ToolBrowser, FileDropzone …
data/                    tool registry + static datasets
hooks/                   shared client hooks
lib/                     utils, site config, SEO builders, API helpers
```

Imports use the `@/*` alias, which maps to the project root — `@/lib/utils`,
`@/components/ui/button`, `@/data/tools`.

### The tool registry

`data/tools.ts` is the single source of truth. One entry drives the tool's
card, its category page, search, breadcrumbs, page metadata, JSON-LD, the
related-tools rail and the sitemap.

### Adding a tool

1. Add an entry to `tools` in `data/tools.ts`.
2. Map its slug to a Lucide icon in `data/tool-icons.ts`.
3. Create `app/apps/<slug>/page.tsx`:

   ```tsx
   import type { Metadata } from "next";
   import { ToolShell } from "@/components/tools/tool-shell";
   import { toolMetadata } from "@/lib/tool-page";
   import { MyTool } from "./my-tool";

   const SLUG = "my-tool";
   export const metadata: Metadata = toolMetadata(SLUG);

   export default function Page() {
     return (
       <ToolShell slug={SLUG}>
         <MyTool />
       </ToolShell>
     );
   }
   ```

4. Build the tool itself in `./<slug>-tool.tsx` as a client component.

`ToolShell` supplies the breadcrumbs, title block, description, "How to use it"
panel, source attribution, structured data and related-tools rail. Everything
else — navigation, search, the sitemap — updates from the registry entry.

## Design system

Tokens live in `app/globals.css`, authored in OKLCH with a matched
light/dark pair for every value. Components are shadcn/ui (new-york) built on
Radix primitives, with Lucide icons, CVA variants and `tailwind-merge`.

Category colour is assigned centrally so a grid of tools reads as grouped
families rather than unrelated accents.

## Quality bar

Verified against the production build:

- **Lighthouse** — 100 performance / 100 accessibility / 100 best practices /
  100 SEO on desktop; 89–95 performance on the throttled mobile profile.
- **Accessibility** — zero `axe-core` violations across 27 pages in both
  themes, covering WCAG 2.0/2.1/2.2 A and AA plus best-practice rules.
- **Types and lint** — `tsc --noEmit` and ESLint both clean, with `strict` and
  `noUncheckedIndexedAccess` on.
- **Runtime** — no console errors, no hydration mismatches and no horizontal
  overflow from 390px to 2560px.

## Contributing

Branches must be named `feat/*`, `fix/*` or `ref/*` — the pre-commit hook
enforces it. `npm run check` must pass before pushing.

## Licence

See [LICENSE](LICENSE). Made with ❤️ by [DanfeCamp](https://danfecamp.com).

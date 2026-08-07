import {
  ArrowDownAZ,
  ArrowRightLeft,
  AudioLines,
  Calculator,
  Cookie,
  Globe,
  Grid3x3,
  Hourglass,
  ImageMinus,
  Images,
  KeyRound,
  Languages,
  ListChecks,
  Network,
  Palette,
  PiggyBank,
  QrCode,
  Quote,
  Sparkles,
  Tags,
  Timer,
  Wand2,
  type LucideIcon,
} from "lucide-react";

/**
 * Slug → icon. Kept apart from the registry so `data/tools.ts` stays plain
 * data that can cross the server/client boundary.
 */
export const toolIcons: Record<string, LucideIcon> = {
  "audio-converter": AudioLines,
  calculator: Calculator,
  "color-generator": Palette,
  "cookie-details": Cookie,
  countdown: Hourglass,
  "currency-converter": ArrowRightLeft,
  "image-compressor": ImageMinus,
  "image-converter": Images,
  "image-editor": Wand2,
  "interest-calculator": PiggyBank,
  "name-generator": Tags,
  "password-generator": KeyRound,
  "qr-generator": QrCode,
  quotes: Quote,
  "sitemap-compiler": Network,
  "sort-lists": ArrowDownAZ,
  "tic-tac-toe": Grid3x3,
  timer: Timer,
  "to-do": ListChecks,
  translator: Languages,
  "world-clock": Globe,
};

export function getToolIcon(slug: string): LucideIcon {
  return toolIcons[slug] ?? Sparkles;
}

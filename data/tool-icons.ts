import {
  ArrowDownAZ,
  ArrowRightLeft,
  AudioLines,
  Calculator,
  Clapperboard,
  Cookie,
  FileText,
  FileVideo,
  Globe,
  Grid3x3,
  Hourglass,
  ImageMinus,
  Images,
  KeyRound,
  Languages,
  ListChecks,
  MonitorDown,
  Music4,
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
  "audio-downloader": Music4,
  calculator: Calculator,
  "color-generator": Palette,
  "cookie-details": Cookie,
  countdown: Hourglass,
  "currency-converter": ArrowRightLeft,
  "document-converter": FileText,
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
  "video-converter": FileVideo,
  "video-downloader": MonitorDown,
  "video-editor": Clapperboard,
  "world-clock": Globe,
};

export function getToolIcon(slug: string): LucideIcon {
  return toolIcons[slug] ?? Sparkles;
}

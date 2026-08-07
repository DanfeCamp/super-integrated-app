import {
  Calculator,
  Clock,
  CodeXml,
  Gamepad2,
  ImageIcon,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";

import type { ToolCategoryId } from "@/data/tools";

/**
 * Category → icon. Split from the registry for the same reason tool icons are:
 * `data/tools.ts` stays plain data that crosses the server/client boundary.
 */
export const categoryIcons: Record<ToolCategoryId, LucideIcon> = {
  calculators: Calculator,
  productivity: Clock,
  text: Type,
  media: ImageIcon,
  developer: CodeXml,
  generators: Sparkles,
  fun: Gamepad2,
};

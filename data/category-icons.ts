import {
  CodeXml,
  Gamepad2,
  ImageIcon,
  Type,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { ToolCategoryId } from "@/data/tools";

/**
 * Category → icon. Split from the registry for the same reason tool icons are:
 * `data/tools.ts` stays plain data that crosses the server/client boundary.
 */
export const categoryIcons: Record<ToolCategoryId, LucideIcon> = {
  everyday: Wrench,
  media: ImageIcon,
  text: Type,
  developer: CodeXml,
  fun: Gamepad2,
};

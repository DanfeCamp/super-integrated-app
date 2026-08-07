import {
  getLiveToolsByCategory,
  toolCategories,
  type Tool,
  type ToolCategory,
  type ToolCategoryId,
} from "@/data/tools";

export interface CategoryEntry {
  category: ToolCategory;
  /** Live tools in the category, in registry order. */
  tools: Tool[];
  count: number;
}

/**
 * Categories paired with their live tools. Derived once at module load rather
 * than per render — the registry is static, and the header menu, the mobile
 * sheet and the footer all need exactly this shape.
 */
export const categoryEntries: CategoryEntry[] = toolCategories.map(
  (category) => {
    const tools = getLiveToolsByCategory(category.id);
    return { category, tools, count: tools.length };
  }
);

/**
 * The category the Tools menu opens on — first in registry order. The fallback
 * is unreachable (the registry is never empty) and exists only because
 * `noUncheckedIndexedAccess` can't know that.
 */
export const defaultCategoryId: ToolCategoryId =
  categoryEntries[0]?.category.id ?? "calculators";

export interface HeaderNavItem {
  title: string;
  href: string;
}

/**
 * The centred header links, either side of the Tools menu. Kept here so the
 * desktop bar and the mobile sheet can never drift apart on what "the main
 * navigation" is.
 */
export const headerNavLeading: HeaderNavItem[] = [{ title: "Home", href: "/" }];

export const headerNavTrailing: HeaderNavItem[] = [
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about-us" },
  { title: "Contact", href: "/contact-us" },
];

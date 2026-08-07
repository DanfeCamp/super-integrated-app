import { getLiveToolsByCategory, toolCategories } from "@/data/tools";

/**
 * Categories paired with their live tool count. Derived once at module load
 * rather than per render — the registry is static, and both the header menu
 * and the mobile sheet need the same numbers.
 */
export const categoryEntries = toolCategories.map((category) => ({
  category,
  count: getLiveToolsByCategory(category.id).length,
}));

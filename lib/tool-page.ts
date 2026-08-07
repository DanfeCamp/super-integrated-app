import type { Metadata } from "next";

import { getCategory, getTool } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";

/**
 * Per-tool metadata derived from the registry, so a route never restates
 * anything the registry already knows. Planned tools are `noindex` — their
 * pages are placeholders and shouldn't compete in search.
 */
export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  if (!tool) return {};

  const category = getCategory(tool.category);

  return buildMetadata({
    title: tool.name,
    description: tool.description,
    path: `/apps/${tool.slug}`,
    keywords: [
      tool.name.toLowerCase(),
      `free ${tool.name.toLowerCase()}`,
      `online ${tool.name.toLowerCase()}`,
      ...tool.keywords,
      category.name.toLowerCase(),
    ],
    noIndex: tool.status === "planned",
  });
}

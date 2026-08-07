import type { MetadataRoute } from "next";

import { liveTools, toolCategories } from "@/data/tools";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/apps"), changeFrequency: "weekly", priority: 0.9 },
    {
      url: absoluteUrl("/categories"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: absoluteUrl("/about-us"), changeFrequency: "yearly", priority: 0.4 },
    {
      url: absoluteUrl("/contact-us"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = toolCategories.map(
    (category) => ({
      url: absoluteUrl(`/categories/${category.id}`),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  // Planned tools are intentionally excluded — they render a placeholder and
  // are marked `noindex`, so listing them would send crawlers to thin pages.
  const toolRoutes: MetadataRoute.Sitemap = liveTools.map((tool) => ({
    url: absoluteUrl(`/apps/${tool.slug}`),
    changeFrequency: "monthly",
    priority: tool.featured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes].map((entry) => ({
    ...entry,
    lastModified,
  }));
}

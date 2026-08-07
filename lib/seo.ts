import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. `/apps/calculator`. */
  path: string;
  keywords?: string[];
  /** Set on pages that shouldn't be indexed (planned tools, utility routes). */
  noIndex?: boolean;
}

/**
 * Every page's metadata funnels through here so canonicals, Open Graph and
 * Twitter cards can never drift out of sync with one another.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(
    `/opengraph-image?title=${encodeURIComponent(title)}`
  );

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.fullName,
      title,
      description,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ------------------------------- JSON-LD ---------------------------------- */

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/apps?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.fullName,
    url: siteConfig.url,
    logo: absoluteUrl("/img/logo.png"),
    sameAs: Object.values(siteConfig.links),
  };
}

export function softwareApplicationJsonLd(tool: {
  name: string;
  description: string;
  slug: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(`/apps/${tool.slug}`),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; href: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function itemListJsonLd(
  name: string,
  items: { name: string; slug: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(`/apps/${item.slug}`),
    })),
  };
}

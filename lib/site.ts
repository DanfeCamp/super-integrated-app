export const siteConfig = {
  name: "SIA",
  fullName: "Super Integrated App",
  title: "SIA — Super Integrated App",
  tagline: "Every everyday tool, in one place.",
  description:
    "SIA brings calculators, converters, generators and productivity tools together in one fast, free, privacy-friendly workspace. No sign-up, no limits.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://superintegrateapp.com")
    .trim()
    .replace(/\/+$/, ""),
  locale: "en_US",
  author: {
    name: "DanfeCamp",
    url: "https://danfecamp.com",
  },
  links: {
    github: "https://github.com/DanfeCamp",
    facebook: "https://www.facebook.com/DanfeCamp",
    instagram: "https://www.instagram.com/DanfeCamp",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const mainNav = [
  { title: "All tools", href: "/apps" },
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about-us" },
  { title: "Contact", href: "/contact-us" },
] as const;

/** Absolute URL builder — required for canonicals, OG tags and JSON-LD. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

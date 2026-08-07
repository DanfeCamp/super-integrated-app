const repo = "https://github.com/DanfeCamp/super-integrated-app";

export const siteConfig = {
  name: "SIA",
  fullName: "Super Integrated App",
  title: "SIA — Super Integrated App",
  tagline: "Every everyday tool, in one place.",
  description:
    "SIA brings calculators, converters, generators and productivity tools together in one fast, free, privacy-friendly workspace. No sign-up, no limits.",
  /** One sentence of intent — used in the footer's brand column. */
  mission:
    "The small tools you need for two minutes shouldn't cost you an install, an account, or a page full of adverts.",
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
    repo,
    docs: `${repo}#readme`,
    changelog: `${repo}/releases`,
    issues: `${repo}/issues`,
    bugReport: `${repo}/issues/new?template=bug_report.md`,
    featureRequest: `${repo}/issues/new?template=feature_request.md`,
    license: `${repo}/blob/main/LICENSE`,
    codeOfConduct: `${repo}/blob/main/CODE_OF_CONDUCT.md`,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const mainNav = [
  { title: "All tools", href: "/apps" },
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about-us" },
  { title: "Contact", href: "/contact-us" },
] as const;

export interface NavLink {
  title: string;
  /** Omitted for items that aren't built yet — rendered as plain text. */
  href?: string;
  external?: boolean;
  soon?: boolean;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

/**
 * The static half of the footer. Tool and category columns are generated from
 * the registry instead, so they can never drift from what actually ships.
 *
 * Anything without an `href` renders as a "soon" row rather than a dead link —
 * the section stays future-ready without promising a page that 404s.
 */
export const footerNav: NavSection[] = [
  {
    title: "Resources",
    links: [
      { title: "Documentation", href: siteConfig.links.docs, external: true },
      { title: "FAQ", href: "/about-us#faq" },
      { title: "Changelog", href: siteConfig.links.changelog, external: true },
      { title: "Blog", soon: true },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/about-us" },
      { title: "Contact", href: "/contact-us" },
      { title: "Privacy & data", href: "/about-us#faq" },
      { title: "Terms of service", soon: true },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "GitHub", href: siteConfig.links.repo, external: true },
      {
        title: "Report an issue",
        href: siteConfig.links.bugReport,
        external: true,
      },
      {
        title: "Request a feature",
        href: siteConfig.links.featureRequest,
        external: true,
      },
      { title: "Send feedback", href: "/contact-us" },
      {
        title: "Code of conduct",
        href: siteConfig.links.codeOfConduct,
        external: true,
      },
    ],
  },
];

/** Absolute URL builder — required for canonicals, OG tags and JSON-LD. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

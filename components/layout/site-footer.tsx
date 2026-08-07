import Link from "next/link";

import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
} from "@/components/layout/brand-icons";
import { Logo } from "@/components/layout/logo";
import { featuredTools, toolCategories } from "@/data/tools";
import { mainNav, siteConfig } from "@/lib/site";

const socials = [
  { label: "GitHub", href: siteConfig.links.github, Icon: GitHubIcon },
  { label: "Facebook", href: siteConfig.links.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: siteConfig.links.instagram, Icon: InstagramIcon },
];

export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-20 border-t">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-1 flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring/40 grid size-9 place-items-center rounded-md transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Popular tools">
            {featuredTools.slice(0, 6).map((tool) => (
              <FooterLink key={tool.slug} href={`/apps/${tool.slug}`}>
                {tool.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Categories">
            {toolCategories.map((category) => (
              <FooterLink key={category.id} href={`/categories/${category.id}`}>
                {category.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="SIA">
            {mainNav.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.title}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="border-border/60 mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.fullName}. Free and
            open to everyone.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with{" "}
            <span aria-label="love" role="img">
              ❤️
            </span>{" "}
            by{" "}
            <a
              href={siteConfig.author.url}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-foreground font-medium underline underline-offset-4 transition-colors"
            >
              {siteConfig.author.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

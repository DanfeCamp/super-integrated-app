import { Code2, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
} from "@/components/layout/brand-icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Report a bug, request a tool or say hello. Get in touch with the team behind SIA — Super Integrated App.",
  path: "/contact-us",
  keywords: ["contact SIA", "request a tool", "report a bug"],
});

const channels = [
  {
    label: "GitHub",
    description: "Issues, feature requests and pull requests",
    href: siteConfig.links.github,
    Icon: GitHubIcon,
  },
  {
    label: "Facebook",
    description: "Updates and announcements",
    href: siteConfig.links.facebook,
    Icon: FacebookIcon,
  },
  {
    label: "Instagram",
    description: "Behind the scenes",
    href: siteConfig.links.instagram,
    Icon: InstagramIcon,
  },
];

export default function ContactPage() {
  const crumbs = [{ name: "Contact", href: "/contact-us" }];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", href: "/" }, ...crumbs])}
      />

      <div className="container-page flex flex-col gap-10 py-8 sm:py-10">
        <Breadcrumbs items={crumbs} />

        <PageHeader
          eyebrow="Contact"
          title="Tell us what you need"
          description="Found a bug, want a tool that doesn't exist yet, or just want to say hello? Every message gets read."
        />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <Card>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg"
                >
                  <MessageSquare className="size-4.5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold">Send a message</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    This form opens your email client with everything filled in
                    — nothing is sent to or stored on our servers.
                  </p>
                </div>
              </div>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="flex flex-col gap-4">
                <h2 className="font-semibold">Other ways to reach us</h2>
                <ul className="flex flex-col gap-1">
                  {channels.map(({ label, description, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover:bg-accent focus-visible:ring-ring/40 -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                      >
                        <span
                          aria-hidden
                          className="bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-lg"
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-muted-foreground text-xs">
                            {description}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="from-primary/8 bg-linear-to-br to-transparent">
              <CardContent className="flex flex-col gap-2.5">
                <span
                  aria-hidden
                  className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg"
                >
                  <Code2 className="size-4.5" />
                </span>
                <h2 className="font-semibold">Prefer to build it yourself?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {siteConfig.name} is open source. Adding a tool means one
                  registry entry and one route — contributions are very welcome.
                </p>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-primary mt-1 text-sm font-medium hover:underline"
                >
                  Browse the repository →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

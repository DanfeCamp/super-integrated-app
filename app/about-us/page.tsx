import { Heart, Lock, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faq } from "@/data/faq";
import { liveTools, toolCategories } from "@/data/tools";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "SIA is a free, open-source collection of everyday online tools. No accounts, no adverts, and most tools run entirely in your browser.",
  path: "/about-us",
  keywords: ["about SIA", "free online tools", "open source utilities"],
});

const principles = [
  {
    icon: Zap,
    title: "Fast before anything else",
    body: "Tools open in a working state and respond instantly. No spinners where a calculation would do, no loading screens for something your browser can compute.",
  },
  {
    icon: Lock,
    title: "Your data stays yours",
    body: "We collect nothing about you. Where a tool can run on your device, it does — files and text never touch a server unless the task genuinely requires it.",
  },
  {
    icon: Sparkles,
    title: "Consistent, not clever",
    body: "The same patterns, shortcuts and language across every tool, so learning one teaches you the rest.",
  },
  {
    icon: Heart,
    title: "Free and open",
    body: "No paywalls, no upsells, no adverts. The whole project is open source and open to contributions.",
  },
];

export default function AboutPage() {
  const crumbs = [{ name: "About", href: "/about-us" }];

  return (
    <>
      <JsonLd data={faqJsonLd([...faq])} />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", href: "/" }, ...crumbs])}
      />

      <div className="container-page flex flex-col gap-12 py-8 sm:py-10">
        <Breadcrumbs items={crumbs} />

        <PageHeader
          eyebrow="About"
          title="One place for the small things"
          description={`${siteConfig.fullName} exists because the tools you need for two minutes shouldn't cost you an install, an account or a page full of adverts. ${liveTools.length} of them live here, and they all work the same way.`}
        />

        <section aria-labelledby="principles" className="flex flex-col gap-6">
          <h2 id="principles" className="text-2xl font-semibold">
            What we optimise for
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <CardContent className="flex flex-col gap-2.5">
                  <span
                    aria-hidden
                    className="bg-primary/10 text-primary mb-1 grid size-9 place-items-center rounded-lg"
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="whats-inside" className="flex flex-col gap-5">
          <h2 id="whats-inside" className="text-2xl font-semibold">
            What&apos;s inside
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="border-border/70 bg-card hover:border-primary/35 focus-visible:ring-ring/40 flex flex-col gap-1.5 rounded-xl border p-5 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
              >
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="faq" className="flex flex-col gap-5">
          <h2 id="faq" className="text-2xl font-semibold">
            Frequently asked questions
          </h2>
          <Card>
            <CardContent className="py-1">
              <Accordion type="single" collapsible className="w-full">
                {faq.map((item, index) => (
                  <AccordionItem key={item.question} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="border-border/70 from-primary/8 flex flex-col items-center gap-4 rounded-2xl border bg-linear-to-br to-transparent p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold">Still have a question?</h2>
          <p className="text-muted-foreground max-w-md text-balance">
            We read everything that comes in, and tool requests genuinely shape
            what gets built next.
          </p>
          <Button asChild className="mt-1">
            <Link href="/contact-us">Get in touch</Link>
          </Button>
        </section>
      </div>
    </>
  );
}

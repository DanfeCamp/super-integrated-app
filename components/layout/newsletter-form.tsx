"use client";

import { Send } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/site";

/**
 * A deliberate placeholder. There is no list to add anyone to yet, so the form
 * says so on submit rather than swallowing an address and implying otherwise —
 * the markup and the copy are both ready for the day it's wired up.
 */
export function NewsletterForm() {
  const [email, setEmail] = React.useState("");

  return (
    <form
      className="flex flex-col gap-2.5 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        toast("Sign-ups aren't open yet", {
          description:
            "Nothing was stored. Release notes go out on GitHub in the meantime.",
          action: {
            label: "Follow releases",
            onClick: () =>
              window.open(
                siteConfig.links.changelog,
                "_blank",
                "noopener,noreferrer"
              ),
          },
        });
        setEmail("");
      }}
    >
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby="newsletter-note"
          className="bg-background/70 h-10"
        />
      </div>
      <Button type="submit" className="h-10 shrink-0">
        Notify me
        <Send className="size-3.5" aria-hidden />
      </Button>
    </form>
  );
}

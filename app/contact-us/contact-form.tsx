"use client";

import { Send } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/site";

const CONTACT_EMAIL = "hello@danfecamp.com";
const MAX_MESSAGE = 2000;

const topics = [
  { value: "tool-request", label: "Request a tool" },
  { value: "bug", label: "Report a bug" },
  { value: "feedback", label: "Share feedback" },
  { value: "other", label: "Something else" },
] as const;

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * The form composes a `mailto:` handoff rather than posting anywhere: it keeps
 * the page a static asset, sends nothing to a third party, and still gives
 * people a working way to reach us. The copy button covers anyone without a
 * mail client configured.
 */
export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [topic, setTopic] = React.useState<string>("tool-request");
  const [message, setMessage] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const validate = React.useCallback((): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Please tell us your name.";
    if (!email.trim()) next.email = "We need an email address to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That doesn't look like a valid email address.";
    if (!message.trim()) next.message = "Please write a message.";
    else if (message.length > MAX_MESSAGE)
      next.message = `Please keep it under ${MAX_MESSAGE} characters.`;
    return next;
  }, [name, email, message]);

  // Errors are derived, not stored: they re-evaluate as the user types, but
  // stay hidden until a submit has failed — so the form doesn't shout at
  // people before they've finished filling it in.
  const errors = React.useMemo<Errors>(
    () => (submitted ? validate() : {}),
    [submitted, validate]
  );

  const topicLabel =
    topics.find((item) => item.value === topic)?.label ?? "Message";

  const plainText = `Name: ${name}\nEmail: ${email}\nTopic: ${topicLabel}\n\n${message}`;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const subject = `[${siteConfig.name}] ${topicLabel} from ${name.trim()}`;
    const body = `${message.trim()}\n\n—\n${name.trim()} · ${email.trim()}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    toast.success("Opening your email client…", {
      description: "If nothing happens, copy the message instead.",
    });
  };

  const remaining = MAX_MESSAGE - message.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name}>
          <Input
            id="contact-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
        </Field>

        <Field id="contact-email" label="Email" error={errors.email}>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-topic">Topic</Label>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger id="contact-topic">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {topics.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Field id="contact-message" label="Message" error={errors.message}>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          maxLength={MAX_MESSAGE + 200}
          placeholder="What would make your day easier?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby="contact-message-count"
        />
        <p
          id="contact-message-count"
          className={`text-xs ${remaining < 0 ? "text-destructive" : "text-muted-foreground"}`}
        >
          {remaining < 0
            ? `${Math.abs(remaining)} characters over the limit`
            : `${remaining} characters remaining`}
        </p>
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit">
          <Send className="size-4" aria-hidden />
          Send message
        </Button>
        <CopyButton
          value={plainText}
          label="Copy message"
          copiedLabel="Copied"
        />
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}

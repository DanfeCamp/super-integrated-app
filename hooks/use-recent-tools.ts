"use client";

import * as React from "react";

import { getTool, type Tool } from "@/data/tools";

const STORAGE_KEY = "sia:recent-tools";
const MAX_RECENT = 6;

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((slug): slug is string => typeof slug === "string")
      : [];
  } catch {
    return [];
  }
}

/** Records a visit to `slug`, most recent first. Safe to call on every mount. */
export function useTrackToolVisit(slug: string) {
  React.useEffect(() => {
    try {
      const next = [slug, ...read().filter((item) => item !== slug)].slice(
        0,
        MAX_RECENT
      );
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode, quota) — recents are optional.
    }
  }, [slug]);
}

/** Resolved recently-visited tools. Empty until the client has hydrated. */
export function useRecentTools(): Tool[] {
  const [recent, setRecent] = React.useState<Tool[]>([]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable on the client, after hydration.
    setRecent(
      read()
        .map(getTool)
        .filter((tool): tool is Tool => Boolean(tool && tool.status === "live"))
    );
  }, []);

  return recent;
}

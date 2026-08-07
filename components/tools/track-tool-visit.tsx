"use client";

import { useTrackToolVisit } from "@/hooks/use-recent-tools";

/**
 * Zero-markup client island so the server-rendered `ToolShell` can record a
 * visit without becoming a client component itself.
 */
export function TrackToolVisit({ slug }: { slug: string }) {
  useTrackToolVisit(slug);
  return null;
}

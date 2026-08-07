import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { CookieDetailsTool } from "./cookie-details-tool";

const SLUG = "cookie-details";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <CookieDetailsTool />
    </ToolShell>
  );
}

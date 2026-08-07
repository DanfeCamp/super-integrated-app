import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { UrlParserTool } from "./url-parser-tool";

const SLUG = "url-parser";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <UrlParserTool />
    </ToolShell>
  );
}

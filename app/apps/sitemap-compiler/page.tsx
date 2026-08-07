import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { SitemapCompilerTool } from "./sitemap-compiler-tool";

const SLUG = "sitemap-compiler";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <SitemapCompilerTool />
    </ToolShell>
  );
}

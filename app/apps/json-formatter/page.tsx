import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { JsonFormatterTool } from "./json-formatter-tool";

const SLUG = "json-formatter";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <JsonFormatterTool />
    </ToolShell>
  );
}

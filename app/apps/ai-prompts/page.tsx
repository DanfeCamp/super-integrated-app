import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { AiPromptsTool } from "./ai-prompts-tool";

const SLUG = "ai-prompts";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <AiPromptsTool />
    </ToolShell>
  );
}

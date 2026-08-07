import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { WordCounterTool } from "./word-counter-tool";

const SLUG = "word-counter";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <WordCounterTool />
    </ToolShell>
  );
}

import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { AudioConverterTool } from "./audio-converter-tool";

const SLUG = "audio-converter";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <AudioConverterTool />
    </ToolShell>
  );
}

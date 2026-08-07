import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { WorldClockTool } from "./world-clock-tool";

const SLUG = "world-clock";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <WorldClockTool />
    </ToolShell>
  );
}

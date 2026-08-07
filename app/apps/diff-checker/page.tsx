import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { DiffCheckerTool } from "./diff-checker-tool";

const SLUG = "diff-checker";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <DiffCheckerTool />
    </ToolShell>
  );
}

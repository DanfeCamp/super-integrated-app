import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { ColorGeneratorTool } from "./color-generator-tool";

const SLUG = "color-generator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <ColorGeneratorTool />
    </ToolShell>
  );
}

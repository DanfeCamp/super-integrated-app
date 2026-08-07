import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { HashGeneratorTool } from "./hash-generator-tool";

const SLUG = "hash-generator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <HashGeneratorTool />
    </ToolShell>
  );
}

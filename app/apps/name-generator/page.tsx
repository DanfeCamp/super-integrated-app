import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { NameGeneratorTool } from "./name-generator-tool";

const SLUG = "name-generator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <NameGeneratorTool />
    </ToolShell>
  );
}

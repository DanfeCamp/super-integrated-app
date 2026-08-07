import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { UnitConverterTool } from "./unit-converter-tool";

const SLUG = "unit-converter";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <UnitConverterTool />
    </ToolShell>
  );
}

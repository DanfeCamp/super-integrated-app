import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { CalculatorTool } from "./calculator-tool";

const SLUG = "calculator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <CalculatorTool />
    </ToolShell>
  );
}

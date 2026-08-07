import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { PercentageCalculatorTool } from "./percentage-calculator-tool";

const SLUG = "percentage-calculator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <PercentageCalculatorTool />
    </ToolShell>
  );
}

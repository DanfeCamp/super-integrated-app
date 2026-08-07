import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { LoanCalculatorTool } from "./loan-calculator-tool";

const SLUG = "loan-calculator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <LoanCalculatorTool />
    </ToolShell>
  );
}

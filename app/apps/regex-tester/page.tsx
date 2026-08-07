import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { RegexTesterTool } from "./regex-tester-tool";

const SLUG = "regex-tester";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <RegexTesterTool />
    </ToolShell>
  );
}

import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { CronHelperTool } from "./cron-helper-tool";

const SLUG = "cron-helper";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <CronHelperTool />
    </ToolShell>
  );
}

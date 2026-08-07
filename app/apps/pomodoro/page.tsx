import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { PomodoroTool } from "./pomodoro-tool";

const SLUG = "pomodoro";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <PomodoroTool />
    </ToolShell>
  );
}

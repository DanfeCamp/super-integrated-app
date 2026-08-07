import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { TicTacToeTool } from "./tic-tac-toe-tool";

const SLUG = "tic-tac-toe";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <TicTacToeTool />
    </ToolShell>
  );
}

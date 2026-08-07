import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { JwtDecoderTool } from "./jwt-decoder-tool";

const SLUG = "jwt-decoder";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <JwtDecoderTool />
    </ToolShell>
  );
}

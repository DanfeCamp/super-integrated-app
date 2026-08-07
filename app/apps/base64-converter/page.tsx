import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { Base64ConverterTool } from "./base64-converter-tool";

const SLUG = "base64-converter";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <Base64ConverterTool />
    </ToolShell>
  );
}

import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { ImageCompressorTool } from "./image-compressor-tool";

const SLUG = "image-compressor";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <ImageCompressorTool />
    </ToolShell>
  );
}

import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { ImageResizerTool } from "./image-resizer-tool";

const SLUG = "image-resizer";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <ImageResizerTool />
    </ToolShell>
  );
}

import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { ImageConverterTool } from "./image-converter-tool";

const SLUG = "image-converter";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <ImageConverterTool />
    </ToolShell>
  );
}

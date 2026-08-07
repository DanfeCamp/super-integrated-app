import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { ImageEditorTool } from "./image-editor-tool";

const SLUG = "image-editor";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <ImageEditorTool />
    </ToolShell>
  );
}

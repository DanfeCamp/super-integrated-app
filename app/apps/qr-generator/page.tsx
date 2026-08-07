import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { QrGeneratorTool } from "./qr-generator-tool";

const SLUG = "qr-generator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <QrGeneratorTool />
    </ToolShell>
  );
}

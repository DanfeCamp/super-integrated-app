import type { Metadata } from "next";

import { ComingSoon } from "@/components/tools/coming-soon";
import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

const SLUG = "video-editor";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <ComingSoon slug={SLUG} />
    </ToolShell>
  );
}

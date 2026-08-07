import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { SortListsTool } from "./sort-lists-tool";

const SLUG = "sort-lists";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <SortListsTool />
    </ToolShell>
  );
}

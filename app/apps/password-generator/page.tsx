import type { Metadata } from "next";

import { ToolShell } from "@/components/tools/tool-shell";
import { toolMetadata } from "@/lib/tool-page";

import { PasswordGeneratorTool } from "./password-generator-tool";

const SLUG = "password-generator";

export const metadata: Metadata = toolMetadata(SLUG);

export default function Page() {
  return (
    <ToolShell slug={SLUG}>
      <PasswordGeneratorTool />
    </ToolShell>
  );
}

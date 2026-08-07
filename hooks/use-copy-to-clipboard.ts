"use client";

import * as React from "react";

/**
 * Clipboard write with a self-resetting "copied" flag, plus a same-origin
 * fallback for browsers that block `navigator.clipboard` outside HTTPS.
 */
export function useCopyToClipboard(resetDelay = 1600) {
  const [copied, setCopied] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  React.useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = React.useCallback(
    async (value: string) => {
      if (!value) return false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = value;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }

        setCopied(true);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copy };
}

"use client";

import * as React from "react";

/**
 * Object URL for a Blob/File, revoked whenever the source changes or the
 * component unmounts. Doing this inline is the usual source of blob-URL leaks
 * in file tools.
 *
 * The URL is created in a memo and only *revoked* in the effect, so there is no
 * extra render pass between choosing a file and being able to show it.
 */
export function useObjectUrl(source: Blob | null | undefined) {
  const url = React.useMemo(
    () => (source ? URL.createObjectURL(source) : null),
    [source]
  );

  React.useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}

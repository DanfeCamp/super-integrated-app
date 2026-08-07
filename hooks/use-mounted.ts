"use client";

import * as React from "react";

/**
 * `false` during SSR and the first client render, `true` afterwards. Use it to
 * gate anything that reads browser-only state (timezones, media queries,
 * `localStorage`) so the first paint matches the server's HTML.
 */
export function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- flipping after the first commit is the point of this hook.
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

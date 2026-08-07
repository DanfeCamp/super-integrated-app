"use client";

import * as React from "react";

/**
 * `setInterval` that always calls the latest callback and pauses when `delay`
 * is `null`, so timers never capture stale state.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const saved = React.useRef(callback);

  React.useEffect(() => {
    saved.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

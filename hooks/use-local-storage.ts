"use client";

import * as React from "react";

/**
 * `useState` backed by localStorage.
 *
 * Always renders `initialValue` on the first pass and hydrates from storage in
 * an effect — reading during render would produce a server/client mismatch.
 * `hydrated` lets callers hold back UI that would otherwise flash empty.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = React.useState<T>(initialValue);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading storage must happen after hydration, never during render.
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      // Corrupt or unreadable entry — fall back to the initial value.
    }
    setHydrated(true);
  }, [key]);

  const setStoredValue = React.useCallback(
    (next: React.SetStateAction<T>) => {
      setValue((previous) => {
        const resolved =
          typeof next === "function"
            ? (next as (prev: T) => T)(previous)
            : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Quota exceeded or storage disabled — keep the in-memory value.
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue, hydrated] as const;
}

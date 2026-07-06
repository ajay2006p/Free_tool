"use client";

import { useState, useEffect } from "react";

// Persist state to localStorage. `ready` is false until we've read from storage
// (avoids server/client hydration mismatches).
export function useLocalStorage(key, initial) {
  const [val, setVal] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s != null) setVal(JSON.parse(s));
    } catch (e) {}
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }, [key, val, ready]);

  return [val, setVal, ready];
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

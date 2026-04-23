import { useCallback, useEffect, useState } from "react";

export type HistoryEntry = {
  tool: string;
  toolSlug: string;
  input: string;
  output: string;
  timestamp: number;
};

const KEY = "wordspack_history";
const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX = 50;

const read = (): HistoryEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: HistoryEntry[] = JSON.parse(raw);
    const now = Date.now();
    return parsed.filter((e) => now - e.timestamp < TTL_MS);
  } catch {
    return [];
  }
};

const write = (entries: HistoryEntry[]) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
  } catch {
    /* ignore */
  }
};

export function useSessionHistory(filterSlug?: string) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(read());
    const onStorage = () => setEntries(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("wordspack:history", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wordspack:history", onStorage);
    };
  }, []);

  const add = useCallback((entry: Omit<HistoryEntry, "timestamp">) => {
    const all = read();
    const next = [{ ...entry, timestamp: Date.now() }, ...all].slice(0, MAX);
    write(next);
    setEntries(next);
    window.dispatchEvent(new Event("wordspack:history"));
  }, []);

  const clear = useCallback(() => {
    sessionStorage.removeItem(KEY);
    setEntries([]);
    window.dispatchEvent(new Event("wordspack:history"));
  }, []);

  const filtered = filterSlug ? entries.filter((e) => e.toolSlug === filterSlug) : entries;

  return { entries: filtered, allEntries: entries, add, clear };
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface APIExplorerState {
  query: string;
  activeEntryId: string | null;
  setQuery: (q: string) => void;
  setActiveEntryId: (id: string | null) => void;
}

const Ctx = createContext<APIExplorerState | null>(null);

export function APIExplorerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const query = params.get("q") ?? "";

  // hash → activeEntryId
  const [activeEntryId, setActiveEntryIdState] = useState<string | null>(null);
  useEffect(() => {
    const read = () => {
      const h = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      setActiveEntryIdState(h || null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const setQuery = useCallback(
    (q: string) => {
      const next = new URLSearchParams(params.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      const qs = next.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}${window.location.hash}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const setActiveEntryId = useCallback(
    (id: string | null) => {
      setActiveEntryIdState(id);
      const qs = params.toString();
      const url = `${pathname}${qs ? `?${qs}` : ""}${id ? `#${id}` : ""}`;
      router.replace(url, { scroll: false });
    },
    [params, pathname, router],
  );

  const value = useMemo(
    () => ({ query, activeEntryId, setQuery, setActiveEntryId }),
    [query, activeEntryId, setQuery, setActiveEntryId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAPIExplorer(): APIExplorerState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAPIExplorer must be used inside <APIExplorerProvider>");
  return v;
}

import type { ComponentRegistryEntry } from "@/lib/registry/types";

function pad(n: number) {
  return String(n).padStart(3, "0");
}

type Entry = {
  idx: number;
  key: string;
  value: ComponentRegistryEntry | undefined;
};

export function BlackflagCatalog({ entries }: { entries: Entry[] }) {
  return (
    <section className="px-6 md:px-12 pt-6 md:pt-12 pb-32 md:pb-40">
      <div
        className="mb-8 text-[11px] uppercase tracking-[0.2em] opacity-60"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {entries.length} SERIALIZED COMPONENTS · E0000 SHEET
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-white/20">
        {entries.map((e) => (
          <li
            key={e.key}
            data-plate="blackflag-entry"
            className="border-r border-b border-white/20 p-4 md:p-5"
          >
            <div
              data-plate="blackflag-code"
              className="text-[10px] uppercase tracking-[0.18em] opacity-50"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              SF//E00-{pad(e.idx)}
            </div>
            <div
              className="uppercase leading-[0.95] mt-2"
              style={{
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "clamp(20px, 3vw, 36px)",
              }}
            >
              {e.value?.name ?? e.key}
            </div>
            <div
              className="text-[11px] mt-2 opacity-60 leading-[1.5]"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {e.value?.importPath ?? "—"}
            </div>
            <div
              className="text-[9px] uppercase tracking-[0.15em] opacity-60 mt-3"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {e.value?.category ?? "—"}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

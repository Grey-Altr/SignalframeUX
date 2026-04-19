"use client";

import dynamic from "next/dynamic";

// Deferred client-boundary wrapper for BlackflagCatalog (55 inventory cards).
// Keeps the catalog grid out of the initial server HTML so the /inventory
// hero "INVE/NTORY" is the stable LCP candidate under Lighthouse throttling.
export const BlackflagCatalogDeferred = dynamic(
  () =>
    import("./blackflag-catalog").then((m) => ({ default: m.BlackflagCatalog })),
  { ssr: false, loading: () => null },
);

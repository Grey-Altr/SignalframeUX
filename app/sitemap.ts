import type { MetadataRoute } from "next";
import { BUILDS } from "@/app/builds/builds-data";

const BASE = "https://signalframe.culturedivision.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const buildEntries = BUILDS.map((build) => ({
    url: `${BASE}/builds/${build.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/inventory`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE}/reference`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/system`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/builds`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/init`, lastModified: new Date(), priority: 0.7 },
    ...buildEntries,
  ];
}

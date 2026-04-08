import type { MetadataRoute } from "next";

const BASE = "https://signalframeux.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/inventory`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE}/reference`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/system`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/init`, lastModified: new Date(), priority: 0.7 },
  ];
}

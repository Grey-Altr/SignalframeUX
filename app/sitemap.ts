import type { MetadataRoute } from "next";

const BASE = "https://signalframeux.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/components`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE}/reference`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/tokens`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/start`, lastModified: new Date(), priority: 0.7 },
  ];
}

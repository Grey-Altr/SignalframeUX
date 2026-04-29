"use client";

/**
 * Phase 58 CIB-05 — field RUM client.
 *
 * Mounts in app/layout.tsx <body>. Renders null. The `useReportWebVitals`
 * hook is built into next/web-vitals (Next.js 15+) — zero new runtime npm
 * dep. Each metric event ships to /api/vitals via navigator.sendBeacon
 * (with keepalive: true fetch fallback for Safari < 11.1).
 *
 * Stable reference: `sendToAnalytics` is defined at MODULE SCOPE (not inside
 * the component) so its identity is stable across re-renders. Per Next.js
 * docs, an unstable callback ref to useReportWebVitals causes duplicate
 * metric emissions.
 *
 * T-CSP-01 (future): When/if CSP headers land in next.config.ts, the
 * `connect-src 'self'` directive must allow same-origin sendBeacon to
 * /api/vitals. Same-origin is default-allowed by 'self' — no CSP edit
 * required for the path used here. Documented for the engineer adding CSP.
 *
 * T-RUM-02 (PII): client side does not strip query strings — the route
 * handler does that on receipt (defense-in-depth applied server-side
 * because the URL is the metric's natural context here, but logs must be
 * sanitized).
 */

import { useReportWebVitals } from "next/web-vitals";

// next/web-vitals does not re-export the `Metric` type at runtime in
// Next.js 15.x — derive the callback's parameter type from the hook signature.
type Metric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: Date.now(),
  });

  // navigator.sendBeacon: fire-and-forget, survives page unload.
  // Blob+type sets Content-Type: application/json so the route handler
  // can call request.json() directly (request.text() also works for the
  // fetch fallback below).
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    const ok = navigator.sendBeacon("/api/vitals", blob);
    if (ok) return;
    // sendBeacon returns false if the user agent rejects the request
    // (e.g. >64KB payload). Fall through to fetch below.
  }

  // Fallback: keepalive fetch. Safari < 11.1 has no sendBeacon; modern
  // browsers also use this when sendBeacon returns false.
  void fetch("/api/vitals", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {
    // RUM is best-effort. Swallow errors — never throw to user.
  });
}

export function WebVitals(): null {
  useReportWebVitals(sendToAnalytics);
  return null;
}

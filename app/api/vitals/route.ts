/**
 * Phase 58 CIB-05 — self-hosted RUM sink.
 *
 * Receives web-vitals beacons from app/_components/web-vitals.tsx and writes
 * a single console.log line per metric. On Vercel, console.log goes to the
 * Vercel runtime log infrastructure (queryable via `vercel logs --prod`).
 * This is the "log-only" sink pattern from RESEARCH §CIB-05.
 *
 * Runtime: Node (default). Edge runtime is rejected here because Edge
 * console.log on Vercel free tier writes to ephemeral edge log streams,
 * NOT the structured `vercel logs` output. Node runtime persists through
 * the build log infrastructure that VRF-05 will query.
 *
 * Defense-in-depth (NOT primary security boundary — RUM is pseudonymous):
 * - T-RUM-01: 2KB payload cap (rejects DoS via log flooding)
 * - T-RUM-01: JSON Content-Type required (rejects multipart abuse)
 * - T-RUM-02: query-string + fragment stripped from payload.url before log
 * - T-RUM-02: the auth header is NEVER read — there is no `headers.get()`
 *   call against any auth-related header anywhere in this file.
 *   (Verified by call-site-targeted grep in this plan's verify command.)
 *
 * Future: when CSP lands, `connect-src 'self'` covers same-origin POSTs here.
 */

import type { NextRequest } from "next/server";

const MAX_BYTES = 2048; // T-RUM-01: 2KB cap

function stripUrl(rawUrl: unknown): string | undefined {
  if (typeof rawUrl !== "string") return undefined;
  // T-RUM-02: drop query string + fragment before logging.
  const qIndex = rawUrl.indexOf("?");
  const fIndex = rawUrl.indexOf("#");
  const cutAt = [qIndex, fIndex].filter((i) => i >= 0).reduce((a, b) => Math.min(a, b), rawUrl.length);
  return rawUrl.slice(0, cutAt);
}

export async function POST(request: NextRequest): Promise<Response> {
  // T-RUM-01: Content-Type gate.
  const ct = request.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().includes("application/json")) {
    return Response.json({ ok: false, error: "content-type" }, { status: 400 });
  }

  // T-RUM-01: size gate (prefer Content-Length; fall back to body byte count).
  const cl = request.headers.get("content-length");
  if (cl !== null && Number.parseInt(cl, 10) > MAX_BYTES) {
    return Response.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return Response.json({ ok: false, error: "read" }, { status: 400 });
  }
  if (raw.length > MAX_BYTES) {
    return Response.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "json" }, { status: 400 });
  }

  // T-RUM-02: sanitize URL before logging.
  const sanitized = {
    type: "rum" as const,
    name: payload.name,
    value: payload.value,
    id: payload.id,
    rating: payload.rating,
    navigationType: payload.navigationType,
    url: stripUrl(payload.url),
    timestamp: payload.timestamp,
  };

  // Vercel runtime log -> queryable via `vercel logs --prod | grep '"type":"rum"'`.
  console.log(JSON.stringify(sanitized));

  return Response.json({ ok: true }, { status: 200 });
}

// Defensive OPTIONS handler. Same-origin sendBeacon does not preflight;
// this exists to avoid 405s if anything else issues a CORS preflight.
export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204 });
}

"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#000", color: "#fff", fontFamily: "monospace" }}>
        <main id="main-content" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              FATAL
            </h1>
            <p style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "1.5rem" }}>
              A critical error occurred in the application shell.
            </p>
            {error.digest && (
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4, marginBottom: "1rem" }}>
                DIGEST: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                border: "2px solid #fff",
                backgroundColor: "#fff",
                color: "#000",
                padding: "0.75rem 1.5rem",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              RELOAD
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * App icon — 32×32 favicon.
 * DU/TDR aesthetic: hard-cut square, magenta slash mark on dark field.
 * Zero border-radius. Sharp edges only.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* SF// mark — two diagonal slash strokes */}
        <div
          style={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* S */}
          <div
            style={{
              width: 10,
              height: 10,
              border: "2px solid #ff00ff",
              display: "flex",
            }}
          />
          {/* // slash */}
          <div
            style={{
              width: 2,
              height: 14,
              background: "#ff00ff",
              transform: "skewX(-20deg)",
              marginLeft: 1,
              marginRight: 1,
            }}
          />
          <div
            style={{
              width: 2,
              height: 14,
              background: "#ffffff",
              transform: "skewX(-20deg)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}

/**
 * Shared grain/noise SVG data URI — fractalNoise at 0.65 baseFrequency.
 * Apply as a CSS background-image overlay for the SIGNAL grain texture aesthetic.
 *
 * @example
 * <div style={{ backgroundImage: GRAIN_SVG, opacity: 0.08 }} aria-hidden="true" />
 */
export const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sf-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sf-grain)'/%3E%3C/svg%3E")`;

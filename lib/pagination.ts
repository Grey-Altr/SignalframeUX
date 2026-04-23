/**
 * §14.18 · R-63-g support. Pure slicer for paginating entries across SFPanels.
 * Consumed by `hooks/use-api-pagination.ts`. Kept React-free for unit testing.
 */
export function sliceIntoPanels<T>(entries: T[], rowsPerPanel: number): T[][] {
  if (rowsPerPanel <= 0) {
    throw new RangeError(`rowsPerPanel must be > 0, got ${rowsPerPanel}`);
  }
  if (entries.length === 0) return [];
  const slices: T[][] = [];
  for (let i = 0; i < entries.length; i += rowsPerPanel) {
    slices.push(entries.slice(i, i + rowsPerPanel));
  }
  return slices;
}

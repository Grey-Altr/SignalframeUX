import { describe, it, expect } from "vitest";
import { sliceIntoPanels } from "./pagination";

describe("sliceIntoPanels", () => {
  const mk = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `e${String(i).padStart(3, "0")}`, pos: i }));

  it("returns empty array for zero entries", () => {
    expect(sliceIntoPanels([], 28)).toEqual([]);
  });

  it("returns single slice when entries <= rowsPerPanel", () => {
    const slices = sliceIntoPanels(mk(5), 28);
    expect(slices).toHaveLength(1);
    expect(slices[0]).toHaveLength(5);
  });

  it("slices 158 into 6 panels of 28 (mobile default)", () => {
    const slices = sliceIntoPanels(mk(158), 28);
    expect(slices).toHaveLength(6);
    expect(slices.slice(0, 5).every((s) => s.length === 28)).toBe(true);
    expect(slices[5]).toHaveLength(18);
  });

  it("slices 158 into 3 panels of 56 (desktop default)", () => {
    const slices = sliceIntoPanels(mk(158), 56);
    expect(slices).toHaveLength(3);
    expect(slices[0]).toHaveLength(56);
    expect(slices[1]).toHaveLength(56);
    expect(slices[2]).toHaveLength(46);
  });

  it("preserves stable order", () => {
    const slices = sliceIntoPanels(mk(10), 4);
    const flat = slices.flatMap((s) => s.map((e) => e.pos));
    expect(flat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("throws on non-positive rowsPerPanel", () => {
    expect(() => sliceIntoPanels(mk(5), 0)).toThrow();
    expect(() => sliceIntoPanels(mk(5), -1)).toThrow();
  });
});

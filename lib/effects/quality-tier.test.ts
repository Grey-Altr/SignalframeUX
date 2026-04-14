import { describe, it, expect } from "vitest";
import { tierMultiplier, type QualityTier } from "./quality-tier";

describe("tierMultiplier", () => {
  const cases: [QualityTier, number][] = [
    ["ultra", 1.0],
    ["high", 0.75],
    ["medium", 0.45],
    ["fallback", 0],
  ];

  for (const [tier, expected] of cases) {
    it(`returns ${expected} for tier "${tier}"`, () => {
      expect(tierMultiplier(tier)).toBe(expected);
    });
  }
});

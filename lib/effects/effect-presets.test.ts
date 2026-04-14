import { describe, it, expect } from "vitest";
import { getPreset, getBaseline, type EffectFamily } from "./effect-presets";

const FAMILIES: EffectFamily[] = [
  "feedback",
  "particle",
  "displace",
  "bloom",
  "glitch",
  "audio",
];

describe("getBaseline", () => {
  for (const family of FAMILIES) {
    it(`returns non-empty baseline for "${family}"`, () => {
      const base = getBaseline(family);
      const values = Object.values(base);
      expect(values.length).toBeGreaterThan(0);
      for (const v of values) {
        expect(typeof v).toBe("number");
      }
    });
  }
});

describe("getPreset (fallback tier)", () => {
  for (const family of FAMILIES) {
    it(`returns zeroed preset for "${family}" at fallback tier`, () => {
      const preset = getPreset(family, "fallback");
      for (const v of Object.values(preset)) {
        expect(v).toBe(0);
      }
    });
  }
});

describe("getPreset (ultra tier)", () => {
  it("feedback decay has floor of 0.88", () => {
    const preset = getPreset("feedback", "ultra");
    expect(preset.decay).toBeGreaterThanOrEqual(0.88);
  });

  it("bloom threshold has floor of 0.5", () => {
    const preset = getPreset("bloom", "ultra");
    expect(preset.threshold).toBeGreaterThanOrEqual(0.5);
  });

  it("particle count is a whole number", () => {
    const preset = getPreset("particle", "ultra");
    expect(Number.isInteger(preset.count)).toBe(true);
  });

  it("displace octaves is a positive integer", () => {
    const preset = getPreset("displace", "ultra");
    expect(Number.isInteger(preset.octaves)).toBe(true);
    expect(preset.octaves).toBeGreaterThanOrEqual(1);
  });
});

describe("tier scaling", () => {
  it("medium tier produces lower values than ultra", () => {
    const medium = getPreset("particle", "medium");
    const ultra = getPreset("particle", "ultra");
    expect(medium.count).toBeLessThan(ultra.count);
    expect(medium.speed).toBeLessThan(ultra.speed);
  });
});

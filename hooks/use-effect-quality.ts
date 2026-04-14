"use client";

/**
 * Diagnostics hook for the effects quality-tier subsystem.
 *
 * In dev builds, logs the selected tier + multiplier to the console on mount.
 * Returns the current tier and multiplier for runtime inspection.
 *
 * @module hooks/use-effect-quality
 */

import { useEffect, useState } from "react";
import {
  type QualityTier,
  getQualityTier,
  resetQualityTier,
  tierMultiplier,
} from "@/lib/effects/quality-tier";

type EffectQualityInfo = {
  tier: QualityTier;
  multiplier: number;
};

export function useEffectQuality(): EffectQualityInfo {
  const [info, setInfo] = useState<EffectQualityInfo>({
    tier: "fallback",
    multiplier: 0,
  });

  useEffect(() => {
    const tier = getQualityTier();
    const m = tierMultiplier(tier);
    setInfo({ tier, multiplier: m });

    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[SFX Effects] %cTier: ${tier}  ×${m}`,
        "color: oklch(0.65 0.3 350); font-weight: bold",
        "color: inherit"
      );
    }

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    function onChange() {
      resetQualityTier();
      const next = getQualityTier();
      setInfo({ tier: next, multiplier: tierMultiplier(next) });
    }
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return info;
}

"use client";

/**
 * SFSignalComposer — Ordered effect pass graph with declarative API.
 *
 * Wraps multiple effect primitives into a single composable layer.
 * Pages declare which effects they want via `passes` array — the
 * composer handles mounting order, shared intensity scaling, and
 * quality-tier gating.
 *
 * Usage:
 *   <SFSignalComposer
 *     passes={["feedback", "bloom", "glitch"]}
 *     intensity={0.8}
 *     preserveLegibility
 *   />
 *
 * @module components/animation/sf-signal-composer
 */

import { useMemo, useState, useEffect } from "react";
import { type QualityTier, getQualityTier } from "@/lib/effects";
import { FeedbackField, type FeedbackFieldProps } from "./feedback-field";
import { ParticleFieldHQ, type ParticleFieldHQProps } from "./particle-field-hq";
import { DisplaceField, type DisplaceFieldProps } from "./displace-field";
import { BloomPass, type BloomPassProps } from "./bloom-pass";
import { GlitchPass, type GlitchPassProps } from "./glitch-pass";

export type EffectPassName =
  | "feedback"
  | "particle"
  | "displace"
  | "bloom"
  | "glitch";

type PassOverrides = {
  feedback?: Partial<FeedbackFieldProps>;
  particle?: Partial<ParticleFieldHQProps>;
  displace?: Partial<DisplaceFieldProps>;
  bloom?: Partial<BloomPassProps>;
  glitch?: Partial<GlitchPassProps>;
};

export type SFSignalComposerProps = {
  passes: EffectPassName[];
  intensity?: number;
  tempo?: number;
  reactivity?: number;
  preserveLegibility?: boolean;
  className?: string;
  overrides?: PassOverrides;
};

const TIER_MAX_PASSES: Record<QualityTier, number> = {
  ultra: 5,
  high: 4,
  medium: 2,
  fallback: 0,
};

export function SFSignalComposer({
  passes,
  intensity = 1,
  tempo = 1,
  preserveLegibility = false,
  className,
  overrides,
}: SFSignalComposerProps) {
  const [mounted, setMounted] = useState(false);
  const [tier, setTier] = useState<QualityTier>("fallback");
  const [rm, setRm] = useState(false);

  useEffect(() => {
    setTier(getQualityTier());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRm(mq.matches);
    setMounted(true);
    const h = () => setRm(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const activePasses = useMemo(() => {
    if (!mounted || rm || tier === "fallback") return [];
    const max = TIER_MAX_PASSES[tier];
    return passes.slice(0, max);
  }, [passes, tier, rm, mounted]);

  if (activePasses.length === 0) return null;

  const legibilityDamp = preserveLegibility ? 0.6 : 1;
  const effectiveIntensity = intensity * legibilityDamp;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ""}`}
      data-signal-composer
      data-fx-tier={tier}
      aria-hidden="true"
    >
      {activePasses.map((pass) => {
        switch (pass) {
          case "feedback":
            return (
              <FeedbackField
                key="feedback"
                intensity={effectiveIntensity * tempo}
                {...overrides?.feedback}
              />
            );
          case "particle":
            return (
              <ParticleFieldHQ
                key="particle"
                intensity={effectiveIntensity}
                className="absolute inset-0"
                {...overrides?.particle}
              />
            );
          case "displace":
            return (
              <DisplaceField
                key="displace"
                intensity={effectiveIntensity * tempo}
                {...overrides?.displace}
              />
            );
          case "bloom":
            return (
              <BloomPass
                key="bloom"
                intensity={effectiveIntensity}
                {...overrides?.bloom}
              />
            );
          case "glitch":
            return (
              <GlitchPass
                key="glitch"
                intensity={effectiveIntensity * tempo * 0.5}
                {...overrides?.glitch}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

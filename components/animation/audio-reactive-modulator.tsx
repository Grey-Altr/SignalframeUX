"use client";

/**
 * @status reference-template
 * No live consumers (lockdown audit 2026-04-22, §6.39).
 * See: .planning/lockdown-audit/AUDIT-VERDICTS.md
 * Retained as layout-generation reference per KEEP-ref policy.
 */

/**
 * AudioReactiveModulator — CHOP-like Web Audio frequency analysis input.
 *
 * Provides real-time audio frequency data (bass/mid/high bands) as CSS custom
 * properties and an optional callback, enabling other effect primitives to
 * react to audio without wiring their own AnalyserNode.
 *
 * Does NOT render any visuals — purely a data source component.
 *
 * Requires user gesture to start (Web Audio autoplay policy). Call `start()`
 * from the returned ref, or pass `autoStart` with an existing AudioContext.
 *
 * @module components/animation/audio-reactive-modulator
 */

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { getPreset } from "@/lib/effects";

export type AudioBands = {
  bass: number;
  mid: number;
  high: number;
  raw: Float32Array;
};

export type AudioReactiveModulatorHandle = {
  start: (sourceNode?: MediaStreamAudioSourceNode) => void;
  stop: () => void;
  getBands: () => AudioBands;
};

export type AudioReactiveModulatorProps = {
  onFrame?: (bands: AudioBands) => void;
  writeCSSVars?: boolean;
  smoothing?: number;
  fftSize?: number;
  reactivity?: number;
};

export const AudioReactiveModulator = forwardRef<
  AudioReactiveModulatorHandle,
  AudioReactiveModulatorProps
>(function AudioReactiveModulator(
  { onFrame, writeCSSVars = true, smoothing: smOv, fftSize: fftOv, reactivity: reactOv },
  ref
) {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Float32Array<ArrayBuffer>>(new Float32Array(0));
  const bandsRef = useRef<AudioBands>({ bass: 0, mid: 0, high: 0, raw: new Float32Array(0) });
  const rafRef = useRef(0);
  const analyseRef = useRef<() => void>(() => {});
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const preset = getPreset("audio");
  const smoothing = smOv ?? preset.smoothing;
  const fftSize = fftOv ?? preset.fftSize;
  const reactivity = reactOv ?? preset.reactivity;

  const analyse = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    analyser.getFloatFrequencyData(dataRef.current);
    const data = dataRef.current;
    const len = data.length;
    if (len === 0) return;

    const bassEnd = Math.floor(len * 0.15);
    const midEnd = Math.floor(len * 0.5);

    let bassSum = 0;
    let midSum = 0;
    let highSum = 0;

    for (let i = 0; i < bassEnd; i++) bassSum += data[i];
    for (let i = bassEnd; i < midEnd; i++) midSum += data[i];
    for (let i = midEnd; i < len; i++) highSum += data[i];

    const norm = (sum: number, count: number) => {
      const avg = sum / Math.max(count, 1);
      return Math.max(0, Math.min(1, (avg + 100) / 100)) * reactivity;
    };

    const bands: AudioBands = {
      bass: norm(bassSum, bassEnd) * preset.bassMultiplier,
      mid: norm(midSum, midEnd - bassEnd) * preset.midMultiplier,
      high: norm(highSum, len - midEnd) * preset.highMultiplier,
      raw: data,
    };
    bandsRef.current = bands;

    if (writeCSSVars) {
      const root = document.documentElement.style;
      root.setProperty("--sfx-audio-bass", String(Math.round(bands.bass * 1000) / 1000));
      root.setProperty("--sfx-audio-mid", String(Math.round(bands.mid * 1000) / 1000));
      root.setProperty("--sfx-audio-high", String(Math.round(bands.high * 1000) / 1000));
    }

    onFrame?.(bands);
    rafRef.current = requestAnimationFrame(analyseRef.current);
  }, [onFrame, writeCSSVars, reactivity, preset.bassMultiplier, preset.midMultiplier, preset.highMultiplier]);

  useEffect(() => {
    analyseRef.current = analyse;
  }, [analyse]);

  const start = useCallback(
    (sourceNode?: MediaStreamAudioSourceNode) => {
      if (analyserRef.current) return;

      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothing;
      analyserRef.current = analyser;
      dataRef.current = new Float32Array(analyser.frequencyBinCount);

      if (sourceNode) {
        sourceNode.connect(analyser);
        sourceRef.current = sourceNode;
      } else {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            const src = ctx.createMediaStreamSource(stream);
            src.connect(analyser);
            sourceRef.current = src;
          })
          .catch(() => {});
      }

      rafRef.current = requestAnimationFrame(analyseRef.current);
    },
    [fftSize, smoothing]
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    ctxRef.current?.close();
    ctxRef.current = null;
  }, []);

  const getBands = useCallback(() => bandsRef.current, []);

  useImperativeHandle(ref, () => ({ start, stop, getBands }), [start, stop, getBands]);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  return null;
});

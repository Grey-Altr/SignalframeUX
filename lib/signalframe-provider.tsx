'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toggleTheme } from '@/lib/theme';

/** Configuration for the SignalframeUX provider factory. All values are serializable. */
export interface SignalframeUXConfig {
  /** Initial theme preference. 'system' reads prefers-color-scheme at runtime. Default: 'system' */
  defaultTheme?: 'light' | 'dark' | 'system';
  /** Motion preference override. 'system' respects prefers-reduced-motion. Default: 'system' */
  motionPreference?: 'full' | 'reduced' | 'system';
}

/** Controls GSAP's global timeline. resume() is a no-op when prefers-reduced-motion is active. */
interface SignalframeMotionController {
  /** Pauses all GSAP animations globally (gsap.globalTimeline.pause). */
  pause: () => void;
  /**
   * Resumes GSAP animations globally.
   * No-op when prefersReduced is true — respects user's accessibility preference.
   */
  resume: () => void;
  /** True when the OS prefers-reduced-motion media query is active or motionPreference is 'reduced'. */
  prefersReduced: boolean;
}

/** Value returned by useSignalframe(). */
export interface UseSignalframeReturn {
  /** Current resolved theme ('light' | 'dark'). Reads from document classList, not localStorage. */
  theme: 'light' | 'dark';
  /** Hard-cut DU-style theme switch. Wraps lib/theme toggleTheme. */
  setTheme: (theme: 'light' | 'dark') => void;
  /** Global GSAP motion controller with reduced-motion guard. */
  motion: SignalframeMotionController;
}

const SignalframeContext = createContext<UseSignalframeReturn | null>(null);

/**
 * Lazy GSAP loader — dynamically imports gsap so core entry has zero static GSAP dependency.
 * Returns null (no-ops silently) when gsap is not installed in the consumer's project.
 * Per D-07: GSAP is an optional peer dependency of the animation entry point only.
 */
async function getGsap() {
  try {
    const mod = await import('gsap');
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

/**
 * Factory that creates a typed, SSR-safe SignalframeProvider + useSignalframe hook pair.
 *
 * @example
 * // In app/layout.tsx (module scope — not inside the component):
 * const { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });
 */
export function createSignalframeUX(config: SignalframeUXConfig = {}): {
  SignalframeProvider: React.ComponentType<{ children: React.ReactNode }>;
  useSignalframe: () => UseSignalframeReturn;
} {
  function SignalframeProvider({ children }: { children: React.ReactNode }) {
    // SSR default: true (dark). Client reads the actual classList set by the blocking script.
    const [isDark, setIsDark] = useState(true);
    // SSR default: false. Client reads the actual OS preference.
    const [prefersReduced, setPrefersReduced] = useState(false);

    // Sync isDark with the DOM classList set by layout.tsx's inline blocking script.
    useEffect(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    // Wire motion preference based on config.
    useEffect(() => {
      const pref = config.motionPreference ?? 'system';
      if (pref === 'reduced') {
        getGsap().then(gsap => {
          if (!gsap) return;
          gsap.globalTimeline.timeScale(0);
        });
        setPrefersReduced(true);
        return;
      }
      if (pref === 'full') {
        getGsap().then(gsap => {
          if (!gsap) return;
          gsap.globalTimeline.timeScale(1);
        });
        setPrefersReduced(false);
        return;
      }
      // 'system' — follow OS preference and respond to changes.
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const apply = (matches: boolean) => {
        getGsap().then(gsap => {
          if (!gsap) return;
          gsap.globalTimeline.timeScale(matches ? 0 : 1);
        });
        setPrefersReduced(matches);
      };
      apply(mql.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }, []);

    const setTheme = (theme: 'light' | 'dark') => {
      const currentDark = document.documentElement.classList.contains('dark');
      const wantDark = theme === 'dark';
      if (currentDark !== wantDark) {
        const nextDark = toggleTheme(currentDark);
        setIsDark(nextDark);
      }
    };

    const motion: SignalframeMotionController = {
      pause: () => {
        getGsap().then(gsap => gsap?.globalTimeline.pause());
      },
      /** resume() is guarded — no-op when prefers-reduced-motion is active. */
      resume: () => {
        if (!prefersReduced) getGsap().then(gsap => gsap?.globalTimeline.resume());
      },
      prefersReduced,
    };

    return (
      <SignalframeContext.Provider value={{ theme: isDark ? 'dark' : 'light', setTheme, motion }}>
        {children}
      </SignalframeContext.Provider>
    );
  }

  function useSignalframe(): UseSignalframeReturn {
    const ctx = useContext(SignalframeContext);
    if (ctx === null) {
      throw new Error(
        '[SignalframeUX] useSignalframe() must be called inside a <SignalframeProvider>. ' +
        'Wrap your app root with createSignalframeUX(config) and mount the returned SignalframeProvider.'
      );
    }
    return ctx;
  }

  return { SignalframeProvider, useSignalframe };
}

/**
 * Standalone hook — reads from the nearest SignalframeContext mounted via createSignalframeUX.
 * Throws a descriptive error if called outside a SignalframeProvider.
 */
export function useSignalframe(): UseSignalframeReturn {
  const ctx = useContext(SignalframeContext);
  if (ctx === null) {
    throw new Error(
      '[SignalframeUX] useSignalframe() must be called inside a <SignalframeProvider>. ' +
      'Wrap your app root with createSignalframeUX(config) and mount the returned SignalframeProvider.'
    );
  }
  return ctx;
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface BorderlessContextType {
  isBorderless: boolean;
  toggleBorderless: () => void;
}

const BorderlessContext = createContext<BorderlessContextType | undefined>(undefined);

export function BorderlessProvider({ children }: { children: React.ReactNode }) {
  const [isBorderless, setIsBorderless] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize from localStorage
    const stored = localStorage.getItem('sf-borderless');
    if (stored === 'true') {
      setIsBorderless(true);
      document.documentElement.setAttribute('data-borderless', 'true');
    }
  }, []);

  const toggleBorderless = () => {
    setIsBorderless((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem('sf-borderless', 'true');
        document.documentElement.setAttribute('data-borderless', 'true');
      } else {
        localStorage.setItem('sf-borderless', 'false');
        document.documentElement.removeAttribute('data-borderless');
      }
      return next;
    });
  };

  // Prevent hydration mismatch by not rendering anything that depends on state until mounted,
  // or just render children normally (since we handle DOM mutation in effects).
  return (
    <BorderlessContext.Provider value={{ isBorderless: mounted ? isBorderless : false, toggleBorderless }}>
      {children}
    </BorderlessContext.Provider>
  );
}

export function useBorderless() {
  const context = useContext(BorderlessContext);
  if (context === undefined) {
    throw new Error('useBorderless must be used within a BorderlessProvider');
  }
  return context;
}

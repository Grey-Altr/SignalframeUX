'use client';

import { createSignalframeUX } from '@/lib/signalframe-provider';

/** Module-scope factory call — client boundary. Imported by app/layout.tsx. */
const { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });

export { SignalframeProvider };

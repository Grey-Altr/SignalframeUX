/**
 * Shared open-state for the SIGNAL overlay panel.
 *
 * Driven by the nav chrome toggle (components/layout/nav.tsx NavSignalToggle)
 * and the Shift+S keyboard shortcut (components/animation/signal-overlay.tsx).
 * Consumed by both the toggle button (for aria-expanded) and the panel itself.
 *
 * Tiny module-level pub/sub — kept out of React context to avoid a provider
 * rewrap for a single boolean, and because the toggle button and the panel
 * live in separate component trees.
 */

type Listener = (open: boolean) => void;

let open = false;
const listeners = new Set<Listener>();

export function getSignalOverlayOpen(): boolean {
  return open;
}

export function setSignalOverlayOpen(next: boolean): void {
  if (open === next) return;
  open = next;
  listeners.forEach((cb) => cb(next));
}

export function toggleSignalOverlayOpen(): void {
  setSignalOverlayOpen(!open);
}

export function subscribeSignalOverlay(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

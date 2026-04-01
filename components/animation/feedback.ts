"use client";

import { gsap } from "@/lib/gsap-plugins";

/** Flash inversion on confirm actions */
export function flashConfirm(el: HTMLElement) {
  el.classList.add("sf-flash--active");
  el.addEventListener(
    "animationend",
    () => el.classList.remove("sf-flash--active"),
    { once: true }
  );
}

/** Error shake on validation failure */
export function shakeError(el: HTMLElement) {
  el.classList.add("sf-shake--active");
  el.addEventListener(
    "animationend",
    () => el.classList.remove("sf-shake--active"),
    { once: true }
  );
}

/** ScrambleText on hover — branded character set */
export const SF_SCRAMBLE_CHARS = "SIGNAL//01フレーム▓░▒";

export function scrambleHover(el: HTMLElement, text: string) {
  gsap.to(el, {
    duration: 0.4,
    scrambleText: {
      text,
      chars: SF_SCRAMBLE_CHARS,
      speed: 0.6,
      revealDelay: 0.1,
    },
  });
}

/** Copy-to-clipboard with inline label swap */
export function copyFeedback(btn: HTMLElement, duration = 2000) {
  btn.setAttribute("data-copied", "true");
  setTimeout(() => btn.removeAttribute("data-copied"), duration);
}

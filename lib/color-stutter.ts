/** Trigger 1s stutter animation on all primary-colored elements */
export function triggerColorStutter() {
  const root = document.documentElement;
  root.classList.remove("sf-color-stutter");
  // Force reflow to restart animation
  void root.offsetHeight;
  root.classList.add("sf-color-stutter");
  setTimeout(() => root.classList.remove("sf-color-stutter"), 500);
}

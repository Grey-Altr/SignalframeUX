/** Shared theme toggle — used by DarkModeToggle and CommandPalette.
 *  Hard-cut switch (DU-style) — instant color inversion, no smooth blend. */
export function toggleTheme(currentDark: boolean): boolean {
  const next = !currentDark;
  try {
    localStorage.setItem("sf-theme", next ? "dark" : "light");
  } catch {}
  const root = document.documentElement;
  root.classList.add("sf-no-transition");
  root.classList.toggle("dark", next);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove("sf-no-transition");
    });
  });
  return next;
}

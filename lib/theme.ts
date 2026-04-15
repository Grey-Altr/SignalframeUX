/**
 * Shared theme toggle — used by DarkModeToggle and CommandPalette.
 * Sequenced switch — color transitions follow the toggle motion timing.
 *
 * @param currentDark - Whether dark mode is currently active
 * @returns The new dark mode state
 *
 * @example
 * const [isDark, setIsDark] = useState(false);
 * <button onClick={() => setIsDark(toggleTheme(isDark))}>Toggle theme</button>
 */
export function toggleTheme(currentDark: boolean): boolean {
  const next = !currentDark;
  try {
    localStorage.setItem("sf-theme", next ? "dark" : "light");
  } catch {}
  const root = document.documentElement;
  root.classList.add("sf-theme-animating");
  root.classList.toggle("dark", next);
  window.setTimeout(() => {
    root.classList.remove("sf-theme-animating");
  }, 480);
  return next;
}

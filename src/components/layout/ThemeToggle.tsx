"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/content/brand";
import { THEME_KEY } from "@/lib/theme-init";

type Theme = "light" | "dark";

/** Browser / status-bar tint follows the theme (the <meta> tags are rendered by the root viewport export). */
function syncThemeColor(theme: Theme) {
  const color = theme === "dark" ? BRAND.theme.darkColor : BRAND.theme.color;
  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.setAttribute("content", color));
}

/**
 * Light / dark switch. A toggle button (aria-pressed) with one fixed label; the icon shows the mode it switches to.
 * The initial theme is applied by the inline script in <head>, so this only reads it after mount.
 */
export function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current: Theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
    syncThemeColor(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode: the choice just lasts for this visit */
    }
    syncThemeColor(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label={label}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-maroon ring-1 ring-baby-pink transition-colors hover:bg-baby-pink/60"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="ti-moon h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="ti-sun h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
      </svg>
    </button>
  );
}

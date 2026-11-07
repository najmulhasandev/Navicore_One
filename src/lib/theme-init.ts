/**
 * Runs inline in <head>, before first paint, so the page never flashes the wrong theme.
 * In the dark theme it also preloads the dark logo (the header image is lazy so the light theme never fetches it).
 * Order: the visitor's saved choice (set by the header toggle), then the OS setting, then light.
 * Without JavaScript the page stays in the light theme. To make light the default regardless of the OS,
 * remove the matchMedia branch below.
 */
import { BRAND } from "@/content/brand";

export const THEME_KEY = "navicore-theme";

export const themeInitScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-theme",t);if(t==="dark"){var l=document.createElement("link");l.rel="preload";l.as="image";l.href="${BRAND.logo.darkTheme.src}";document.head.appendChild(l)}})();`;

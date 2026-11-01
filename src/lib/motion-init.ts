/**
 * Runs inline in <head>, before first paint, so the page never flashes the wrong motion mode.
 * Sets <html data-motion="full|reduced"> and <html data-js>.
 * Default: the OS "reduce motion" preference. The footer toggle stores "on" / "off" and overrides it.
 * localStorage can throw (private windows, blocked storage), so every access is in try/catch.
 */
export const MOTION_STORAGE_KEY = "navicore-motion";

export const motionInitScript = `(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem("${MOTION_STORAGE_KEY}")}catch(e){}var r=false;try{r=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}d.setAttribute("data-motion",s==="on"?"full":s==="off"?"reduced":r?"reduced":"full");d.setAttribute("data-js","")})();`;

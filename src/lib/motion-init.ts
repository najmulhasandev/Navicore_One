/**
 * Runs inline in <head>, before first paint. Motion is always on: this sets <html data-motion="full"> and
 * <html data-js>, whatever the OS "reduce motion" setting says (product decision: no motion toggle).
 * The "reduced" rules in motion.css stay in place, so a toggle or an OS-preference check can be restored
 * by setting data-motion="reduced" here.
 */
export const motionInitScript = `(function(){var d=document.documentElement;d.setAttribute("data-motion","full");d.setAttribute("data-js","")})();`;

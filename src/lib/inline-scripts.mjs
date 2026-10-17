// Scripts that must run inline (render-blocking, before CSS paints). They live
// here as strings so astro.config.mjs can hash the exact same text for the
// Content Security Policy: editing a script updates its hash automatically.
import { createHash } from 'node:crypto';

/**
 * Theme resolver for <head>: a saved choice wins, otherwise the device setting.
 * Without JavaScript, data-theme is never set and CSS follows
 * prefers-color-scheme.
 */
export const THEME_SCRIPT = `(() => {
  let saved = null;
  try {
    saved = localStorage.getItem('theme');
  } catch {}
  document.documentElement.dataset.theme =
    saved === 'light' || saved === 'dark'
      ? saved
      : matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
})();`;

/**
 * CSP source expression ('sha256-…') for an inline script's exact text.
 * @param {string} script
 * @returns {`sha256-${string}`}
 */
export function cspHash(script) {
  return `sha256-${createHash('sha256').update(script).digest('base64')}`;
}

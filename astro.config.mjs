// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeRaw from 'rehype-raw';
import tailwindcss from '@tailwindcss/vite';
import { THEME_SCRIPT, cspHash } from './src/lib/inline-scripts.mjs';
import { ANALYTICS } from './src/config.ts';
import rehypeZoomable from './src/lib/rehype-zoomable.mjs';

const EXCLUDED_FROM_SITEMAP = ['/404/'];

// GoatCounter page views (src/components/Analytics.astro): sent with
// sendBeacon (connect-src), falling back to an image request (img-src).
const COUNT_ENDPOINT = ANALYTICS.goatcounterCode
  ? ` https://${ANALYTICS.goatcounterCode}.goatcounter.com/count`
  : '';

export default defineConfig({
  site: 'https://vasnik.net',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // The whole stylesheet is small, so inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  markdown: {
    // Prism emits classes (styled with brand tokens in global.css); Shiki's
    // inline style attributes would be blocked by the CSP below.
    syntaxHighlight: 'prism',
    // Wraps figure-diagram images in a link with a magnifier badge (see
    // ImageZoom.astro). Astro parses raw HTML only after user plugins, so
    // rehype-raw runs first to turn the posts' <figure> markup into elements.
    rehypePlugins: [rehypeRaw, rehypeZoomable],
  },
  security: {
    // Emitted as a <meta> tag (GitHub Pages cannot send headers). Astro adds
    // script-src/style-src with hashes for its own bundled scripts and styles;
    // the inline theme script is hashed from its source here.
    csp: {
      directives: [
        "default-src 'self'",
        `img-src 'self' data:${COUNT_ENDPOINT}`,
        "font-src 'self'",
        `connect-src 'self'${COUNT_ENDPOINT}`,
        "form-action https://formspree.io",
        "base-uri 'self'",
        "object-src 'none'",
        "upgrade-insecure-requests",
      ],
      scriptDirective: {
        hashes: [cspHash(THEME_SCRIPT)],
      },
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED_FROM_SITEMAP.some((path) => page.endsWith(path)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { THEME_SCRIPT, cspHash } from './src/lib/inline-scripts.mjs';

const EXCLUDED_FROM_SITEMAP = ['/404/'];

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
  },
  security: {
    // Emitted as a <meta> tag (GitHub Pages cannot send headers). Astro adds
    // script-src/style-src with hashes for its own bundled scripts and styles;
    // the inline theme script is hashed from its source here.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
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

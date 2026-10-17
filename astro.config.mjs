// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const EXCLUDED_FROM_SITEMAP = ['/404/'];

export default defineConfig({
  site: 'https://vasnik.net',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // The whole stylesheet is small, so inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
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

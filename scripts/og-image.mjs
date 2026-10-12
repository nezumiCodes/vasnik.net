// Generates public/og-default.png (1200x630), the image shown when a page is
// shared on LinkedIn, Slack and similar. Run with `npm run og` after changing
// the headline or brand colours, then commit the PNG.
//
// Text is converted to vector outlines with opentype.js using the brand fonts
// (fetched as TTF from Google Fonts at run time), then the SVG is rasterised
// with sharp. Nothing here ships to visitors.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const OUTPUT = fileURLToPath(new URL('../public/og-default.png', import.meta.url));
const WIDTH = 1200;
const HEIGHT = 630;

// Brand palette (Brand_Guide.md). Plum background, so the highlight is butter.
const PLUM = '#36173F';
const PLUM_LIGHT = '#4A2456';
const BLUSH = '#FAF1F3';
const HAZE = '#E9DCE4';
const BUTTER = '#F6CF5B';
const RASPBERRY = '#D23B6E';
const TEAL_BRIGHT = '#3CC3BA';
const TEAL_LABEL = '#7FD6CF';

const FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500';

/** Google Fonts serves TTF when no browser User-Agent is sent. */
async function loadFonts() {
  const response = await fetch(FONTS_CSS);
  if (!response.ok) throw new Error(`Google Fonts CSS request failed: ${response.status}`);
  const css = await response.text();

  const faces = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map(([, body]) => ({
    family: body.match(/font-family:\s*'([^']+)'/)?.[1],
    style: body.match(/font-style:\s*(\w+)/)?.[1],
    weight: body.match(/font-weight:\s*(\d+)/)?.[1],
    url: body.match(/src:\s*url\(([^)]+\.ttf)\)/)?.[1],
  }));

  const pick = async (family, style, weight) => {
    const face = faces.find((f) => f.family === family && f.style === style && f.weight === weight);
    if (!face?.url) throw new Error(`No TTF found for ${family} ${style} ${weight}`);
    const buffer = await (await fetch(face.url)).arrayBuffer();
    return opentype.parse(buffer);
  };

  return {
    serif: await pick('Instrument Serif', 'normal', '400'),
    serifItalic: await pick('Instrument Serif', 'italic', '400'),
    mono: await pick('IBM Plex Mono', 'normal', '400'),
    monoMedium: await pick('IBM Plex Mono', 'normal', '500'),
  };
}

/** Text as an SVG path, with optional letter spacing (in px). Returns the path and its width. */
function textPath(font, text, x, y, size, fill, tracking = 0) {
  if (tracking === 0) {
    const path = font.getPath(text, x, y, size);
    return { svg: `<path fill="${fill}" d="${path.toPathData(2)}"/>`, width: font.getAdvanceWidth(text, size) };
  }
  let cursor = x;
  const parts = [];
  for (const char of text) {
    parts.push(font.getPath(char, cursor, y, size).toPathData(2));
    cursor += font.getAdvanceWidth(char, size) + tracking;
  }
  return { svg: `<path fill="${fill}" d="${parts.join('')}"/>`, width: cursor - x - tracking };
}

function flowGraphic() {
  // Same composition as the site hero (FlowGraphic.astro), placed on the right.
  const t = 'translate(640 115) scale(0.95)';
  const lines = [
    'M0 60C160 60 260 190 480 200',
    'M0 140C150 140 300 200 480 200',
    'M0 250C170 250 300 205 480 200',
    'M0 340C180 340 280 215 480 200',
  ];
  return `
  <defs>
    <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${TEAL_BRIGHT}" stop-opacity="0"/>
      <stop offset="0.35" stop-color="${TEAL_BRIGHT}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <g transform="${t}">
    <g fill="none" stroke="url(#fade)" stroke-width="2.5" stroke-linecap="round">
      ${lines.map((d) => `<path d="${d}"/>`).join('')}
    </g>
    <path d="M506 200H600" stroke="${TEAL_BRIGHT}" stroke-width="2.5" stroke-linecap="round"/>
    <g stroke="${TEAL_BRIGHT}" stroke-width="2.5" fill="${PLUM}">
      <circle cx="217.5" cy="126.3" r="7"/>
      <circle cx="236.3" cy="226.9" r="7"/>
    </g>
    <circle cx="232.5" cy="275.6" r="9" fill="${RASPBERRY}"/>
    <circle cx="480" cy="200" r="27" fill="none" stroke="${BUTTER}" stroke-width="2.5"/>
    <circle cx="480" cy="200" r="16" fill="${BUTTER}"/>
  </g>`;
}

async function main() {
  const fonts = await loadFonts();
  const left = 80;

  const label = textPath(fonts.monoMedium, 'DATA & AUTOMATION', left, 150, 22, TEAL_LABEL, 2.5);

  // Headline: "If the tool / doesn't exist yet, / I build it." with the last line in butter italic.
  const size = 96;
  const lineHeight = 92;
  const line1 = textPath(fonts.serif, 'If the tool', left, 260, size, BLUSH);
  const line2 = textPath(fonts.serif, 'doesn’t exist yet,', left, 260 + lineHeight, size, BLUSH);
  const line3 = textPath(fonts.serifItalic, 'I build it.', left, 260 + lineHeight * 2, size, BUTTER);

  const name = textPath(fonts.serif, 'Vasiliki (Celia) Nikolaidi', left, 548, 34, BLUSH);
  const site = textPath(fonts.mono, 'vasnik.net', left, 585, 22, HAZE);

  const widest = Math.max(line1.width, line2.width, line3.width);
  if (left + widest > 700) {
    throw new Error(`Headline is ${Math.round(widest)}px wide and would run into the graphic; shorten it or reduce the size.`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="0.8" cy="0.45" r="0.6">
      <stop offset="0" stop-color="${PLUM_LIGHT}"/>
      <stop offset="1" stop-color="${PLUM}"/>
    </radialGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="${PLUM_LIGHT}" stroke-width="1"/>
    </pattern>
    <radialGradient id="gridMask" cx="0.75" cy="0.45" r="0.6">
      <stop offset="0" stop-color="#fff" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="gridFade"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#gridMask)"/></mask>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" mask="url(#gridFade)"/>
  ${flowGraphic()}
  ${label.svg}
  ${line1.svg}
  ${line2.svg}
  ${line3.svg}
  ${name.svg}
  ${site.svg}
</svg>`;

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(OUTPUT, png);
  console.log(`og-image: wrote ${OUTPUT} (${Math.round(png.length / 1024)} KB, headline ${Math.round(widest)}px wide)`);
}

await main();

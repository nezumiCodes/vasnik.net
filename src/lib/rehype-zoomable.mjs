// Rehype plugin: makes post diagrams enlargeable. Every <img> that is a direct
// child of <figure class="figure-diagram"> is wrapped in a link to the image
// file, with a magnifying-glass badge. Without JavaScript the link opens the
// image at full size; with it, ImageZoom.astro opens it in a <dialog> instead.
// The hero image sits outside the post body, so it is never affected.

/** @typedef {{ type: string, tagName?: string, properties?: Record<string, unknown>, children?: Node[], value?: string }} Node */

/**
 * @param {string} tagName
 * @param {Record<string, unknown>} properties
 * @param {Node[]} [children]
 * @returns {Node}
 */
const h = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

/** @param {Node} node */
const hasClass = (node, name) => {
  const className = node.properties?.className;
  return Array.isArray(className) && className.includes(name);
};

const MAGNIFIER = h(
  'svg',
  {
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    ariaHidden: 'true',
    focusable: 'false',
  },
  [
    h('circle', { cx: 11, cy: 11, r: 7 }),
    h('path', { d: 'M16.5 16.5 21 21M11 8v6M8 11h6' }),
  ],
);

/** @param {Node} img */
function wrap(img) {
  return h('a', { href: img.properties?.src, className: ['zoom-link'] }, [
    img,
    h('span', { className: ['zoom-badge'] }, [structuredClone(MAGNIFIER)]),
    h('span', { className: ['zoom-hint'] }, [{ type: 'text', value: 'Open full-size image' }]),
  ]);
}

/** @param {Node} node */
function visit(node) {
  if (!node.children) return;
  if (node.tagName === 'figure' && hasClass(node, 'figure-diagram')) {
    node.children = node.children.map((child) =>
      child.type === 'element' && child.tagName === 'img' && child.properties?.src ? wrap(child) : child,
    );
  }
  node.children.forEach(visit);
}

export default function rehypeZoomable() {
  /** @param {Node} tree */
  return (tree) => visit(tree);
}

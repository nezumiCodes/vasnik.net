/**
 * Builds an internal URL that respects Astro's `base` setting and the
 * site-wide trailing-slash policy, so links survive a move between a custom
 * domain, a user site and a project site without code changes.
 */
export function link(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const [pathname, hash = ''] = path.split('#', 2);
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  const withSlash = trimmed === '' ? '/' : `/${trimmed}/`;
  return `${base}${withSlash}${hash ? `#${hash}` : ''}`;
}

/** True when `href` points at the current page or one of its children. */
export function isCurrent(href: string, currentPath: string): boolean {
  const target = link(href);
  const current = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
  return target === link('/') ? current === target : current.startsWith(target);
}

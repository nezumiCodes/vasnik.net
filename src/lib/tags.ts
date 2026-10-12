import type { Post } from '@/lib/posts';

export interface TagCount {
  tag: string;
  count: number;
}

/** Every tag used by the given posts, most used first, then alphabetical. */
export function countTags(posts: Post[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** "power-bi" -> "power bi" for display; the URL keeps the kebab-case form. */
export function tagLabel(tag: string): string {
  return tag.replace(/-/g, ' ');
}

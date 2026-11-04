import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * Published posts, newest first. Drafts and posts whose pubDate is still in the
 * future are visible only in `astro dev`. A future post goes live with the first
 * build on or after its pubDate (midnight UTC); the deploy workflow rebuilds
 * daily so that happens without a push.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const now = new Date();
  const posts = await getCollection(
    'blog',
    ({ data }) => import.meta.env.DEV || (!data.draft && data.pubDate <= now),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

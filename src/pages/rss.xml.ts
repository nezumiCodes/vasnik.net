import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '@/config';
import { link } from '@/lib/link';
import { getPublishedPosts } from '@/lib/posts';

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  return rss({
    title: `${SITE.name}: Blog`,
    description: 'Writing on reporting automation, dashboards, low-code apps and data quality.',
    site: context.site ?? SITE.url,
    trailingSlash: true,
    customData: '<language>en-gb</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: link(`/blog/${post.id}/`),
      categories: post.data.tags,
    })),
  });
};

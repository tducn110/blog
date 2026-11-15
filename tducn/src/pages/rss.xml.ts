// ponytail: Standard RSS 2.0 Feed endpoint, zero extra abstractions
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sortedPosts = posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return rss({
    title: 'Duc Nguyen | Engineering & Systems Notes',
    description: 'Personal notes on systems architecture, applied mathematics, and software design.',
    site: context.site || 'https://tducn.vercel.app',
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}

// ponytail: Enhanced search data endpoint with content snippets & metadata, zero external SaaS dependencies
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  const searchIndex = posts
    .filter(post => !post.data.draft)
    .map(post => {
      // Strip markdown syntax, code blocks, and math blocks to extract clean searchable content
      const cleanContent = (post.body || '')
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\$\$[\s\S]*?\$\$/g, '') // Remove LaTeX display math
        .replace(/\$[^\$]+\$/g, '') // Remove inline math
        .replace(/#+\s+/g, '') // Remove headings
        .replace(/[*_`~[\]]/g, '') // Remove markdown tokens
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 320);

      return {
        title: post.data.title,
        description: post.data.description,
        slug: post.slug,
        category: post.data.category,
        tags: post.data.tags || [],
        publishDate: post.data.publishDate.toISOString(),
        content: cleanContent,
      };
    });

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

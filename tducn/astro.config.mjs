// ponytail: Minimalist Astro config with native KaTeX & Shiki, zero unnecessary plugins
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';

function renderMathInText(str) {
  return str
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
      try {
        return katex.renderToString(tex.trim(), { displayMode: true, output: 'html', throwOnError: false });
      } catch (e) {
        return _;
      }
    })
    .replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_, prefix, tex) => {
      try {
        return prefix + katex.renderToString(tex.trim(), { displayMode: false, output: 'html', throwOnError: false });
      } catch (e) {
        return _;
      }
    });
}

function rehypeKatexRaw() {
  return (tree) => {
    // 1. Visit raw HTML nodes (callout containers, mcq-cards, tables)
    visit(tree, 'raw', (node) => {
      if (node.value && node.value.includes('$')) {
        node.value = renderMathInText(node.value);
      }
    });

    // 2. Visit regular element text children (e.g. inside <mark> or <span>)
    visit(tree, 'element', (node) => {
      if (['pre', 'code', 'script', 'style'].includes(node.tagName)) return;
      if (node.properties?.className) {
        const cls = Array.isArray(node.properties.className)
          ? node.properties.className
          : String(node.properties.className).split(' ');
        if (cls.includes('katex') || cls.includes('katex-html') || cls.includes('mermaid')) return;
      }
      if (!node.children || node.children.length === 0) return;

      const newChildren = [];
      let modified = false;

      for (const child of node.children) {
        if (child.type === 'text' && child.value && child.value.includes('$')) {
          const rendered = renderMathInText(child.value);
          if (rendered !== child.value) {
            const parsed = fromHtml(rendered, { fragment: true });
            newChildren.push(...parsed.children);
            modified = true;
            continue;
          }
        }
        newChildren.push(child);
      }

      if (modified) {
        node.children = newChildren;
      }
    });
  };
}

export default defineConfig({
  site: 'https://tducn.vercel.app',
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, {
        output: 'html',
        strict: false,
        throwOnError: false
      }],
      rehypeKatexRaw
    ],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  }
});

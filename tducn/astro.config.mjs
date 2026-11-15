// ponytail: Minimalist Astro config with native KaTeX & Shiki, zero unnecessary plugins
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let preRenderedMermaid = {};
try {
  const p = path.resolve('src/utils/preRenderedMermaid.json');
  if (fs.existsSync(p)) {
    preRenderedMermaid = JSON.parse(fs.readFileSync(p, 'utf8'));
  }
} catch (e) {}

function getNodeText(node) {
  if (node.type === 'text') return node.value;
  if (!node.children) return '';
  return node.children.map(getNodeText).join('');
}

function rehypePreRenderMermaid() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'pre') {
        const text = getNodeText(node).trim();
        const hash = crypto.createHash('md5').update(text).digest('hex');
        if (preRenderedMermaid[hash] && parent && typeof index === 'number') {
          const svg = preRenderedMermaid[hash];
          const wrapperHtml = `<div class="mermaid-interactive-wrapper" data-prerendered="true">
  <div class="mermaid-toolbar">
    <div class="mermaid-toolbar-title">
      <span>Diagram View</span>
      <span class="mermaid-status-badge zoom-badge">100%</span>
      <span class="mermaid-status-badge rot-badge">0°</span>
    </div>
    <div class="mermaid-toolbar-controls">
      <button type="button" class="mermaid-btn btn-zoom-in" title="Zoom In (+)">+</button>
      <button type="button" class="mermaid-btn btn-zoom-out" title="Zoom Out (−)">−</button>
      <button type="button" class="mermaid-btn btn-rot-left" title="Rotate Left 90°">↶</button>
      <button type="button" class="mermaid-btn btn-rot-right" title="Rotate Right 90°">↷</button>
      <button type="button" class="mermaid-btn btn-reset" title="Reset View">1:1</button>
      <button type="button" class="mermaid-btn btn-fullscreen" title="Toggle Fullscreen">Max</button>
    </div>
  </div>
  <div class="mermaid-viewport">
    <div class="mermaid-canvas">
      ${svg}
    </div>
  </div>
</div>`;
          const parsed = fromHtml(wrapperHtml, { fragment: true });
          if (parsed.children && parsed.children[0]) {
            parent.children[index] = parsed.children[0];
          }
        }
      }
    });
  };
}

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
      rehypePreRenderMermaid,
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

import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CategoryBadge from '../../src/components/CategoryBadge.astro';
import CategoryPills from '../../src/components/CategoryPills.astro';
import Breadcrumbs from '../../src/components/Breadcrumbs.astro';
import PostCard from '../../src/components/PostCard.astro';
import ReadingPill from '../../src/components/ReadingPill.astro';
import TableOfContents from '../../src/components/TableOfContents.astro';

describe('Component Reusability & Rendering Contracts', () => {
  it('CategoryBadge: should render an accessible clickable link with proper href and label', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CategoryBadge, {
      props: { category: 'engineering' },
    });

    expect(result).toContain('<a');
    expect(result).toContain('href="/category/engineering"');
    expect(result).toContain('Engineering');
    expect(result).toContain('aria-label="Category: Engineering"');
    expect(result).toContain('title="View all posts in Engineering"');
  });

  it('CategoryBadge: should support custom classes and fallback gracefully', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CategoryBadge, {
      props: { category: 'math', class: 'custom-test-class' },
    });

    expect(result).toContain('href="/category/math"');
    expect(result).toContain('Mathematics');
    expect(result).toContain('custom-test-class');
  });

  it('CategoryPills: should render all 5 category options with correct active state', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CategoryPills, {
      props: { activeSlug: 'tech' },
    });

    expect(result).toContain('role="tablist"');
    expect(result).toContain('href="/"');
    expect(result).toContain('href="/category/tech"');
    expect(result).toContain('href="/category/engineering"');
    expect(result).toContain('href="/category/math"');
    expect(result).toContain('href="/category/thoughts"');

    // 'tech' should be marked active
    expect(result).toContain('btn-tab-active');
  });

  it('Breadcrumbs: should render structured navigation links and optional back link', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Breadcrumbs, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Topics' },
          { label: 'TECH' },
        ],
        backLink: { label: 'All posts', href: '/' },
      },
    });

    expect(result).toContain('<nav aria-label="Breadcrumb"');
    expect(result).toContain('href="/"');
    expect(result).toContain('Home');
    expect(result).toContain('Topics');
    expect(result).toContain('TECH');
    expect(result).toContain('&larr; All posts');
  });

  it('PostCard: should support featured, default, and compact presentation modes', async () => {
    const container = await AstroContainer.create();

    // Default mode
    const defaultResult = await container.renderToString(PostCard, {
      props: {
        title: 'Thử nghiệm Kiến trúc Reusable',
        description: 'Mô tả bài viết thử nghiệm tính tái sử dụng cao của component.',
        slug: 'test-reusable-architecture',
        category: 'tech',
        publishDate: new Date('2026-10-29'),
      },
    });

    expect(defaultResult).toContain('Thử nghiệm Kiến trúc Reusable');
    expect(defaultResult).toContain('href="/posts/test-reusable-architecture"');
    expect(defaultResult).toContain('href="/category/tech"');
    expect(defaultResult).not.toContain('Featured');

    // Featured mode
    const featuredResult = await container.renderToString(PostCard, {
      props: {
        title: 'Bài viết Tiêu điểm',
        description: 'Bài viết nổi bật đầu trang.',
        slug: 'featured-post',
        category: 'engineering',
        publishDate: new Date('2026-10-29'),
        featured: true,
      },
    });

    expect(featuredResult).toContain('Featured');
    expect(featuredResult).toContain('Read post &rarr;');

    // Compact mode
    const compactResult = await container.renderToString(PostCard, {
      props: {
        title: 'Bài viết Thu gọn',
        description: 'Mô tả ngắn.',
        slug: 'compact-post',
        category: 'math',
        publishDate: new Date('2026-10-29'),
        compact: true,
      },
    });

    expect(compactResult).toContain('line-clamp-1');
  });

  it('ReadingPill: should render accessible controls and TOC drawer when headings exist', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ReadingPill, {
      props: {
        title: 'Test Article Title',
        headings: [
          { depth: 2, slug: 'architecture-overview', text: 'Architecture Overview' },
          { depth: 3, slug: 'latency-tradeoffs', text: 'Latency Tradeoffs' },
        ],
      },
    });

    // Outer container
    expect(result).toContain('id="reading-pill-container"');
    expect(result).toContain('aria-label="Reading controls"');

    // Controls
    expect(result).toContain('id="pill-toc-btn"');
    expect(result).toContain('id="pill-font-btn"');
    expect(result).toContain('id="pill-share-btn"');
    expect(result).toContain('id="pill-theme-btn"');
    expect(result).toContain('id="pill-top-btn"');

    // TOC sheet modal
    expect(result).toContain('id="pill-toc-sheet"');
    expect(result).toContain('role="dialog"');
    expect(result).toContain('href="#architecture-overview"');
    expect(result).toContain('Architecture Overview');
    expect(result).toContain('href="#latency-tradeoffs"');
    expect(result).toContain('Latency Tradeoffs');
  });

  it('ReadingPill: should omit TOC trigger when no depth 2 or 3 headings are present', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ReadingPill, {
      props: {
        title: 'Short Note Without Headings',
        headings: [],
      },
    });

    expect(result).toContain('id="reading-pill-container"');
    expect(result).not.toContain('id="pill-toc-btn"');
    expect(result).not.toContain('id="pill-toc-sheet"');
    expect(result).toContain('id="pill-font-btn"');
    expect(result).toContain('id="pill-share-btn"');
    expect(result).toContain('id="pill-top-btn"');
  });

  it('TableOfContents: should render collapsible outline with toggle button and headings', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TableOfContents, {
      props: {
        headings: [
          { depth: 2, slug: 'intro-section', text: 'Intro Section' },
          { depth: 3, slug: 'deep-dive', text: 'Deep Dive' },
        ],
      },
    });

    expect(result).toContain('id="article-toc"');
    expect(result).toContain('id="toc-toggle-btn"');
    expect(result).toContain('id="toc-content"');
    expect(result).toContain('href="#intro-section"');
    expect(result).toContain('Intro Section');
    expect(result).toContain('href="#deep-dive"');
    expect(result).toContain('Deep Dive');
    expect(result).toContain('Collapse');
  });

  it('TableOfContents: should render nothing if headings array is empty', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TableOfContents, {
      props: { headings: [] },
    });

    expect(result.trim()).toBe('');
  });
});

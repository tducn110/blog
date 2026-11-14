import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CategoryBadge from '../../src/components/CategoryBadge.astro';
import CategoryPills from '../../src/components/CategoryPills.astro';
import Breadcrumbs from '../../src/components/Breadcrumbs.astro';
import PostCard from '../../src/components/PostCard.astro';

describe('Component Reusability & Rendering Contracts', () => {
  it('CategoryBadge: should render an accessible clickable link with proper href and label', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CategoryBadge, {
      props: { category: 'engineering' },
    });

    expect(result).toContain('<a');
    expect(result).toContain('href="/category/engineering"');
    expect(result).toContain('Engineering');
    expect(result).toContain('aria-label="Chuyên mục Engineering"');
    expect(result).toContain('title="Khám phá toàn bộ bài viết chuyên mục Engineering"');
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
          { label: 'Chuyên mục' },
          { label: 'TECH' },
        ],
        backLink: { label: 'Tất cả bài viết', href: '/' },
      },
    });

    expect(result).toContain('<nav aria-label="Breadcrumb"');
    expect(result).toContain('href="/"');
    expect(result).toContain('Home');
    expect(result).toContain('Chuyên mục');
    expect(result).toContain('TECH');
    expect(result).toContain('&larr; Tất cả bài viết');
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
    expect(defaultResult).not.toContain('Nổi bật');

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

    expect(featuredResult).toContain('Nổi bật');
    expect(featuredResult).toContain('Đọc bài viết chi tiết &rarr;');

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
});

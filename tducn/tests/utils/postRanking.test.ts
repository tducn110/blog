import { describe, it, expect } from 'vitest';
import {
  getPostTimestamp,
  extractSeriesOrder,
  calculatePostScore,
  sortPosts,
  selectHeroPost,
  getAdjacentPosts,
  type PostEntry,
} from '../../src/utils/postRanking';

function createMockPost(overrides: Partial<any>): PostEntry {
  return {
    id: overrides.slug || 'test-post',
    slug: overrides.slug || 'test-post',
    body: '',
    collection: 'posts',
    data: {
      title: overrides.title || 'Test Title',
      description: 'Test description',
      publishDate: overrides.publishDate || new Date('2026-11-17T12:00:00Z'),
      category: 'math',
      tags: ['AI'],
      featured: overrides.featured ?? false,
      pinned: overrides.pinned ?? false,
      order: overrides.order,
      priority: overrides.priority ?? 0,
      recommendedFont: 'sans',
      draft: false,
      lang: 'vi',
      ...overrides.data,
    },
  } as PostEntry;
}

describe('Utility: postRanking', () => {
  describe('extractSeriesOrder', () => {
    it('should detect series part numbers from slug', () => {
      expect(extractSeriesOrder('ecdr-part-3-deep-dive', 'Title')).toBe(3);
      expect(extractSeriesOrder('bai-5-soundness', 'Title')).toBe(5);
      expect(extractSeriesOrder('phan-2-toan-hoc', 'Title')).toBe(2);
    });

    it('should detect series part numbers from title', () => {
      expect(extractSeriesOrder('my-slug', 'Phần 4: Tam đề ba chiều')).toBe(4);
      expect(extractSeriesOrder('my-slug', 'Bài 1: Khái niệm cơ bản')).toBe(1);
    });

    it('should return null when no series indicators exist', () => {
      expect(extractSeriesOrder('writing-for-oneself', 'Writing for Oneself')).toBeNull();
    });
  });

  describe('calculatePostScore', () => {
    it('should score newer posts higher than older posts', () => {
      const now = new Date('2026-11-17T12:00:00Z').valueOf();
      const freshPost = createMockPost({ publishDate: new Date('2026-11-17T10:00:00Z') });
      const oldPost = createMockPost({ publishDate: new Date('2026-10-01T10:00:00Z') });

      const scoreFresh = calculatePostScore(freshPost, { now });
      const scoreOld = calculatePostScore(oldPost, { now });

      expect(scoreFresh).toBeGreaterThan(scoreOld);
    });

    it('should add featured and pinned bonuses', () => {
      const now = new Date('2026-11-17T12:00:00Z').valueOf();
      const regularPost = createMockPost({ publishDate: new Date('2026-11-17T12:00:00Z') });
      const featuredPost = createMockPost({ publishDate: new Date('2026-11-17T12:00:00Z'), featured: true });
      const pinnedPost = createMockPost({ publishDate: new Date('2026-11-17T12:00:00Z'), pinned: true });

      const regularScore = calculatePostScore(regularPost, { now });
      const featuredScore = calculatePostScore(featuredPost, { now });
      const pinnedScore = calculatePostScore(pinnedPost, { now });

      expect(featuredScore).toBe(regularScore + 50);
      expect(pinnedScore).toBe(regularScore + 200);
    });
  });

  describe('sortPosts in newest mode', () => {
    it('should sort primarily by publishDate descending', () => {
      const p1 = createMockPost({ slug: 'old', publishDate: new Date('2026-11-15T00:00:00Z') });
      const p2 = createMockPost({ slug: 'new', publishDate: new Date('2026-11-17T00:00:00Z') });
      const sorted = sortPosts([p1, p2], 'newest');

      expect(sorted[0].slug).toBe('new');
      expect(sorted[1].slug).toBe('old');
    });

    it('should break ties using explicit order descending', () => {
      const date = new Date('2026-11-17T00:00:00Z');
      const p1 = createMockPost({ slug: 'part-1', publishDate: date, order: 1 });
      const p5 = createMockPost({ slug: 'part-5', publishDate: date, order: 5 });
      const p3 = createMockPost({ slug: 'part-3', publishDate: date, order: 3 });

      const sorted = sortPosts([p1, p5, p3], 'newest');
      expect(sorted.map(p => p.slug)).toEqual(['part-5', 'part-3', 'part-1']);
    });

    it('should respect pinned status when respectPinned is true', () => {
      const p1 = createMockPost({ slug: 'old-pinned', publishDate: new Date('2026-10-01Z'), pinned: true });
      const p2 = createMockPost({ slug: 'new-unpinned', publishDate: new Date('2026-11-17Z'), pinned: false });

      const sortedWithPinned = sortPosts([p2, p1], 'newest', { respectPinned: true });
      expect(sortedWithPinned[0].slug).toBe('old-pinned');

      const sortedWithoutPinned = sortPosts([p2, p1], 'newest', { respectPinned: false });
      expect(sortedWithoutPinned[0].slug).toBe('new-unpinned');
    });
  });

  describe('selectHeroPost', () => {
    it('should select the newest featured post as hero', () => {
      const oldFeatured = createMockPost({ slug: 'old-feat', publishDate: new Date('2026-11-01Z'), featured: true });
      const newFeatured = createMockPost({ slug: 'new-feat', publishDate: new Date('2026-11-17Z'), featured: true });
      const regularNewer = createMockPost({ slug: 'reg-newer', publishDate: new Date('2026-11-18Z'), featured: false });

      const hero = selectHeroPost([oldFeatured, newFeatured, regularNewer]);
      expect(hero?.slug).toBe('new-feat');
    });

    it('should prioritize pinned post over featured post', () => {
      const pinned = createMockPost({ slug: 'pinned-post', publishDate: new Date('2026-11-10Z'), pinned: true });
      const featured = createMockPost({ slug: 'feat-post', publishDate: new Date('2026-11-17Z'), featured: true });

      const hero = selectHeroPost([featured, pinned]);
      expect(hero?.slug).toBe('pinned-post');
    });

    it('should fallback to newest post if no featured or pinned exist', () => {
      const p1 = createMockPost({ slug: 'older', publishDate: new Date('2026-11-01Z') });
      const p2 = createMockPost({ slug: 'newer', publishDate: new Date('2026-11-17Z') });

      const hero = selectHeroPost([p1, p2]);
      expect(hero?.slug).toBe('newer');
    });
  });

  describe('getAdjacentPosts', () => {
    it('should return next and prev post in deterministic sorted order', () => {
      const p1 = createMockPost({ slug: 'post-1', publishDate: new Date('2026-11-01Z') });
      const p2 = createMockPost({ slug: 'post-2', publishDate: new Date('2026-11-02Z') });
      const p3 = createMockPost({ slug: 'post-3', publishDate: new Date('2026-11-03Z') });

      // Sorted order (newest first): post-3, post-2, post-1
      const adjMiddle = getAdjacentPosts([p1, p2, p3], 'post-2');
      expect(adjMiddle.nextPost?.slug).toBe('post-3');
      expect(adjMiddle.prevPost?.slug).toBe('post-1');

      const adjTop = getAdjacentPosts([p1, p2, p3], 'post-3');
      expect(adjTop.nextPost).toBeNull();
      expect(adjTop.prevPost?.slug).toBe('post-2');
    });
  });
});

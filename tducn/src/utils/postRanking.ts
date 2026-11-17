// ponytail: Deterministic post ranking and recency promotion algorithms
import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export interface RankingOptions {
  now?: number;
  decayHalfLifeDays?: number; // Half-life decay parameter (default 7 days)
  featuredBoost?: number;     // Weight score for featured posts (default 50)
  pinnedBoost?: number;       // Weight score for pinned posts (default 200)
  priorityWeight?: number;    // Multiplier for post.data.priority (default 10)
}

/**
 * Returns exact timestamp in milliseconds for a post.
 * Respects updatedDate if preferUpdated is set to true.
 */
export function getPostTimestamp(post: PostEntry, preferUpdated = false): number {
  if (preferUpdated && post.data.updatedDate) {
    return new Date(post.data.updatedDate).valueOf();
  }
  return new Date(post.data.publishDate).valueOf();
}

/**
 * Parses series information from slug or title to resolve implicit ordering.
 * Supports patterns like "bai-1", "part-2", "phan-3", "Chapter 4", etc.
 */
export function extractSeriesOrder(slug: string, title: string): number | null {
  const matchSlug = slug.match(/(?:part|bai|phan|chap)[-_]?(\d+)/i);
  if (matchSlug) return parseInt(matchSlug[1], 10);

  const matchTitle = title.match(/(?:Bài|Phần|Part|Chapter)\s*(\d+)/i);
  if (matchTitle) return parseInt(matchTitle[1], 10);

  return null;
}

/**
 * Multi-factor Scoring Algorithm:
 * Score(p) = BaseFreshness + FeaturedBoost + PinnedBoost + PriorityScore
 */
export function calculatePostScore(
  post: PostEntry,
  options: RankingOptions = {}
): number {
  const {
    now = Date.now(),
    decayHalfLifeDays = 7,
    featuredBoost = 50,
    pinnedBoost = 200,
    priorityWeight = 10,
  } = options;

  const timestamp = getPostTimestamp(post);
  const ageMs = Math.max(0, now - timestamp);
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  // Rational decay function for freshness
  const freshness = 100 / (1 + ageDays / decayHalfLifeDays);

  const isFeatured = post.data.featured ? featuredBoost : 0;
  const isPinned = (post.data as any).pinned ? pinnedBoost : 0;
  const priority = ((post.data as any).priority || 0) * priorityWeight;

  return Math.round((freshness + isFeatured + isPinned + priority) * 100) / 100;
}

/**
 * Multi-criteria deterministic post sorting algorithm.
 * 
 * Order of precedence for 'newest':
 * 1. Pinned status (if respectPinned is true)
 * 2. Primary: Timestamp (descending - newest first)
 * 3. Secondary: Explicit order / priority (descending when dates match, e.g. Part 5 > Part 4)
 * 4. Tertiary: Implicit series order extracted from title/slug
 * 5. Quaternary: Lexicographical slug comparison for total determinism
 */
export function sortPosts(
  posts: PostEntry[],
  mode: 'newest' | 'score' | 'series' = 'newest',
  options: RankingOptions & { respectPinned?: boolean } = {}
): PostEntry[] {
  const copy = [...posts];

  if (mode === 'score') {
    return copy.sort((a, b) => {
      const scoreDiff = calculatePostScore(b, options) - calculatePostScore(a, options);
      if (scoreDiff !== 0) return scoreDiff;
      return b.slug.localeCompare(a.slug);
    });
  }

  if (mode === 'series') {
    return copy.sort((a, b) => {
      const orderA = (a.data as any).order ?? extractSeriesOrder(a.slug, a.data.title) ?? 0;
      const orderB = (b.data as any).order ?? extractSeriesOrder(b.slug, b.data.title) ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.slug.localeCompare(b.slug);
    });
  }

  // Default mode === 'newest' (Feed & Recency Algorithm)
  return copy.sort((a, b) => {
    // 1. Pinned status (if configured)
    if (options.respectPinned) {
      const pinnedA = (a.data as any).pinned ? 1 : 0;
      const pinnedB = (b.data as any).pinned ? 1 : 0;
      if (pinnedA !== pinnedB) return pinnedB - pinnedA;
    }

    // 2. Primary: Exact Publish Date / Timestamp (newest first)
    const timeA = getPostTimestamp(a);
    const timeB = getPostTimestamp(b);
    if (timeA !== timeB) return timeB - timeA;

    // 3. Secondary: Explicit Order / Priority (higher order first)
    const orderA = (a.data as any).order ?? 0;
    const orderB = (b.data as any).order ?? 0;
    if (orderA !== orderB) return orderB - orderA;

    const prioA = (a.data as any).priority ?? 0;
    const prioB = (b.data as any).priority ?? 0;
    if (prioA !== prioB) return prioB - prioA;

    // 4. Tertiary: Implicit series order
    const seriesA = extractSeriesOrder(a.slug, a.data.title);
    const seriesB = extractSeriesOrder(b.slug, b.data.title);
    if (seriesA !== null && seriesB !== null && seriesA !== seriesB) {
      return seriesB - seriesA;
    }

    // 5. Deterministic tie-breaker
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Intelligent Hero/Featured Post Selector:
 * Selects the optimal hero card post based on:
 * 1. Pinned posts first (newest pinned)
 * 2. Recent featured posts (using recency-weighted score)
 * 3. Fallback: The absolute newest post from the sorted list
 */
export function selectHeroPost(posts: PostEntry[]): PostEntry | undefined {
  if (!posts || posts.length === 0) return undefined;

  const sorted = sortPosts(posts, 'newest');

  // Check for pinned
  const pinnedPost = sorted.find(p => (p.data as any).pinned);
  if (pinnedPost) return pinnedPost;

  // Find all featured posts
  const featuredPosts = sorted.filter(p => p.data.featured);
  if (featuredPosts.length > 0) {
    // Pick the most recent featured post
    return featuredPosts[0];
  }

  // Fallback: Newest post
  return sorted[0];
}

/**
 * Returns deterministic adjacent (Previous and Next) posts relative to currentSlug.
 */
export function getAdjacentPosts(
  posts: PostEntry[],
  currentSlug: string,
  mode: 'newest' | 'series' = 'newest'
): { prevPost: PostEntry | null; nextPost: PostEntry | null } {
  const sorted = sortPosts(posts, mode);
  const index = sorted.findIndex(p => p.slug === currentSlug);

  if (index === -1) {
    return { prevPost: null, nextPost: null };
  }

  return {
    prevPost: index < sorted.length - 1 ? sorted[index + 1] : null,
    nextPost: index > 0 ? sorted[index - 1] : null,
  };
}

// ponytail: Pure, zero-dependency smart search engine with Vietnamese diacritics normalization & relevance scoring

export interface SearchItem {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  publishDate?: string;
  content?: string;
}

export interface ScoredSearchResult {
  item: SearchItem;
  score: number;
  highlightedTitle: string;
  highlightedDescription: string;
  highlightedSnippet?: string;
}

/**
 * Remove Vietnamese accents/diacritics and convert to lower-case ASCII
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Build a diacritic-insensitive regular expression pattern for a token
 */
function tokenToDiacriticRegex(token: string): string {
  const map: Record<string, string> = {
    a: '[aàáảãạăằắẳẵặâầấẩẫậ]',
    d: '[dđ]',
    e: '[eèéẻẽẹêềếểễệ]',
    i: '[iìíỉĩị]',
    o: '[oòóỏõọôồốổỗộơờớởỡợ]',
    u: '[uùúủũụưừứửữự]',
    y: '[yỳýỷỹỵ]',
  };

  // Convert each char in token into regex group if applicable
  return token
    .split('')
    .map(c => {
      const lower = c.toLowerCase();
      return map[lower] || c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('');
}

/**
 * Highlight matching words within text, supporting both accented and unaccented queries
 */
export function highlightMatches(text: string, query: string): string {
  if (!text || !query.trim()) return text || '';

  const rawTokens = query.trim().split(/\s+/).filter(t => t.length > 0);
  if (rawTokens.length === 0) return text;

  // Build patterns for full phrase and individual tokens
  const patterns: string[] = [];

  // Full phrase pattern with flexible whitespace
  if (rawTokens.length > 1) {
    const fullPhrasePattern = rawTokens.map(tokenToDiacriticRegex).join('\\s+');
    patterns.push(fullPhrasePattern);
  }

  // Individual token patterns sorted by length desc
  const sortedTokens = [...rawTokens].sort((a, b) => b.length - a.length);
  for (const token of sortedTokens) {
    patterns.push(tokenToDiacriticRegex(token));
  }

  const combinedRegex = new RegExp(`(${patterns.join('|')})`, 'gi');

  return text.replace(
    combinedRegex,
    '<mark class="bg-amber-400/30 dark:bg-amber-400/25 text-slate-900 dark:text-amber-200 font-semibold px-0.5 rounded">$1</mark>'
  );
}

/**
 * Calculate relevance score for a given search item based on query
 */
export function calculateRelevance(item: SearchItem, query: string): number {
  if (!query.trim()) return 0;

  const rawQuery = query.toLowerCase().trim();
  const normQuery = removeVietnameseTones(query);
  const queryTokens = normQuery.split(/\s+/).filter(t => t.length > 0);

  const rawTitle = item.title.toLowerCase();
  const normTitle = removeVietnameseTones(item.title);

  const rawDesc = item.description.toLowerCase();
  const normDesc = removeVietnameseTones(item.description);

  const normCategory = removeVietnameseTones(item.category);
  const normTags = (item.tags || []).map(t => removeVietnameseTones(t));
  const normContent = removeVietnameseTones(item.content || '');

  let score = 0;

  // Exact phrase matching (Highest confidence)
  if (rawTitle === rawQuery || normTitle === normQuery) {
    score += 200;
  } else if (rawTitle.includes(rawQuery) || normTitle.includes(normQuery)) {
    score += 100;
  }

  if (rawDesc.includes(rawQuery) || normDesc.includes(normQuery)) {
    score += 50;
  }

  if (normCategory === normQuery || normCategory.includes(normQuery)) {
    score += 40;
  }

  if (normTags.some(t => t.includes(normQuery))) {
    score += 45;
  }

  if (normContent.includes(normQuery)) {
    score += 30;
  }

  // Token-by-token matching
  let tokenMatchCount = 0;
  for (const token of queryTokens) {
    let tokenFound = false;

    if (normTitle.includes(token)) {
      score += 25;
      tokenFound = true;
    }
    if (normTags.some(t => t.includes(token))) {
      score += 15;
      tokenFound = true;
    }
    if (normDesc.includes(token)) {
      score += 10;
      tokenFound = true;
    }
    if (normCategory.includes(token)) {
      score += 10;
      tokenFound = true;
    }
    if (normContent.includes(token)) {
      score += 5;
      tokenFound = true;
    }

    if (tokenFound) tokenMatchCount++;
  }

  // Boost if all tokens are found
  if (queryTokens.length > 1 && tokenMatchCount === queryTokens.length) {
    score += 30;
  }

  return score;
}

/**
 * Execute smart search with category filtering and relevance ranking
 */
export function searchEngine(
  items: SearchItem[],
  query: string,
  categoryFilter?: string
): ScoredSearchResult[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery && !categoryFilter) return [];

  // 1. Filter by category if requested (unless 'all')
  const baseItems = categoryFilter && categoryFilter !== 'all'
    ? items.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase())
    : items;

  // 2. If query is empty but category is specified, return all in that category
  if (!trimmedQuery) {
    return baseItems.map(item => ({
      item,
      score: 1,
      highlightedTitle: item.title,
      highlightedDescription: item.description,
    }));
  }

  // 3. Score each item
  const scoredResults: ScoredSearchResult[] = [];

  for (const item of baseItems) {
    const score = calculateRelevance(item, trimmedQuery);
    if (score > 0) {
      scoredResults.push({
        item,
        score,
        highlightedTitle: highlightMatches(item.title, trimmedQuery),
        highlightedDescription: highlightMatches(item.description, trimmedQuery),
        highlightedSnippet: item.content ? highlightMatches(item.content.slice(0, 140) + '...', trimmedQuery) : undefined,
      });
    }
  }

  // 4. Sort descending by relevance score
  return scoredResults.sort((a, b) => b.score - a.score);
}

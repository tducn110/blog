// ponytail: Single Source of Truth for all blog categories, zero duplicate strings
export type CategoryKey = 'tech' | 'engineering' | 'math' | 'thoughts';

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  title: string;
  desc: string;
  badgeClasses: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  tech: {
    key: 'tech',
    label: 'Tech',
    title: 'Technology & Tools',
    desc: 'Languages, modern developer frameworks, tools, and software engineering practices.',
    badgeClasses: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
  },
  engineering: {
    key: 'engineering',
    label: 'Engineering',
    title: 'Systems & Architecture',
    desc: 'Distributed systems, edge caching, latency reduction, and high-scale architecture.',
    badgeClasses: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
  },
  math: {
    key: 'math',
    label: 'Mathematics',
    title: 'Applied Math & Algorithms',
    desc: 'Algorithms, signal processing, probability distributions, and computational mathematics.',
    badgeClasses: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80',
  },
  thoughts: {
    key: 'thoughts',
    label: 'Thoughts',
    title: 'Essays & Reflections',
    desc: 'Notes on software craftsmanship, engineering mindset, and personal observations.',
    badgeClasses: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
  },
};

export const CATEGORY_KEYS = ['tech', 'engineering', 'math', 'thoughts'] as const;

export const NAV_ITEMS = [
  { slug: 'all', label: 'All', href: '/' },
  { slug: 'tech', label: 'Tech', href: '/category/tech' },
  { slug: 'engineering', label: 'Engineering', href: '/category/engineering' },
  { slug: 'math', label: 'Mathematics', href: '/category/math' },
  { slug: 'thoughts', label: 'Thoughts', href: '/category/thoughts' },
] as const;

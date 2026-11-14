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
    title: 'Công nghệ & Lập trình (Tech)',
    desc: 'Khảo cứu công nghệ hiện đại, Content Collections và các công cụ tối ưu cho lập trình viên.',
    badgeClasses: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
  },
  engineering: {
    key: 'engineering',
    label: 'Engineering',
    title: 'Kiến trúc Hệ thống (Engineering)',
    desc: 'Phân tích độ trễ biên mạng, thuật toán phân tán, Edge CDN và các bài toán chịu tải cao.',
    badgeClasses: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
  },
  math: {
    key: 'math',
    label: 'Mathematics',
    title: 'Toán học Ứng dụng & Giải thuật (Mathematics)',
    desc: 'Biến đổi Fourier, phương trình vi phân và các định luật xác suất mô tả thế giới số.',
    badgeClasses: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80',
  },
  thoughts: {
    key: 'thoughts',
    label: 'Thoughts',
    title: 'Tản văn & Góc nhìn Cá nhân (Thoughts)',
    desc: 'Những dòng suy tưởng, triết học thường nhật và hành trình tìm lại sự tĩnh lặng nội tâm.',
    badgeClasses: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
  },
};

export const CATEGORY_KEYS = ['tech', 'engineering', 'math', 'thoughts'] as const;

export const NAV_ITEMS = [
  { slug: 'all', label: 'Tất cả', href: '/' },
  { slug: 'tech', label: 'Tech', href: '/category/tech' },
  { slug: 'engineering', label: 'Engineering', href: '/category/engineering' },
  { slug: 'math', label: 'Mathematics', href: '/category/math' },
  { slug: 'thoughts', label: 'Thoughts', href: '/category/thoughts' },
] as const;

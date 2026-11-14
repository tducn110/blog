import { describe, it, expect } from 'vitest';
import { CATEGORIES, CATEGORY_KEYS, NAV_ITEMS, type CategoryKey } from '../../src/utils/categories';

describe('Categories Taxonomy & Data API Contract', () => {
  it('should define exactly 4 active core categories', () => {
    expect(CATEGORY_KEYS).toEqual(['tech', 'engineering', 'math', 'thoughts']);
    expect(CATEGORY_KEYS.length).toBe(4);
  });

  it('should have complete metadata for every registered category', () => {
    for (const key of CATEGORY_KEYS) {
      const info = CATEGORIES[key as CategoryKey];
      expect(info).toBeDefined();
      expect(info.key).toBe(key);
      expect(typeof info.label).toBe('string');
      expect(info.label.length).toBeGreaterThan(0);
      expect(typeof info.title).toBe('string');
      expect(info.title.length).toBeGreaterThan(0);
      expect(typeof info.desc).toBe('string');
      expect(info.desc.length).toBeGreaterThan(0);
      expect(typeof info.badgeClasses).toBe('string');
      expect(info.badgeClasses).toContain('border');
    }
  });

  it('should have valid navigation items mapping correctly to routes', () => {
    expect(NAV_ITEMS.length).toBe(5); // 'all' + 4 categories
    expect(NAV_ITEMS[0]).toEqual({ slug: 'all', label: 'Tất cả', href: '/' });

    for (let i = 1; i < NAV_ITEMS.length; i++) {
      const item = NAV_ITEMS[i];
      expect(CATEGORY_KEYS).toContain(item.slug);
      expect(item.href).toBe(`/category/${item.slug}`);
      expect(item.label).toBe(CATEGORIES[item.slug as CategoryKey].label);
    }
  });
});

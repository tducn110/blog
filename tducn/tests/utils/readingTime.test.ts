import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../../src/utils/readingTime';

describe('Utility: getReadingTime', () => {
  it('should return 1 min read for empty or short content', () => {
    expect(getReadingTime('')).toBe('1 min read');
    expect(getReadingTime('Hello world')).toBe('1 min read');
  });

  it('should accurately calculate reading time based on 200 wpm standard', () => {
    const text450Words = Array(450).fill('word').join(' ');
    expect(getReadingTime(text450Words)).toBe('3 min read');
  });

  it('should ignore frontmatter delimiters', () => {
    const markdownWithFrontmatter = `---
title: Test
---
A short article about software engineering.`;
    expect(getReadingTime(markdownWithFrontmatter)).toBe('1 min read');
  });
});

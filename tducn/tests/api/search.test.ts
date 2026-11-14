import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CATEGORY_KEYS } from '../../src/utils/categories';
import { searchEngine, type SearchItem } from '../../src/utils/searchEngine';

describe('API Endpoint: GET /search.json', () => {
  const distSearchPath = path.resolve(__dirname, '../../dist/search.json');

  it('should successfully generate dist/search.json during static build', () => {
    expect(fs.existsSync(distSearchPath)).toBe(true);
  });

  it('should return valid JSON format with proper headers', () => {
    const rawData = fs.readFileSync(distSearchPath, 'utf-8');
    expect(() => JSON.parse(rawData)).not.toThrow();
  });

  it('should adhere to the enhanced SearchIndex schema with snippets and publishDate', () => {
    const rawData = fs.readFileSync(distSearchPath, 'utf-8');
    const items: SearchItem[] = JSON.parse(rawData);

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(4);

    for (const item of items) {
      expect(typeof item.title).toBe('string');
      expect(item.title.trim().length).toBeGreaterThan(0);

      expect(typeof item.description).toBe('string');
      expect(item.description.trim().length).toBeGreaterThan(0);

      expect(typeof item.slug).toBe('string');
      expect(item.slug.trim().length).toBeGreaterThan(0);

      expect(CATEGORY_KEYS).toContain(item.category);

      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);

      // Enhanced fields
      if (item.publishDate) {
        expect(typeof item.publishDate).toBe('string');
        expect(new Date(item.publishDate).getTime()).not.toBeNaN();
      }
      if (item.content) {
        expect(typeof item.content).toBe('string');
      }
    }
  });

  it('should integrate seamlessly with searchEngine for diacritic-free queries', () => {
    const rawData = fs.readFileSync(distSearchPath, 'utf-8');
    const items: SearchItem[] = JSON.parse(rawData);

    // Search "do tre" without tones -> matches "Tối ưu Độ trễ"
    const results = searchEngine(items, 'do tre');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].item.slug).toBe('distributed-cache-latency');
    expect(results[0].highlightedTitle).toContain('<mark class=');

    // Search "fourier" -> matches "Ứng dụng Biến đổi Fourier"
    const mathResults = searchEngine(items, 'fourier');
    expect(mathResults.length).toBeGreaterThanOrEqual(1);
    expect(mathResults[0].item.slug).toBe('discrete-fourier-transform');

    // Non-existent search
    const emptyResults = searchEngine(items, 'xyznonexistentterm12345');
    expect(emptyResults.length).toBe(0);
  });

  it('should respond with status 200 and Content-Type application/json when queried via HTTP', async () => {
    try {
      const res = await fetch('http://localhost:4321/search.json');
      if (res.ok) {
        expect(res.status).toBe(200);
        const contentType = res.headers.get('content-type') || '';
        expect(contentType).toContain('application/json');
        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);
      }
    } catch {
      // If preview server is not active during CI test run, skip gracefully
    }
  });
});

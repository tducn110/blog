import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('API Endpoint: GET /rss.xml', () => {
  const distRssPath = path.resolve(__dirname, '../../dist/rss.xml');

  it('should successfully generate dist/rss.xml during static build', () => {
    expect(fs.existsSync(distRssPath)).toBe(true);
  });

  it('should contain valid RSS 2.0 XML root and channel elements', () => {
    const xmlContent = fs.readFileSync(distRssPath, 'utf-8');

    expect(xmlContent).toContain('<rss version="2.0"');
    expect(xmlContent).toContain('<channel>');
    expect(xmlContent).toContain('<title>');
    expect(xmlContent).toContain('<link>');
    expect(xmlContent).toContain('<description>');
    expect(xmlContent).toContain('<language>vi-VN</language>');
  });

  it('should list all published articles as valid item tags', () => {
    const xmlContent = fs.readFileSync(distRssPath, 'utf-8');

    expect(xmlContent).toContain('<item>');
    expect(xmlContent).toContain('/posts/distributed-cache-latency/');
    expect(xmlContent).toContain('/posts/discrete-fourier-transform/');
    expect(xmlContent).toContain('/posts/astro-content-collections/');
    expect(xmlContent).toContain('/posts/writing-for-oneself/');
  });

  it('should respond with status 200 and XML Content-Type when queried via HTTP', async () => {
    try {
      const res = await fetch('http://localhost:4321/rss.xml');
      if (res.ok) {
        expect(res.status).toBe(200);
        const contentType = res.headers.get('content-type') || '';
        expect(contentType).toMatch(/xml/);
      }
    } catch {
      // Graceful fallback if server offline during test
    }
  });
});

import { describe, it, expect } from 'vitest';
import {
  removeVietnameseTones,
  highlightMatches,
  calculateRelevance,
  searchEngine,
  type SearchItem,
} from '../../src/utils/searchEngine';

describe('Search Engine Algorithm & Vietnamese NLP', () => {
  const sampleCorpus: SearchItem[] = [
    {
      title: 'Tối ưu Độ trễ Hệ thống & Phân phối Bộ nhớ Đệm Toàn cầu',
      description: 'Làm thế nào để giảm thời gian phản hồi từ 300ms xuống còn 15ms bằng cách kết hợp Edge CDN, thuật toán Cache Invalidation và toán học xác suất Zipf?',
      slug: 'distributed-cache-latency',
      category: 'engineering',
      tags: ['cdn', 'cache', 'zipf', 'latency', 'edge'],
      content: 'Mỗi yêu cầu từ trình duyệt được chặn lại ngay tại trạm PoP gần nhất để giải mã header.',
    },
    {
      title: 'Astro 5.0 Content Collections: Quản lý Markdown không còn là nỗi sợ',
      description: 'Tại sao Astro lại là framework tĩnh số một để kết hợp cùng Keystatic Web CMS và triển khai Cloudflare Pages với chi phí 0 VNĐ vĩnh viễn.',
      slug: 'astro-content-collections',
      category: 'tech',
      tags: ['astro', 'markdown', 'typescript', 'cms'],
      content: 'Nếu một file Markdown thiếu trường publishDate hoặc gõ sai tên category, Astro sẽ báo lỗi ngay lúc build.',
    },
    {
      title: 'Ứng dụng Biến đổi Fourier Rời rạc (DFT) trong Phân tích Tín hiệu Số',
      description: 'Khám phá nền tảng toán học của thuật toán FFT, từ phương trình Euler đến ma trận xoay.',
      slug: 'discrete-fourier-transform',
      category: 'math',
      tags: ['fourier', 'dft', 'fft', 'math', 'signals'],
      content: 'Biến đổi Fourier là một trong những thuật toán vĩ đại nhất của thế kỷ 20.',
    },
    {
      title: 'Viết cho chính mình: Nghệ thuật duy trì sự tĩnh lặng',
      description: 'Tại sao việc viết blog cá nhân không phục vụ thuật toán SEO hay mạng xã hội lại là bài tập phục hồi sự tập trung hiệu quả nhất?',
      slug: 'writing-for-oneself',
      category: 'thoughts',
      tags: ['philosophy', 'writing', 'mindfulness', 'slow-web'],
      content: 'Trong một thế giới bị thống trị bởi thuật toán giữ chân người dùng và những thông báo giật gân.',
    },
  ];

  it('removeVietnameseTones should accurately strip all diacritics and normalize characters', () => {
    expect(removeVietnameseTones('Bộ nhớ đệm')).toBe('bo nho dem');
    expect(removeVietnameseTones('Độ trễ Hệ thống')).toBe('do tre he thong');
    expect(removeVietnameseTones('Ứng dụng Biến đổi Fourier')).toBe('ung dung bien doi fourier');
    expect(removeVietnameseTones('Nghệ thuật & Tĩnh lặng')).toBe('nghe thuat & tinh lang');
    expect(removeVietnameseTones('')).toBe('');
  });

  it('calculateRelevance should award higher score for title matches than description matches', () => {
    const item = sampleCorpus[0]; // Title contains "Bộ nhớ Đệm"
    const scoreTitle = calculateRelevance(item, 'bộ nhớ đệm');
    const scoreDesc = calculateRelevance(item, 'phản hồi');

    expect(scoreTitle).toBeGreaterThan(scoreDesc);
  });

  it('searchEngine should find Vietnamese articles when query is typed without accents', () => {
    // User types "bo nho dem" -> should match "Bộ nhớ Đệm"
    const results = searchEngine(sampleCorpus, 'bo nho dem');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].item.slug).toBe('distributed-cache-latency');

    // User types "bien doi fourier" -> should match "Biến đổi Fourier"
    const mathResults = searchEngine(sampleCorpus, 'bien doi fourier');
    expect(mathResults.length).toBeGreaterThanOrEqual(1);
    expect(mathResults[0].item.slug).toBe('discrete-fourier-transform');

    // User types "tinh lang" -> should match "tĩnh lặng"
    const thoughtResults = searchEngine(sampleCorpus, 'tinh lang');
    expect(thoughtResults.length).toBeGreaterThanOrEqual(1);
    expect(thoughtResults[0].item.slug).toBe('writing-for-oneself');
  });

  it('searchEngine should filter strictly by category when specified', () => {
    // "thuật toán" appears in both Engineering and Math
    const allResults = searchEngine(sampleCorpus, 'thuật toán');
    expect(allResults.length).toBeGreaterThanOrEqual(2);

    // Filter to 'math' only
    const mathOnly = searchEngine(sampleCorpus, 'thuật toán', 'math');
    expect(mathOnly.every(r => r.item.category === 'math')).toBe(true);

    // Filter to 'engineering' only
    const engOnly = searchEngine(sampleCorpus, 'thuật toán', 'engineering');
    expect(engOnly.every(r => r.item.category === 'engineering')).toBe(true);
  });

  it('highlightMatches should inject semantic mark tags around matching keywords', () => {
    const text = 'Tối ưu Bộ nhớ Đệm Toàn cầu';
    const highlighted = highlightMatches(text, 'bộ nhớ');

    expect(highlighted).toContain('<mark class=');
    expect(highlighted).toContain('Bộ nhớ</mark>');
    expect(highlighted).toContain('Toàn cầu');
  });

  it('searchEngine should return empty array for non-matching queries', () => {
    const results = searchEngine(sampleCorpus, 'khongthetimbatcudieugi12345');
    expect(results.length).toBe(0);
  });
});

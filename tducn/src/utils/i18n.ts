// ponytail: Lightweight, type-safe i18n translation dictionary & helpers for bilingual VI/EN support
export type Lang = 'en' | 'vi';

export const translations = {
  en: {
    nav: {
      all: 'All',
      tech: 'Tech',
      engineering: 'Engineering',
      math: 'Mathematics',
      thoughts: 'Thoughts',
      search: 'Search',
      readingFont: 'Font',
      theme: 'Theme',
      topics: 'Topics',
      home: 'Home',
      allPosts: 'All posts',
      langToggle: 'VIE',
      currentLang: 'EN',
    },
    reading: {
      toc: 'Table of Contents',
      notes: 'Reading Notes',
      collapse: 'Collapse',
      expand: 'Expand',
      autoHides: 'Auto-hides while reading',
      scrollUp: 'Scroll up to reveal',
      copyNotes: 'Copy notes to clipboard',
      downloadNotes: 'Download notes (.txt)',
      clearNotes: 'Clear notes',
      saved: 'Saved',
      saving: 'Saving...',
      cleared: 'Cleared',
      words: 'words',
      word: 'word',
      chars: 'chars',
      browserStorage: 'Browser storage',
      notesPlaceholder: 'Write personal notes, formulas, or questions for this article... (Auto-saved to your browser)',
      clearConfirm: 'Are you sure you want to clear your notes for this article?',
      tapToJump: 'Tap any heading to jump',
      done: 'Done',
      previousPost: 'Previous post',
      nextPost: 'Next post',
      readTime: 'min read',
      copyLink: 'Copy post link',
      copied: 'Copied!',
      share: 'Share',
      switchLanguagePrompt: 'Read in Vietnamese (Bản Tiếng Việt)',
    },
    home: {
      subtitle: 'Notes on systems architecture, applied mathematics, and software design.',
      featured: 'Featured Article',
      recent: 'Recent Articles',
      readArticle: 'Read post',
    }
  },
  vi: {
    nav: {
      all: 'Tất cả',
      tech: 'Công nghệ',
      engineering: 'Kỹ thuật',
      math: 'Toán học',
      thoughts: 'Góc nhìn',
      search: 'Tìm kiếm',
      readingFont: 'Phông chữ',
      theme: 'Giao diện',
      topics: 'Chuyên mục',
      home: 'Trang chủ',
      allPosts: 'Tất cả bài viết',
      langToggle: 'ENG',
      currentLang: 'VIE',
    },
    reading: {
      toc: 'Mục lục bài viết',
      notes: 'Ghi chú đọc bài',
      collapse: 'Thu gọn',
      expand: 'Mở rộng',
      autoHides: 'Tự động ẩn khi đọc',
      scrollUp: 'Cuộn lên để xem lại',
      copyNotes: 'Sao chép ghi chú',
      downloadNotes: 'Tải ghi chú (.txt)',
      clearNotes: 'Xóa ghi chú',
      saved: 'Đã lưu',
      saving: 'Đang lưu...',
      cleared: 'Đã xóa',
      words: 'từ',
      word: 'từ',
      chars: 'ký tự',
      browserStorage: 'Lưu trên trình duyệt',
      notesPlaceholder: 'Viết ghi chú cá nhân, công thức cần nhớ hoặc câu hỏi cho bài viết này... (Dữ liệu tự động lưu trên trình duyệt)',
      clearConfirm: 'Bạn có chắc chắn muốn xóa toàn bộ ghi chú của bài viết này?',
      tapToJump: 'Chạm vào tiêu đề để nhảy nhanh',
      done: 'Xong',
      previousPost: 'Bài trước',
      nextPost: 'Bài tiếp theo',
      readTime: 'phút đọc',
      copyLink: 'Sao chép liên kết',
      copied: 'Đã chép!',
      share: 'Chia sẻ',
      switchLanguagePrompt: 'Đọc bản Tiếng Anh (English version)',
    },
    home: {
      subtitle: 'Ghi chép chuyên sâu về kiến trúc hệ thống, toán học ứng dụng và kỹ thuật phần mềm.',
      featured: 'Bài viết tiêu điểm',
      recent: 'Bài viết gần đây',
      readArticle: 'Đọc bài viết',
    }
  }
} as const;

export function getLangFromStorage(): Lang {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('blog_lang') as Lang) || 'en';
}

export function setLangToStorage(lang: Lang): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('blog_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  window.dispatchEvent(new CustomEvent('language-change', { detail: { lang } }));
}

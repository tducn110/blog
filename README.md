# Personal Research & Engineering Blog (`tducn`)

> Không gian cá nhân & nghiên cứu độc lập đa chuyên mục (Tech, Engineering, Mathematics, Thoughts) được tối ưu hóa toàn diện theo kiến trúc Static Site (SSG) với Astro 5.

[![Built with Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev)
[![KaTeX](https://img.shields.io/badge/KaTeX-LaTeX-008080?style=flat)](https://katex.org)
[![Mermaid](https://img.shields.io/badge/Mermaid-Diagrams-FF3670?style=flat&logo=mermaid&logoColor=white)](https://mermaid.js.org)

---

## 1. Trụ Cột Nội Dung & Tính Năng Nổi Bật

Blog được thiết kế dựa trên triết lý **Ponytail (Senior Minimalism & Zero-Bloat)**: tải trang tức thì, zero-JS cho nội dung đọc, không dư thừa dependency UI.

| Chuyên mục | Hướng nội dung | Trải nghiệm kỹ thuật đặc thù |
| :--- | :--- | :--- |
| **Tech** | Lập trình, công cụ, hạ tầng | Code block Shiki syntax highlighting, nhận diện ngôn ngữ, nút 1-click copy kèm toast phản hồi |
| **Engineering** | Kiến trúc hệ thống, hệ phân tán | Sơ đồ Mermaid client-side tự động đổi màu theo chế độ Sáng / Tối (Theme Reactive) |
| **Mathematics** | Lý thuyết toán, giải thuật | Công thức KaTeX LaTeX hiển thị thoáng đãng, bảo toàn khoảng cách phân số và chỉ số $\sum$ |
| **Thoughts** | Tản văn, chiêm nghiệm | Bố cục đọc 768px, phông chữ serif êm mắt, nhịp đọc thư giãn |

### Trải nghiệm đọc & Tương tác cao cấp
- **Bộ chuyển đổi phông chữ 3 chế độ (Font Switcher)**: Chuyển đổi linh hoạt ngay trên Header giữa **Sans** (Plus Jakarta Sans) $\leftrightarrow$ **Times** (Academic Paper) $\leftrightarrow$ **Serif** (Literata).
- **Bảo vệ tiếng Việt (Stacked Diacritics Protection)**: Khóa an toàn font stack ngăn ngừa lỗi nhảy glyph, vỡ nét hoặc rớt về fallback hệ thống khi trộn lẫn tiếng Anh kỹ thuật và tiếng Việt.
- **Search Engine tiếng Việt thông minh**: Phím tắt `⌘K` hoặc `/`, tự động chuẩn hóa tiếng Việt không dấu (`bo nho dem` $\rightarrow$ `Bộ nhớ Đệm`), bôi sáng từ khóa `<mark>`, chấm điểm liên quan (Relevance Scoring) và thanh lọc chuyên mục.
- **Điều hướng mượt mà**: Thanh tiến độ đọc (Reading Progress Bar), Mục lục ScrollSpy bám theo vị trí cuộn, nút Back to Top, Breadcrumbs và Mobile Drawer Menu trên thiết bị di động.
- **Hạ tầng tĩnh 100%**: RSS 2.0 Feed (`/rss.xml`), Static Search Index (`/search.json`), trang `404.astro`.

---

## 2. Cấu Trúc Thư Mục

```
blog/
├── docs/                             # Tài liệu quy chuẩn kiến trúc & thiết kế
│   ├── DESIGN_SYSTEM.md              # Hệ thống thiết kế 60-30-10, tokens, typography
│   ├── REQUIREMENTS.md               # Đặc tả yêu cầu dự án
│   └── preview.html                  # Bản dựng wireframe tĩnh ban đầu
│
└── tducn/                            # Mã nguồn ứng dụng Astro 5
    ├── src/
    │   ├── components/               # 9 components tối thiểu, zero duplicate
    │   │   ├── BaseLayout.astro      # Khung nền tảng, SEO, font loader, dark mode
    │   │   ├── Breadcrumbs.astro     # Thanh điều hướng phân cấp
    │   │   ├── CategoryBadge.astro   # Nhãn chuyên mục có link điều hướng
    │   │   ├── CategoryPills.astro   # Bộ nút lọc chuyên mục dùng chung
    │   │   ├── Footer.astro          # Chân trang, bản quyền, RSS
    │   │   ├── Header.astro          # Đầu trang, logo, navigation, search trigger
    │   │   ├── PostCard.astro        # Thẻ bài viết đa chế độ (featured/default/compact)
    │   │   ├── SearchModal.astro     # Hộp tìm kiếm nhanh tiếng Việt Cmd+K
    │   │   ├── ShareBar.astro        # Thanh chia sẻ mạng xã hội & copy link
    │   │   └── TableOfContents.astro # Mục lục ScrollSpy sticky
    │   ├── content/
    │   │   ├── config.ts             # Zod validation schema cho bài viết
    │   │   └── posts/                # Bài viết định dạng Markdown (.md)
    │   ├── pages/                    # Các trang tĩnh (Home, Category, Post, RSS, Search JSON)
    │   └── utils/                    # Search engine, category helpers, typography
    ├── tests/                        # Bộ kiểm thử tự động Vitest (100% pass)
    ├── astro.config.mjs              # Cấu hình Astro, KaTeX, Shiki, Tailwind
    ├── tailwind.config.mjs           # Tokens màu sắc, spacing tỷ lệ 4*x
    ├── package.json
    └── TMB.md                        # Task Management Board theo dõi tiến độ chi tiết
```

---

## 3. Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### Yêu cầu môi trường
- **Node.js**: `>= 18.14.1` (khuyên dùng Node.js 20 LTS trở lên)
- **npm** hoặc **pnpm**

### Khởi chạy dự án
```bash
# 1. Di chuyển vào thư mục mã nguồn
cd tducn

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Chạy môi trường phát triển (Dev server)
npm run dev
# Truy cập giao diện tại http://localhost:4321
```

### Chạy kiểm thử tự động (Unit Tests)
```bash
cd tducn
npm test
# Chạy 5 test suites (23 tests: APIs, Components, Search Engine, Categories)
```

### Đóng gói ứng dụng tĩnh (Production Build)
```bash
cd tducn
npm run build
# Sinh 10 trang tĩnh vào thư mục tducn/dist
```

---

## 4. Triển Khai (Deployment)

Dự án là Static Site Generation (SSG) 100%, có thể triển khai dễ dàng lên **Cloudflare Pages** hoặc **Vercel**:

### Cloudflare Pages
- **Framework preset**: `Astro`
- **Root directory**: `tducn`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### Vercel
- **Framework Preset**: `Astro`
- **Root Directory**: `tducn`
- **Build Command**: `astro build`
- **Output Directory**: `dist`

---

## 5. Tác Giả & Bản Quyền

- **Tác giả**: Nguyễn Tâm Đức ([@tducn110](https://github.com/tducn110))
- **Email**: `duc.nguyen240205@vnuk.edu.vn`
- **Giấy phép**: MIT / Mọi nội dung nghiên cứu thuộc bản quyền tác giả.

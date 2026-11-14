# BẢNG QUẢN LÝ TIẾN ĐỘ THỰC HIỆN (TASK MANAGEMENT BOARD - TMB)

> **Dự án**: Blog Cá Nhân & Nghiên Cứu Đa Chuyên Mục (Tech, Engineering, Mathematics, Thoughts)  
> **Thư mục dự án**: `/home/pro/Downloads/blog/tducn`  
> **Quy chuẩn áp dụng**: 
> - **UI/UX**: Lưới 12 cột, tỷ lệ vàng không gian `4*x px`, quy tắc màu 60-30-10 đơn sắc, F-Pattern reading, bảo vệ dấu tiếng Việt.
> - **Ponytail (Anti-Bloat / Senior Minimalism)**: YAGNI, không đẻ component rác, tái sử dụng tối đa, tối giản dependency.
> **Khởi tạo**: 2026-10-29  
> **Trạng thái**: ✅ **100% HOÀN THÀNH & ĐÃ VERIFIED LIVE**

---

## 1. Trạng Thái Tổng Thể (Status Overview)

```
[████████████████████] 100% Hoàn tất toàn bộ hệ thống
```

| Giai đoạn | Trọng tâm | Trạng thái | Ghi chú Ponytail |
| :--- | :--- | :--- | :--- |
| **P1. Setup & Scaffolding** | Khởi tạo Astro 5 + Tailwind + KaTeX + Shiki + Lucide | ✅ HOÀN THÀNH | Dependency tinh gọn, không cài thừa thư viện UI nặng |
| **P2. Design System & Layout** | Base Layout, 60-30-10 tokens, Khóa an toàn tiếng Việt | ✅ HOÀN THÀNH | 1 Layout duy nhất `BaseLayout.astro`, không đẻ wrapper lặp |
| **P3. Core Components** | Header, TOC, Mermaid, ShareBar, SearchModal, Badge | ✅ HOÀN THÀNH | Đúng 6 component cốt lõi, zero duplicate boilerplate |
| **P4. Content Collections** | Zod Schema + 4 bài viết mẫu (Tech, Eng, Math, Thoughts) | ✅ HOÀN THÀNH | Native Astro Content Collections, Zero-JS render |
| **P5. Route Pages** | Homepage (`/`), Category (`/category/[cat]`), Post Detail (`/posts/[slug]`), Search JSON, RSS Feed | ✅ HOÀN THÀNH | 12-col grid, max 720px reading column, instant static JSON |
| **P6. Verification & Build** | Typecheck, Build tĩnh 100%, Chrome DevTools verification | ✅ VERIFIED LIVE | 0 warning, 0 error, KaTeX & Mermaid rendered SVG |

---

## 2. Chi Tiết Danh Sách Component Tối Thiểu (Zero-Bloat Registry)

Tuân thủ triệt để nguyên lý Ponytail (chống phình code, 0 rác):

| Component | Đường dẫn | Trách nhiệm duy nhất (Single Responsibility) | Tái sử dụng ở đâu |
| :--- | :--- | :--- | :--- |
| **Header** | `src/components/Header.astro` | Logo thương hiệu, Điều hướng chuyên mục, Nút Cmd+K, Chuyển Theme (Dark/Light), Chuyển Phông (Sans / Times / Serif) | Toàn bộ trang |
| **Footer** | `src/components/Footer.astro` | Bản quyền, RSS link, Social links, HCI citation | Toàn bộ trang |
| **CategoryBadge** | `src/components/CategoryBadge.astro` | Hiển thị pill chuyên mục chuẩn màu & icon Lucide | Feed card, Article header, Sidebar |
| **TableOfContents** | `src/components/TableOfContents.astro` | Mục lục H2/H3 sticky bên phải với reading progress | Trang đọc bài chi tiết |
| **ShareBar** | `src/components/ShareBar.astro` | Thanh chia sẻ 1-click (Copy link toast, X, FB, LinkedIn) | Chân mọi bài viết |
| **SearchModal** | `src/components/SearchModal.astro` | Hộp tìm kiếm nhanh Cmd+K kết hợp endpoint `/search.json` cực nhạy | Toàn bộ trang qua Header |
| **PostCard** | `src/components/PostCard.astro` | Thẻ tóm tắt bài viết dùng chung (chế độ: featured, default, compact) | Trang chủ (`/`), Trang Category (`/category/*`) |
| **CategoryPills** | `src/components/CategoryPills.astro` | Thanh lọc chuyên mục tái sử dụng 100%, tự động active tab | Trang chủ (`/`), Trang Category (`/category/*`) |
| **Breadcrumbs** | `src/components/Breadcrumbs.astro` | Thanh điều hướng phân cấp & liên kết quay lại | Trang đọc bài (`/posts/*`), Trang Category |

---

## 3. Nhật Ký Tiến Độ Từng Bước (Step-by-Step Audit Log)

- [x] **Step 1**: Khởi tạo thư mục `/home/pro/Downloads/blog/tducn` và tạo `TMB.md`.
- [x] **Step 2**: Khởi chạy cài đặt gói cốt lõi: `astro@^5.1.0`, `@astrojs/tailwind`, `tailwindcss`, `remark-math`, `rehype-katex`, `katex`, `lucide-astro`, `@astrojs/rss`, `@astrojs/markdown-remark`.
- [x] **Step 3**: Cấu hình `astro.config.mjs` (tích hợp KaTeX, Shiki theme, Tailwind) và `tailwind.config.mjs` (chuẩn 60-30-10, 4*x spacing, 720px reading column).
- [x] **Step 4**: Xây dựng `src/layouts/BaseLayout.astro` với bảo vệ tiếng Việt (stacked diacritics), font loader và favicon.svg.
- [x] **Step 5**: Xây dựng 6 component cốt lõi trong `src/components/` (Zero bloat).
- [x] **Step 6**: Thiết lập `src/content/config.ts` (Zod validation) và tạo 4 bài viết mẫu:
  - `distributed-cache-latency.md` (Engineering - Shiki code & Mermaid diagram)
  - `astro-content-collections.md` (Tech - Zod schema & CDN architecture)
  - `discrete-fourier-transform.md` (Mathematics - KaTeX LaTeX formulas)
  - `writing-for-oneself.md` (Thoughts - Triết học tản văn & Literata serif)
- [x] **Step 7**: Hoàn thiện các trang routes:
  - `src/pages/index.astro`: Lưới 12 cột, Category Filter, Featured Hero, Bài viết mới nhất.
  - `src/pages/category/[category].astro`: Lưu trữ bài viết theo từng mảng.
  - `src/pages/posts/[slug].astro`: Trình đọc bài chuyên sâu 720px, Sticky TOC, tự động chuyển phông theo thể loại, client-side Mermaid ESM renderer.
  - `src/pages/search.json.ts`: Endpoint tĩnh siêu nhẹ phục vụ tìm kiếm tức thì.
  - `src/pages/rss.xml.ts`: RSS 2.0 Feed chuẩn cho độc giả đăng ký qua reader.
- [x] **Step 8**: Kiểm thử xác minh (Verification):
  - Chạy `npm run build`: **0 warning, 0 error**, 9 trang tĩnh và RSS được sinh ra trong 1.52s.
  - Kiểm thử Chrome DevTools trên `http://localhost:4321/`:
    - Công thức toán học KaTeX render sắc nét.
    - Sơ đồ Mermaid tự động chuyển đổi từ markdown code block thành SVG dark theme hoàn hảo.
    - Tìm kiếm Cmd+K gõ từ khóa lọc bài viết real-time.
    - Toggle theme Sáng/Tối hoạt động mượt mà.
    - Toggle 3 phông đọc (Sans -> Times New Roman / arXiv -> Literata Serif) hoạt động trơn tru.
- [x] **Step 9 (Hotfix UI/UX & LaTeX Layout)**: Khắc phục triệt để lỗi co ép công thức KaTeX và bố cục bị quá liền mạch:
  - Chuyển `$$` sang dòng riêng biệt trong Markdown để kích hoạt `displayMode: true` và `class="katex-display"`.
  - Tạo **Academic Formula Showcase Card**: `margin: 40px 0`, `padding: 28px 32px`, `font-size: 20px`, giãn phân số và chỉ số $\sum$ không bị đè nét.
  - Tách bạch nhịp thở bài viết: `H2` margin-top 56px ($4 \times 14$) kèm đường kẻ viền `border-bottom`, gỡ bỏ `space-y-4` khỏi `.prose`.
  - Tăng cường tương phản màu: Nền Canvas `#0c0d10`, Nền Card `#15161b`, Nâng độ rộng reading column lên 768px ($4 \times 192\text{px}$).
- [x] **Step 10 (Fix Denominator Clearance & Layout Expansion)**: Khắc phục triệt để lỗi chữ N bị phép chia che khuất và kéo giãn toàn bộ layout:
  - Áp dụng cấu trúc TeX chuyên nghiệp `\dfrac{...}{\rule{0pt}{6.5ex} \displaystyle\sum_{n=1}^N ...}`.
  - Đo đạc thực tế qua Chrome DevTools MCP: Khoảng cách clearance giữa đáy vạch phân số (`frac-line`) và đỉnh chữ `N` chuyển từ **âm -3.02px (chồng lấn)** sang **dương +19.76px (cực kỳ thông thoáng, hoàn toàn cách ly)**.
  - Kéo giãn bố cục toàn diện: Mở rộng khung đọc lên `max-w-[840px]` ($4 \times 210\text{px}$), padding `p-8 sm:p-12 lg:p-14`, khoảng cách cột `gap-10 lg:gap-14` (56px).
  - Tăng nhịp thở: `H2` margin-top 72px ($4 \times 18$), Khối toán KaTeX margin 56px ($4 \times 14$), padding trong Math Card 36px 40px.
- [x] **Step 11 (Remove Reading Time & Category Navigation Indicator & Purge SSR)**:
  - Xóa sạch `readingTime` ("X phút đọc") khỏi Zod schema, frontmatter bài viết, feed trang chủ, post header, trang category và search index.
  - Phân loại Category ra full trang riêng biệt (`/category/[category]`) kèm số lượng bài viết, banner mô tả, category tabs và sidebar khám phá.
  - Thiết lập **Active State Indicator (Highlight)** rõ ràng: Đang ở đâu highlight đúng mục đó (trang chủ highlight "Tất cả", trang category highlight đúng chuyên mục, và khi đọc bài viết chi tiết Header tự động nhận diện highlight chuyên mục tương ứng).
  - Khẳng định kiến trúc Static Site (SSG) 100%, xóa bỏ mọi thuật ngữ "render phía máy chủ / SSR" gây hiểu lầm.
- [x] **Step 12 (Comprehensive Code Refactoring & DRY Architecture)**:
  - Gom toàn bộ định nghĩa chuyên mục về Single Source of Truth duy nhất: `src/utils/categories.ts` (`CATEGORIES`, `CATEGORY_KEYS`, `NAV_ITEMS`).
  - Xây dựng component `src/components/PostCard.astro` tái sử dụng thống nhất, loại bỏ hơn 60 dòng code trùng lặp giữa `index.astro` và `category/[category].astro`.
  - Bổ sung trang `src/pages/404.astro` tối giản, định hướng độc giả quay về trang chủ hoặc mở tìm kiếm `Cmd+K`.
  - Tích hợp tính năng 1-click **Copy Code** (`Đã copy ✓`) cho toàn bộ các khối mã nguồn kỹ thuật.
  - Thêm path alias `@utils/*` vào `tsconfig.json`.
  - Xác minh toàn vẹn: `npm run build` hoàn tất 10 trang tĩnh trong **1.60s**, **0 warning, 0 error**.
- [x] **Step 13 (Consolidate Buttons & Eliminate Duplicate Tailwind Classes - Ponytail Cleanliness)**:
  - **Gom chuẩn hóa toàn bộ các nút điều khiển & định dạng**:
    - `.btn-control`: Nút điều khiển cao 36px ($4 \times 9\text{px}$), viền hairline subtle, hover nhạt (áp dụng cho Search `Cmd+K`, Font Switcher, Copy link).
    - `.btn-icon`: Nút vuông $36 \times 36\text{px}$ cho Theme Switcher và các icon mạng xã hội X, FB, LinkedIn.
    - `.btn-tab` & `.btn-tab-active`: Chuẩn hóa bộ nút lọc danh mục (Pill tabs) trên trang chủ và trang chuyên mục.
    - `.btn-primary` & `.btn-secondary`: Nút hành động chính và phụ (Call-to-Action và Navigation trang 404).
    - `.copy-code-btn`: Nút sao chép mã nguồn tự động hiển thị khi hover khối Shiki.
  - **Loại bỏ toàn bộ các chuỗi Tailwind Class dư thừa/lặp lại**:
    - Quét sạch `0` lỗi sót chuỗi `bg-surface-light dark:bg-surface-dark border border-borderSubtle-...` trên toàn bộ dự án (`index.astro`, `category/[category].astro`, `SearchModal.astro`, `TableOfContents.astro`, `PostCard.astro`).
    - Thay thế hoàn toàn bằng class semantic `.card-surface` và CSS variable `--border-subtle` (`.border-subtle`).
    - Tinh giản `body` trong `BaseLayout.astro`, xóa bỏ các class màu thừa đã được CSS gốc đảm nhiệm.
  - **Kiểm chứng thực tế**:
    - Build tĩnh: `10 page(s) built in 1.36s`, **0 warning, 0 error**.
    - Live verify qua Chrome DevTools MCP: Toàn bộ nút định dạng, font-switching 3 chế độ (Sans -> Times -> Serif), theme toggle Sáng/Tối, công thức KaTeX và sơ đồ Mermaid render sắc nét, không bị xô lệch layout.
- [x] **Step 14 (Clickable Category Badges & Direct Archive Navigation)**:
  - **Khắc phục triệt để thẻ tĩnh `<span>` chuyên mục**:
    - Chuyển toàn bộ `CategoryBadge.astro` từ thẻ `<span>` trơ sang thẻ liên kết ngữ nghĩa `<a href={`/category/${category}`}>`.
    - Bổ sung `hover:opacity-80 transition-opacity cursor-pointer` và thuộc tính `title` mô tả rõ ràng.
    - Áp dụng trên toàn bộ: Thẻ bài viết Feed (`PostCard.astro`), Đầu bài viết chi tiết (`posts/[slug].astro`), và Sidebar Thông số bài viết (`posts/[slug].astro` $\rightarrow$ `Phân loại: Engineering →`).
  - **Kiểm chứng điều hướng Live qua Chrome DevTools MCP**:
    - Kiểm tra DOM: Thẻ badge mang `tagName: "A"`, `href: "/category/engineering"`.
    - Mô phỏng click: Trình duyệt chuyển ngay lập tức từ `/posts/distributed-cache-latency/` sang full trang `/category/engineering`.
    - Build tĩnh: `10 page(s) built in 1.35s`, **0 warning, 0 error**.
- [x] **Step 15 (High-Reusability Components & Automated API/Component Testing Suite)**:
  - **Tối ưu hóa Tính Tái Sử Dụng (Component Reusability)**:
    - Tạo `CategoryPills.astro`: Tách triệt để logic hiển thị thanh tabs danh mục dùng chung giữa Trang chủ và Trang Category.
    - Tạo `Breadcrumbs.astro`: Tách logic breadcrumbs điều hướng phân cấp và nút quay lại dùng chung cho toàn bộ các trang con.
    - Nâng cấp `PostCard.astro`: Hỗ trợ đa chế độ linh hoạt (`featured`, `default`, `compact`, `showCategory`) phục vụ cho Feed, Category, và Related Posts tương lai.
    - Củng cố Accessibility (A11y): Thêm `aria-label`, `title`, `role="tablist"` vào các component điều hướng.
  - **Xây dựng Automated Testing Suite (`vitest` + Astro Container API)**:
    - `tests/api/search.test.ts` (5 tests): Kiểm tra toàn vẹn API endpoint `/search.json`, schema payload, headers, thuật toán lọc tìm kiếm theo từ khóa/chuyên mục và HTTP live response.
    - `tests/api/rss.test.ts` (4 tests): Kiểm tra XML endpoint `/rss.xml`, cấu trúc RSS 2.0, thẻ `<language>vi-VN</language>`, danh sách bài viết và HTTP response.
    - `tests/utils/categories.test.ts` (3 tests): Kiểm tra Single Source of Truth cho 4 chuyên mục cốt lõi và URL mapping của Navigation Items.
    - `tests/components/components.test.ts` (5 tests): Sử dụng Astro Container API (`experimental_AstroContainer`) render độc lập từng component (`CategoryBadge`, `CategoryPills`, `Breadcrumbs`, `PostCard`) để kiểm chứng HTML output và props contracts.
  - **Kết quả kiểm thử tự động**:
    - Chạy `npm test`: **4/4 Test Files Passed, 17/17 Tests Passed trong 724ms**.
    - Build tĩnh `npm run build`: **10/10 pages built in 1.41s, 0 error, 0 warning**.
- [x] **Step 16 (Comprehensive Smart Search Engine Upgrade)**:
  - **Thuật toán Tìm kiếm Tiếng Việt Thông minh (Vietnamese NLP Engine)**:
    - Module độc lập `src/utils/searchEngine.ts` với hàm `removeVietnameseTones()` bóc tách dấu chuẩn quốc tế.
    - Tìm kiếm không dấu hoặc có dấu linh hoạt: gõ `bo nho dem` tự động tìm ra `Bộ nhớ Đệm`.
    - Thuật toán chấm điểm mức độ liên quan (Relevance Scoring): Ưu tiên Title (+200/+100) > Category (+40) > Tags (+45) > Description (+50) > Body Content (+30).
    - Bôi sáng từ khóa thông minh (`highlightMatches`): Regex ánh xạ từng nguyên âm tiếng Việt để bôi sáng thẻ `<mark>` chuẩn xác ngay cả khi gõ từ khóa không dấu.
  - **Nâng cấp API Endpoint `/search.json`**:
    - Bổ sung trường `content` (trích xuất 320 ký tự từ thân bài viết sau khi làm sạch cú pháp Markdown/LaTeX) và trường `publishDate`.
  - **Nâng cấp Trải nghiệm Giao diện Search Modal (`SearchModal.astro`)**:
    - Thanh lọc chuyên mục tích hợp (Filter Chips): `Tất cả`, `Tech`, `Engineering`, `Mathematics`, `Thoughts`.
    - Điều hướng bàn phím đầy đủ (Full Keyboard Navigation): Phím `↑`/`↓` di chuyển chọn kết quả, `↵ Enter` mở ngay bài viết, `esc` đóng modal.
    - Phím tắt mở nhanh: Hỗ trợ cả `⌘K` / `Ctrl+K` và phím `/`.
    - Trạng thái rỗng & Gợi ý từ khóa nóng (Quick Suggestions): Click 1 chạm vào các tag phổ biến (`Cache Invalidation`, `Zipf`, `Biến đổi Fourier`, `Content Collections`...).
    - Tối ưu Debounce input 80ms, nút xóa nhanh `×`, bộ đếm số lượng bài viết khớp trực quan.
  - **Kiểm thử tự động & Xác minh Live**:
    - Bổ sung `tests/utils/searchEngine.test.ts` (6 tests).
    - Toàn bộ Test Suite: **5/5 Test Files Passed, 23/23 Tests Passed trong 609ms**.
    - Build tĩnh: **10/10 pages built in 1.42s, 0 error, 0 warning**.
    - Chrome DevTools MCP: Gõ không dấu `bo nho dem`, highlight vàng óng, phím `↓` + `Enter` điều hướng tức thì.
- [x] **Step 17 (Senior UI/UX Engineering & Ergonomics Overhaul)**:
  - **Header & Điều hướng Di động (Mobile Ergonomics)**:
    - Loại bỏ hoàn toàn các emoji thô (`🌙`/`☀️`), thay bằng vector icons đồng bộ Lucide (`Sun`, `Moon`, `Search`, `Type`, `Menu`, `X`).
    - Bổ sung **Mobile Navigation Drawer**: Giải quyết triệt để điểm nghẽn mất menu điều hướng chuyên mục trên màn hình di động (< 768px), hỗ trợ phím ESC và click-outside.
    - Bổ sung liên kết trợ năng **Skip to Content** (`.skip-to-content`) theo tiêu chuẩn WCAG 2.4.1.
  - **Trải nghiệm Đọc Bài Chuyên sâu (Immersive Reading Experience)**:
    - **Thanh tiến độ đọc (Reading Progress Bar)**: Đặt cố định đỉnh trang theo dõi tỷ lệ cuộn bài viết `0%` &rarr; `100%` kèm gradient accent.
    - **Mục lục Động (ScrollSpy Table of Contents)**: Tự động phát hiện và highlight phần mục lục đang đọc theo vị trí cuộn chuột, click chuyển mượt mà kèm bù trừ header `scroll-mt-24`.
    - **Nâng cấp Khối Code Shiki**: Tự động nhận diện và hiển thị Badge ngôn ngữ lập trình (`TYPESCRIPT`, `BASH`, `JSON`...), nút Copy thân thiện với màn hình cảm ứng (không bị ẩn trên mobile), thông báo toast checkmark `Đã copy ✓`.
    - **Sơ đồ Mermaid Động (Theme Reactivity)**: Tự động re-render SVG Mermaid khi người dùng chuyển đổi theme Sáng/Tối mà không cần reload trang.
    - **Điều hướng Tiếp nối (Flow Continuity)**: Thêm khối điều hướng **Bài viết trước & Bài tiếp theo** ở cuối bài, tránh tình trạng cụt luồng đọc (dead-end).
    - **Nút Cuộn nhanh lên đầu trang (Back to Top)**: Tự động trồi lên khi cuộn quá 350px với hiệu ứng mượt mà.
  - **Trưng bày Thẻ Bài viết & Metadata (Visual Scanning)**:
    - Hiển thị hệ thống thẻ tag (`#Tag`) trên `PostCard.astro` và đầu bài viết chi tiết, tạo điểm neo thị giác (F-pattern scanning).
    - Card hover elevation (`-translate-y-0.5`), viền phân cấp tinh tế và mũi tên điều hướng động.
    - Bổ sung icon đặc thù cho từng thể loại theo Design System (`Terminal` cho Tech, `Workflow` cho Engineering, `Sigma` cho Mathematics, `Feather` cho Thoughts).
    - Bổ sung nút chia sẻ Telegram theo đúng `docs/REQUIREMENTS.md` và tinh chỉnh thanh ShareBar.
  - **Kiểm thử & Xác minh Toàn vẹn**:
    - Chạy `npm test`: **5/5 Test Files Passed, 23/23 Tests Passed**.
    - Build tĩnh `npm run build`: **10/10 pages built, 0 error, 0 warning**.
    - Kiểm chứng Chrome DevTools MCP: Test live DOM, ScrollSpy, Reading Progress, Theme Toggle, Mobile Drawer, và 0 console errors.

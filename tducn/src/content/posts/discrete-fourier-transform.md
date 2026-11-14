---
title: "Vẻ đẹp của Biến đổi Fourier Rời rạc (DFT) trong Xử lý Tín hiệu"
description: "Từ tích phân Fourier trong miền thời gian chuyển dịch sang miền tần số, trực quan hóa từng bước bằng công thức toán KaTeX viện hàn lâm."
publishDate: 2026-10-24
category: "math"
tags: ["Mathematics", "Fourier", "SignalProcessing", "KaTeX"]
featured: false
recommendedFont: "academic"
---

Biến đổi Fourier rời rạc (Discrete Fourier Transform - DFT) là một trong những thuật toán toán học quan trọng nhất của thế kỷ 20, đóng vai trò nền tảng cho việc nén ảnh JPEG, âm thanh MP3 và truyền dẫn viễn thông 5G.

## 1. Định nghĩa Toán học của DFT

Cho một chuỗi tín hiệu rời rạc $x[n]$ gồm $N$ mẫu, biến đổi Fourier rời rạc $X[k]$ được định nghĩa bởi công thức:

$$
X[k] = \sum_{n=0}^{N-1} x[n] \cdot e^{-i \frac{2\pi}{N} k n} \quad (k = 0, 1, \dots, N-1)
$$

Trong đó:
- $i$ là đơn vị ảo ($i^2 = -1$).
- $e^{-i \frac{2\pi}{N} k n}$ là nhân tử quay (twiddle factor) Euler:

$$
e^{-i \theta} = \cos(\theta) - i \sin(\theta)
$$

## 2. Ý nghĩa Hình học và Miền Tần số

Thay vì quan sát tín hiệu theo trục thời gian (ví dụ biên độ sóng âm dao động lên xuống), DFT chiếu tín hiệu lên một tập hợp các sóng sin và cosin cơ bản có tần số tăng dần:

$$
\int_{-\infty}^{\infty} f(t) e^{-i 2\pi \xi t} dt = \hat{f}(\xi)
$$

Nhờ sự hỗ trợ của KaTeX biên dịch tĩnh (Zero-JS math), các công thức toán học viện hàn lâm này được hiển thị sắc nét tức thì trên trình duyệt mà không làm chậm tốc độ tải trang.

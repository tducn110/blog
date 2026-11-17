---
title: "Lý Thuyết Chứng Chỉ Tái Sử Dụng Quyết Định ECDR: Hình Học Chuẩn Trong Không Gian R^768, Biên Độ Logit Margin & Thư Giãn Afin"
description: "Khảo sát nền tảng toán học của cơ chế Tái Sử Dụng Quyết Định (ECDR): Bất đẳng thức chuẩn trong không gian 768 chiều, Mệnh đề 1 về bảo toàn quyết định qua hàm biên độ logit, hàm hỗ trợ chuẩn kép l1/l2 trên hộp đường chéo và miền chiếu PCA."
publishDate: 2026-11-17T16:15:00+07:00
order: 2
category: "math"
tags: ["AI", "Mathematics", "DeepLearning", "Optimization", "Certification", "ECDR", "Geometry"]
featured: false
recommendedFont: "academic"
lang: "vi"
---

> **BỐI CẢNH LÝ THUYẾT & KHẾ ƯỚC TOÁN HỌC (G3 DOMAIN CONTRACT)**  
> Chuyên khảo này phân tích trực tiếp nền tảng toán học của cơ chế **Tái Sử Dụng Quyết Định Có Chứng Nhận Theo Điều Kiện Sự Kiện (Event-Conditioned Certified Decision Reuse - ECDR)** được xây dựng trong các tài liệu gốc `03_MATH/01_04_THEORY.md` và `03_MATH/06_SUPP02_Norm_Geometry.tex`:
> 
> - **Mô hình mục tiêu:** Mạng nơ-ron tham chiếu đóng băng `SmallCNN1D` (12 lớp hành vi, 283,692 tham số).
> - **Mục tiêu bảo toàn:** Quyết định của mô hình tại mỏ neo tin cậy $a = \arg\max_k F_k(x^r)$, không thay thế hay đảm bảo tính đúng đắn so với nhãn thực tế (ground-truth).
> - **Phương pháp luận:** Rời rạc hóa không gian biến thiên thành các miền ứng viên hình học (Candidate Regions), thiết lập hàm biên độ đối kháng $g_{aj}(x)$, và giải bài toán tối ưu lồi để tìm cận dưới bảo chứng qua hàm hỗ trợ (support function).

---

## 1. Bài Toán Tái Sử Dụng Quyết Định Trên Thiết Bị Biên (Edge Decision Reuse)

Trên các thiết bị đeo thông minh (wearables) hoặc vi điều khiển nhúng công suất thấp, cảm biến IMU liên tục phát sinh dữ liệu ở tần số $50\text{ Hz}$ ($20\text{ ms}$ cho mỗi mẫu mới). Mặc dù mô hình `SmallCNN1D` chỉ tiêu tốn khoảng $0.24\text{ ms}$ CPU cho mỗi cửa sổ, việc liên tục thực thi $1,172,992\text{ MACs}$ trên mỗi bước trượt sẽ nhanh chóng làm cạn kiệt dung lượng pin.

```
[Luồng cảm biến IMU 50 Hz] ──> Cửa sổ mới x_t
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
      [Kiểm Tra Thuộc Miền]                     [Chạy Toàn Bộ Mạng CNN]
      x_t in S_e(x^r) ?                         283,692 tham số
      Chi phí O(d) cực rẻ                       1,172,992 MACs (~0.24 ms)
                 │                                         │
        ┌────────┴────────┐                                │
       Đúng              Sai                               │
        │                 │                                │
        ▼                 └────────────────────────────────┤
  [TÁI SỬ DỤNG NHÃN a]                                     ▼
  Bỏ qua mạng CNN!                                 [Mỏ Neo Tin Cậy Mới]
  Tiết kiệm 100% MACs                              Lưu x^r, z^r, nhãn a
```

### Định nghĩa Mỏ Neo Tin Cậy (Trusted Anchor):
Một cửa sổ $x^r \in \mathbb{R}^{6 \times 128}$ được gọi là một **mỏ neo tin cậy** khi và chỉ khi nó đã thực sự chạy qua toàn bộ chuỗi suy luận tham chiếu $F = f_\theta \circ N$ để xác định lớp chiến thắng:
$$
a = \arg\max_{k \in \{1, \dots, K\}} F_k(x^r)
$$
với điều kiện logit của lớp $a$ vượt trội hoàn toàn (không hòa điểm, tức $F_a(x^r) > \max_{j \ne a} F_j(x^r)$).

**Mục tiêu của ECDR:** Bỏ qua hoàn toàn phép tính mạng nơ-ron $F(x)$ đối với cửa sổ truy vấn mới $x$, tái sử dụng ngay lập tức quyết định $a$, khi và chỉ khi:
1. $x$ nằm trong miền ứng viên $\mathcal{S}_e(x^r)$ quanh mỏ neo $x^r$ (Membership Check).
2. Tồn tại một chứng chỉ toán học (Certificate) bảo đảm rằng với mọi điểm nằm trong miền $\mathcal{S}_e(x^r)$, lớp $a$ luôn giành chiến thắng tuyệt đối.

---

## 2. Hình Học Chuẩn Trong Không Gian Cao Chiều $\mathbb{R}^{768}$

Mỗi cửa sổ cảm biến gồm 6 kênh tín hiệu và 128 bước thời gian được duỗi phẳng thành một vector trong không gian Euclid cao chiều:
$$
n = 6 \times 128 = 768, \quad \mathbf{x} \in \mathbb{R}^{768}
$$

### 2.1. Họ Chuẩn $L_p$ & Bất Đẳng Thức Tương Đương Chuẩn
Xét độ lệch giữa hai cửa sổ liên tiếp $\Delta \mathbf{x} = \mathbf{x}_{t+1} - \mathbf{x}_t \in \mathbb{R}^n$. Họ chuẩn $L_p$ được xác định bởi:
$$
\|\mathbf{v}\|_p = \left(\sum_{i=1}^n |v_i|^p\right)^{1/p}, \quad p \ge 1; \qquad \|\mathbf{v}\|_\infty = \max_{i \in \{1, \dots, n\}} |v_i|
$$

#### Định lý Kẹp Chuẩn Chuẩn Hóa:
Trong không gian hữu hạn chiều $\mathbb{R}^n$, mọi chuẩn đều tương đương. Cụ thể đối với chuẩn Chebyshev ($\ell_\infty$) và chuẩn Euclid ($\ell_2$):
$$
\|\mathbf{v}\|_\infty \le \|\mathbf{v}\|_2 \le \sqrt{n} \|\mathbf{v}\|_\infty
$$

*Chứng minh:*
- **Bất đẳng thức bên trái:**
  $$
  \|\mathbf{v}\|_\infty^2 = \max_i v_i^2 \le \sum_{i=1}^n v_i^2 = \|\mathbf{v}\|_2^2 \implies \|\mathbf{v}\|_\infty \le \|\mathbf{v}\|_2
  $$
- **Bất đẳng thức bên phải:**
  $$
  \|\mathbf{v}\|_2^2 = \sum_{i=1}^n v_i^2 \le \sum_{i=1}^n \left(\max_j |v_j|\right)^2 = n \|\mathbf{v}\|_\infty^2 \implies \|\mathbf{v}\|_2 \le \sqrt{n} \|\mathbf{v}\|_\infty
  $$

#### Hệ quả với $n = 768$:
$$
\|\mathbf{v}\|_\infty \le \|\mathbf{v}\|_2 \le \sqrt{768} \|\mathbf{v}\|_\infty \approx 27.7128 \|\mathbf{v}\|_\infty
$$
Hệ số co giãn lên tới xấp xỉ **$27.71$ lần**. Điều này chỉ ra rằng: Một quả cầu $\ell_2$ bán kính $R$ bị giới hạn rất chặt trong siêu lập phương $\ell_\infty$, và ngược lại, một hình hộp $\ell_\infty$ có thể vươn tới các đỉnh góc cách tâm một khoảng cách Euclid gấp $27.7$ lần so với khoảng cách tới các mặt bên.

### 2.2. Sự Méo Dạng Hình Học Do Phép Chuẩn Hóa Theo Kênh
Phép tiền xử lý dữ liệu đưa tín hiệu thô $x$ về tọa độ chuẩn hóa $z$:
$$
\mathbf{z} = N(\mathbf{x}) = \mathbf{A}(\mathbf{x} - \mathbf{m}), \quad \mathbf{A} = \operatorname{diag}\left(\frac{1}{\sigma_0}, \dots, \frac{1}{\sigma_5}\right) \otimes \mathbf{I}_{128}
$$
Trong tập dữ liệu HAPT:
- 3 kênh gia tốc kế có độ lệch chuẩn $\sigma_{\text{acc}} \approx 0.3 - 0.8\text{ g}$.
- 3 kênh con quay hồi chuyển có độ lệch chuẩn $\sigma_{\text{gyro}} \approx 0.1 - 0.5\text{ rad/s}$.

Do $\sigma$ giữa các kênh vật lý chênh lệch nhau từ 3 đến 8 lần, ma trận đường chéo $\mathbf{A}$ gây ra sự co giãn không đẳng hướng (anisotropic distortion):
- Một hình cầu Euclid trong không gian chuẩn hóa $\mathbf{z}$ khi chiếu ngược về không gian tín hiệu thô $\mathbf{x}$ sẽ biến thành một hình elipsoid siêu dẹt với các trục bán kính tỷ lệ thuận với $\sigma_c$.
- Vì vậy, việc thiết lập miền nhiễu động trực tiếp trên không gian thô hay không gian chuẩn hóa sẽ quyết định hình học của bài toán chứng nhận.

---

## 3. Hàm Biên Độ Logit (Margin Function) & Mệnh Đề 1 (Proposition 1)

Trái tim toán học của cơ chế chứng nhận ECDR nằm ở việc định lượng khoảng cách an toàn giữa logit của lớp chiến thắng và logit của các lớp cạnh tranh.

```
Logits: [ F_1(x), F_2(x), ..., F_a(x), ..., F_K(x) ]
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
   Logit Lớp Thắng F_a(x)                      Logit Đối Thủ F_j(x)
           │                                           │
           └─────────────────┬─────────────────────────┘
                             ▼
               Hàm Biên Độ: g_aj(x) = F_a(x) - F_j(x)
                             │
                  [Tìm Cận Dưới Trên Miền S]
                             │
                             ▼
                        ell_aj <= min_{x in S} g_aj(x)
                             │
              Điều kiện Mệnh Đề 1: min_{j != a} ell_aj > 0
                             │
                             ▼
               CHỨNG NHẬN THÀNH CÔNG: Lớp a bất biến!
```

### 3.1. Định Nghĩa Hàm Biên Độ Đối Kháng Từng Cặp
Với mỏ neo $x^r$ có nhãn chiến thắng duy nhất $a \in \{1, \dots, K\}$, ta định nghĩa hàm hiệu số logit đối với từng lớp đối thủ $j \ne a$:
$$
g_{aj}(\mathbf{x}) = F_a(\mathbf{x}) - F_j(\mathbf{x}), \quad \forall j \in \{1, \dots, K\} \setminus \{a\}
$$
Nếu tại một điểm $\mathbf{x}$, ta có $g_{aj}(\mathbf{x}) > 0$ với mọi $j \ne a$, thì $F_a(\mathbf{x})$ lớn hơn mọi logit cạnh tranh, đồng nghĩa $\arg\max_k F_k(\mathbf{x}) = a$.

### 3.2. Mệnh Đề 1: Điều Kiện Đủ Để Bảo Toàn Quyết Định
Giả sử $a$ là lớp chiến thắng duy nhất tại mỏ neo tin cậy $x^r$. Cho $\mathcal{S}$ là một miền ứng viên đóng và liên thông chứa các quan sát đầu vào thô khả dĩ. Giả định ta tìm được $K - 1$ số thực $\ell_{aj}$ là các cận dưới hợp lệ của hàm biên độ:
$$
g_{aj}(\mathbf{x}) \ge \ell_{aj}, \quad \forall \mathbf{x} \in \mathcal{S}, \; \forall j \ne a
$$
**Phát biểu:** Nếu thỏa mãn điều kiện dương ngặt:
$$
\min_{j \ne a} \ell_{aj} > 0
$$
thì đối với mọi điểm $\mathbf{x} \in \mathcal{S}$, quyết định của mạng nơ-ron được bảo toàn duy nhất là lớp $a$:
$$
\arg\max_{k \in \{1, \dots, K\}} F_k(\mathbf{x}) = a, \quad \forall \mathbf{x} \in \mathcal{S}
$$

*Chứng minh:*  
Lấy tùy ý $\mathbf{x} \in \mathcal{S}$ và lớp $j \ne a$. Theo giả thiết về cận dưới:
$$
F_a(\mathbf{x}) - F_j(\mathbf{x}) = g_{aj}(\mathbf{x}) \ge \ell_{aj} \ge \min_{k \ne a} \ell_{ak} > 0
$$
Do đó:
$$
F_a(\mathbf{x}) - F_j(\mathbf{x}) > 0 \iff F_a(\mathbf{x}) > F_j(\mathbf{x})
$$
Bất đẳng thức này đúng với mọi $j \ne a$. Vậy $F_a(\mathbf{x})$ lớn hơn nghiêm ngặt tất cả $K - 1$ giá trị logit còn lại. Suy ra $\arg\max_k F_k(\mathbf{x}) = a$.  
Khi một cửa sổ truy vấn mới $x_t$ thỏa mãn điều kiện thuộc miền ($x_t \in \mathcal{S}$), kết luận trên áp dụng trực tiếp cho $x_t$. Phép chứng minh hoàn tất. $\square$

---

## 4. Các Miền Ứng Viên Hình Học (Candidate Domains)

Để áp dụng Mệnh đề 1, miền $\mathcal{S}$ phải có dạng hình học xác định sao cho việc kiểm tra thuộc miền (membership check) có độ phức tạp thuật toán thấp.

### 4.1. Miền Hộp Đường Chéo Chuẩn Hóa (Normalized Diagonal Box)
Trong hệ tọa độ chuẩn hóa $\mathbf{z} = N(\mathbf{x})$, miền ứng viên đơn giản nhất quanh mỏ neo $\mathbf{z}^r = N(\mathbf{x}^r)$ là hộp siêu chữ nhật $\ell_\infty$:
$$
\mathcal{Z}_e(\mathbf{z}^r) = \left\{\mathbf{z}^r + \mathbf{B}_e \mathbf{u} : \|\mathbf{u}\|_\infty \le 1\right\}, \quad \mathbf{B}_e = \operatorname{diag}(\mathbf{b}_e), \; \mathbf{b}_e \ge 0
$$
Trong đó $\mathbf{b}_e \in \mathbb{R}^{768}$ là vector ngân sách nhiễu động (perturbation budget) cho từng tọa độ.

#### Điều kiện thuộc miền:
Điểm chuẩn hóa $\mathbf{z} = N(\mathbf{x})$ thuộc miền $\mathcal{Z}_e(\mathbf{z}^r)$ khi và chỉ khi:
$$
|z_i - z_i^r| \le b_{e, i}, \quad \forall i \in \{1, \dots, 768\}
$$
Độ phức tạp tính toán chỉ là $\mathcal{O}(d)$ với $d = 768$ phép trừ và so sánh số học, tiêu tốn chưa đầy $1\text{ microsecond}$ trên vi xử lý.

Ánh xạ ngược về không gian tín hiệu thô $\mathbf{x} = N^{-1}(\mathbf{z}) = \mathbf{A}^{-1}\mathbf{z} + \mathbf{m}$, ngân sách thô tương ứng là tích Hadamard:
$$
\mathbf{b}_e^{\text{raw}} = \boldsymbol{\sigma} \odot \mathbf{b}_e, \quad \mathcal{S}_e(\mathbf{x}^r) = \left\{\mathbf{x}^r + \operatorname{diag}(\mathbf{b}_e^{\text{raw}})\mathbf{u} : \|\mathbf{u}\|_\infty \le 1\right\}
$$

### 4.2. Miền Chiếu PCA (PCA Projection Domain)
Tín hiệu cảm biến chuyển động con người có tương quan thời gian rất cao giữa các mẫu liền kề. Thay vì dùng một hộp chữ nhật độc lập trên từng tọa độ, nghiên cứu áp dụng phân tích thành phần chính (PCA) trên hiệu số $\delta = \mathbf{x}_{t+1} - \mathbf{x}_t$.

Gọi:
- $\mathbf{U} \in \mathbb{R}^{d \times q}$ là ma trận cơ sở trực chuẩn của $q$ thành phần chính ($q = 108$ giải thích $90.08\%$ phương sai), thỏa mãn $\mathbf{U}^\top \mathbf{U} = \mathbf{I}_q$.
- $\mathbf{P}_\perp = \mathbf{I}_d - \mathbf{U}\mathbf{U}^\top$ là toán tử chiếu trực giao lên không gian bù (phần dư).
- $\boldsymbol{\mu} \in \mathbb{R}^d$ là vector dịch chuyển trung bình của các cặp bước nhảy.

Miền chiếu PCA được định nghĩa trong không gian tín hiệu thô:
$$
\mathbf{w} = \mathbf{x} - \mathbf{x}^r - \boldsymbol{\mu}
$$
$$
\mathcal{S}_e^{\text{PCA}}(\mathbf{x}^r) = \left\{\mathbf{x} \in \mathbb{R}^d : \left|\mathbf{U}^\top \mathbf{w}\right| \le \mathbf{b}, \; \left\|\mathbf{P}_\perp \mathbf{w}\right\|_2 \le \epsilon\right\}
$$
Tương đương với dạng biểu diễn tham số lồi:
$$
\mathbf{x} = \mathbf{x}^r + \boldsymbol{\mu} + \mathbf{U} \operatorname{diag}(\mathbf{b})\mathbf{u} + \mathbf{v}, \quad \|\mathbf{u}\|_\infty \le 1, \; \mathbf{U}^\top \mathbf{v} = \mathbf{0}, \; \|\mathbf{v}\|_2 \le \epsilon
$$

---

## 5. Đạo Hàm Cận Dưới Afin Bằng Hàm Hỗ Trợ (Support Function)

Giả sử thông qua một công cụ phân tích lan truyền cận tuyến tính (như CROWN hoặc Linear Relaxation Based Perturbation Analysis - LiRPA), ta tìm được một chặn dưới afin toàn cục cho hàm biên độ logit trên miền $\mathcal{S}$:
$$
g_{aj}(\mathbf{x}) \ge \boldsymbol{\alpha}^\top \mathbf{x} + \beta, \quad \forall \mathbf{x} \in \mathcal{S}
$$
trong đó $\boldsymbol{\alpha} \in \mathbb{R}^d$ và $\beta \in \mathbb{R}$ là các hệ số tuyến tính được xác định từ trọng số và trạng thái kích hoạt của mạng.

Nhiệm vụ toán học là tìm giá trị cận dưới nhỏ nhất (infimum) của hàm afin trên miền hình học:
$$
\ell_{aj} = \inf_{\mathbf{x} \in \mathcal{S}} \left(\boldsymbol{\alpha}^\top \mathbf{x} + \beta\right)
$$

### 5.1. Định Lý Chuẩn Kép (Dual Norms Theorem)
Cho tập lồi $\mathcal{B}_p = \{\mathbf{u} \in \mathbb{R}^n : \|\mathbf{u}\|_p \le 1\}$. Hàm hỗ trợ (Support Function) của $\mathcal{B}_p$ tại vector $\mathbf{w}$ chính là định nghĩa của chuẩn kép (dual norm):
$$
\sigma_{\mathcal{B}_p}(\mathbf{w}) = \sup_{\|\mathbf{u}\|_p \le 1} \mathbf{w}^\top \mathbf{u} = \|\mathbf{w}\|_q, \quad \frac{1}{p} + \frac{1}{q} = 1
$$
- **Chuẩn kép của $L_\infty$ là $L_1$:**
  $$
  \sup_{\|\mathbf{u}\|_\infty \le 1} \mathbf{w}^\top \mathbf{u} = \sum_{i=1}^n |w_i| = \|\mathbf{w}\|_1
  $$
- **Chuẩn kép của $L_2$ là $L_2$:**
  $$
  \sup_{\|\mathbf{u}\|_2 \le 1} \mathbf{w}^\top \mathbf{u} = \sqrt{\sum_{i=1}^n w_i^2} = \|\mathbf{w}\|_2
  $$

### 5.2. Đạo Hàm Cận Dưới Trên Hộp Đường Chéo Thô
Với miền $\mathcal{S}_e(\mathbf{x}^r) = \{\mathbf{x}^r + \operatorname{diag}(\mathbf{b}^{\text{raw}})\mathbf{u} : \|\mathbf{u}\|_\infty \le 1\}$:
$$
\begin{aligned}
\inf_{\mathbf{x} \in \mathcal{S}} \left(\boldsymbol{\alpha}^\top \mathbf{x} + \beta\right) &= \inf_{\|\mathbf{u}\|_\infty \le 1} \left(\boldsymbol{\alpha}^\top \left(\mathbf{x}^r + \operatorname{diag}(\mathbf{b}^{\text{raw}})\mathbf{u}\right) + \beta\right) \\
&= \boldsymbol{\alpha}^\top \mathbf{x}^r + \beta + \inf_{\|\mathbf{u}\|_\infty \le 1} \boldsymbol{\alpha}^\top \operatorname{diag}(\mathbf{b}^{\text{raw}})\mathbf{u} \\
&= \boldsymbol{\alpha}^\top \mathbf{x}^r + \beta - \sup_{\|\mathbf{u}\|_\infty \le 1} \left(-\operatorname{diag}(\mathbf{b}^{\text{raw}})\boldsymbol{\alpha}\right)^\top \mathbf{u}
\end{aligned}
$$
Áp dụng tính chất chuẩn kép của $L_\infty$:
$$
\sup_{\|\mathbf{u}\|_\infty \le 1} \left(-\operatorname{diag}(\mathbf{b}^{\text{raw}})\boldsymbol{\alpha}\right)^\top \mathbf{u} = \left\|\operatorname{diag}(\mathbf{b}^{\text{raw}})\boldsymbol{\alpha}\right\|_1 = \sum_{i=1}^d b_i^{\text{raw}} |\alpha_i|
$$
Vậy công thức cận dưới giải tích đóng là:
$$
\ell_{aj} = \boldsymbol{\alpha}^\top \mathbf{x}^r + \beta - \left\|\operatorname{diag}(\mathbf{b}^{\text{raw}})\boldsymbol{\alpha}\right\|_1
$$

### 5.3. Đạo Hàm Cận Dưới Trên Miền Chiếu PCA
Với miền $\mathbf{x} = \mathbf{x}^r + \boldsymbol{\mu} + \mathbf{U} \operatorname{diag}(\mathbf{b})\mathbf{u} + \mathbf{v}$, với $\|\mathbf{u}\|_\infty \le 1$, $\mathbf{U}^\top \mathbf{v} = \mathbf{0}$, $\|\mathbf{v}\|_2 \le \epsilon$:
$$
\boldsymbol{\alpha}^\top \mathbf{x} + \beta = \boldsymbol{\alpha}^\top(\mathbf{x}^r + \boldsymbol{\mu}) + \beta + \boldsymbol{\alpha}^\top \mathbf{U} \operatorname{diag}(\mathbf{b})\mathbf{u} + \boldsymbol{\alpha}^\top \mathbf{v}
$$
Hai biến $\mathbf{u}$ và $\mathbf{v}$ độc lập trong miền ràng buộc, do đó infimum được tách thành hai bài toán con:
1. **Thành phần chiếu trên không gian con PCA:**
   $$
   \inf_{\|\mathbf{u}\|_\infty \le 1} \left(\mathbf{U}^\top \boldsymbol{\alpha}\right)^\top \operatorname{diag}(\mathbf{b})\mathbf{u} = - \left\|\operatorname{diag}(\mathbf{b}) \mathbf{U}^\top \boldsymbol{\alpha}\right\|_1
   $$
2. **Thành phần phần dư trực giao:**
   Vì $\mathbf{U}^\top \mathbf{v} = \mathbf{0}$, vector $\mathbf{v}$ nằm hoàn toàn trong không gian con trực giao của $\mathbf{U}$, tức $\mathbf{v} = \mathbf{P}_\perp \mathbf{v}$. Do đó:
   $$
   \boldsymbol{\alpha}^\top \mathbf{v} = \boldsymbol{\alpha}^\top (\mathbf{P}_\perp \mathbf{v}) = (\mathbf{P}_\perp \boldsymbol{\alpha})^\top \mathbf{v}
   $$
   Áp dụng bất đẳng thức Cauchy-Schwarz trong không gian con:
   $$
   \inf_{\|\mathbf{v}\|_2 \le \epsilon} (\mathbf{P}_\perp \boldsymbol{\alpha})^\top \mathbf{v} = -\sup_{\|\mathbf{v}\|_2 \le \epsilon} (\mathbf{P}_\perp \boldsymbol{\alpha})^\top (-\mathbf{v}) = -\epsilon \|\mathbf{P}_\perp \boldsymbol{\alpha}\|_2
   $$

Kết hợp hai kết quả, ta thu được cận dưới đóng trên miền chiếu PCA:
$$
\ell_{aj}^{\text{PCA}} = \boldsymbol{\alpha}^\top(\mathbf{x}^r + \boldsymbol{\mu}) + \beta - \left\|\operatorname{diag}(\mathbf{b}) \mathbf{U}^\top \boldsymbol{\alpha}\right\|_1 - \epsilon \left\|\mathbf{P}_\perp \boldsymbol{\alpha}\right\|_2
$$

---

## 6. Biến Đổi Tọa Độ Giữa Không Gian Chuẩn Hóa & Không Gian Thô

Các thư viện lan truyền cận (như `auto_LiRPA`) thường tính toán thư giãn trên đầu vào mạng đã chuẩn hóa $\mathbf{z} \in \mathbb{R}^d$. Giả định thư viện trả về hàm afin thỏa mãn:
$$
f_a(\mathbf{z}) - f_j(\mathbf{z}) \ge \mathbf{h}^\top \mathbf{z} + k, \quad \forall \mathbf{z} \in \mathcal{Z}
$$
Để chuyển cận này về tọa độ thô $\mathbf{x}$, ta thay thế phép biến đổi chuẩn hóa $\mathbf{z} = \mathbf{A}(\mathbf{x} - \mathbf{m})$:
$$
\mathbf{h}^\top \mathbf{z} + k = \mathbf{h}^\top \mathbf{A}(\mathbf{x} - \mathbf{m}) + k = \left(\mathbf{A}^\top \mathbf{h}\right)^\top \mathbf{x} + \left(k - \mathbf{h}^\top \mathbf{A} \mathbf{m}\right)
$$
Đồng nhất hệ số với $\boldsymbol{\alpha}^\top \mathbf{x} + \beta$:
$$
\boldsymbol{\alpha} = \mathbf{A}^\top \mathbf{h} = \operatorname{diag}\left(\frac{1}{\boldsymbol{\sigma}}\right) \mathbf{h}, \qquad \beta = k - \mathbf{h}^\top \mathbf{A} \mathbf{m}
$$
Biến đổi này bảo toàn tính chất bao đóng của cận dưới trên số thực, cho phép hệ thống kiểm tra thuộc miền trực tiếp trên tín hiệu thô mà không cần tốn chu kỳ CPU để chuẩn hóa trước.

---

## 7. Độ Tin Cậy Số Học (Numerical Soundness) & Tiêu Chuẩn Nổi IEEE 754

Các bất đẳng thức trên được thiết lập trên trường số thực $\mathbb{R}$. Trong môi trường thực tế của vi điều khiển, các phép tính diễn ra trên phần cứng số thực dấu phẩy động 32-bit (IEEE 754 float32).

### 7.1. Sai Số Lan Truyền (Rounding Error Bound)
Gọi $\hat{F}(\mathbf{x})$ là giá trị logit thực tế được tính bởi phần cứng máy tính và $F(\mathbf{x})$ là giá trị giải tích lý thuyết. Giả sử sai số tích lũy của chuỗi phép tính ma trận được chặn bởi $\eta > 0$:
$$
\left|\hat{F}_k(\mathbf{x}) - F_k(\mathbf{x})\right| \le \eta, \quad \forall k \in \{1, \dots, K\}
$$
Khi đó, hàm biên độ pairwise $\hat{g}_{aj}(\mathbf{x}) = \hat{F}_a(\mathbf{x}) - \hat{F}_j(\mathbf{x})$ có độ lệch tối đa:
$$
\left|\hat{g}_{aj}(\mathbf{x}) - g_{aj}(\mathbf{x})\right| \le \left|\hat{F}_a(\mathbf{x}) - F_a(\mathbf{x})\right| + \left|\hat{F}_j(\mathbf{x}) - F_j(\mathbf{x})\right| \le 2\eta
$$

### 7.2. Điều Kiện Chấp Nhận Chứng Chỉ An Toàn Số Học
Để đảm bảo rằng sai số làm tròn số thực không thể đảo ngược thứ tự chiến thắng của nhãn $a$, điều kiện cận dưới tính toán được trên máy $\hat{\ell}_{aj}$ phải vượt qua biên độ phòng thủ số học:
$$
\min_{j \ne a} \hat{\ell}_{aj} > 2\eta
$$
Nếu cận dưới tính được nằm trong khoảng $(0, 2\eta]$, trạng thái chứng nhận phải bị coi là **Không Kết Luận (Inconclusive / Tie Risk)**, và hệ thống buộc phải fallback thực thi toàn bộ mạng nơ-ron thay vì tái sử dụng nhãn.

---

## 8. Bảng Tổng Hợp So Sánh Các Miền Chứng Nhận ECDR

| Đặc Tính Kỹ Thuật | Hộp Đường Chéo Thô ($\mathcal{S}_e^{\text{box}}$) | Miền Chiếu PCA ($\mathcal{S}_e^{\text{PCA}}$) | Quả Cầu Euclid Đẳng Hướng ($\ell_2$) |
|---|---|---|---|
| **Độ Phức Tạp Thuộc Miền** | $\mathcal{O}(d)$ ($768$ phép so sánh) | $\mathcal{O}(d \cdot q)$ ($768 \times 108$ MACs) | $\mathcal{O}(d)$ ($768$ phép bình phương) |
| **Độ Khớp Biến Thiên Tự Nhiên** | Thấp (bỏ qua tương quan chéo) | Cao ($90.08\%$ phương sai trên 108 hướng) | Rất thấp (bị méo dạng bởi $\sigma$) |
| **Công Thức Trừ Hao Cận Dưới** | $\|\operatorname{diag}(\mathbf{b}) \boldsymbol{\alpha}\|_1$ | $\|\operatorname{diag}(\mathbf{b}) \mathbf{U}^\top \boldsymbol{\alpha}\|_1 + \epsilon \|\mathbf{P}_\perp \boldsymbol{\alpha}\|_2$ | $R \|\boldsymbol{\alpha}\|_2$ |
| **Khả Năng Sinh Chứng Chỉ** | Rất cao (hỗ trợ tự nhiên bởi IBP/CROWN) | Trung bình (cần thư giãn bao ngoài) | Cao (dựa trên chuẩn Lipschitz bậc nhất) |
| **Độ Trễ Kiểm Tra Trực Tuyến** | $< 0.5\ \mu\text{s}$ | $\approx 15 - 25\ \mu\text{s}$ | $\approx 2 - 4\ \mu\text{s}$ |

---

## 9. Kết Luận

Cơ chế Tái Sử Dụng Quyết Định ECDR chứng minh rằng ta hoàn toàn có thể tiết kiệm năng lượng tính toán trên thiết bị biên một cách có bảo chứng toán học:
1. Mệnh đề 1 chuyển đổi bài toán kiểm tra độ bất biến của mạng nơ-ron thành bài toán tìm cận dưới của $K - 1$ hàm biên độ đối kháng $g_{aj}(x)$.
2. Việc khai thác chuẩn kép $\ell_1$ và $\ell_2$ qua hàm hỗ trợ của tập lồi cho phép tính toán cận dưới một cách giải tích đóng, triệt tiêu nhu cầu chạy các thuật toán tối ưu lặp tốn kém tại thời điểm suy luận.
3. Ranh giới an toàn cần tính đến sai số làm tròn $2\eta$ của số thực dấu phẩy động IEEE 754 để loại trừ hoàn toàn nguy cơ sai lệch phân loại do phần cứng.

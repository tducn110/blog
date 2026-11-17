---
title: "Sổ Tay Công Thức Cốt Lõi Học Máy Midterm: Bảng Tra Cứu 20+ Phương Trình Hạt Nhân"
description: "Bản tổng hợp tra cứu toàn bộ 20+ công thức toán học trọng tâm của chương trình Machine Learning Midterm: Từ tích vô hướng không gian hàm, Newton-Raphson, MLE Gaussian, Khoảng cách có dấu r, LDA/QDA, Naive Bayes đến Hessian Cross-Entropy và IRLS."
publishDate: 2026-11-15T12:00:00+07:00
order: 2
category: "engineering"
tags: ["MachineLearning", "ML-Midterm", "Mathematics", "Probability", "Optimization", "Cheatsheet"]
featured: false
recommendedFont: "academic"
lang: "vi"
---

> **BỘ 3 CẨM NANG ÔN TẬP MACHINE LEARNING MIDTERM (VNUK 2026)**  
> Nhằm phục vụ việc ôn tập cấp tốc, kiến thức ôn thi Midterm được phân tầng thành 3 chuyên đề độc lập, thống nhất dưới nhãn tag `MachineLearning`:
> 
> 1. **Bài 1 (Tổng quan kiến trúc):** [Tổng Quan Ôn Tập Midterm: Bản Đồ Tri Thức 12 Bài Giảng & 11 Điểm Gãy Đổ Hệ Thống](/posts/on-tap-hoc-may-midterm-toan-dien/)
> 2. **Bài 2 (Bài viết này):** [Sổ Tay Công Thức Cốt Lõi Học Máy Midterm: Bảng Tra Cứu 20+ Phương Trình Hạt Nhân](/posts/so-tay-cong-thuc-hoc-may-midterm/)
> 3. **Bài 3 (Giải mã trực giác):** [Giải Mã Trực Giác Các Công Thức Học Máy Midterm: Bản Chất Hình Học, Khi Nào Dùng & Bẫy Đề Thi](/posts/giai-ma-truc-giac-cong-thuc-hoc-may-midterm/)
> 
> * **Tải trọn bộ chuyên khảo đầy đủ (111 Trang A4, 553 KB):**  
>   [Tải xuống ML_midterm_vi.pdf (Bản Tiếng Việt 111 Trang A4)](/files/midterms/ML_midterm_vi.pdf) | [English Edition (111 Pages A4)](/files/midterms/ML_midterm_en.pdf)

---

## 1. Bảng Tra Cứu Toàn Bộ 20 Công Thức Hạt Nhân (Master Cheatsheet)

Bảng tra cứu dưới đây hệ thống hóa toàn bộ các công thức toán học cốt lõi của môn học, giúp sinh viên và kỹ sư ôn tập nhanh, định vị chính xác vị trí chứng minh giải tích trong file tài liệu chuyên khảo 111 trang:

| Khái Niệm / Phương Trình | Công Thức Toán Học Chuẩn | Ý Nghĩa / Bản Chất Trực Giác | Vị Trí Chứng Minh Trong PDF 111 Trang |
| :--- | :--- | :--- | :--- |
| **Tích Vô Hướng Không Gian Hàm** | $\langle f, g \rangle = \int_{\mathcal{X}} f(x) g(x) \, dx$ | Đo lường mức độ tương đồng và tính trực giao trong không gian Hilbert vô hạn chiều. | Chương 2, tr. 14 |
| **Bước Lặp Newton-Raphson** | $\mathbf{w}_{t} = \mathbf{w}_{t-1} - \mathbf{H}^{-1} \nabla E(\mathbf{w}_{t-1})$ | Xấp xỉ Taylor bậc hai dùng độ cong Hessian để hội tụ siêu tốc tới điểm cực trị. | Chương 3, tr. 18 |
| **Quy Tắc Cộng Xác Suất** | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ | Xác suất biến cố hợp qua nguyên lý bù trừ (thu về tổng đơn nếu hai biến cố xung khắc). | Chương 4, tr. 22 |
| **Quy Tắc Cộng Biên Duyên** | $P(X=x) = \sum_y P(X=x \mid Y=y)P(Y=y)$ | Luật xác suất toàn phần: triệt tiêu biến phụ $Y$ bằng cách tính tổng trên phân hoạch. | Chương 4, tr. 23 |
| **Định Lý Bayes Cổ Điển** | $P(Y \mid X) = \frac{P(X \mid Y)P(Y)}{\sum_{y'} P(X \mid y')P(y')}$ | Đảo ngược xác suất có điều kiện: Cập nhật niềm tin tiên nghiệm thành hậu nghiệm. | Chương 4, tr. 23 |
| **Shannon Entropy** | $H(X) = - \sum_{i} P(x_i) \log_2 P(x_i)$ | Thước đo độ bất định kỳ vọng, mức độ hỗn loạn thông tin, hoặc số bit bất ngờ. | Chương 4, tr. 24 |
| **Ước Lượng Hợp Lý Cực Đại MLE** | $\hat{\boldsymbol{\theta}}_{\text{MLE}} = \arg\max_{\boldsymbol{\theta}} \sum_{n=1}^N \ln p(\mathbf{x}_n; \boldsymbol{\theta})$ | Tối đa hóa xác suất đồng thời quan sát được tập dữ liệu thực nghiệm mẫu. | Chương 5, tr. 27 |
| **Khoảng Cách Đại Số Có Dấu** | $r = \frac{\mathbf{w}^T \mathbf{x} + w_0}{\|\mathbf{w}\|_2} = \frac{g(\mathbf{x})}{\|\mathbf{w}\|_2}$ | Độ lệch đại số vuông góc từ điểm $\mathbf{x}$ tới siêu phẳng ranh giới quyết định $\mathcal{P}$. | Phụ lục A, tr. 84 |
| **Tính Lồi Của Vùng Quyết Định** | $\mathbf{x} = \alpha \mathbf{x}_A + (1-\alpha)\mathbf{x}_B \in \mathcal{R}_k$ | Đoạn thẳng nối 2 điểm bất kỳ trong vùng luôn thuộc vùng; không có lỗ hổng. | Phụ lục B, tr. 86 |
| **Nghiệm Giải Tích Least Squares** | $\mathbf{W}^* = (\tilde{\mathbf{X}}^T \tilde{\mathbf{X}})^{-1} \tilde{\mathbf{X}}^T \mathbf{T} = \tilde{\mathbf{X}}^\dagger \mathbf{T}$ | Nghiệm đóng tối thiểu hóa MSE qua giả nghịch đảo Moore-Penrose. | Phụ lục C, tr. 88 |
| **Hàm Kích Hoạt Sigmoid** | $\sigma(a) = \frac{1}{1 + e^{-a}}, \; a = \ln \frac{p(\mathbf{x} \mid C_1)P(C_1)}{p(\mathbf{x} \mid C_2)P(C_2)}$ | Cầu nối biến đổi định lý Bayes từ mô hình sinh thành hàm kích hoạt Sigmoid. | Chương 9, tr. 45 |
| **Hàm Softmax Đa Lớp** | $P(C_k \mid \mathbf{x}) = \frac{\exp(a_k)}{\sum_j \exp(a_j)}, \; a_k = \ln [p(\mathbf{x} \mid C_k)P(C_k)]$ | Ánh xạ vector điểm số logit thực vào đơn vị xác suất đơn hình (tổng bằng 1). | Chương 9, tr. 47 |
| **Ranh Giới Tuyến Tính LDA** | $(\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2)^T \boldsymbol{\Sigma}^{-1} \mathbf{x} + \text{bias} = 0$ | Số hạng bậc hai $\mathbf{x}^T \boldsymbol{\Sigma}^{-1} \mathbf{x}$ tự triệt tiêu do dùng chung ma trận $\boldsymbol{\Sigma}$. | Phụ lục D, tr. 90 |
| **Ranh Giới Mặt Cong Bậc Hai QDA** | $\mathbf{x}^T (\boldsymbol{\Sigma}_2^{-1} - \boldsymbol{\Sigma}_1^{-1}) \mathbf{x} + \mathbf{w}^T \mathbf{x} + w_0 = 0$ | Ma trận $\boldsymbol{\Sigma}_k$ riêng biệt giữ lại dạng toàn phương, sinh ra mặt cong bậc hai. | Phụ lục E, tr. 92 |
| **MLE Cho Mô Hình GDA** | $\boldsymbol{\mu}_k = \frac{\sum_{y_n=k} \mathbf{x}_n}{N_k}, \; \boldsymbol{\Sigma} = \frac{1}{N}\sum_k \mathbf{S}_k$ | Nghiệm giải tích dạng đóng cho vector trọng tâm cụm và ma trận tán xạ gộp. | Phụ lục F, tr. 95 |
| **Giả Thiết Độc Lập Naive Bayes** | $P(\mathbf{x} \mid C_k) = \prod_{d=1}^D P(x_d \mid C_k)$ | Độc lập có điều kiện phân rã mật độ $D$ chiều thành tích của $D$ mật độ 1 chiều. | Chương 11, tr. 54 |
| **Kỹ Thuật Làm Mịn Laplace** | $\hat{\theta}_{kd} = \frac{N_{kd} + \alpha}{N_k + \alpha K}$ | Tiên nghiệm Dirichlet loại bỏ hiện tượng triệt tiêu xác suất về 0 khi gặp từ mới. | Phụ lục G, tr. 98 |
| **Mất Mát Cross-Entropy (Logistic)** | $E(\mathbf{w}) = - \sum_{n=1}^N \big[ t_n \ln y_n + (1-t_n)\ln(1-y_n) \big]$ | Hàm đối ngẫu âm log-likelihood của phân phối xác suất Bernoulli. | Chương 13, tr. 62 |
| **Gradient Của Hồi Quy Logistic** | $\nabla_{\mathbf{w}} E(\mathbf{w}) = \mathbf{X}^T (\mathbf{y} - \mathbf{t}) = \sum_{n=1}^N (y_n - t_n) \mathbf{x}_n$ | Vector sai số dự báo $(\mathbf{y} - \mathbf{t})$ nhân tích vô hướng với vector đặc trưng. | Phụ lục H, tr. 101 |
| **Ma Trận Hessian Hồi Quy Logistic** | $\mathbf{H} = \mathbf{X}^T \mathbf{R} \mathbf{X}, \quad R_{nn} = y_n(1-y_n)$ | Ma trận hiệp phương sai có trọng số; nửa xác định dương đảm bảo lồi toàn cục. | Phụ lục H, tr. 102 |
| **Phương Trình Cập Nhật IRLS** | $\mathbf{w}^{(\text{new})} = (\mathbf{X}^T \mathbf{R} \mathbf{X})^{-1} \mathbf{X}^T \mathbf{R} \mathbf{z}$ | Chuyển đổi tối ưu hóa Newton-Raphson thành bài toán bình phương tối thiểu lặp. | Phụ lục H, tr. 103 |
| **Hệ Số Xác Định $R^2$** | $R^2 = 1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}} = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$ | Tỷ lệ phương sai của biến mục tiêu được giải thích bởi mô hình hồi quy. | Chương 16, tr. 75 |

---

## 2. Chi Tiết Các Nhóm Công Thức Trọng Tâm

### Nhóm 1: Đại Số Tuyến Tính, Không Gian Hàm & Tối Ưu Hóa
- **Tích vô hướng hàm số**:
  $$\langle f, g \rangle = \int_{\mathcal{X}} f(x) g(x) \, dx \implies \|f\|_{L_2} = \sqrt{\langle f, f \rangle}$$
- **Hệ hàm cơ sở (Basis Expansion)**:
  $$f(x) = \sum_{j=1}^M w_j \phi_j(x) = \mathbf{w}^T \boldsymbol{\phi}(x)$$
- **Ma trận Gram**:
  $$G_{ij} = \langle \phi_i, \phi_j \rangle \implies \mathbf{G} \succeq 0 \quad (\text{Positive Semi-Definite})$$
- **Bước lặp Newton-Raphson đa biến**:
  $$\mathbf{w}_{t} = \mathbf{w}_{t-1} - \mathbf{H}^{-1} \nabla E(\mathbf{w}_{t-1}), \quad \mathbf{H}_{ij} = \frac{\partial^2 E}{\partial w_i \partial w_j}$$

### Nhóm 2: Xác Suất, Entropy & Hợp Lý Cực Đại (MLE)
- **Quy tắc cộng (Addition Rule)**:
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
- **Quy tắc cộng biên duyên (Sum Rule / Marginalization)**:
  $$P(X=x) = \sum_{y} P(X=x, Y=y) = \sum_{y} P(X=x \mid Y=y)P(Y=y)$$
- **Định lý Bayes (Bayes' Theorem)**:
  $$P(Y=k \mid X=x) = \frac{P(X=x \mid Y=k) P(Y=k)}{\sum_{j} P(X=x \mid Y=j) P(Y=j)}$$
- **Shannon Entropy**:
  $$H(X) = - \sum_{i=1}^n P(x_i) \log_2 P(x_i)$$
- **Nghiệm đóng MLE cho phân phối chuẩn đa biến $\mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$**:
  $$\hat{\boldsymbol{\mu}}_{\text{MLE}} = \frac{1}{N}\sum_{n=1}^N \mathbf{x}_n, \quad \hat{\boldsymbol{\Sigma}}_{\text{MLE}} = \frac{1}{N}\sum_{n=1}^N (\mathbf{x}_n - \hat{\boldsymbol{\mu}})(\mathbf{x}_n - \hat{\boldsymbol{\mu}})^T$$

### Nhóm 3: Hình Học Ranh Giới Quyết Định & Phân Loại Tuyến Tính
- **Phương trình siêu phẳng ranh giới quyết định $\mathcal{P}$**:
  $$g(\mathbf{x}) = \mathbf{w}^T \mathbf{x} + w_0 = 0$$
- **Khoảng cách có dấu (Signed Distance)**:
  $$r = \frac{g(\mathbf{x})}{\|\mathbf{w}\|_2} = \frac{\mathbf{w}^T \mathbf{x} + w_0}{\|\mathbf{w}\|_2}$$
- **Nghiệm OLS Normal Equation cho phân loại Least Squares**:
  $$\mathbf{W}^* = (\tilde{\mathbf{X}}^T \tilde{\mathbf{X}})^{-1} \tilde{\mathbf{X}}^T \mathbf{T} = \tilde{\mathbf{X}}^\dagger \mathbf{T}$$

### Nhóm 4: Các Mô Hình Sinh Xác Suất (GLM, GDA, Naive Bayes)
- **Dẫn xuất Sigmoid từ tỉ số Log-Odds**:
  $$P(C_1 \mid \mathbf{x}) = \frac{1}{1 + \exp(-a)}, \quad a = \ln \frac{p(\mathbf{x} \mid C_1)P(C_1)}{p(\mathbf{x} \mid C_2)P(C_2)}$$
- **Dẫn xuất Softmax cho $K$ lớp**:
  $$P(C_k \mid \mathbf{x}) = \frac{\exp(a_k)}{\sum_{j=1}^K \exp(a_j)}, \quad a_k = \ln \big[ p(\mathbf{x} \mid C_k)P(C_k) \big]$$
- **Hàm phân biệt tuyến tính LDA ($\boldsymbol{\Sigma}$ chung)**:
  $$g_k(\mathbf{x}) = \mathbf{w}_k^T \mathbf{x} + w_{k0}, \quad \mathbf{w}_k = \boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}_k, \quad w_{k0} = -\frac{1}{2}\boldsymbol{\mu}_k^T \boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}_k + \ln P(C_k)$$
- **Hàm phân biệt mặt bậc hai QDA ($\boldsymbol{\Sigma}_k$ riêng)**:
  $$g_k(\mathbf{x}) = -\frac{1}{2}\mathbf{x}^T \boldsymbol{\Sigma}_k^{-1} \mathbf{x} + \boldsymbol{\mu}_k^T \boldsymbol{\Sigma}_k^{-1} \mathbf{x} - \frac{1}{2}\boldsymbol{\mu}_k^T \boldsymbol{\Sigma}_k^{-1}\boldsymbol{\mu}_k - \frac{1}{2}\ln|\boldsymbol{\Sigma}_k| + \ln P(C_k)$$
- **Làm mịn Laplace cho Naive Bayes (Laplace Smoothing)**:
  $$\hat{\theta}_{kd} = \frac{N_{kd} + 1}{N_k + K}$$

### Nhóm 5: Các Mô Hình Phân Biệt Xác Suất & Hồi Quy Logistic
- **Hàm mất mát Cross-Entropy nhị phân (Binary Cross-Entropy Loss)**:
  $$E(\mathbf{w}) = - \sum_{n=1}^N \Big[ t_n \ln y_n + (1 - t_n) \ln(1 - y_n) \Big], \quad y_n = \sigma(\mathbf{w}^T \mathbf{x}_n)$$
- **Đạo hàm Gradient giải tích**:
  $$\nabla_{\mathbf{w}} E(\mathbf{w}) = \mathbf{X}^T (\mathbf{y} - \mathbf{t}) = \sum_{n=1}^N (y_n - t_n) \mathbf{x}_n$$
- **Ma trận Hessian có trọng số**:
  $$\mathbf{H} = \nabla_{\mathbf{w}}^2 E(\mathbf{w}) = \mathbf{X}^T \mathbf{R} \mathbf{X}, \quad \mathbf{R} = \operatorname{diag}\big(y_1(1-y_1), \dots, y_N(1-y_N)\big)$$
- **Biến mục tiêu hiệu chỉnh trong IRLS**:
  $$\mathbf{z} = \mathbf{X}\mathbf{w} - \mathbf{R}^{-1}(\mathbf{y} - \mathbf{t})$$
- **Bước cập nhật trọng số IRLS**:
  $$\mathbf{w}^{(\text{new})} = (\mathbf{X}^T \mathbf{R} \mathbf{X})^{-1} \mathbf{X}^T \mathbf{R} \mathbf{z}$$

### Nhóm 6: Thước Đo Hiệu Năng & Đánh Giá Mô Hình
- **Hệ số xác định hồi quy $R^2$**:
  $$R^2 = 1 - \frac{\sum_{i=1}^N (y_i - \hat{y}_i)^2}{\sum_{i=1}^N (y_i - \bar{y})^2}$$
- **Dải dung sai phát hiện bất thường cảm biến $3\sigma$**:
  $$\text{Upper Limit} = \hat{y}(t) + 3\sigma_e, \quad \text{Lower Limit} = \hat{y}(t) - 3\sigma_e, \quad \sigma_e = \sqrt{\frac{1}{N-d-1}\sum_{i=1}^N e_i^2}$$
- **Bộ ba chỉ số phân loại Precision, Recall và $F_1$**:
  $$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$
- **Macro-$F_1$ vs. Weighted-$F_1$**:
  $$F_{1, \text{Macro}} = \frac{1}{K}\sum_{k=1}^K F_{1, k}, \quad F_{1, \text{Weighted}} = \sum_{k=1}^K \frac{N_k}{N} F_{1, k}$$

---

## 3. Xem Chi Tiết Chứng Minh Giải Tích

Nếu bạn cần tra cứu toàn văn các bước biến đổi đại số khép kín, đạo hàm từng bước và minh họa hình học vector không đè chữ, vui lòng tải tài liệu chuyên khảo chính thức:

* **Bản Tiếng Việt (111 Trang A4):** [Tải ML_midterm_vi.pdf](/files/midterms/ML_midterm_vi.pdf)
* **Bản Tiếng Anh (111 Pages A4):** [Download ML_midterm_en.pdf](/files/midterms/ML_midterm_en.pdf)
* **Đọc bài phân tích trực giác:** [Giải Mã Trực Giác Các Công Thức Học Máy Midterm: Bản Chất Hình Học, Khi Nào Dùng & Bẫy Đề Thi](/posts/giai-ma-truc-giac-cong-thuc-hoc-may-midterm/)
* **Đọc bài tổng quan kiến trúc:** [Tổng Quan Ôn Tập Midterm: Bản Đồ Tri Thức 12 Bài Giảng & 11 Điểm Gãy Đổ Hệ Thống](/posts/on-tap-hoc-may-midterm-toan-dien/)

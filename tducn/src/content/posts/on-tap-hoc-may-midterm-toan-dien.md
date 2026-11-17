---
title: "Tổng Quan Ôn Tập Học Máy Midterm: Bản Đồ Tri Thức 12 Bài Giảng & 11 Điểm Gãy Đổ Hệ Thống"
description: "Khung tóm tắt toàn cảnh chương trình Midterm Machine Learning: Bản đồ đối chiếu 12 bài giảng, cấu trúc 6 Phần & 17 Chương, phân loại 4 nhóm mô hình (LL, NL, NN, LN) và phân tích sâu sắc 11 lỗi hệ thống thực chiến (Data Leakage, Masking Effect, Overfitting tách tuyến tính, ma trận hiệp phương sai suy biến)."
publishDate: 2026-11-15T16:00:00+07:00
order: 4
category: "engineering"
tags: ["MachineLearning", "ML-Midterm", "Mathematics", "Optimization", "Classification", "DataLeakage"]
featured: true
recommendedFont: "academic"
lang: "vi"
translationSlug: "machine-learning-midterm-comprehensive-guide"
---

> **BỘ 3 CẨM NANG ÔN TẬP MACHINE LEARNING MIDTERM (VNUK 2026)**  
> Nhằm phục vụ việc ôn tập cấp tốc, kiến thức ôn thi Midterm được phân tầng thành 3 chuyên đề độc lập, thống nhất dưới nhãn tag `MachineLearning`:
> 
> 1. **Bài 1 (Bài viết này):** [Tổng Quan Ôn Tập Midterm: Bản Đồ Tri Thức 12 Bài Giảng & 11 Điểm Gãy Đổ Hệ Thống](/posts/on-tap-hoc-may-midterm-toan-dien/)
> 2. **Bài 2 (Sổ tay tra cứu):** [Sổ Tay Công Thức Cốt Lõi Học Máy Midterm: Bảng Tra Cứu 20+ Phương Trình Hạt Nhân](/posts/so-tay-cong-thuc-hoc-may-midterm/)
> 3. **Bài 3 (Giải mã trực giác):** [Giải Mã Trực Giác Các Công Thức Học Máy Midterm: Bản Chất Hình Học, Khi Nào Dùng & Bẫy Đề Thi](/posts/giai-ma-truc-giac-cong-thuc-hoc-may-midterm/)
> 
> * **Tải trọn bộ chuyên khảo đầy đủ (111 Trang A4, 553 KB):**  
>   [Tải xuống ML_midterm_vi.pdf (Bản Tiếng Việt 111 Trang A4)](/files/midterms/ML_midterm_vi.pdf) | [English Edition (111 Pages A4)](/files/midterms/ML_midterm_en.pdf)

---

## 1. Lời Tựa & Tầm Nhìn Kiến Trúc Môn Học

Trong bối cảnh kỷ nguyên AI bùng nổ, việc tiếp cận Machine Learning đơn thuần như một kỹ thuật lập trình "hộp đen" — nạp dữ liệu vào thư viện `scikit-learn`, gọi hàm `fit()` rồi đọc độ chính xác `score()` — tạo ra những ảo tưởng nguy hiểm về năng lực mô hình. Khi triển khai vào môi trường sản xuất thực tế (production), các hệ thống này nhanh chóng sụp đổ do <mark class="hl-warn">rò rỉ dữ liệu (data leakage)</mark>, phân phối suy biến (distribution shift) hoặc mất kiểm soát trước các mẫu ngoại lai (outliers).

Bộ tài liệu chuyên khảo **Machine Learning Midterm (111 trang A4)** tại VNUK được xây dựng nhằm xác lập lại nền tảng học thuật chuẩn mực, kết nối chặt chẽ giữa:
1. **Bản chất Toán học Trừu tượng**: Xem học máy là quá trình tìm kiếm tự động trong không gian hàm (Function Space), tận dụng đại số ma trận, giải tích đa biến và lý thuyết xác suất Bayes.
2. **Hình học Ranh giới Quyết định**: Giải mã trực giác hình học của các siêu phẳng phân tách, khoảng cách có dấu, tính lồi của các vùng quyết định và sự biến dạng từ ranh giới phẳng sang mặt cong bậc hai.
3. **Động học Tối ưu hóa Khắt khe**: So sánh nghiệm giải tích dạng đóng (OLS Normal Equation, Moore-Penrose Pseudoinverse) với các thuật toán tối ưu hóa lặp bậc hai (Newton-Raphson, IRLS) trên hàm mất mát lồi ngặt.
4. **Kỷ Luật Dữ Liệu Công Nghiệp**: Nhận diện các lỗi rò rỉ dữ liệu tinh vi trong các pipeline tiền xử lý và thiết lập quy trình kiểm định phần dư $3\sigma$ trên chuỗi tín hiệu cảm biến IoT.

---

## 2. Bản Đồ Tri Thức Đối Chiếu 12 Tài Liệu Bài Giảng Gốc

Toàn bộ chương trình ôn tập được tổng hợp và chuẩn hóa khép kín từ đúng 12 tài liệu bài giảng, notebook và slide gốc của khóa học:

| Tài Liệu Nguồn Gốc | Mô Hình Hóa Toán Học | Phạm Vi Lý Thuyết & Thực Hành | Chương Tương Ứng (111 Trang) |
| :--- | :--- | :--- | :--- |
| `functions_ representation_and_search.pdf` | Bộ ngũ 5-tuple $\langle T, E, \mathcal{F}, P, A \rangle$ | Mô hình hóa AI thành bài toán tìm kiếm hàm số trong không gian giả thuyết $\mathcal{F}$. | Chương 1 |
| `DataChallenge22_Function_...pdf` | Không gian Vector & Metric Hilbert | Tích vô hướng hàm, chuẩn $L_2$, hệ hàm cơ sở, ma trận Gram, bất đẳng thức Cauchy-Schwarz. | Chương 2 |
| `review.pdf` | Xác Suất & Tối Ưu Vi Tích Phân | Quy tắc cộng/nhân, định lý Bayes, Entropy, đạo hàm Gradient, ma trận Hessian và Newton-Raphson. | Chương 3 & Chương 4 |
| `MLE.html` | Nguyên Lý Hợp Lý Cực Đại | Hàm Likelihood, hàm số điểm Score, ước lượng giải tích vs. mô phỏng Monte Carlo, định lý CLT. | Chương 5 |
| `Chapter05_Classification_...pdf` | Hình Học Quyết Định Tuyến Tính | Phân loại Generative vs. Discriminative, khoảng cách có dấu $r$, OvR/OvO, 3 nhược điểm OLS. | Chương 6, 7 & 8 |
| `Chapter 06.pdf` | Mô Hình Tuyến Tính Tổng Quát (GLM) | Họ hàm mũ Exponential Family, dẫn xuất hàm Sigmoid và Softmax trực tiếp từ định lý Bayes. | Chương 9 |
| `Chapter06_Probabilistic_...pdf` | Phân Tích Phân Biệt Gauss (GDA) | Mật độ Gauss có điều kiện, ma trận hiệp phương sai gộp $\boldsymbol{\Sigma}$ (LDA) vs. riêng $\boldsymbol{\Sigma}_k$ (QDA). | Chương 10 |
| `NB.pdf` | Bộ Phân Loại Naive Bayes | Giả thiết độc lập có điều kiện, mô hình Bernoulli/Đa thức, kỹ thuật làm mịn Laplace. | Chương 11 |
| `Data-challenge_IntroML.pptx.pdf` | Thước Đo Đánh Giá Mô Hình | Ma trận nhầm lẫn, Precision, Recall, Macro-$F_1$, bẫy mất cân bằng dữ liệu, đường cong ROC-AUC. | Chương 12 |
| `Chapter 07.pdf` | Hồi Quy Logistic & Thuật Toán IRLS | MLE Logistic, mất mát Cross-Entropy, ma trận Hessian lồi ngặt $\mathbf{X}^T\mathbf{R}\mathbf{X}$, tối ưu lặp bậc hai IRLS. | Chương 13, 14 & 15 |
| `untitled0.py` | Lab 1: Hồi Quy Đa Thức Cảm Biến | Thử nghiệm bậc đa thức ($d=2\dots6$), các chỉ số $R^2$/MSE/MAE, kiểm định phân phối phần dư, ngưỡng $3\sigma$. | Chương 16 |
| `Classification.html` | Lab 2: Pipeline Phân Loại Adult Census | So sánh 7 thuật toán phân loại, mổ xẻ lỗi rò rỉ dữ liệu (Data Leakage) khi fit scaler trước split. | Chương 17 |

---

## 3. Cấu Trúc Khung 6 Phần Lớn & 17 Chương Chuyên Đề

Chương trình học tập được tổ chức thành một chuỗi nhận thức liền mạch từ trừu tượng đến cụ thể:

* **PHẦN I: Cơ Sở Toán Học và Không Gian Hàm (Chương 1 – 3)**: Định nghĩa học máy qua bộ ngũ $\langle T, E, \mathcal{F}, P, A \rangle$, biểu diễn hàm số bằng tổ hợp tuyến tính các hàm cơ sở $\mathbf{w}^T\boldsymbol{\phi}(\mathbf{x})$, và điều kiện cực trị bậc hai thông qua ma trận Hessian $\mathbf{H}$.
* **PHẦN II: Lý Thuyết Xác Suất và Nguyên Lý MLE (Chương 4 – 5)**: Hệ tiên đề xác suất Kolmogorov, quy tắc cộng biên duyên (Marginalization), định lý Bayes, Shannon Entropy, nguyên lý cực đại hóa hàm hợp lý MLE và nghiệm giải tích cho phân phối chuẩn $\mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$.
* **PHẦN III: Mô Hình Phân Loại Tuyến Tính & Hình Học (Chương 6 – 8)**: Tách biệt Inference vs. Decision, hàm tổn thất Bayes Risk, hình học khoảng cách có dấu $r = \frac{g(\mathbf{x})}{\|\mathbf{w}\|_2}$, chứng minh tính lồi của các vùng quyết định, và phân tích 3 lý do Least Squares thất bại trong phân loại.
* **PHẦN IV: Các Mô Hình Sinh Xác Suất (Chương 9 – 12)**: Dẫn xuất Sigmoid và Softmax từ định lý Bayes, Phân tích phân biệt Gauss GDA (sự triệt tiêu số hạng bậc hai trong LDA vs. mặt cong bậc hai trong QDA), Naive Bayes cùng kỹ thuật làm mịn Laplace, và cạm bẫy của Accuracy trên dữ liệu mất cân bằng.
* **PHẦN V: Mô Hình Phân Biệt Xác Suất & Hồi Quy Logistic (Chương 13 – 15)**: Mô hình hóa trực tiếp xác suất hậu nghiệm $P(C_1 \mid \mathbf{x})$, đạo hàm Gradient Cross-Entropy, chứng minh tính lồi ngặt của ma trận Hessian $\mathbf{H} = \mathbf{X}^T\mathbf{R}\mathbf{X} \succ 0$, và thuật toán tối ưu hóa Newton-Raphson chuyển thành IRLS.
* **PHẦN VI: Thực Hành Mã Nguồn & Dự Án Thực Chiến (Chương 16 – 17)**: 
  - *Lab 1 (`untitled0.py`)*: Phân tích hồi quy đa thức trên tín hiệu cảm biến IoT, nhận diện hiện tượng dao động Runge ở biên, và thiết lập dải dung sai cảnh báo bất thường $3\sigma$.
  - *Lab 2 (`Classification.html`)*: Kiểm toán toàn diện lỗi rò rỉ dữ liệu (Data Leakage) trong pipeline tiền xử lý bộ dữ liệu Adult Census Income.
* **PHẦN PHỤ LỤC (Phụ lục A – H)**: 8 chứng minh toán học khép kín hoàn chỉnh (Khoảng cách $r$, Tính lồi, Nghiệm đóng Moore-Penrose, Triệt tiêu bậc hai LDA, Phân rã mặt bậc hai QDA, MLE GDA, Phân phối Beta-Binomial Laplace, và Hessian lồi ngặt).

---

## 4. Ma Trận Phân Loại 4 Nhóm Mô Hình Khóa Học (LL, NL, NN, LN)

Chương 15 tổng kết toàn bộ các mô hình phân loại được học vào một bảng ma trận 4 góc phần tư dựa trên: (1) Tính tuyến tính của ranh giới quyết định (Decision Boundary) và (2) Bản chất tham số của mật độ xác suất điều kiện lớp (Class-Conditional Density):

| Góc Phần Tư | Bản Chất Ranh Giới Quyết Định | Bản Chất Phân Phối Điều Kiện Lớp | Mô Hình Tiêu Biểu Trong Khóa Học |
| :---: | :--- | :--- | :--- |
| **LL (Linear-Linear)** | Siêu phẳng tuyến tính phẳng: $\mathbf{w}^T\mathbf{x} + w_0 = 0$ | Tham số tuyến tính / Phân phối Gauss dùng chung hiệp phương sai $\boldsymbol{\Sigma}$ | **LDA (Linear Discriminant Analysis)**, **Hồi quy Logistic** (không biến đổi phi tuyến cơ sở). |
| **NL (Nonlinear-Linear)** | Mặt cong bậc hai (Paraboloid, Hyperboloid, Ellipsoid) | Tham số đa biến Gauss với ma trận hiệp phương sai riêng $\boldsymbol{\Sigma}_k$ | **QDA (Quadratic Discriminant Analysis)**. |
| **NN (Nonlinear-Nonparametric)** | Ranh giới uốn lượn phi tuyến phức tạp | Phi tham số (Non-parametric) / Xấp xỉ theo mật độ lân cận | **K-Nearest Neighbors (k-NN)**, Parzen Window, RBF Kernel SVM. |
| **LN (Linear-Nonparametric)** | Siêu phẳng phân tách tuyến tính phẳng | Phi tham số cục bộ / Không giả định dạng phân phối giải tích | **Linear SVM** (biên cực đại), Perceptron cổ điển. |

---

## 5. Hệ Thống 11 Lỗi Hệ Thống & Điểm Gãy Đổ Thực Chiến (ML Engineering Failure Modes)

Khả năng chẩn đoán chính xác lý do một hệ sinh thái học máy gãy đổ là thước đo năng lực của một kỹ sư Machine Learning. Dưới đây là 11 lỗi nghiêm trọng nhất được tổng hợp từ 12 bài giảng:

### 1. Overfitting Trên Dữ Liệu Tách Biệt Tuyến Tính (Hồi Quy Logistic)
- **Cơ chế:** Khi dữ liệu huấn luyện phân tách hoàn hảo bởi một siêu phẳng, hàm mất mát Cross-Entropy luôn có thể giảm về 0 bằng cách nhân vector trọng số với một hệ số khuếch đại vô hạn $c \to \infty$:
  $$\lim_{c \to \infty} \sigma(c \mathbf{w}^T \mathbf{x}_n) = t_n \implies E(c \mathbf{w}) \to 0$$
  Hậu quả là nghiệm Maximum Likelihood bị phân kỳ: độ dài vector tham số bùng nổ $\|\mathbf{w}\|_2 \to \infty$, khiến ma trận Hessian $\mathbf{H} = \mathbf{X}^T\mathbf{R}\mathbf{X}$ suy biến vì các phần tử phương sai $R_{nn} = y_n(1-y_n) \to 0$.
- **Triệu chứng:** Mô hình dự đoán với độ tự tin cực đoan phi lý ($P = 1.0000$ hoặc $0.0000$), mất hoàn toàn khả năng tổng quát hóa trên dữ liệu mới.
- **Khắc phục:** Bắt buộc áp dụng điều chuẩn $L_2$ Ridge Penalty $\frac{\lambda}{2}\|\mathbf{w}\|_2^2$, ép ma trận Hessian $\mathbf{X}^T\mathbf{R}\mathbf{X} + \lambda \mathbf{I}$ luôn khả nghịch và chặn không cho trọng số bùng nổ.

### 2. Rò Rỉ Dữ Liệu (Data Leakage) Trong Pipeline Tiền Xử Lý
- **Cơ chế:** Thực hiện các phép biến đổi thống kê phụ thuộc vào toàn bộ tập dữ liệu TRƯỚC KHI phân chia train/test split. Điển hình trong tệp `Classification.html`:
  1. Gọi `StandardScaler.fit_transform()` trên toàn bộ 100% dữ liệu (rò rỉ giá trị trung bình $\mu$ và độ lệch chuẩn $\sigma$ của tập kiểm thử vào tập huấn luyện).
  2. Điền giá trị khuyết thiếu (nhãn `'?'`) bằng Mode của toàn bộ tập dữ liệu.
  3. Áp dụng nhân bản mẫu `RandomOverSampler` trước khi split, khiến các mẫu nhân bản giống hệt nhau cùng lúc xuất hiện ở cả tập train lẫn tập test.
- **Hậu quả:** Độ chính xác kiểm thử nội bộ đạt mức cao giả tạo ($98\%+$), nhưng mô hình sụp đổ hoàn toàn khi đưa vào môi trường thực tế.
- **Khắc phục:** Tuân thủ nguyên tắc "Split-first": Chỉ fit các bộ tiền xử lý trên tập train, sau đó gọi `transform()` trên tập test thông qua `sklearn.pipeline.Pipeline`.

### 3. Hiện Tượng Che Lấp Lớp (Masking Effect) Trong Least Squares
- **Cơ chế:** Khi phân loại $K \ge 3$ lớp bằng hồi quy Least Squares mã hóa One-hot, nếu 3 cụm lớp nằm thẳng hàng và lớp $C_2$ bị kẹp ở giữa $C_1$ và $C_3$, độ dốc lớn của hai hàm $g_1$ và $g_3$ sẽ áp đảo hoàn toàn hàm $g_2$:
  $$g_2(\mathbf{x}) < \max\big( g_1(\mathbf{x}), g_3(\mathbf{x}) \big), \quad \forall \mathbf{x} \in \mathbb{R}^D$$
- **Hậu quả:** Vùng quyết định của lớp trung gian bị xóa sổ hoàn toàn ($\mathcal{R}_2 = \emptyset$). Mô hình không bao giờ phân loại bất kỳ mẫu nào vào lớp $C_2$, dù dữ liệu trên thực tế hoàn toàn khả tách!
- **Khắc phục:** Không dùng Least Squares cho bài toán phân loại đa lớp; thay thế bằng Hồi quy Logistic (Softmax) hoặc Support Vector Machines.

### 4. Méo Ranh Giới Do Điểm Ngoại Lai Trong Phân Loại Bằng Least Squares
- **Cơ chế:** Hàm mất mát sai số bình phương $(y_n - 1)^2$ phạt rất nặng các điểm dữ liệu dù đã được phân loại đúng nhưng nằm quá sâu trong miền an toàn ($y_n \gg 1$). Ví dụ: một điểm có $\hat{y} = 2.5$ với nhãn $t=1$ vẫn bị tính tổn thất $(2.5 - 1.0)^2 = 2.25$.
- **Hậu quả:** Thuật toán buộc phải xoay lệch siêu phẳng ranh giới về phía điểm ngoại lai để giảm sai số bình phương, làm phát sinh hàng loạt lỗi phân loại sai ở các mẫu nhạy cảm nằm sát biên.
- **Khắc phục:** Sử dụng hàm mất mát không phạt mẫu dự đoán đúng như Cross-Entropy hoặc Hinge Loss.

### 5. Suy Biến Ma Trận Hiệp Phương Sai Khi Số Mẫu Nhỏ ($N_k \le D$ Trong QDA)
- **Cơ chế:** QDA yêu cầu tính nghịch đảo ma trận hiệp phương sai riêng $\boldsymbol{\Sigma}_k^{-1} \in \mathbb{R}^{D \times D}$. Khi số mẫu quan sát $N_k$ của lớp $k$ nhỏ hơn số chiều đặc trưng $D$, ma trận hiệp phương sai mẫu chỉ có hạng tối đa $N_k - 1 < D$ và trở thành ma trận suy biến không thể khả nghịch ($\det \boldsymbol{\Sigma}_k = 0$).
- **Khắc phục:** Chuyển sang mô hình LDA (gộp toàn bộ mẫu để ước lượng chung $\boldsymbol{\Sigma}$), sử dụng Gaussian Naive Bayes (chỉ giữ lại các phần tử trên đường chéo), hoặc áp dụng kỹ thuật làm co Ledoit-Wolf ($\hat{\boldsymbol{\Sigma}}_k = (1-\alpha)\boldsymbol{\Sigma}_k + \alpha \mathbf{I}$).

### 6. Triệt Tiêu Xác Suất Về 0 (Zero-Frequency Problem) Trong Naive Bayes
- **Cơ chế:** Xác suất hậu nghiệm Naive Bayes được tính bằng tích chuỗi: $P(\mathbf{x} \mid C_k) = \prod_{d=1}^D P(x_d \mid C_k)$. Nếu chỉ cần một đặc trưng $x_d$ chưa từng xuất hiện cùng lớp $C_k$ trong tập huấn luyện ($N_{kd} = 0$), thì $P(x_d \mid C_k) = 0$.
- **Hậu quả:** Toàn bộ tích xác suất bị nhân với 0 và sụp đổ hoàn toàn về 0, xóa sạch mọi bằng chứng khẳng định mạnh mẽ của $D-1$ đặc trưng còn lại.
- **Khắc phục:** Sử dụng kỹ thuật làm mịn Laplace ($\hat{\theta}_{kd} = \frac{N_{kd} + \alpha}{N_k + \alpha K}$ với $\alpha = 1$) hoặc làm mịn Lidstone ($\alpha < 1$).

### 7. Tràn Số Dưới Số Thực (Arithmetic Floating-Point Underflow)
- **Cơ chế:** Việc nhân liên tiếp hàng chục hoặc hàng trăm xác suất nhỏ ($P < 0.01$) khiến kết quả tính toán nhanh chóng vượt ra ngoài giới hạn biểu diễn của chuẩn số thực IEEE 754 ($10^{-308}$), dẫn tới việc máy tính làm tròn thành số 0 tuyệt đối.
- **Khắc phục:** Luôn chuyển các phép nhân xác suất thành phép cộng trong miền logarit: $\ln P = \sum \ln P_d$, và sử dụng công thức đồng nhất **Log-Sum-Exp** để tính mẫu số một cách ổn định:
  $$\ln \sum_{k=1}^K e^{a_k} = m + \ln \sum_{k=1}^K e^{a_k - m}, \quad \text{with } m = \max_{k} a_k$$

### 8. Hiện Tượng Đa Cộng Tuyến (Multicollinearity) Trong Các Mô Hình Tuyến Tính
- **Cơ chế:** Khi hai hoặc nhiều biến đặc trưng có quan hệ tuyến tính hoàn hảo (như `education` và `education.num` trong `Classification.html`), ma trận thiết kế $\mathbf{X}$ mất hạng cột đầy đủ, khiến ma trận $\mathbf{X}^T\mathbf{X}$ bị suy biến hoặc có số điều kiện ma trận cực lớn ($\kappa \gg 10^4$).
- **Hậu quả:** Phương sai ước lượng của các hệ số trọng số bùng nổ, dấu của trọng số bị đảo ngược ngẫu nhiên, làm sai lệch hoàn toàn việc diễn giải tầm quan trọng của các đặc trưng.
- **Khắc phục:** Kiểm tra ma trận tương quan, tính hệ số phóng đại phương sai VIF, và loại bỏ các cột thông tin trùng lặp trước khi huấn luyện.

### 9. Nghịch Lý Độ Chính Xác (Accuracy Paradox) Trên Dữ Liệu Mất Cân Bằng
- **Cơ chế:** Trong tập dữ liệu mà lớp đa số chiếm tỷ lệ áp đảo (ví dụ $95\%$ nhãn âm, $5\%$ nhãn dương), một mô hình ngu ngốc luôn dự đoán nhãn âm sẽ đạt độ chính xác $95\%$.
- **Khắc phục:** Tuyệt đối không dùng Accuracy làm chỉ số chính; bắt buộc sử dụng Precision, Recall, Macro-$F_1$, PR-AUC, kết hợp với các kỹ thuật gán trọng số lớp (class weights) hoặc tái lấy mẫu phân tầng (Stratified Sampling).

### 10. Hiện Tượng Dao Động Runge Khi Khớp Đa Thức Bậc Cao
- **Cơ chế:** Trong bài toán hồi quy chuỗi thời gian cảm biến (`untitled0.py`), việc tăng bậc đa thức lên quá cao ($d \ge 5$) khiến các số hạng lũy thừa $x^d$ dao động hình sin dữ dội ở hai đầu mút của khoảng thời gian (rạng sáng và nửa đêm).
- **Khắc phục:** Khống chế bậc đa thức ở mức tối ưu ($d = 4$ được chọn trong thực nghiệm `untitled0.py`), sử dụng spline từng đoạn, hoặc áp dụng điều chuẩn Ridge.

### 11. Phần Dư Không Phân Phối Chuẩn & Phương Sai Thay Đổi (Heteroscedasticity)
- **Cơ chế:** Đánh giá mô hình hồi quy chỉ qua chỉ số tổng hợp ($R^2$ hay MSE) mà không kiểm tra hình dạng phân phối của phần dư $e_i = y_i - \hat{y}_i$. Nếu phần dư có trung bình lệch khỏi 0 ($\mu_e \ne 0$) hoặc bị lệch đuôi, các giả định của hồi quy tuyến tính bị vi phạm.
- **Khắc phục:** Vẽ biểu đồ phân phối `sns.displot(residuals)`, xác nhận $\text{Mean} \approx \text{Median} \approx 0$, và thiết lập dải ngưỡng dung sai $\pm 3\sigma$ để phát hiện bất thường tự động như mã nguồn `untitled0.py`.

---

## 6. Đọc Tiếp Các Chuyên Đề Trong Bộ Cẩm Nang

Để tiếp tục chuẩn bị cho kỳ thi Midterm, mời bạn theo dõi hai bài viết chuyên sâu tiếp theo trong bộ 3 cẩm nang:

- **Tra cứu nhanh công thức:** [Sổ Tay Công Thức Cốt Lõi Học Máy Midterm: Bảng Tra Cứu 20+ Phương Trình Hạt Nhân](/posts/so-tay-cong-thuc-hoc-may-midterm/)
- **Hiểu sâu trực giác & bẫy thi:** [Giải Mã Trực Giác Các Công Thức Học Máy Midterm: Bản Chất Hình Học, Khi Nào Dùng & Bẫy Đề Thi](/posts/giai-ma-truc-giac-cong-thuc-hoc-may-midterm/)
- **Tải toàn văn chuyên khảo (111 trang có đủ 8 phụ lục chứng minh toán học):**  
  [Tải ML_midterm_vi.pdf (Tiếng Việt)](/files/midterms/ML_midterm_vi.pdf) | [Tải ML_midterm_en.pdf (English)](/files/midterms/ML_midterm_en.pdf)

---
title: "Giáo Trình Học Máy Toàn Diện: Từ Nền Tảng Toán Học, Tối Ưu Hóa Đến Mạng Sâu & Kiểm Chứng Thực Nghiệm"
description: "Tổng quan chi tiết toàn bộ 93 trang giáo trình học máy chuẩn hóa của VNUK: Lý thuyết ERM, Phân loại Bayes, Phân rã Bias-Variance, Tiền xử lý dữ liệu, Mạng nơ-ron, Tối ưu SGD Momentum, 1D-CNN và Kiểm chứng Rust."
publishDate: 2026-11-15T18:00:00+07:00
order: 5
category: "engineering"
tags: ["MachineLearning", "DeepLearning", "Mathematics", "Optimization", "NeuralNetworks", "PyTorch", "Rust"]
featured: true
recommendedFont: "academic"
lang: "vi"
translationSlug: "machine-learning-comprehensive-curriculum"
---

> **TÀI LIỆU TOÀN VĂN (BẢN CHUẨN XUẤT BẢN THÁNG 11/2026)**  
> Tài liệu gốc dài 93 trang biên soạn bởi **Nhóm Nghiên Cứu AI & Học Máy VNUK (Viện Nghiên Cứu và Đào Tạo Việt – Anh, Đại Học Đà Nẵng)**. Bản in PDF tích hợp đầy đủ công thức toán học, bảng đối sánh, sơ đồ kiến trúc, mã nguồn Rust kiểm thử và ngân hàng 60 câu hỏi ôn tập có lời giải chi tiết.  
> 
> [Tải xuống Giao_Trinh_Machine_Learning_Toan_Dien.pdf (PDF 93 Trang, 457 KB)](/downloads/Giao_Trinh_Machine_Learning_Toan_Dien.pdf)

---

## Lời Tựa & Tầm Nhìn Kiến Trúc

Học máy (Machine Learning) trong các chương trình đào tạo hiện đại không còn là việc gọi các hàm `model.fit()` và `model.predict()` một cách cơ học như những "hộp đen" (Black-box abstractions). Bản chất của học máy là sự kết hợp khắt khe giữa ba trụ cột:
1. **Nền tảng Toán học Thống kê (Statistical Foundations)**: Không gian hàm số, lý thuyết rủi ro thực nghiệm (ERM), phân phối xác suất và nguyên lý ước lượng hợp lý cực đại (MLE).
2. **Động học Tối ưu hóa (Optimization Dynamics)**: Hình học của mặt phẳng hàm mất mát (Loss Surface), phương pháp hạ độ dốc (Gradient Descent), cơ chế quán tính Momentum và các thuật toán thích nghi hiện đại (AdaGrad, RMSprop, Adam).
3. **Kiến trúc Mạng Sâu & Độ Bền Vững (Deep Architectures & Verification)**: Từ tầng Perceptron đa lớp (MLP) đến Mạng tích chập 1D (1D-CNN) xử lý chuỗi thời gian, đi kèm chứng chỉ miền toàn cục (Whole-Domain Certificate) bảo đảm an toàn trước nhiễu dữ liệu.

Bài viết này tổng hợp và phân tích có hệ thống toàn bộ nội dung từ **3 Phần chính (10 Chương)** và **3 Phụ lục thực nghiệm** của cuốn giáo trình.

---

## PHẦN I: NỀN TẢNG HỌC MÁY VÀ LÝ THUYẾT TỐI ƯU HÓA

### 1. Phân Lớp Bài Toán: Học Có Giám Sát và Không Giám Sát

Theo học thuyết Machine Learning hiện đại (Mitchell & Jordan, Science 2015), một bài toán học máy tổng quát được mô hình hóa chặt chẽ dưới dạng một bộ 5 thành phần (5-tuple):

$$

\mathcal{M} = \langle T, E, \mathcal{F}, P, A \rangle

$$


* $T$ (Task – Tác vụ nghiệp vụ): Hồi quy ($f^*: \mathbb{R}^d \to \mathbb{R}$), Phân loại ($f^*: \mathbb{R}^d \to \{1, \dots, K\}$), hoặc nén dữ liệu.
* $E$ (Experience – Dữ liệu quan sát): Tập có nhãn $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^n$ hoặc không nhãn $\mathcal{D} = \{x_i\}_{i=1}^n$.
* $\mathcal{F}$ (Function Space – Không gian hàm ứng viên): Lớp hàm được tham số hóa bởi $\theta \in \Theta$: $\mathcal{F}_\Theta = \{f(x; \theta) : \theta \in \Theta\}$.
* $P$ (Performance Measure – Thước đo hiệu năng): Hàm mất mát $\mathcal{L}(f_\theta, \mathcal{D})$ hoặc các chỉ số định lượng ($R^2$, Accuracy, Macro-F1).
* $A$ (Algorithm – Thuật toán tối ưu): Phương pháp tìm kiếm nghiệm trong không gian hàm, phổ biến nhất là Gradient Descent: $\theta^{(t+1)} = \theta^{(t)} - \eta \nabla_\theta \mathcal{L}(\theta^{(t)})$.

#### Học Máy Là Quá Trình Tìm Kiếm Trong Không Gian Hàm

Máy tính "học" thực chất là quá trình tìm kiếm tự động một hàm số $f^* \in \mathcal{F}$ sao cho năng lực khái quát hóa (*Generalization*) trên dữ liệu tương lai là tối ưu nhất. Để máy tính có thể biểu diễn và thao tác trên không gian hàm trừu tượng (*coordinate-free*), ta sử dụng Không gian vector $\langle V, \mathbb{R}, +, * \rangle$ và Hệ cơ sở (*Basis functions*):

$$

f(x) = \sum_{j=1}^m w_j \phi_j(x)

$$


Dữ liệu được biểu diễn thông qua cấu trúc Tensor nhiều chiều:
* **Tensor bậc 0 (Scalar)**: Đại lượng vô hướng $x \in \mathbb{R}$.
* **Tensor bậc 1 (Vector)**: Vector đặc trưng $d$ chiều của một mẫu quan sát $x \in \mathbb{R}^d$.
* **Tensor bậc 2 (Matrix)**: Bảng dữ liệu mẫu $X \in \mathbb{R}^{n \times d}$ hoặc ảnh xám $[H, W]$.
* **Tensor bậc 3**: Ảnh màu $[C, H, W]$ với $C=3$ (RGB).
* **Tensor bậc 4**: Lô huấn luyện (Batch) ảnh $[B, C, H, W]$ hoặc chuỗi video $[T, C, H, W]$.

#### Cạm Bẫy Nhãn Đích (Target Presence Fallacy)
Giáo trình cảnh báo: *Sự hiện diện của một cột nhãn trong bảng dữ liệu không bắt buộc mọi câu hỏi nghiên cứu đều phải quy về Supervised Learning.* Ngược lại, việc tự ý gán số thứ tự cho các cụm dữ liệu phân hoạch rồi xem đó là nhãn thật không tạo ra chân lý (*ground-truth*) được kiểm chứng khoa học.

---

### 2. Lý Thuyết Cực Tiểu Hóa Rủi Ro Thực Nghiệm (ERM) & Phân Rã Bias-Variance

Mục tiêu tối thượng của học máy thống kê không phải là ghi nhớ dữ liệu huấn luyện mà là đạt được khả năng khái quát hóa (*Generalization*) trên các quan sát độc lập chưa từng thấy trong tương lai.

* **Rủi ro thực nghiệm (Empirical Risk)**:

  $$
  \hat{R}_n(h) = \frac{1}{n} \sum_{i=1}^n \mathcal{L}(h(x_i), y_i)

  $$

* **Rủi ro kỳ vọng / Rủi ro thực tế (Generalization Risk)**:

  $$
  R(h) = \mathbb{E}_{(X,Y) \sim P}[\mathcal{L}(h(X), Y)] = \int_{\mathcal{X} \times \mathcal{Y}} \mathcal{L}(h(x), y) dP(x, y)

  $$


Khoảng cách khái quát hóa $\Delta(h) = R(h) - \hat{R}_n(h)$ biểu thị mức độ quá khớp (*Overfitting*). Khi không gian giả thuyết $\mathcal{H}$ quá phức tạp, $\hat{R}_n(h) \to 0$ nhưng $R(h)$ tăng vọt.

#### Chứng Minh Toán Học: Hàm Hồi Quy Tối Ưu $h^*(x) = \mathbb{E}[y | x]$
Với hàm mất mát bình phương sai số $\mathcal{L}(y, h(x)) = (h(x) - y)^2$, ta thêm bớt đại lượng $\mathbb{E}[y | x]$:

$$

(h(x) - y)^2 = \big((h(x) - \mathbb{E}[y | x]) + (\mathbb{E}[y | x] - y)\big)^2

$$


Bằng Luật Kỳ Vọng Lặp (*Law of Iterated Expectations*), số hạng chéo triệt tiêu hoàn toàn về 0:

$$

\mathbb{E}_{x, y}\big[(h(x) - \mathbb{E}[y|x])(\mathbb{E}[y|x] - y)\big] = \mathbb{E}_x \big[(h(x) - \mathbb{E}[y|x]) \cdot \mathbb{E}_{y|x}[\mathbb{E}[y|x] - y | x]\big] = 0

$$


Từ đó suy ra:

$$

\mathbb{E}[\mathcal{L}(y, h(x))] = \int (h(x) - \mathbb{E}[y | x])^2 P(x)dx + \int \text{Var}(y | x)P(x)dx

$$


Vì số hạng đầu tiên luôn $\ge 0$, để rủi ro kỳ vọng nhỏ nhất, nghiệm tối ưu duy nhất bắt buộc phải là:

$$

h^*(x) = \mathbb{E}[y | x]

$$


#### Chứng Minh Phân Rã Đánh Đổi Độ Chệch và Phương Sai (Bias-Variance Decomposition)
Khi mô hình được huấn luyện trên tập dữ liệu cụ thể $\mathcal{D}$, kỳ vọng sai số ngoài mẫu phân rã thành ba thành phần độc lập:

$$

\mathbb{E}_{\mathcal{D}, y}\big[(h(x; \mathcal{D}) - y)^2\big] = \underbrace{\big(\mathbb{E}_{\mathcal{D}}[h(x; \mathcal{D})] - \mathbb{E}[y | x]\big)^2}_{\text{Bias}^2(x)} + \underbrace{\mathbb{E}_{\mathcal{D}}\big[(h(x; \mathcal{D}) - \mathbb{E}_{\mathcal{D}}[h(x; \mathcal{D})])^2\big]}_{\text{Variance}(x)} + \underbrace{\text{Var}(y | x)}_{\sigma^2(x) \text{ (Noise)}}

$$


* $\text{Bias}^2$: Sai lệch giữa dự đoán trung bình của thuật toán với chân lý lý thuyết (gây ra hiện tượng Underfitting).
* $\text{Variance}$: Độ nhạy của mô hình trước biến động của tập dữ liệu mẫu (gây ra hiện tượng Overfitting).
* $\sigma^2$: Nhiễu không thể giản lược (*Irreducible error*), là giới hạn toán học dưới của mọi mô hình.

---

### 3. Hệ Thống Thước Đo Đánh Giá & Cạm Bẫy Mất Cân Bằng Dữ Liệu

Trong bài toán phân loại nhị phân ($y \in \{0, 1\}$), Ma trận nhầm lẫn (*Confusion Matrix*) chia dự đoán thành 4 trạng thái:
* **True Positive (TP)**: Thực tế dương, đoán đúng là dương.
* **False Positive (FP - Lỗi Type I)**: Báo động nhầm (thực tế âm, đoán là dương).
* **False Negative (FN - Lỗi Type II)**: Bỏ sót nguy hiểm (thực tế dương, đoán là âm).
* **True Negative (TN)**: Thực tế âm, đoán đúng là âm.

$$

\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}

$$


```
                       DỰ ĐOÁN (PREDICTION)
                     Positive (1)     Negative (0)
THỰC TẾ  Positive(1) [    TP     ]   [  FN (Bỏ sót) ]
(ACTUAL) Negative(0) [ FP (Nhầm) ]   [      TN      ]
```

> **CẢNH BÁO KHOA HỌC: CẠM BẪY ROC-AUC KHI MẤT CÂN BẰNG DỮ LIỆU**  
> Khi tập dữ liệu có tỷ lệ dương tính cực thấp (ví dụ chỉ $0.1\%$ mẫu gian lận, số mẫu âm tính $TN$ lên tới hàng triệu), số lượng báo động nhầm $FP$ dù tăng vọt vẫn bị mẫu số $(TN + FP)$ áp đảo:
>
> $$
> FPR = \frac{FP}{TN + FP} \approx 0
> $$
>
> Hậu quả là đường cong **ROC-AUC hiển thị giá trị ảo rất cao** ($> 0.95$). Trong các bài toán phát hiện gian lận, chẩn đoán y tế hay an ninh mạng, **PR-AUC (Precision-Recall AUC)** là thước đo bắt buộc duy nhất phản ánh trung thực sự sụp đổ của mô hình.

---

### 4. Tiền Xử Lý Dữ Liệu & Quy Tắc Tránh Rò Rỉ (Data Leakage)

* **Cơ chế khuyết thiếu**:
  * **MCAR (Missing Completely at Random)**: Khuyết ngẫu nhiên độc lập hoàn toàn với mọi biến.
  * **MAR (Missing at Random)**: Phụ thuộc vào các biến quan sát khác nhưng không phụ thuộc giá trị bị khuyết.
  * **MNAR (Missing Not at Random)**: Phụ thuộc trực tiếp vào chính giá trị chưa quan sát (ví dụ: người thu nhập cao giấu thu nhập).
* **Chiến lược điền khuyết**: Sử dụng **Median Imputation** cho dữ liệu số có phân phối lệch hoặc chứa ngoại lai; dùng **KNN Imputation / MICE** cho mối tương quan đa biến.
* **Quy tắc Bất di Bất dịch Tránh Rò rỉ Dữ liệu (Pipeline Leakage Rule)**:
  Toàn bộ tham số thống kê ($\mu_{\text{train}}, \sigma_{\text{train}}, x_{\min}, x_{\max}$) chỉ được phép học (`fit`) duy nhất trên tập huấn luyện. Tập kiểm định và tập kiểm thử chỉ được phép áp dụng phép biến đổi (`transform`) dựa trên các tham số đã đóng băng.
  *Vi phạm nghiêm trọng nhất: Gọi `fit_transform()` trên toàn bộ tập dữ liệu trước khi phân chia train/test.*

---

## PHẦN II: PHÂN LOẠI XÁC SUẤT VÀ CÁC MÔ HÌNH SINH

### 5. Phân Loại Xác Suất Bayes & Trực Giác Feynman

Theo phương pháp trực quan Feynman, bài toán phân loại thực chất là việc tìm kiếm siêu mặt toán học chia cắt không gian sao cho xác suất hậu nghiệm thuộc về lớp đúng là lớn nhất.

Định lý Bayes xác lập mối quan hệ:

$$

P(C_k | x) = \frac{p(x | C_k) P(C_k)}{p(x)} = \frac{p(x | C_k) P(C_k)}{\sum_{j=1}^K p(x | C_j) P(C_j)}

$$


* $P(C_k)$: Xác suất Tiên nghiệm (Prior).
* $p(x | C_k)$: Hàm Khả năng (Likelihood).
* $P(C_k | x)$: Xác suất Hậu nghiệm (Posterior).
* **Quy tắc quyết định MAP (Maximum A Posteriori)**: $\hat{k} = \arg\max_{k} p(x | C_k)P(C_k)$.

#### So Sánh 3 Trường Phái Phân Loại

| Tiêu Chí | Mô Hình Sinh (Generative) | Mô Hình Phân Biệt (Discriminative) | Hàm Phân Biệt (Discriminant) |
|---|---|---|---|
| **Mục tiêu học** | Học phân phối kết hợp $p(x, y)$ | Học trực tiếp xác suất hậu nghiệm $P(y \| x)$ | Học trực tiếp hàm ánh xạ $f(x) \to y$ |
| **Công cụ toán** | Định lý Bayes, GDA, Naive Bayes | Logistic Regression, Softmax | Support Vector Machine (SVM), Perceptron |
| **Ưu điểm** | Có thể sinh dữ liệu mẫu mới, phát hiện điểm bất thường | Thường đạt độ chính xác cao hơn, không cần giả định $p(x)$ | Ranh giới trực tiếp, tốc độ suy luận cực nhanh |
| **Nhược điểm** | Nhạy cảm với giả định phân phối sai | Dễ bị overfit khi số lượng mẫu nhỏ | Không cung cấp xác suất tin cậy (Calibrated probabilities) |

---

### 6. Mô Hình Sinh Xác Suất: LDA, QDA và Naive Bayes

#### Phân Tích Phân Biệt Gauss (GDA)
Giả định mỗi lớp tuân theo phân phối chuẩn đa biến $\mathcal{N}(\mu_k, \Sigma_k)$.
* **LDA (Linear Discriminant Analysis)**: Giả định các lớp có chung ma trận hiệp phương sai $\Sigma_1 = \Sigma_2 = \Sigma$. Khi xét tỷ số log-likelihood:

  $$
  \log \frac{P(C_1 | x)}{P(C_2 | x)} = (\mu_1 - \mu_2)^T \Sigma^{-1} x + w_0 = 0

  $$
  Số hạng bậc hai $x^T \Sigma^{-1} x$ triệt tiêu hoàn toàn, tạo ra **ranh giới quyết định tuyến tính phẳng**.
* **QDA (Quadratic Discriminant Analysis)**: Cho phép mỗi lớp có ma trận hiệp phương sai riêng $\Sigma_1 \ne \Sigma_2$. Số hạng bậc hai tồn tại tạo nên **ranh giới bậc hai phi tuyến** (elip, parabol, hyperbol).

#### Naive Bayes & Kỹ Thuật Làm Mịn Laplace
Giả định các đặc trưng độc lập có điều kiện khi biết nhãn lớp: $p(x | y) = \prod_{j=1}^d p(x_j | y)$. Để tránh xác suất thực nghiệm bằng 0 khi gặp từ vựng mới kéo sụp toàn bộ tích số về 0, kỹ thuật làm mịn Laplace bổ sung hằng số $\alpha = 1$:

$$

\hat{p}(x_j | y = k) = \frac{N_{j, k} + \alpha}{N_k + \alpha d}

$$


---

### 7. Ước Lượng Hợp Lý Cực Đại (Maximum Likelihood Estimation - MLE)

Cho $n$ quan sát độc lập cùng phân phối (i.i.d.) từ phân phối $p(x; \theta)$, hàm log-likelihood là:

$$

\ell(\theta; \mathcal{D}) = \sum_{i=1}^n \log p(x_i; \theta) \implies \hat{\theta}_{\text{MLE}} = \arg\max_\theta \ell(\theta; \mathcal{D})

$$


Với phân phối chuẩn $\mathcal{N}(\mu, \sigma^2)$, nghiệm MLE dẫn xuất được:
* $\hat{\mu}_{\text{MLE}} = \bar{x} = \frac{1}{n} \sum x_i$ (Ước lượng không thiên lệch).
* $\hat{\sigma}^2_{\text{MLE}} = \frac{1}{n} \sum (x_i - \bar{x})^2$ (Ước lượng **có thiên lệch** vì chia cho $n$; trong thực tế thống kê dùng mẫu số $n-1$ của Bessel).

#### Tính Chất Tiệm Cận Của MLE
Khi kích thước mẫu $n \to \infty$:
1. **Tính Nhất Quán (Consistency)**: $\hat{\theta}_{\text{MLE}} \xrightarrow{P} \theta^*$ (hội tụ theo xác suất về chân lý).
2. **Tính Chuẩn Tiệm Cận (Asymptotic Normality)**: $\sqrt{n}(\hat{\theta}_{\text{MLE}} - \theta^*) \xrightarrow{d} \mathcal{N}(0, \mathcal{I}(\theta^*)^{-1})$, với $\mathcal{I}(\theta^*)$ là Ma trận Thông tin Fisher.
3. **Hiệu Quả Tiệm Cận (Asymptotic Efficiency)**: Đạt giới hạn dưới Cramér-Rao, có phương sai nhỏ nhất trong mọi ước lượng không thiên lệch.

---

## PHẦN III: MẠNG NƠ-RON NHÂN TẠO VÀ HỌC SÂU

### 8. Kiến Trúc Mạng Nơ-ron & Tính Ổn Định Số Học

Một tầng tuyến tính kết nối đầy đủ `nn.Linear(in_features, out_features)` biến đổi tensor đầu vào thông qua:

$$

y = x W^T + b, \quad \text{Parameters: } P = (\text{in} + 1) \times \text{out}

$$


#### Vai Trò Bắt Buộc Của Hàm Kích Hoạt Phi Tuyến
Nếu không có hàm kích hoạt phi tuyến $\sigma(\cdot)$, mạng nơ-ron dù xếp chồng hàng trăm tầng ẩn cũng chỉ tương đương với một phép biến đổi tuyến tính đơn lẻ duy nhất:

$$

W_k \dots W_2 W_1 x = W_{\text{eff}} x

$$


Mạng mất đi toàn bộ khả năng xấp xỉ hàm vạn năng (*Universal Function Approximation*).

#### Tính Ổn Định Số Học Trong Hàm Mất Mát (Numerical Stability)
Để triệt tiêu hiện tượng tràn số (*numerical overflow/underflow*) khi tính số mũ $e^z$, PyTorch kết hợp phép biến đổi toán học trực tiếp trong hàm mất mát:
* **Binary Cross-Entropy**:

  $$
  \mathcal{L}(z, y) = \max(z, 0) - yz + \log(1 + e^{-|z|}) \implies \text{Use } \texttt{nn.BCEWithLogitsLoss()}

  $$

* **Multiclass Cross-Entropy (Thuật toán Log-Sum-Exp)**:

  $$
  \log \sum_{j=1}^K e^{z_j} = m + \log \sum_{j=1}^K e^{z_j - m}, \quad \text{where } m = \max_j z_j \implies \text{Use } \texttt{nn.CrossEntropyLoss()}

  $$
  *Quy tắc chuẩn: Truyền trực tiếp logits thô vào loss function, tuyệt đối không gọi `nn.Softmax()` thủ công trước đó.*

---

### 9. Tối Ưu Hóa SGD, Động Lượng Momentum và Động Học Huấn Luyện

Trong không gian hàm mất mát phi lồi chứa nhiều thung lũng hẹp dốc đứng, thuật toán hạ độ dốc cơ bản (Plain SGD) thường bị dao động chữ chi qua lại giữa hai sườn dốc và đình trệ.

Cơ chế Momentum tích lũy vận tốc quá khứ $v_t$ để duy trì quán tính chuyển động (tương tự hòn bi lăn xuống dốc):

$$

v_t = \beta v_{t-1} + g_t, \quad w_t = w_{t-1} - \eta v_t

$$


```
MẶT PHẲNG MẤT MÁT (LOSS SURFACE) & ĐỘNG HỌC TỐI ƯU
Plain SGD:    \  /\  /\  /\  /  (Dao động chữ chi dữ dội tại đáy vực)
Momentum:     \---------->     (Tích lũy quán tính trượt thẳng tới cực tiểu)
```

Giáo trình minh họa thực nghiệm bước $t=4$ và $t=5$ khi đạo hàm đổi dấu sang âm ($g_4 = -0.1, g_5 = -0.4$):
* **Plain SGD**: Phụ thuộc tức thời vào $g_t$, lập tức quay đầu tăng trọng số ngược trở lại ($1.85 \to 1.86 \to 1.90$), bị kẹt trong dao động.
* **SGD có Momentum**: Nhờ vận tốc tích lũy $v_3 = 1.298$, quán tính $v_4 = 1.0682 > 0$ vẫn mang dấu dương, giúp mô hình vượt qua vùng dao động phẳng và tiếp tục tiến tới vùng nghiệm tối ưu sâu hơn ($w_5 = 1.50524$).

---

### 10. Toán Học Mạng Tích Chập 1D (1D-CNN) Trên Tín Hiệu Cảm Biến Chuỗi Thời Gian

Trong khi 2D-CNN thống trị bài toán xử lý ảnh, 1D-CNN là giải pháp tối ưu cho chuỗi tín hiệu cảm biến thời gian thực (như dữ liệu gia tốc kế và con quay hồi chuyển 6 kênh trong bài toán nhận dạng hoạt động người HAPT).

#### Công Thức Kích Thước Đầu Ra (Output Shape)

$$

L_{\text{out}} = \left\lfloor \frac{L_{\text{in}} + 2P - D(K - 1) - 1}{S} \right\rfloor + 1

$$


#### Hệ Thức Truy Hồi Vùng Cảm Nhận (Receptive Field - RF)
Vùng cảm nhận tại tầng thứ $k$ biểu thị độ dài đoạn tín hiệu đầu vào gốc mà một nơ-ron có thể quan sát:

$$

RF_k = RF_{k-1} + (K_k - 1) \prod_{i=1}^{k-1} S_i, \quad \text{where } RF_0 = 1

$$


#### Ưu Thế Vượt Trội Của Global Average Pooling (GAP) So Với Flatten
Xét kiến trúc phân loại 12 hoạt động thể chất với feature map sau Conv3 kích thước $[B, 64, 120]$:
* **Nếu dùng Flatten**: Vector nối ra có kích thước $64 \times 120 = 7,680$. Tầng Dense nối tới 12 lớp đầu ra sẽ cần **$92,172$ tham số** (chiếm hơn $80\%$ tham số toàn mạng), dẫn đến nguy cơ quá khớp cực kỳ nghiêm trọng.
* **Khi dùng GAP**: Toàn bộ chiều thời gian $L=120$ được lấy trung bình $\bar{h}_c = \frac{1}{L} \sum_{t=1}^L h_{c,t}$. Tầng GAP có **0 tham số học**, nén gọn tensor về $[B, 64]$, tạo ra tính bất biến dịch chuyển thời gian (*Translation Invariance*) và đóng vai trò như một bộ điều chuẩn cấu trúc cực mạnh.

#### Chứng Chỉ Miền Toàn Cục (Whole-Domain Certificate)
Trong kiểm định độ bền vững (*Robustness Verification*), lề quyết định $\gamma(x) = z_{y^*} - \max_{j \ne y^*} z_j$ đo lường khoảng cách an toàn giữa lớp đúng và lớp sai thứ nhì. Nếu mô hình có hằng số Lipschitz toàn cục $L_{\text{net}}$, với mọi nhiễu cảm biến $\|\Delta x\| \le \epsilon$, điều kiện đủ để mô hình không bao giờ bị đánh lừa là:

$$

L_{\text{net}} \cdot \epsilon < \gamma(x)

$$


Bất đẳng thức này cung cấp chứng chỉ toán học bảo đảm an toàn tuyệt đối khi triển khai AI trên các thiết bị y tế và nhúng IoT.

---

## CÁC PHẦN PHỤ LỤC THỰC NGHIỆM

### Phụ Lục A: Ngân Hàng 60 Câu Hỏi Ôn Tập Chuyên Sâu
Tài liệu cung cấp bảng tra cứu đáp án nhanh và lời giải chi tiết cho 60 câu trắc nghiệm bao quát:
* Công thức tính số tham số lớp Dense: $P = (n_{\text{in}} + 1) \times n_{\text{out}}$.
* Phân biệt thước đo MAE ($L_1$, robust với outlier) và MSE ($L_2$, phạt nặng lỗi lớn).
* Lý do trong chẩn đoán y khoa nguy hiểm (ung thư), Recall được ưu tiên tuyệt đối nhằm cực tiểu hóa các ca bỏ sót (False Negative $\to 0$).

### Phụ Lục B: Mã Nguồn Kiểm Định Tính Toàn Vẹn Bằng Rust
Chương trình `validate.rs` viết bằng ngôn ngữ Rust 1.80+ thực hiện kiểm định nghiêm ngặt tập dữ liệu benchmark 100 mẫu sản phẩm công nghiệp:
* Kiểm tra tính duy nhất của mã ID bằng `HashSet`.
* Ràng buộc miền giá trị toán học: $x_1 \ge 0.0$ (độ lệch cơ khí), $x_2 \in [0.0, 1.0]$ (tỷ lệ rung động).
* Kiểm định tính cân bằng phân phối nhãn ($C_1 : 34, C_2 : 33, C_3 : 33$), bảo đảm 0 lỗi định dạng trước khi đưa vào mô hình học máy.

### Phụ Lục C: Bản Đồ Ôn Tập 100 Khái Niệm Cốt Lõi (Mental Model)
Chuỗi liên kết tư duy logic chuẩn mực xuyên suốt từ bài toán đến mô hình:
```
Problem Definition (Bài toán)
      ↓
Data & Representation (Biểu diễn Tensor)
      ↓
Preprocessing (Tiền xử lý & Tránh rò rỉ dữ liệu)
      ↓
Model & Inductive Bias (Kiến trúc & Không gian giả thuyết)
      ↓
Loss Formulation (Định nghĩa hàm mất mát ổn định số học)
      ↓
Optimization (Gradient Descent & Momentum)
      ↓
Evaluation & Verification (Thước đo phù hợp & Chứng chỉ toàn vẹn)
```

---

## Tải Về & Đọc Toàn Bộ Tài Liệu

Toàn văn giáo trình định dạng PDF chất lượng cao (biên soạn bằng LaTeX) đã được tích hợp trực tiếp vào hệ thống blog:

* **Tên tệp**: `Giao_Trinh_Machine_Learning_Toan_Dien.pdf`
* **Quy mô**: 93 trang chuẩn A4
* **Dung lượng**: 457 KB
* **Đường dẫn tải về**: [/downloads/Giao_Trinh_Machine_Learning_Toan_Dien.pdf](/downloads/Giao_Trinh_Machine_Learning_Toan_Dien.pdf)

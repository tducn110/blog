---
title: "Giải Mã Trực Giác Các Công Thức Học Máy Midterm: Bản Chất Hình Học, Khi Nào Dùng & Bẫy Đề Thi"
description: "Giải mã trực giác hình học và bản chất toán học của các công thức cốt lõi Machine Learning Midterm: Tại sao w trực giao với ranh giới? Vì sao LDA triệt tiêu bậc hai? Nguồn gốc Sigmoid từ Bayes? Động học IRLS? Bẫy Masking Effect & Outlier của Least Squares? Chi tiết chứng minh tra cứu tại bản PDF 111 trang."
publishDate: 2026-11-15T14:00:00+07:00
order: 3
category: "engineering"
tags: ["MachineLearning", "ML-Midterm", "Mathematics", "Probability", "Intuition", "Classification"]
featured: false
recommendedFont: "academic"
lang: "vi"
---

> **BỘ 3 CẨM NANG ÔN TẬP MACHINE LEARNING MIDTERM (VNUK 2026)**  
> Nhằm phục vụ việc ôn tập cấp tốc, kiến thức ôn thi Midterm được phân tầng thành 3 chuyên đề độc lập, thống nhất dưới nhãn tag `MachineLearning`:
> 
> 1. **Bài 1 (Tổng quan kiến trúc):** [Tổng Quan Ôn Tập Midterm: Bản Đồ Tri Thức 12 Bài Giảng & 11 Điểm Gãy Đổ Hệ Thống](/posts/on-tap-hoc-may-midterm-toan-dien/)
> 2. **Bài 2 (Sổ tay tra cứu):** [Sổ Tay Công Thức Cốt Lõi Học Máy Midterm: Bảng Tra Cứu 20+ Phương Trình Hạt Nhân](/posts/so-tay-cong-thuc-hoc-may-midterm/)
> 3. **Bài 3 (Bài viết này):** [Giải Mã Trực Giác Các Công Thức Học Máy Midterm: Bản Chất Hình Học, Khi Nào Dùng & Bẫy Đề Thi](/posts/giai-ma-truc-giac-cong-thuc-hoc-may-midterm/)
> 
> * **Tải trọn bộ chuyên khảo đầy đủ (111 Trang A4, 553 KB):**  
>   [Tải xuống ML_midterm_vi.pdf (Bản Tiếng Việt 111 Trang A4)](/files/midterms/ML_midterm_vi.pdf) | [English Edition (111 Pages A4)](/files/midterms/ML_midterm_en.pdf)

---

## Lời Mở Đầu: Đừng Học Vẹt Công Thức

Một sai lầm phổ biến khi ôn thi Machine Learning là cố gắng ghi nhớ từng biến số trong công thức mà không hiểu **trực giác hình học** và **cơ chế vận hành** đằng sau nó. Khi bước vào phòng thi hoặc phỏng vấn kỹ thuật, chỉ cần đề bài thay đổi ngữ cảnh hoặc đưa vào một câu hỏi bẫy về trường hợp biên (edge case), người học vẹt sẽ lúng túng ngay lập tức.

Bài viết này không lặp lại các bước biến đổi đại số dài dòng (vốn đã được trình bày chi tiết trong [Chuyên khảo 111 trang](/files/midterms/ML_midterm_vi.pdf)), mà tập trung giải mã **7 câu hỏi bản chất quan trọng nhất** của chương trình học máy Midterm:

---

## 1. Tại Sao Vector Trọng Số $\mathbf{w}$ Luôn Trực Giao Với Siêu Phẳng Ranh Giới?

<span class="focus-key-pill">TRỰC GIÁC HÌNH HỌC 01: PHÁP TUYẾN & KHOẢNG CÁCH CÓ DẤU</span>

### Bản chất hình học:
Xét siêu phẳng ranh giới quyết định $\mathcal{P}: g(\mathbf{x}) = \mathbf{w}^T \mathbf{x} + w_0 = 0$.
Lấy hai điểm bất kỳ $\mathbf{x}_A$ và $\mathbf{x}_B$ nằm tùy ý trên chính siêu phẳng này:
$$g(\mathbf{x}_A) = 0 \iff \mathbf{w}^T \mathbf{x}_A + w_0 = 0$$
$$g(\mathbf{x}_B) = 0 \iff \mathbf{w}^T \mathbf{x}_B + w_0 = 0$$

Lấy phương trình trên trừ phương trình dưới:
$$\mathbf{w}^T (\mathbf{x}_A - \mathbf{x}_B) = 0$$

Vector $(\mathbf{x}_A - \mathbf{x}_B)$ chính là một vector chỉ phương nằm hoàn toàn trên bề mặt siêu phẳng. Tích vô hướng của $\mathbf{w}$ với một vector bất kỳ nằm trên mặt phẳng bằng 0 đồng nghĩa: **$\mathbf{w}$ là vector pháp tuyến vuông góc $90^\circ$ với siêu phẳng**. Chiều mũi tên của $\mathbf{w}$ luôn chỉ thẳng vào miền không gian nửa dương ($g(\mathbf{x}) > 0$).

### Vì sao mẫu số khoảng cách phải chia cho $\|\mathbf{w}\|_2$?
Phân rã một điểm $\mathbf{x}$ bất kỳ thành hình chiếu trực giao $\mathbf{x}_p$ nằm trên siêu phẳng và độ lệch vuông góc theo phương vector đơn vị $\frac{\mathbf{w}}{\|\mathbf{w}\|_2}$:
$$\mathbf{x} = \mathbf{x}_p + r \frac{\mathbf{w}}{\|\mathbf{w}\|_2}$$

Nhân vô hướng cả hai vế với $\mathbf{w}^T$ và cộng $w_0$:
$$\mathbf{w}^T \mathbf{x} + w_0 = \underbrace{(\mathbf{w}^T \mathbf{x}_p + w_0)}_{= 0 \text{ do } \mathbf{x}_p \in \mathcal{P}} + r \frac{\mathbf{w}^T \mathbf{w}}{\|\mathbf{w}\|_2} = r \|\mathbf{w}\|_2$$
$$\implies r = \frac{\mathbf{w}^T \mathbf{x} + w_0}{\|\mathbf{w}\|_2} = \frac{g(\mathbf{x})}{\|\mathbf{w}\|_2}$$

> **Ý nghĩa:** Giá trị hàm $g(\mathbf{x})$ chỉ là khoảng cách "chưa chuẩn hóa". Nếu ta nhân đôi tất cả các hệ số trọng số ($2\mathbf{w}, 2w_0$), ranh giới quyết định không hề thay đổi nhưng giá trị $g(\mathbf{x})$ bị tăng gấp 2 lần. Việc chia cho chuẩn Euclid $\|\mathbf{w}\|_2$ giúp triệt tiêu độ co giãn tỉ lệ này, biến $r$ thành thước đo khoảng cách vật lý thực sự tính theo mét hoặc pixel!

*(Xem chứng minh hình học vector đầy đủ tại Phụ lục A, tr. 84 của Chuyên khảo 111 trang).*

---

## 2. Vì Sao LDA Cho Ranh Giới Phẳng Còn QDA Lại Sinh Ra Mặt Cong Bậc Hai?

<span class="focus-key-pill">TRỰC GIÁC HÌNH HỌC 02: CƠ CHẾ TRIỆT TIÊU BẬC HAI</span>

Cả LDA và QDA đều giả định mật độ dữ liệu điều kiện theo từng lớp tuân theo phân phối chuẩn Gauss đa biến $\mathcal{N}(\boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)$. Ranh giới quyết định giữa hai lớp $C_1$ và $C_2$ là tập hợp các điểm mà xác suất hậu nghiệm bằng nhau:
$$P(C_1 \mid \mathbf{x}) = P(C_2 \mid \mathbf{x}) \iff \ln \frac{P(C_1 \mid \mathbf{x})}{P(C_2 \mid \mathbf{x})} = 0$$

Khai triển hàm log-likelihood Gauss chứa số hạng khoảng cách Mahalanobis bậc hai:
$$\ln p(\mathbf{x} \mid C_k) = -\frac{1}{2} (\mathbf{x} - \boldsymbol{\mu}_k)^T \boldsymbol{\Sigma}_k^{-1} (\mathbf{x} - \boldsymbol{\mu}_k) - \frac{1}{2}\ln|\boldsymbol{\Sigma}_k| - \frac{D}{2}\ln(2\pi)$$

### Sự khác biệt cốt tử:
1. **Trong LDA (Linear Discriminant Analysis)**: Hai lớp được giả định **dùng chung một ma trận hiệp phương sai** $\boldsymbol{\Sigma}_1 = \boldsymbol{\Sigma}_2 = \boldsymbol{\Sigma}$.
   - Khi lấy log tỉ số $\ln p(\mathbf{x} \mid C_1) - \ln p(\mathbf{x} \mid C_2)$, số hạng bậc hai $-\frac{1}{2}\mathbf{x}^T \boldsymbol{\Sigma}^{-1} \mathbf{x}$ xuất hiện giống hệt nhau ở cả hai lớp.
   - Phép trừ khiến thành phần toàn phương bậc hai **tự triệt tiêu hoàn toàn về 0**!
   - Biểu thức còn lại chỉ gồm các số hạng bậc nhất $\mathbf{x}^T \boldsymbol{\Sigma}^{-1} (\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2)$, tạo ra một **siêu phẳng ranh giới tuyến tính hoàn toàn phẳng**.
2. **Trong QDA (Quadratic Discriminant Analysis)**: Mỗi lớp sở hữu ma trận hiệp phương sai riêng biệt $\boldsymbol{\Sigma}_1 \ne \boldsymbol{\Sigma}_2$.
   - Số hạng bậc hai lúc này là $\mathbf{x}^T (\boldsymbol{\Sigma}_2^{-1} - \boldsymbol{\Sigma}_1^{-1}) \mathbf{x}$.
   - Do $\boldsymbol{\Sigma}_1^{-1} \ne \boldsymbol{\Sigma}_2^{-1}$, ma trận hiệu này khác ma trận không, số hạng bậc hai **được giữ nguyên**!
   - Tùy thuộc vào dấu của các trị riêng (eigenvalues) của ma trận $(\boldsymbol{\Sigma}_2^{-1} - \boldsymbol{\Sigma}_1^{-1})$, ranh giới quyết định sẽ uốn cong thành hình Elip (Ellipsoid), Parabol (Paraboloid) hoặc Hypecbol (Hyperboloid).

> **Bẫy đề thi:** Nếu đề bài cho QDA nhưng lại cho biết hai lớp có cùng ma trận hiệp phương sai ($\boldsymbol{\Sigma}_1 = \boldsymbol{\Sigma}_2$), thì ranh giới QDA sẽ tự động thoái hóa về ranh giới phẳng của LDA!

*(Xem bảng phân loại các mặt bậc hai QDA tại Phụ lục E, tr. 92 của Chuyên khảo 111 trang).*

---

## 3. Nguồn Gốc Thực Sự Của Hàm Sigmoid Từ Định Lý Bayes

<span class="focus-key-pill">TRỰC GIÁC XÁC SUẤT 03: CẦU NỐI GENERATIVE & DISCRIMINATIVE</span>

Nhiều người nghĩ hàm Sigmoid $\sigma(a) = \frac{1}{1 + e^{-a}}$ là một công thức "tự nhiên sinh ra" hoặc do con người tự tiện nghĩ ra để ép giá trị về khoảng $(0, 1)$. **Sự thật hoàn toàn ngược lại**: Sigmoid là hệ quả giải tích tất yếu của định lý Bayes!

Xét bài toán phân loại nhị phân giữa lớp $C_1$ và $C_2$. Theo định lý Bayes:
$$P(C_1 \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid C_1)P(C_1)}{p(\mathbf{x} \mid C_1)P(C_1) + p(\mathbf{x} \mid C_2)P(C_2)}$$

Chia cả tử số và mẫu số cho tử số $p(\mathbf{x} \mid C_1)P(C_1)$:
$$P(C_1 \mid \mathbf{x}) = \frac{1}{1 + \frac{p(\mathbf{x} \mid C_2)P(C_2)}{p(\mathbf{x} \mid C_1)P(C_1)}} = \frac{1}{1 + \exp(-a)}$$
Trong đó $a$ chính là **tỉ số log-odds (Logarithm of Odds Ratio)**:
$$a = \ln \frac{p(\mathbf{x} \mid C_1)P(C_1)}{p(\mathbf{x} \mid C_2)P(C_2)}$$

- Khi $a = 0 \iff P(C_1 \mid \mathbf{x}) = P(C_2 \mid \mathbf{x}) = 0.5$ (điểm nằm ngay trên ranh giới quyết định).
- Khi $a \to +\infty \iff P(C_1 \mid \mathbf{x}) \to 1.0$ (bằng chứng ủng hộ tuyệt đối lớp 1).
- Khi $a \to -\infty \iff P(C_1 \mid \mathbf{x}) \to 0.0$ (bằng chứng ủng hộ tuyệt đối lớp 2).

Nếu cả hai lớp tuân theo phân phối Gauss cùng hiệp phương sai (mô hình LDA), ta đã chứng minh ở trên rằng đại lượng log-odds $a$ là một hàm bậc nhất tuyến tính: $a = \mathbf{w}^T \mathbf{x} + w_0$. Thay vào, ta thu được trực tiếp dạng của **Hồi quy Logistic**!

---

## 4. Bản Chất Của Thuật Toán IRLS: Vì Sao Tối Ưu Phi Tuyến Lại Trở Thành Bình Phương Tối Thiểu?

<span class="focus-key-pill">TRỰC GIÁC TỐI ƯU 04: TRỌNG SỐ BIẾN THIÊN & KHÔNG GIAN ĐỘNG</span>

Trong Hồi quy Logistic, do có hàm phi tuyến Sigmoid nằm bên trong, phương trình gradient bằng 0 không thể giải bằng nghiệm đóng đại số (Closed-form solution). Ta bắt buộc phải dùng thuật toán tối ưu hóa lặp bậc hai **Newton-Raphson**:
$$\mathbf{w}^{(\text{new})} = \mathbf{w}^{(\text{old})} - \mathbf{H}^{-1} \nabla E(\mathbf{w}^{(\text{old})})$$

Thay vector Gradient $\nabla E = \mathbf{X}^T (\mathbf{y} - \mathbf{t})$ và ma trận Hessian $\mathbf{H} = \mathbf{X}^T \mathbf{R} \mathbf{X}$ vào:
$$\mathbf{w}^{(\text{new})} = \mathbf{w} - (\mathbf{X}^T \mathbf{R} \mathbf{X})^{-1} \mathbf{X}^T (\mathbf{y} - \mathbf{t})$$
$$= (\mathbf{X}^T \mathbf{R} \mathbf{X})^{-1} \Big[ (\mathbf{X}^T \mathbf{R} \mathbf{X})\mathbf{w} - \mathbf{X}^T (\mathbf{y} - \mathbf{t}) \Big]$$
$$= (\mathbf{X}^T \mathbf{R} \mathbf{X})^{-1} \mathbf{X}^T \mathbf{R} \underbrace{\Big[ \mathbf{X}\mathbf{w} - \mathbf{R}^{-1}(\mathbf{y} - \mathbf{t}) \Big]}_{\mathbf{z}}$$

Phương trình này có cấu trúc giống hệt phương trình OLS có trọng số (Weighted Least Squares):
$$\mathbf{w}^* = (\mathbf{X}^T \mathbf{R} \mathbf{X})^{-1} \mathbf{X}^T \mathbf{R} \mathbf{z}$$

> **Ý nghĩa thực tế:** Thuật toán IRLS (Iteratively Reweighted Least Squares) hoạt động bằng cách:
> 1. Tính toán một biến mục tiêu ảo $\mathbf{z}$ trong không gian tuyến tính.
> 2. Gán ma trận trọng số $\mathbf{R}$ với từng phần tử đường chéo $R_{nn} = y_n(1 - y_n)$.
> 3. Điểm dữ liệu nào nằm sát ranh giới quyết định ($y_n \approx 0.5$) sẽ có trọng số lớn nhất ($R_{nn} \approx 0.25$) và đóng góp nhiều nhất vào việc xoay ranh giới.
> 4. Điểm nào nằm sâu trong miền an toàn ($y_n \to 1$ hoặc $y_n \to 0$) sẽ có trọng số triệt tiêu về 0 ($R_{nn} \to 0$) và hầu như không làm đổi ranh giới nữa!

*(Xem chứng minh ma trận chi tiết tại Phụ lục H, tr. 101 của Chuyên khảo 111 trang).*

---

## 5. Vì Sao Least Squares (OLS) Thất Bại Trong Phân Loại?

<span class="focus-key-pill">BẪY THI CỬ 05: MASKING EFFECT & OUTLIER DISTORTION</span>

Tại sao ta không thể dùng hồi quy bình phương tối thiểu (OLS) quen thuộc cho bài toán phân loại nhãn $\{0, 1\}$? Có hai nguyên nhân chí mạng:

1. **Hiện tượng Outlier kéo lệch ranh giới:**
   - Hàm mất mát bình phương $(y_n - 1)^2$ phạt rất nặng các điểm dù **đã được phân loại đúng** nhưng lại nằm quá xa ranh giới về phía đúng.
   - Một điểm có $\hat{y} = 3.0$ với nhãn $t=1$ vẫn bị phạt $(3.0 - 1.0)^2 = 4.0$. Thuật toán buộc phải xoay lệch siêu phẳng về phía điểm này để giảm tổn thất, dẫn tới việc làm phân loại sai hàng loạt điểm nhạy cảm nằm sát biên.
   - Hồi quy Logistic dùng hàm mất mát Cross-Entropy không hề phạt điểm này vì $-\ln \sigma(3.0) \approx 0$.
2. **Hiện tượng Che lấp lớp (Masking Effect):**
   - Khi có 3 lớp nằm thẳng hàng ($C_1 - C_2 - C_3$), nếu lớp $C_2$ bị kẹp ở giữa, mặt phẳng hồi quy của lớp 1 và lớp 3 sẽ giao nhau ở độ cao lớn hơn mặt phẳng của lớp 2 trên toàn bộ không gian:
     $$g_2(\mathbf{x}) < \max\big(g_1(\mathbf{x}), g_3(\mathbf{x})\big), \quad \forall \mathbf{x}$$
   - Vùng quyết định của lớp 2 bị xóa sổ hoàn toàn ($\mathcal{R}_2 = \emptyset$). Mô hình OLS không bao giờ gán bất kỳ mẫu nào vào lớp 2!

---

## 6. Nghịch Lý Naive Bayes: Giả Thiết Sai Nhưng Vì Sao Kết Quả Vẫn Tốt?

<span class="focus-key-pill">TRỰC GIÁC MÔ HÌNH 06: RANKING PRESERVATION & ZERO FREQUENCY</span>

Giả thiết của Naive Bayes là: *Các biến đặc trưng độc lập có điều kiện với nhau khi biết trước nhãn lớp*:
$$P(\mathbf{x} \mid C_k) = \prod_{d=1}^D P(x_d \mid C_k)$$

Trong thực tế, giả thiết này **hầu như luôn luôn sai** (ví dụ trong văn bản, từ "học" và từ "máy" rõ ràng có quan hệ tương quan mạnh mẽ với nhau). Nhưng tại sao Naive Bayes vẫn phân loại rất tốt?

- **Bản chất:** Để đưa ra quyết định phân loại đúng, mô hình không cần phải ước lượng chuẩn xác giá trị xác suất tuyệt đối. Mô hình chỉ cần **bảo toàn đúng thứ tự xếp hạng (Ranking Order)**:
  $$P(C_1 \mid \mathbf{x}) > P(C_2 \mid \mathbf{x})$$
  Dù các xác suất bị phóng đại hoặc lệch do giả thiết độc lập, nếu tỉ số thứ tự giữa các lớp không bị đảo lộn, quyết định phân loại $\arg\max$ vẫn hoàn toàn chính xác!

### Phép làm mịn Laplace cứu nguy như thế nào?
Nếu một từ vựng chưa từng xuất hiện ở lớp $C_1$ trong tập train ($N_{kd} = 0$), thì $P(x_d \mid C_1) = 0$. Vì các xác suất được nhân liên tiếp với nhau:
$$0 \times P(x_1 \mid C_1) \times \dots \times P(x_D \mid C_1) = 0$$
Toàn bộ bằng chứng đanh thép của $D-1$ từ vựng còn lại bị xóa sạch ngay lập tức!
Phép làm mịn Laplace tương đương với việc gán một **phân phối tiên nghiệm Dirichlet** đều:
$$\hat{\theta}_{kd} = \frac{N_{kd} + 1}{N_k + K}$$
Đảm bảo xác suất không bao giờ bằng 0 tuyệt đối.

---

## 7. Nghịch Lý Dữ Liệu Tách Tuyến Tính Trong Hồi Quy Logistic

<span class="focus-key-pill">BẪY THI CỬ 07: SỰ PHÂN KỲ CỦA MAXIMUM LIKELIHOOD</span>

Trong phân loại nhị phân, ta luôn mong muốn dữ liệu khả tách tuyến tính (Linearly Separable) để tìm được ranh giới hoàn hảo. Tuy nhiên, nếu bạn huấn luyện **Hồi quy Logistic không có Regularization (điều chuẩn)** trên tập dữ liệu này:

- Hàm mất mát Cross-Entropy:
  $$E(\mathbf{w}) = - \sum_{n=1}^N \ln \sigma(t_n \mathbf{w}^T \mathbf{x}_n)$$
- Để hàm mất mát này tiến dần về 0 tuyệt đối, thuật toán cần $\sigma(t_n \mathbf{w}^T \mathbf{x}_n) \to 1$, tương đương với:
  $$t_n \mathbf{w}^T \mathbf{x}_n \to +\infty$$
- Thuật toán giải quyết điều này bằng cách nhân vector trọng số $\mathbf{w}$ với một hằng số vô hạn $c \to \infty$. Độ dài của vector trọng số **bùng nổ ra vô cùng** ($\|\mathbf{w}\|_2 \to \infty$)!
- Khi trọng số bùng nổ, hàm Sigmoid bị ép thành hàm bước nhảy dựng đứng (Heaviside step function). Mô hình đưa ra dự đoán với xác suất cực đoan ($0.999999$ hoặc $0.000001$), mất hoàn toàn khả năng thể hiện sự bất định và bị Overfitting nghiêm trọng.

> **Giải pháp bắt buộc:** Luôn bổ sung số hạng phạt trọng số $L_2$ Ridge Penalty $\frac{\lambda}{2}\|\mathbf{w}\|_2^2$ trong hồi quy logistic!

---

## 8. Cây Quyết Định Chiến Lược Chọn Mô Hình Trong Phòng Thi

Khi gặp một bài toán phân loại trong đề thi hoặc dự án, hãy áp dụng lưu đồ tư duy sau:

1. **Dữ liệu có nhiều lớp ($K \ge 3$) và các lớp phân bố cụm elip rõ ràng?**  
   $\to$ Chọn **QDA** (nếu $N_k \gg D$) hoặc **LDA** (nếu số mẫu nhỏ $N_k \le D$ để tránh suy biến ma trận).
2. **Dữ liệu dạng văn bản, số chiều cực lớn ($D \gg 10^4$), cần tốc độ suy luận nhanh?**  
   $\to$ Chọn **Naive Bayes** kết hợp làm mịn Laplace.
3. **Cần xác suất hậu nghiệm tin cậy, không muốn giả định dạng phân phối Gauss cho dữ liệu?**  
   $\to$ Chọn **Hồi quy Logistic** (tối ưu bằng IRLS hoặc L-BFGS, có bổ sung $L_2$ regularization).
4. **Có nên dùng Least Squares cho phân loại không?**  
   $\to$ **KHÔNG BAO GIỜ** (trừ khi đề bài bắt buộc phân tích nhược điểm Masking Effect hoặc Outlier Distortion).

---

## 9. Đọc Toàn Bộ Chứng Minh Giải Tích Khép Kín

Để xem toàn bộ 8 phụ lục chứng minh toán học chi tiết từng bước, xin mời truy cập tài liệu gốc:

* **Tải chuyên khảo Tiếng Việt (111 trang A4, bản chuẩn TeX Live 2025):**  
  [Tải ML_midterm_vi.pdf](/files/midterms/ML_midterm_vi.pdf)
* **Tải chuyên khảo Tiếng Anh (English Edition 111 pages):**  
  [Download ML_midterm_en.pdf](/files/midterms/ML_midterm_en.pdf)
* **Đọc lại Tổng quan kiến trúc & 11 lỗi hệ thống:**  
  [Tổng Quan Ôn Tập Midterm: Bản Đồ Tri Thức 12 Bài Giảng & 11 Điểm Gãy Đổ Hệ Thống](/posts/on-tap-hoc-may-midterm-toan-dien/)
* **Đọc lại Sổ tay tra cứu công thức:**  
  [Sổ Tay Công Thức Cốt Lõi Học Máy Midterm: Bảng Tra Cứu 20+ Phương Trình Hạt Nhân](/posts/so-tay-cong-thuc-hoc-may-midterm/)

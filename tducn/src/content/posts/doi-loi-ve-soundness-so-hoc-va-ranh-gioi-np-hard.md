---
title: "Đôi Lời Về : Soundness Toán Học, Khế Ước Số Thực IEEE 754 & Ranh Giới Bất Khả Thi NP-Hard"
description: "Phân giải toàn diện khái niệm Soundness trong xác minh mạng nơ-ron: Phân biệt rạch ròi với Agreement và Accuracy, ranh giới NP-hard của Katz et al., sai số dấu phẩy động IEEE 754 và thuật toán làm tròn hướng ra ngoài."
publishDate: 2026-11-17T17:00:00+07:00
order: 5
category: "math"
tags: ["AI", "Mathematics", "Optimization", "Certification", "ECDR", "Soundness", "IEEE754"]
featured: true
recommendedFont: "academic"
lang: "vi"
---

> **TÀI LIỆU THAM CHIẾU HỆ THỐNG (ECDR VERIFICATION SPECIFICATION)**  
> Chuyên khảo này phân giải chi tiết khái niệm **Tính Đúng Đắn (Soundness)** cùng chiếc cầu nối số học giữa lý thuyết giải tích và phần cứng máy tính, được trích xuất trực tiếp từ các hồ sơ khoa học của dự án:
> 
> - **Định nghĩa Soundness & Completeness:** [07_SUPP03_Certification_Methods.tex#L260-L270](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/07_SUPP03_Certification_Methods.tex#L260-L270).
> - **Phân tách 5 đại lượng hạt nhân (Khái niệm C28):** [05_ECDR_Mathematics_Concepts_104_Atlas.tex#L3321-L3339](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/05_ECDR_Mathematics_Concepts_104_Atlas.tex#L3321-L3339).
> - **Mô hình sai số IEEE 754 & Làm tròn hướng ra ngoài:** [09_SUPP06_Float_Precision.tex#L87-L122](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/09_SUPP06_Float_Precision.tex#L87-L122).
> - **Khế ước nghĩa vụ số học (Numerical Soundness Contract):** [01_04_THEORY.md#L215-L230](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/01_04_THEORY.md#L215-L230).
> - **Bộ xác minh CROWN 64-bit thực thi kiểm chứng:** [week3_verifier.py](https://github.com/tducn110/ecdr-sensor-inference/blob/main/ecdr/week3_verifier.py).

---

## 1. Đôi Lời Về : Định Nghĩa Toán Học Của Soundness & Completeness

Trong lý thuyết kiểm chứng hình thức (formal verification) và chứng nhận mạng nơ-ron, hai khái niệm **Soundness** (tính đúng đắn) và **Completeness** (tính đầy đủ) thường bị hiểu sai hoặc đánh đồng.

```
                      BÀI TOÁN XÁC MINH AN TOÀN TOÁN HỌC
               Kiểm tra: inf_{x in S} (F_a(x) - F_j(x)) > 0 ?
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           ▼                                                     ▼
     [SOUND VERIFIER]                                   [COMPLETE VERIFIER]
  KHÔNG BAO GIỜ BÁO DƯƠNG TÍNH GIẢ                    KHÔNG BAO GIỜ BÁO ÂM TÍNH GIẢ
  (Zero False Positives)                             (Zero False Negatives)
  Khi bảo an toàn -> Chắc chắn an toàn 100%!         Khi thực sự an toàn -> Luôn chứng minh được!
  Có thể chấp nhận từ chối nhầm                      Không bỏ sót bất kỳ miền an toàn nào
```

### 1.1. Định Nghĩa Bộ Xác Minh Đúng Đắn (Sound Verifier)
Cho mô hình phân loại tham chiếu $F: \mathbb{R}^d \to \mathbb{R}^K$, một miền ứng viên $\mathcal{S} \subset \mathbb{R}^d$ và mỏ neo có lớp chiến thắng $a = \arg\max_k F_k(x^r)$.
Một bộ xác minh $V$ được gọi là **Sound (Đúng đắn)** khi và chỉ khi:
$$
V(\mathcal{S}, a) = \text{SAFE} \implies \inf_{\mathbf{x} \in \mathcal{S}} \left(F_a(\mathbf{x}) - \max_{j \ne a} F_j(\mathbf{x})\right) > 0
$$
Nói cách khác: **Bộ xác minh đúng đắn không bao giờ đưa ra dương tính giả (Zero False Positives)**. Nếu thuật toán xác nhận miền $\mathcal{S}$ là an toàn, thì mọi điểm bên trong $\mathcal{S}$ được bảo đảm $100\%$ không bao giờ bị đổi nhãn. Ngược lại, nếu thuật toán trả về `UNSAFE` hoặc `INCONCLUSIVE`, miền đó chưa chắc đã mất an toàn (có thể do thuật toán tính cận bị lỏng).

### 1.2. Định Nghĩa Bộ Xác Minh Đầy Đủ (Complete Verifier)
Một bộ xác minh $V$ được gọi là **Complete (Đầy đủ)** khi và chỉ khi:
$$
\inf_{\mathbf{x} \in \mathcal{S}} \left(F_a(\mathbf{x}) - \max_{j \ne a} F_j(\mathbf{x})\right) > 0 \implies V(\mathcal{S}, a) = \text{SAFE}
$$
Nghĩa là: **Bộ xác minh đầy đủ không bao giờ đưa ra âm tính giả (Zero False Negatives)**. Bất cứ khi nào miền $\mathcal{S}$ thực sự an toàn, thuật toán chắc chắn sẽ chứng minh được điều đó.

### 1.3. Ranh Giới Bất Khả Thi NP-Hard (Định Lý Katz et al., 2017)
Một câu hỏi hiển nhiên: *Tại sao chúng ta không thiết kế một bộ xác minh vừa Sound vừa Complete?*

Câu trả lời nằm ở định lý nền tảng của Katz et al. (2017) [07_SUPP03_Certification_Methods.tex#L271-L275](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/07_SUPP03_Certification_Methods.tex#L271-L275):
> **Định lý (Độ phức tạp tính toán):** Bài toán xác minh xem một mạng nơ-ron nhiều tầng với hàm kích hoạt ReLU có duy trì tính bền vững trên một quả cầu $\ell_\infty$ hay không là một bài toán **NP-hard**.

Hệ quả toán học trực tiếp: Trừ phi $\text{P} = \text{NP}$, **không thể tồn tại một thuật toán thời gian đa thức nào vừa đúng đắn (Sound) vừa đầy đủ (Complete)** cho mạng nơ-ron tổng quát.
Vì mục tiêu tối thượng của các hệ thống an toàn biên là không bao giờ được phép phân loại sai, các phương pháp như IBP hay CROWN bắt buộc phải đưa ra sự đánh đổi triệt để: **Bảo vệ Soundness tuyệt đối và chấp nhận Incomplete** (tức chấp nhận từ chối chứng nhận một số miền an toàn để đổi lấy thời gian chạy đa thức).

---

## 2. Đôi Lời Về : Phân Tách 5 Khái Niệm Thường Bị Đánh Đồng (Concept C28)

Trong tài liệu [05_ECDR_Mathematics_Concepts_104_Atlas.tex#L3321-L3339](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/05_ECDR_Mathematics_Concepts_104_Atlas.tex#L3321-L3339), Khái niệm **C28** chỉ ra 5 đại lượng thường bị các nhà nghiên cứu nhầm lẫn hoặc đánh tráo:

```
[SOUNDNESS]  ──> Hệ quả logic phổ quát dưới giả thiết tuyên bố (Universal implication).
[AGREEMENT]  ──> Tỷ lệ trùng khớp quyết định với mạng tham chiếu trên tập quan sát.
[ACCURACY]   ──> Tỷ lệ trùng khớp với nhãn thực tế của con người (Ground truth).
[COVERAGE]   ──> Tần suất một miền hoặc cổng chấp nhận truy vấn (Tỷ lệ tái sử dụng).
[NET BENEFIT]──> Lượng thời gian hoặc năng lượng thực sự tiết kiệm được sau trừ overhead.
```

### 2.1. Soundness Không Phải Là Agreement
- **Agreement (Độ đồng thuận):** Là thước đo thực nghiệm trên một tập con hữu hạn các mẫu quan trắc:
  $$
  A_r = \frac{N_{\text{agree}}}{N_{\text{reused}}}
  $$
- Một kỹ sư chạy thử 1,000 cửa sổ và thấy $A_r = 1.0$ ($100\%$ không có lỗi sai nào). Điều đó **không đồng nghĩa với việc hệ thống đạt Soundness**. Sự trùng khớp trên 1,000 mẫu hữu hạn không thể thay thế cho chứng chỉ giải tích bảo đảm vô số điểm trong không gian liên tục $\mathcal{S}$ đều an toàn.

### 2.2. Agreement Không Phải Là Accuracy
- Đối tượng mà ECDR bảo toàn là **quyết định của mô hình tham chiếu** ($F(x)$), không phải nhãn thực tế ($y_t$).
- Nếu tại mỏ neo $x^r$, mạng nơ-ron phân loại nhầm người đang đi bộ thành đang chạy xe, và chứng chỉ ECDR xác nhận miền quanh $x^r$ bất biến, thì mọi truy vấn trong miền đó sẽ được gán nhãn "chạy xe" với độ đồng thuận $A_r = 100\%$ so với mạng, nhưng độ chính xác thực tế so với con người lại là $0\%$.

### 2.3. Soundness Không Kéo Theo Coverage & Net Benefit
- Bạn có thể xây dựng một bộ xác minh Sound $100\%$ bằng cách luôn trả về bán kính $\rho = 0$. Thuật toán không bao giờ sai, nhưng độ phủ tái sử dụng $R_{\text{cert}} = 0\%$.
- Tương tự, nếu độ phủ đạt $100\%$ nhưng chi phí kiểm tra thuộc miền lớn hơn chi phí chạy mạng CNN, lợi ích ròng (Net Benefit) sẽ bị âm.

---

## 3. Đôi Lời Về : Cầu Nối Số Thực $\mathbb{R}$ Sang Chuẩn Nổi IEEE 754

Các chứng minh toán học thường đặt tiền đề trên trường số thực liên tục $\mathbb{R}$. Tuy nhiên, trên vi điều khiển nhúng, mọi con số đều được biểu diễn hữu hạn dưới chuẩn **IEEE 754**.

```
Số Thực Lý Thuyết: x in R (Độ chính xác vô hạn)
                          │
                   [LÀM TRÒN PHẦN CỨNG]
                          │
                          ▼
Chuẩn Nổi IEEE 754 Float32: fl(x) = x(1 + delta),  |delta| <= u = 2^(-24)
                          │
              [CỘNG DỒN SAI SỐ MA TRẬN]
                          │
                          ▼
Sai Số Tích Lũy: |fl(F_k(x)) - F_k(x)| <= tau_fp
                          │
           [BIÊN AN TOÀN PHÒNG THỦ SỐ HỌC]
                          │
                          ▼
            min_j ell_aj > 2 * tau_fp  ===> BẢO ĐẢM SOUNDNESS PHẦN CỨNG!
```

### 3.1. Machine Epsilon & Sai Số Lan Truyền Tích Vô Hướng
Trong chuẩn IEEE 754 [09_SUPP06_Float_Precision.tex#L87-L105](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/09_SUPP06_Float_Precision.tex#L87-L105):
- Kiểu `float32` (đơn) sử dụng 23 bit mantissa, cho machine epsilon:
  $$
  \varepsilon_{\text{mach}} = 2^{-23} \approx 1.192 \times 10^{-7}, \quad u = \frac{\varepsilon_{\text{mach}}}{2} = 2^{-24} \approx 5.960 \times 10^{-8}
  $$
- Kiểu `float64` (kép) sử dụng 52 bit mantissa, cho machine epsilon:
  $$
  \varepsilon_{\text{mach}} = 2^{-52} \approx 2.220 \times 10^{-16}, \quad u = 2^{-53} \approx 1.110 \times 10^{-16}
  $$

Khi thực hiện tích vô hướng $\mathbf{a}^\top \mathbf{b}$ giữa hai vector độ dài $n$ (với $n = 768$ trong cửa sổ IMU), sai số làm tròn tích lũy được chặn bởi công thức giải tích Higham:
$$
\left|\mathrm{fl}\left(\mathbf{a}^\top \mathbf{b}\right) - \mathbf{a}^\top \mathbf{b}\right| \le \gamma_n \sum_{i=1}^n |a_i b_i|, \quad \gamma_n = \frac{n u}{1 - n u}
$$
Với $n = 768$ và $u = 2^{-24}$, hệ số $\gamma_{768} \approx 768 \times 5.96 \times 10^{-8} \approx 4.577 \times 10^{-5}$.

### 3.2. Khế Ước Sai Số Số Thực $\tau_{\text{fp}}$ Trong ECDR
Tại tài liệu [01_04_THEORY.md#L215-L230](https://github.com/tducn110/ecdr-sensor-inference/blob/main/03_MATH/01_04_THEORY.md#L215-L230) và báo cáo khoa học [02_Dossier_Scientific_Report.tex#L284-L286](https://github.com/tducn110/ecdr-sensor-inference/blob/main/04_SYNTHESIS/02_Dossier_Scientific_Report.tex#L284-L286), sai số toàn trình của mạng `SmallCNN1D` trên phần cứng CPU được xác lập nghiêm ngặt:
$$
\tau_{\text{fp}} \in \left[1.17 \times 10^{-5}, \, 4.63 \times 10^{-5}\right]
$$
Hàm biên độ logit tính toán trên máy $\hat{g}_{aj}(\mathbf{x}) = \hat{F}_a(\mathbf{x}) - \hat{F}_j(\mathbf{x})$ có thể sai lệch tối đa:
$$
\left|\hat{g}_{aj}(\mathbf{x}) - g_{aj}(\mathbf{x})\right| \le \left|\hat{F}_a(\mathbf{x}) - F_a(\mathbf{x})\right| + \left|\hat{F}_j(\mathbf{x}) - F_j(\mathbf{x})\right| \le 2\tau_{\text{fp}}
$$

**Quy tắc phòng thủ bắt buộc:** Để một chứng chỉ được coi là Sound trên phần cứng thực tế, cận dưới tính toán được $\hat{\ell}_{aj}$ phải vượt qua ngưỡng $2\tau_{\text{fp}}$:
$$
\min_{j \ne a} \hat{\ell}_{aj} > 2\tau_{\text{fp}} \approx 9.26 \times 10^{-5}
$$
Mọi trường hợp có cận dưới nằm trong khoảng $(0, 2\tau_{\text{fp}}]$ đều bị coi là **Nguy Cơ Hòa Điểm (Tie Risk)** và lập tức bị từ chối tái sử dụng.

---

## 4. Đôi Lời Về : Kỹ Thuật Làm Tròn Hướng Ra Ngoài (Directed Outward Rounding)

Để bảo đảm tính đúng đắn trong số học khoảng (Interval Arithmetic) mà không bị phụ thuộc vào sai số làm tròn ngẫu nhiên của bộ xử lý, bộ xác minh trong [week3_verifier.py](https://github.com/tducn110/ecdr-sensor-inference/blob/main/ecdr/week3_verifier.py) áp dụng kỹ thuật **Làm tròn hướng ra ngoài (Directed Outward Rounding)**:

```
Khoảng Lý Thuyết:               [        l        ,        u        ]
Phép Tính Float32 Làm Tròn:   rd(l) <--- l                  u ---> ru(u)
Khoảng Mở Rộng An Toàn:         [  rd(l - eps)   ,   ru(u + eps)   ]
===> KHOẢNG MÁY TÍNH LUÔN BAO TRỌN 100% KHOẢNG THỰC TẾ!
```

### Nguyên lý thiết lập:
Thay vì dùng chế độ làm tròn mặc định về số chẵn gần nhất (`round-to-nearest`), hệ thống ép các phép toán khoảng theo hai hướng đối cực:
- Khi tính cận dưới $l$, máy tính ép làm tròn xuống phía âm vô cùng: $\operatorname{rd}(x) = \operatorname{round}_{-\infty}(x)$.
- Khi tính cận trên $u$, máy tính ép làm tròn lên phía dương vô cùng: $\operatorname{ru}(x) = \operatorname{round}_{+\infty}(x)$.

Đối với phép cộng hai khoảng $[l_1, u_1] + [l_2, u_2]$:
$$
[l_{\text{sum}}, u_{\text{sum}}] = \left[\operatorname{rd}(l_1 + l_2), \, \operatorname{ru}(u_1 + u_2)\right]
$$
Đối với phép nhân với ma trận trọng số $W$:
$$
W \cdot [l, u] = \left[\operatorname{rd}\left(W^+ l + W^- u\right), \, \operatorname{ru}\left(W^+ u + W^- l\right)\right]
$$
trong đó $W^+ = \max(W, 0)$ và $W^- = \min(W, 0)$.  
Kỹ thuật này bảo đảm một bất biến toán học tuyệt đối: **Khoảng giá trị tính toán trên máy tính luôn là một tập bao (enclosure) chứa trọn vẹn $100\%$ kết quả số thực lý thuyết**.

---

## 5. Kết Luận

Nghiên cứu về Soundness trong dự án ECDR mang lại thông điệp then chốt cho các hệ thống AI an toàn:
1. **Tính đúng đắn là khế ước giải tích, không phải thống kê:** Không bao giờ được dùng tỷ lệ không lỗi trên tập kiểm thử để suy diễn rằng hệ thống đạt Soundness.
2. **Chấp nhận sự bất toàn của NP-Hard:** Vì bài toán xác minh mạng ReLU là NP-hard, ta phải chấp nhận sự không đầy đủ (Incompleteness) của các bộ xác minh lồi như CROWN để đổi lấy sự bảo đảm đúng đắn tuyệt đối trong thời gian thực.
3. **Phần cứng là một phần của phương trình toán học:** Mọi chứng minh số thực trên $\mathbb{R}$ đều trở nên vô nghĩa nếu không tính đến sai số làm tròn $2\tau_{\text{fp}}$ của chuẩn IEEE 754 và kỹ thuật làm tròn hướng ra ngoài.

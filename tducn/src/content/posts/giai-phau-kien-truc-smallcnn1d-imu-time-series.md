---
title: "Giải Phẫu Kiến Trúc SmallCNN1D Cho Dữ Liệu Cảm Biến IMU: Bản Chất Toán Học Conv 1-2-3, Batch Sizing & Tiến Trình Trường Tiếp Nhận"
description: "Phân tích toán học và cấu trúc của mạng SmallCNN1D trên chuỗi thời gian 6 kênh IMU (tập dữ liệu HAPT): Tiến trình mở rộng trường tiếp nhận từ 5 đến 20 mẫu, cân bằng phương sai Batch 128 vs 512, bảng kế toán 283,692 tham số và lý do Dense head phá vỡ tính triệt tiêu GAP."
publishDate: 2026-11-17T16:00:00+07:00
order: 1
category: "engineering"
tags: ["AI", "DeepLearning", "CNN", "TimeSeries", "ReceptiveField", "Optimization", "IMU"]
featured: false
recommendedFont: "academic"
lang: "vi"
---

> **BỐI CẢNH NGHIÊN CỨU & KIỂM CHỨNG THỰC NGHIỆM (HỆ THỐNG ECDR 2026)**  
> Chuyên khảo này phân tích trực tiếp cấu trúc mô hình mạng tích chập 1 chiều (`SmallCNN1D`) được đóng băng làm mô hình tham chiếu (frozen reference backbone) trong nghiên cứu Tái Sử Dụng Quyết Định Theo Điều Kiện Biến Cố (Event-Conditioned Decision Reuse - ECDR) trên tập dữ liệu Human Activity and Postural Transitions (HAPT):
> 
> - **Mã nguồn tham chiếu:** `scripts/backbone.py` và cấu hình thực thi `configs/backbone.yaml`.
> - **Tập trọng số đóng băng:** Checkpoint `selected_best.pt` (Seed 43, Epoch 8, SHA-256: `8ffc5dd8...adb1`).
> - **Quy mô tham số:** 283,692 tham số huấn luyện (12 lớp hành vi), kích thước trọng số nhị phân xấp xỉ 1.08 MiB (float32).
> - **Hiệu năng kiểm chứng:** Tái hiện chính xác 5,053/5,053 logits trên tập kiểm thử (độ lệch tuyệt đối 0.0), độ chính xác 89.05%, macro-F1 đạt 77.63% trên 3,572 cửa sổ có nhãn giám sát.

---

## 1. Không Gian Dữ Liệu Đầu Vào & Đặc Tính Tín Hiệu Cảm Biến Biên

Để hiểu vì sao các tầng tích chập lại có kích thước kernel và stride như hiện tại, trước hết cần thiết lập không gian toán học của tín hiệu đầu vào từ cảm biến chuyển động IMU (Inertial Measurement Unit).

```
[Raw IMU 50 Hz] -> (ax, ay, az, gx, gy, gz)
      │
      ▼
[Sliding Window] -> Độ dài W = 128 (2.56 s), Bước nhảy S = 64 (1.28 s, overlap 50%)
      │
      ▼
[Per-channel Norm] -> x_tilde = (x - mu_train) / sigma_train
      │
      ▼
Tensor X in R^(B x 6 x 128)
```

### 1.1. Cấu trúc Tensor Đầu Vào
Mỗi cửa sổ phân tích là một ma trận tín hiệu 2 chiều gồm 6 kênh quan trắc độc lập:
- 3 trục gia tốc kế tuyến tính (linear accelerometer): $a_x, a_y, a_z$ (đơn vị: $g \approx 9.81\text{ m/s}^2$).
- 3 trục vận tốc góc con quay hồi chuyển (gyroscope): $g_x, g_y, g_z$ (đơn vị: $\text{rad/s}$).

Tín hiệu được lấy mẫu đồng bộ tại tần số danh nghĩa $f_s = 50\text{ Hz}$ (khoảng cách lấy mẫu $\Delta t = 20\text{ ms}$). Chiều dài cửa sổ được cố định tại $W = 128$ mẫu, tương ứng với khoảng thời gian quan sát liên tục:
$$
T_{\text{window}} = \frac{W}{f_s} = \frac{128}{50} = 2.56\text{ s}
$$
Bước nhảy cửa sổ (sliding stride) là $S = 64$ mẫu ($1.28\text{ s}$), tạo ra độ chồng lấp đúng $50\%$. Do đó, đối với một batch gồm $B$ cửa sổ, tensor đầu vào đưa vào mạng có dạng:
$$
\mathbf{X} \in \mathbb{R}^{B \times 6 \times 128}
$$

### 1.2. Chuẩn Hóa Theo Kênh Tĩnh (Stationary Per-Channel Normalization)
Để đảm bảo gradient ổn định khi truyền ngược qua các hàm kích hoạt phi tuyến và tránh rò rỉ thông tin (data leakage) giữa các tập phân chia dữ liệu, tham số chuẩn hóa $(\boldsymbol{\mu}, \boldsymbol{\sigma})$ được tính toán tĩnh chỉ trên tập huấn luyện (TRAIN):
$$
\mu_c = \frac{1}{N_{\text{train}} \cdot W} \sum_{i=1}^{N_{\text{train}}} \sum_{t=0}^{W-1} X^{(i)}_{c, t}, \qquad \sigma_c = \max\left(10^{-6}, \sqrt{\frac{1}{N_{\text{train}} \cdot W} \sum_{i=1}^{N_{\text{train}}} \sum_{t=0}^{W-1} \left(X^{(i)}_{c, t} - \mu_c\right)^2}\right)
$$
Tín hiệu đưa vào mạng được ánh xạ theo công thức phần tử:
$$
\tilde{X}_{c, t} = \frac{X_{c, t} - \mu_c}{\sigma_c}, \quad \forall c \in \{0, \dots, 5\}, \, t \in \{0, \dots, 127\}
$$

---

## 2. Vì Sao Sử Dụng Mạng 1D CNN Thay Vì RNN Hay Transformer?

Trong bài toán phân loại chuỗi thời gian trên thiết bị nhúng (Edge AI), việc lựa chọn mô hình không chỉ dựa trên năng lực biểu diễn lý thuyết mà phụ thuộc chặt chẽ vào ràng buộc độ trễ (latency budget) và công suất tiêu thụ (power budget).

### 2.1. So Sánh Động Học Tính Toán

1. **Mạng Hồi quy tuần tự (RNN, LSTM, GRU):**
   - Bản chất tính toán: Trạng thái ẩn $h_t = f(W_{hh} h_{t-1} + W_{xh} x_t)$ mang tính phụ thuộc tuần tự nghiêm ngặt (sequential dependency) theo trục thời gian $t$.
   - Nhược điểm: Không thể song song hóa phép tính theo trục thời gian; thời gian tính toán phụ thuộc tuyến tính vào chiều dài cửa sổ $W = 128$. Hiện tượng triệt tiêu gradient (vanishing gradient) đòi hỏi các cổng phức tạp, làm tăng độ trễ truy xuất bộ nhớ (memory bandwidth bound).

2. **Kiến trúc Transformer (Self-Attention):**
   - Bản chất tính toán: Ma trận tương tác toàn cục $A = \operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$.
   - Nhược điểm: Độ phức tạp tính toán và bộ nhớ tăng theo hàm bậc hai $\mathcal{O}(W^2 \cdot C)$. Với $W = 128$, việc tính ma trận $128 \times 128$ cho mỗi head gây lãng phí chu kỳ xử lý không cần thiết, trong khi đặc tính của tín hiệu cảm biến sinh cơ học chủ yếu mang tính cục bộ (local temporal correlations).

3. **Mạng Tích Chập 1 Chiều (1D CNN):**
   - Khai thác tối đa tính bất biến dịch chuyển cục bộ (local translation equivariance) và mối liên kết thời gian lân cận.
   - Các phép tính tích chập $\mathbf{W} * \mathbf{x}$ hoàn toàn có thể vector hóa trên tập lệnh SIMD (AVX2, AVX-512 hoặc ARM NEON) thông qua phép nhân ma trận tổng quát `im2col` hoặc các kernel tối ưu hóa.
   - Đo đạc thực nghiệm trên CPU chuẩn: Thời gian suy luận cho một cửa sổ chỉ mất xấp xỉ $0.24\text{ ms}$, hoàn toàn đáp ứng yêu cầu streaming thời gian thực với tần số phát sinh sự kiện $50\text{ Hz}$ ($20\text{ ms}$ cho mỗi mẫu).

---

## 3. Bản Chất Của Batch Size: Huấn Luyện $B=128$ Đối Đầu Suy Luận $B=1$ và $B=512$

Khái niệm `batch` trong học máy thường bị xem nhẹ như một tham số điều chỉnh tùy tiện (hyperparameter). Tuy nhiên, trong mô hình xử lý chuỗi thời gian với Batch Normalization, `batch` quyết định trực tiếp đến phương sai của gradient và thông lượng bộ nhớ cache.

```
[Huấn luyện (Training)] -> B = 128 -> Ước lượng 16,384 điểm/kênh -> Gradient ổn định, BN chuẩn xác
[Suy luận Biên (Online)] -> B = 1   -> Xử lý FIFO thời gian thực -> Độ trễ buffer = 0 ms (0.24 ms CPU)
[Đánh giá Lô (Offline)]  -> B = 512 -> Tối ưu hóa Vector SIMD   -> Tận dụng tối đa băng thông bộ nhớ
```

### 3.1. Động Lực Toán Học Khi Huấn Luyện: $B_{\text{train}} = 128$

Xét hàm mất mát trên toàn bộ phân phối dữ liệu $\mathcal{L}(\theta) = \mathbb{E}[\ell_i(\theta)]$. Khi ước lượng gradient qua một mini-batch kích thước $B$:
$$
\mathbf{g}_B(\theta) = \frac{1}{B} \sum_{i=1}^B \nabla_\theta \ell_i(\theta)
$$
Kỳ vọng và phương sai của gradient mini-batch thỏa mãn:
$$
\mathbb{E}[\mathbf{g}_B(\theta)] = \nabla \mathcal{L}(\theta), \qquad \operatorname{Var}(\mathbf{g}_B(\theta)) = \frac{1}{B} \boldsymbol{\Sigma}_{\text{grad}}
$$
- Nếu $B$ quá nhỏ (ví dụ $B \in \{4, 8\}$): Phương sai gradient lớn làm quỹ đạo tối ưu hóa trong thuật toán Adam bị nhiễu loạn nghiêm trọng, dẫn đến việc cập nhật momentum bậc một và bậc hai thiếu chính xác.
- Thống kê của tầng Batch Normalization: Mỗi kênh $c$ tại tầng Conv thứ $\ell$ có tensor kích thước $(B, C_\ell, T_\ell)$. Thống kê mini-batch được tính trên tập hợp các phần tử:
  $$
  \mu_B = \frac{1}{B \cdot T_\ell} \sum_{i=1}^B \sum_{t=0}^{T_\ell-1} X_{i, c, t}, \qquad \sigma_B^2 = \frac{1}{B \cdot T_\ell} \sum_{i=1}^B \sum_{t=0}^{T_\ell-1} (X_{i, c, t} - \mu_B)^2
  $$
  Ở tầng Conv1 ($T_1 = 128$), với $B = 128$, tổng số mẫu tham gia ước lượng trung bình và phương sai là:
  $$
  N_{\text{norm}} = 128 \times 128 = 16,384 \text{ samples}
  $$
  Số lượng $16,384$ điểm dữ liệu đảm bảo phương sai mẫu của $\mu_B$ và $\sigma_B^2$ cực kỳ nhỏ ($\sim \mathcal{O}(1/N_{\text{norm}}) \approx 6.1 \times 10^{-5}$), giúp giá trị trung bình chạy (running mean) và phương sai chạy (running variance) hội tụ mượt mà tới phân phối chuẩn tắc $\mathcal{N}(0, 1)$.

### 3.2. Động Lực Suy Luận: $B_{\text{inf}} = 1$ (Streaming) vs $B_{\text{inf}} = 512$ (Batch Evaluation)

Trong giai đoạn triển khai thực tế, chế độ suy luận được chia làm 2 hình thái đối lập:

1. **Chế độ Streaming Biên (Online Streaming, $B=1$):**
   - Thiết bị cảm biến ghi nhận dữ liệu liên tục theo dạng bộ đệm FIFO (First-In-First-Out).
   - Khi có đủ 128 mẫu mới (hoặc sau mỗi bước nhảy 64 mẫu), mạng phải đưa ra kết luận ngay lập tức.
   - Nếu áp dụng batch $B > 1$, hệ thống buộc phải chờ thu thập đủ nhiều cửa sổ, tạo ra độ trễ đệm (buffering delay) không thể chấp nhận được trong các bài toán an toàn hoặc phát hiện té ngã.
   - Ở chế độ này, Batch Normalization chuyển sang trạng thái đánh giá (`model.eval()`), sử dụng vector trung bình động tĩnh $\hat{\boldsymbol{\mu}}$ và phương sai động $\hat{\boldsymbol{\sigma}}^2$ đã đóng băng, đảm bảo phép biến đổi trở thành một phép ánh xạ affine đơn nhất độc lập giữa các mẫu.

2. **Chế độ Đánh Giá Ngoại Tuyến (Offline Evaluation, $B=512$):**
   - Khi cần kiểm thử trên toàn bộ luồng 5,053 cửa sổ của tập test, việc chạy $B=1$ lặp lại 5,053 lần sẽ chịu chi phí overhead rất lớn từ lệnh gọi hàm (function call overhead), quản lý luồng CPU và chuyển dịch con trỏ bộ nhớ.
   - Thiết lập $B=512$ nạp đồng thời 512 cửa sổ vào bộ nhớ RAM/Cache, giúp các thư viện BLAS (như OpenBLAS, Intel MKL) tận dụng tối đa chiều rộng thanh ghi vector (vector registers 256-bit hoặc 512-bit) và kỹ thuật unrolling loops.

---

## 4. Giải Phẫu Chi Tiết Chuỗi Tích Chập: Conv 1, Conv 2, Conv 3

Kiến trúc SmallCNN1D gồm chuỗi 3 khối tích chập liên tiếp, xen kẽ bởi các tầng gộp cực đại (MaxPooling):

```
Input: (B, 6, 128)
  │
  ├─ [Conv 1]   k=5, s=1, p=2 (6 -> 32 channels)  ==> Output: (B, 32, 128)
  ├─ [BN 1]     BatchNorm1d(32)
  ├─ [ReLU]
  ├─ [Pool 1]   MaxPool1d(k=2, s=2)                ==> Output: (B, 32, 64)
  │
  ├─ [Conv 2]   k=3, s=1, p=1 (32 -> 64 channels) ==> Output: (B, 64, 64)
  ├─ [BN 2]     BatchNorm1d(64)
  ├─ [ReLU]
  ├─ [Pool 2]   MaxPool1d(k=2, s=2)                ==> Output: (B, 64, 32)
  │
  ├─ [Conv 3]   k=3, s=1, p=1 (64 -> 64 channels) ==> Output: (B, 64, 32)
  ├─ [BN 3]     BatchNorm1d(64)
  ├─ [ReLU]     (KHÔNG DÙNG POOLING)
  │
  ▼
Flatten -> (B, 2048) -> Linear(2048 -> 128) -> ReLU -> Linear(128 -> 12) -> Logits
```

### 4.1. Conv 1: Kernel $k_1 = 5$, Padding $p_1 = 2$, Kênh $6 \to 32$

#### Tại sao Kernel size lại là 5 thay vì 3?
Ở tần số lấy mẫu $f_s = 50\text{ Hz}$, mỗi bước nhảy thời gian tương ứng với $\Delta t = 20\text{ ms}$. Kích thước kernel $k_1 = 5$ bao trùm một khoảng thời gian liên tục:
$$
\tau_1 = k_1 \times \Delta t = 5 \times 20\text{ ms} = 100\text{ ms} = 0.10\text{ s}
$$
Ý nghĩa vật lý và sinh cơ học:
- Tín hiệu gia tốc kế từ cơ thể người luôn bị ảnh hưởng bởi rung chấn cơ học vi mô tần số cao (mechanical tremor, sensor electrical noise) với dải tần thường nằm trên $20\text{ Hz}$ (chu kỳ dao động $< 50\text{ ms}$).
- Nếu dùng $k_1 = 3$ ($60\text{ ms}$), bộ lọc quá hẹp để có thể học được dạng sóng đạo hàm bậc hai (jerk - độ giật của gia tốc) mà dễ bị khớp quá mức vào nhiễu vi mô cục bộ.
- Ngược lại, cửa sổ $100\text{ ms}$ là khoảng thời gian diễn ra va chạm động học gót chân tiếp đất (heel-strike event) hoặc chuyển đổi góc quay cổ tay. Kernel kích thước 5 cho phép mạng học đồng thời các bộ lọc thông thấp (low-pass filter) làm mịn tín hiệu và bộ lọc vi sai (derivative filter) phát hiện đỉnh gia tốc.

#### Vai trò của MaxPool1D($k=2, s=2$) sau Conv 1:
- Giảm độ phân giải thời gian từ 128 xuống 64 mẫu.
- Tần số lấy mẫu biểu kiến sau tầng gộp giảm xuống $25\text{ Hz}$ ($\Delta t' = 40\text{ ms}$).
- Giảm một nửa chi phí tính toán cho các tầng tích chập kế tiếp.

### 4.2. Conv 2: Kernel $k_2 = 3$, Padding $p_2 = 1$, Kênh $32 \to 64$

#### Tại sao chuyển về Kernel size 3?
Sau tầng MaxPool thứ nhất, mỗi vị trí biểu diễn một khoảng thời gian $40\text{ ms}$. Khi đó, một kernel $k_2 = 3$ sẽ bao phủ một khoảng thời gian vật lý:
$$
\tau_2 = 3 \times 40\text{ ms} = 120\text{ ms}
$$
Nhờ tầng gộp trước đó, kernel kích thước 3 tại Conv 2 đã có khả năng quan sát tương đương một kernel kích thước 6 trên tín hiệu gốc, nhưng chỉ tiêu tốn 3 trọng số trên mỗi kết nối kênh.
- Số kênh được nâng từ 32 lên 64 nhằm tăng dung lượng biểu diễn (representation capacity). Ở tầng này, mạng không còn nhìn các trục $a_x, a_y, a_z$ riêng lẻ mà bắt đầu học các đặc trưng tương quan chéo (cross-axis dynamic patterns) như tích vô hướng giữa gia tốc và vận tốc góc để ước lượng phương hướng chuyển động.

#### Tầng MaxPool1D($k=2, s=2$) thứ hai:
- Nén chiều dài đặc trưng từ 64 xuống 32 mẫu.
- Bước nhảy biểu kiến đối với tín hiệu gốc tăng lên thành 4 mẫu ($80\text{ ms}$).

### 4.3. Conv 3: Kernel $k_3 = 3$, Padding $p_3 = 1$, Kênh $64 \to 64$

#### Vì sao KHÔNG sử dụng Pooling sau Conv 3?
Đây là một quyết định kiến trúc then chốt trong `SmallCNN1D`:
1. Nếu tiếp tục áp dụng MaxPool1D($s=2$) sau Conv 3, chiều thời gian sẽ bị rút ngắn chỉ còn 16 mẫu ($128 / 8 = 16$).
2. Tập dữ liệu HAPT bao gồm 12 nhãn, trong đó có 6 trạng thái tĩnh/động đều đặn (WALKING, WALKING_UPSTAIRS, WALKING_DOWNSTAIRS, SITTING, STANDING, LAYING) và 6 hành vi chuyển thế (POSTURAL TRANSITIONS):
   - STAND-TO-SIT, SIT-TO-STAND
   - SIT-TO-LIE, LIE-TO-SIT
   - STAND-TO-LIE, LIE-TO-STAND
3. Các hành vi chuyển thế có thời lượng diễn ra rất ngắn (thường chỉ kéo dài từ $0.5\text{ s}$ đến $1.5\text{ s}$) và có cấu trúc bất đối xứng theo thời gian nghiêm ngặt. Việc giữ nguyên 32 vị trí không gian - thời gian cho phép mô hình duy trì độ phân giải tọa độ thời gian đủ mịn để phân biệt rõ pha bắt đầu, pha cao trào và pha kết thúc của một cú đổi tư thế.

---

## 5. Đạo Hàm Toán Học Về Tiến Trình Trường Tiếp Nhận (Receptive Field Evolution)

Trường tiếp nhận (Receptive Field - RF) là số lượng mẫu của tín hiệu đầu vào nguyên bản có ảnh hưởng trực tiếp đến một giá trị phần tử tại tầng đầu ra thứ $\ell$.

### 5.1. Hệ Thức Truy Hồi Tổng Quát
Đối với chuỗi toán tử 1 chiều (1D Convolution / 1D Pooling) không giãn cách (dilation $d=1$), gọi:
- $r_\ell$: Bán kính trường tiếp nhận tại tầng $\ell$ (tính bằng số mẫu đầu vào).
- $j_\ell$: Bước nhảy (jump / stride tích lũy) giữa hai phần tử liền kề tại tầng $\ell$.
- $k_\ell$: Kích thước kernel của toán tử tại tầng $\ell$.
- $s_\ell$: Bước trượt (stride) của toán tử tại tầng $\ell$.

Hệ thức truy hồi được thiết lập theo quy tắc mở rộng:
$$
r_{\ell+1} = r_\ell + (k_\ell - 1) j_\ell
$$
$$
j_{\ell+1} = s_\ell \cdot j_\ell
$$
với điều kiện khởi tạo tại tín hiệu gốc: $r_0 = 1, j_0 = 1$.

### 5.2. Bảng Tính Tiến Trình Trường Tiếp Nhận Từng Lớp

| Thứ tự tầng ($\ell$) | Toán tử (Operator) | Kernel ($k$) | Stride ($s$) | $r_\ell$ (Mẫu) | $j_\ell$ (Mẫu) | Thời lượng tương ứng ($r_\ell / 50\text{ Hz}$) |
|---|---|---|---|---|---|---|
| 0 | Input Signal | - | - | 1 | 1 | 0.02 s (20 ms) |
| 1 | Conv 1 | 5 | 1 | 5 | 1 | 0.10 s (100 ms) |
| 2 | Pool 1 (MaxPool) | 2 | 2 | 6 | 2 | 0.12 s (120 ms) |
| 3 | Conv 2 | 3 | 1 | 10 | 2 | 0.20 s (200 ms) |
| 4 | Pool 2 (MaxPool) | 2 | 2 | 12 | 4 | 0.24 s (240 ms) |
| 5 | Conv 3 | 3 | 1 | **20** | **4** | **0.40 s (400 ms)** |

Chi tiết từng bước nhảy đại số:
1. **Sau Conv 1:** $r_1 = 1 + (5 - 1) \times 1 = 5$, $j_1 = 1 \times 1 = 1$.
2. **Sau Pool 1:** $r_2 = 5 + (2 - 1) \times 1 = 6$, $j_2 = 2 \times 1 = 2$.
3. **Sau Conv 2:** $r_3 = 6 + (3 - 1) \times 2 = 10$, $j_3 = 1 \times 2 = 2$.
4. **Sau Pool 2:** $r_4 = 10 + (2 - 1) \times 2 = 12$, $j_4 = 2 \times 2 = 4$.
5. **Sau Conv 3:** $r_5 = 12 + (3 - 1) \times 4 = 20$, $j_5 = 1 \times 4 = 4$.

```
[Input: 128 samples]
  │
  ├─── Conv 1 (k=5)  ──> r = 5 samples  (0.10 s)
  ├─── Pool 1 (s=2)  ──> r = 6 samples  (0.12 s)
  ├─── Conv 2 (k=3)  ──> r = 10 samples (0.20 s)
  ├─── Pool 2 (s=2)  ──> r = 12 samples (0.24 s)
  └─── Conv 3 (k=3)  ──> r = 20 samples (0.40 s) ===> Khớp chu kỳ nửa bước đi (half-gait cycle)
```

### 5.3. Ý Nghĩa Cơ Sinh Học Của Trường Tiếp Nhận 20 Mẫu ($0.40\text{ s}$)
Tại tần số $50\text{ Hz}$, trường tiếp nhận danh nghĩa $r_5 = 20$ mẫu tương đương chính xác $0.40\text{ s}$.
Trong cơ sinh học vận động người (human locomotion biomechanics):
- Một chu kỳ bước đi trọn vẹn (full gait cycle: từ lúc gót chân phải chạm đất đến lần tiếp theo gót chân phải chạm đất) của người trưởng thành khi đi bộ bình thường diễn ra trong khoảng $0.9 - 1.2\text{ s}$.
- Do đó, chu kỳ của một **nửa bước chân** (half-gait cycle: từ lúc gót chân phải chạm đất đến lúc gót chân trái chạm đất) kéo dài xấp xỉ $0.40 - 0.50\text{ s}$.

Như vậy, mỗi phần tử đặc trưng tại đầu ra của tầng Conv 3 quan sát trọn vẹn đúng một nửa bước đi của con người. 32 vị trí đặc trưng đầu ra không phải là các khối thời gian rời rạc mà là chuỗi cửa sổ trượt gối đầu nhau với bước nhảy $j_5 = 4$ mẫu ($0.08\text{ s}$), cung cấp một bức tranh liên tục về chu kỳ dáng đi.

### 5.4. Tính Tương Thích Pha (Phase Alignment)
Bước nhảy tích lũy tại tầng Conv 3 là $j_5 = 4$. Cửa sổ trượt của tập dữ liệu có độ dịch chuyển $S = 64$ mẫu. Vì $64$ chia hết cho $4$:
$$
64 \pmod 4 = 0
$$
Tính chất đồng dư này đảm bảo rằng các vị trí lấy mẫu đặc trưng của hai cửa sổ liên tiếp nhau luôn rơi vào đúng cùng một pha mẫu chẵn, không bị lệch pha nội tại (sub-pixel phase misalignment) qua các cửa sổ trượt.

---

## 6. Sổ Sách Kế Toán Tham Số (Parameter Ledger) & Tải Tính Toán (MACs Accounting)

Để đánh giá chính xác tính hiệu quả phần cứng của kiến trúc, ta thực hiện tính toán chi tiết số lượng tham số huấn luyện và số phép tính nhân-cộng tích lũy (Multiply-Accumulate Operations - MACs).

### 6.1. Công Thức Tính Tham Số
- Lớp Tích Chập 1D có bias:
  $$
  P_{\text{Conv1d}} = C_{\text{out}} \times C_{\text{in}} \times k + C_{\text{out}}
  $$
- Lớp Batch Normalization 1D: Chứa hai tham số học được là vector tỉ lệ trọng số $\gamma$ và vector dịch chuyển $\beta$:
  $$
  P_{\text{BN1d}} = 2 \times C_{\text{out}}
  $$
- Lớp Tuyến Tính (Linear / Fully Connected) có bias:
  $$
  P_{\text{Linear}} = N_{\text{out}} \times N_{\text{in}} + N_{\text{out}}
  $$

### 6.2. Bảng Phân Bổ Tham Số Chi Tiết (K = 12 Lớp)

| Tầng (Layer) | Phép tính tham số cụ thể | Số lượng tham số | Tỉ lệ phần trăm |
|---|---|---|---|
| **Conv 1** | $32 \times 6 \times 5 + 32$ | 992 | 0.35% |
| **BN 1** | $2 \times 32$ | 64 | 0.02% |
| **Conv 2** | $64 \times 32 \times 3 + 64$ | 6,208 | 2.19% |
| **BN 2** | $2 \times 64$ | 128 | 0.05% |
| **Conv 3** | $64 \times 64 \times 3 + 64$ | 12,352 | 4.35% |
| **BN 3** | $2 \times 64$ | 128 | 0.05% |
| **Linear 1** | $128 \times 2,048 + 128$ | **262,272** | **92.45%** |
| **Linear 2** | $12 \times 128 + 12$ | 1,548 | 0.55% |
| **Tổng cộng** | **Tổng tất cả các tầng** | **283,692** | **100.00%** |

Dung lượng bộ nhớ lưu trữ trọng số ở định dạng float32 (4 bytes/số thực):
$$
M_{\text{weights}} = 283,692 \times 4\text{ bytes} = 1,134,768\text{ bytes} \approx 1.082\text{ MiB}
$$

### 6.3. Kế Toán Khối Lượng Tính Toán (MACs Count)
Số phép tính MAC (Multiply-Accumulate) được tính cho từng cửa sổ đầu vào $X \in \mathbb{R}^{6 \times 128}$:
$$
M_{\text{Conv1d}} = T_{\text{out}} \times C_{\text{out}} \times C_{\text{in}} \times k
$$
$$
M_{\text{Linear}} = N_{\text{out}} \times N_{\text{in}}
$$

Tính toán từng tầng:
- **Conv 1:** $128 \times 32 \times 6 \times 5 = 122,880\text{ MACs}$
- **Conv 2:** $64 \times 64 \times 32 \times 3 = 393,216\text{ MACs}$
- **Conv 3:** $32 \times 64 \times 64 \times 3 = 393,216\text{ MACs}$
- **Linear 1:** $2,048 \times 128 = 262,144\text{ MACs}$
- **Linear 2:** $128 \times 12 = 1,536\text{ MACs}$

Tổng số phép tính MAC trên một cửa sổ:
$$
M_{\text{total}} = 122,880 + 393,216 + 393,216 + 262,144 + 1,536 = 1,172,992\text{ MACs}
$$
Quy đổi theo quy ước thông thường ($1\text{ MAC} \approx 2\text{ FLOPs}$ gồm 1 phép nhân và 1 phép cộng):
$$
\text{Total FLOPs} \approx 2 \times 1,172,992 = 2,345,984\text{ FLOPs} \approx 2.35\text{ MFLOPs}
$$

### 6.4. Nghịch Lý Giữa Tham Số & Tải Tính Toán

So sánh sự phân bổ giữa hai khối:

```
[Khối Tích Chập: Conv1 + Conv2 + Conv3]
  ├── Tham số: 19,872 tham số      (chiếm 7.01% mô hình)
  └── Tải tính: 909,312 MACs       (chiếm 77.52% khối lượng tính toán)

[Khối Tuyến Tính: Linear1 (Flatten -> 128)]
  ├── Tham số: 262,272 tham số    (chiếm 92.45% mô hình)
  └── Tải tính: 262,144 MACs       (chiếm 22.35% khối lượng tính toán)
```

Nghịch lý này là đặc trưng kinh điển của các mạng tích chập cổ điển kết hợp tầng kết nối dày đặc (Dense Head). Tầng tích chập chia sẻ trọng số trên trục thời gian, do đó số lượng tham số rất nhỏ nhưng phải quét qua toàn bộ 128 bước thời gian nên tiêu tốn phần lớn chu kỳ tính toán. Ngược lại, tầng Flatten tạo ra một vector tọa độ phẳng $64 \times 32 = 2,048$ phần tử; mỗi nút ẩn trong 128 nút của `Linear1` buộc phải có 2,048 trọng số độc lập, khiến số lượng tham số bùng nổ lên tới 262,272 trọng số.

---

## 7. Vì Sao Định Lý Triệt Tiêu GAP Không Áp Dụng Được Cho SmallCNN1D?

Trong một nhánh mô hình lý thuyết khác là `ECDRConv1DNet` (với chỉ 20,332 tham số), người ta loại bỏ tầng Flatten và thay bằng Global Average Pooling (GAP). Một câu hỏi lý thuyết quan trọng: *Tại sao không thể tái sử dụng các chứng chỉ an toàn (safety certificates) hoặc các định lý triệt tiêu hoán vị (permutation cancellation identities) từ ECDRConv1DNet sang SmallCNN1D?*

### 7.1. Cơ Chế Triệt Tiêu Hoán Vị Của Global Average Pooling (GAP)
Giả sử bản đồ đặc trưng cuối cùng có kích thước $F \in \mathbb{R}^{C \times T}$ ($C=64, T=32$). Tầng GAP tính trung bình theo chiều thời gian của từng kênh:
$$
g_c = \frac{1}{T} \sum_{t=0}^{T-1} F_{c, t}, \quad \forall c \in \{0, \dots, C-1\}
$$
Nếu một phép biến đổi dịch chuyển thời gian hoặc hoán vị vị trí $\pi: \{0, \dots, T-1\} \to \{0, \dots, T-1\}$ tác động lên chuỗi đặc trưng:
$$
\tilde{F}_{c, t} = F_{c, \pi(t)}
$$
Tổng trung bình toàn cục hoàn toàn không thay đổi do tính chất giao hoán của phép cộng:
$$
\tilde{g}_c = \frac{1}{T} \sum_{t=0}^{T-1} F_{c, \pi(t)} = \frac{1}{T} \sum_{t=0}^{T-1} F_{c, t} = g_c
$$
Do đó, đầu ra logits $z = \mathbf{W}_{\text{classifier}} \mathbf{g} + \mathbf{b}$ sẽ bất biến hoàn toàn với mọi phép xáo trộn hoặc dịch chuyển chu kỳ của bản đồ đặc trưng.

### 7.2. Sự Phá Vỡ Bất Biến Trong SmallCNN1D

Trong `SmallCNN1D`, tầng Flatten bảo toàn nguyên vẹn tọa độ không gian - thời gian:
$$
\mathbf{v} = \operatorname{vec}(F) \in \mathbb{R}^{2048}, \quad v_{c \cdot 32 + t} = F_{c, t}
$$
Vector biểu diễn ẩn $h \in \mathbb{R}^{128}$ được tính bởi phép nhân ma trận trọng số $\mathbf{A} \in \mathbb{R}^{128 \times 2048}$:
$$
h_i = \operatorname{ReLU}\left(\sum_{c=0}^{63} \sum_{t=0}^{31} A_{i, \, c \cdot 32 + t} \cdot F_{c, t} + a_i\right)
$$
Logit của lớp $k$ là:
$$
q_k = \mathbf{w}_k^\top \mathbf{h} + b_k
$$
- Hệ số trọng số $A_{i, \, c \cdot 32 + t}$ ứng với thời điểm $t$ độc lập hoàn toàn với hệ số $A_{i, \, c \cdot 32 + (t+1)}$ tại thời điểm $t+1$.
- Hàm kích hoạt $\operatorname{ReLU}$ làm méo không gian affine theo từng vùng siêu phẳng cục bộ.
- Do đó, **không tồn tại bất kỳ một cấu trúc tổng đại số nào có thể triệt tiêu phép dịch chuyển thời gian**.

Hệ quả: Quyết định phân loại của `SmallCNN1D` nhạy cảm cao với vị trí tuyệt đối của pha động tác trong cửa sổ 128 mẫu. Một chứng chỉ ổn định (robustness / stability certificate) chứng minh trên mô hình GAP hoàn toàn vô giá trị khi áp dụng cho `SmallCNN1D`. Mọi suy luận hình học về lân cận an toàn buộc phải được xây dựng lại từ đầu dựa trên ma trận đầy đủ của các tầng tuyến tính và điều kiện biên của padding.

---

## 8. Kết Luận & Định Hướng Kiểm Chứng Vùng Quyết Định

Từ các phân tích toán học và cấu trúc trên, ta rút ra các kết luận nền tảng cho hệ thống xử lý chuỗi thời gian IMU:

1. **Tính chất cục bộ của Convolution:** Chuỗi Conv1-2-3 được tối ưu hóa theo đúng động học sinh cơ học của cơ thể người, trong đó trường tiếp nhận danh nghĩa $r_5 = 20$ mẫu ($0.40\text{ s}$) khớp hoàn hảo với chu kỳ nửa bước chân của dáng đi.
2. **Vai trò của Batch Sizing:** Batch $B=128$ khi huấn luyện đảm bảo phương sai gradient nhỏ và ước lượng tham số Batch Normalization ổn định trên $16,384$ điểm dữ liệu; trong khi Batch $B=1$ là điều kiện bắt buộc của streaming biên thời gian thực với độ trễ xử lý chỉ $0.24\text{ ms}$.
3. **Phân bổ tài nguyên bất đối xứng:** Các tầng tích chập chịu trách nhiệm cho $77.52\%$ số lượng phép tính MACs nhưng chỉ chiếm $7.01\%$ tham số; ngược lại tầng kết nối dày đặc đầu tiên chiếm tới $92.45\%$ tổng dung lượng mô hình.
4. **Sự nhạy cảm biên:** Do không sử dụng Global Average Pooling, mô hình bảo toàn được thông tin thứ tự thời gian để nhận diện các hành vi chuyển thế (transitions), nhưng đồng thời mất đi tính bất biến dịch chuyển, khiến các vùng chứng chỉ an toàn phải phụ thuộc trực tiếp vào pha của cửa sổ trượt $S=64$.

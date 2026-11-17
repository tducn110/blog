---
title: "Nghịch Lý Thực Nghiệm ECDR: Rào Cản Trực Giao Dịch Pha Ở Bước Trượt S=64, Sự Đột Phá Tại S=1 & Điểm Hòa Vốn Phần Cứng"
description: "Kiểm chứng đầu-cuối 5,053 cửa sổ của hệ thống ECDR: Vì sao tỷ lệ tái sử dụng bằng 0% ở bước trượt thô S=64 do hiện tượng trực giao dịch pha, sự đảo chiều vọt lên 87.31% ở bước trượt mịn S=1 và bài toán điểm hòa vốn phần cứng giữa chi phí CROWN và mạng CNN."
publishDate: 2026-11-17T16:30:00+07:00
order: 3
category: "engineering"
tags: ["AI", "DeepLearning", "Optimization", "Certification", "ECDR", "Systems", "Benchmarking"]
featured: false
recommendedFont: "academic"
lang: "vi"
---

> **TỔNG HỢP KIỂM CHỨNG ĐẦU-CUỐI CỔNG G4–G6 (IEEE TRANSACTIONS DOSSIER 2026)**  
> Chuyên khảo này công bố kết quả thực nghiệm toàn diện trên toàn bộ $5,053$ cửa sổ kiểm thử của luồng dữ liệu HAPT nhằm kiểm định tính khả thi của cơ chế Tái Sử Dụng Quyết Định Có Chứng Nhận (ECDR), được đối chiếu từ báo cáo khoa học IEEE `04_SYNTHESIS/02_Dossier_Scientific_Report.tex`:
> 
> - **Mô hình kiểm thử:** `SmallCNN1D(num_classes=12)` (283,692 tham số), độ trễ suy luận đơn luồng CPU đạt $T_f = 0.1592\text{ ms}$.
> - **Bộ xác minh chứng chỉ:** Thuật toán CROWN/LiRPA 64-bit có bù trừ biên sai số làm tròn số thực $\tau_{\text{fp}} \in [1.17 \times 10^{-5}, 4.63 \times 10^{-5}]$.
> - **Độ chính xác chứng nhận:** $0\%$ vi phạm (toàn bộ $100\%$ các quyết định được chứng nhận đều trùng khớp tuyệt đối với mô hình tham chiếu).
> - **Kết quả chéo cốt lõi:** Bác bỏ giả thuyết tái sử dụng trên lưới trượt thô $S=64$ ($R_{\text{cert}} = 0\%$, tăng tốc âm $0.9746\times$), đồng thời xác lập vùng hoạt động khả thi vượt trội tại bước trượt mịn $S=1$ ($R_{\text{cert}} = 87.31\%$, tăng tốc thực tế $5.88\times - 6.31\times$ trên các mô hình backbone quy mô lớn).

---

## 1. Nghịch Lý Lưới Trượt Thô: Khi Lý Thuyết Đúng Nhưng Thực Nghiệm Bằng 0%

Ở bài viết trước, lý thuyết Mệnh đề 1 đã chứng minh chặt chẽ rằng nếu hàm biên độ đối kháng $g_{aj}(x) \ge \ell_{aj} > 0$ trên toàn miền $\mathcal{S}$, quyết định của mạng nơ-ron được bảo toàn $100\%$. 

Tuy nhiên, khi đưa bộ xác minh CROWN vào chạy thực tế trên luồng kiểm thử $5,053$ cửa sổ của tập dữ liệu HAPT với cấu hình lưới trượt chuẩn:
- Độ dài cửa sổ: $W = 128$ mẫu ($2.56\text{ s}$ ở $50\text{ Hz}$).
- Bước trượt cửa sổ: $S = 64$ mẫu ($1.28\text{ s}$, độ chồng lấp $50\%$).

**Kết quả thu được là một cú sốc thực nghiệm:**  
Tỷ lệ tái sử dụng có chứng nhận đạt chính xác:
$$
R_{\text{cert}} = 0.00\% \quad (0 / 5{,}053\text{ windows})
$$
Không một cửa sổ nào trong luồng dữ liệu trượt $S=64$ vượt qua được bộ lọc chứng nhận an toàn! Mọi truy vấn đều bị từ chối và buộc phải kích hoạt cơ chế fallback chạy lại toàn bộ mạng CNN.

```
[Lưới Trượt Thô S = 64 (Bước nhảy 1.28 s)]
  Cửa sổ t:     [======================== 128 mẫu ========================]
  Cửa sổ t+1:                 [======================== 128 mẫu ========================]
                              <--- 64 mẫu trùng ---> <--- 64 mẫu mới hoàn toàn --->
  
  Khoảng cách chuẩn hóa thực tế:   ||Delta z||_infinity = 3.6349
  Bán kính chứng nhận tối đa CROWN: rho*                = 0.0650
  
  ===> ||Delta z||_infinity LỚN GẤP 55 LẦN rho* ===> TỶ LỆ CHỨNG NHẬN = 0.00%!
```

---

## 2. Bản Chất Vật Lý & Toán Học: Hiện Tượng Trực Giao Dịch Pha (Phase-Shift Orthogonality)

Tại sao lại có sự sụp đổ hoàn toàn giữa chứng minh toán học và thực nghiệm trên lưới trượt thô?

### 2.1. Độ Lệch Chuẩn Hóa Vượt Bán Kính Chứng Nhận 55 Lần
Đo đạc thống kê trên $5,034$ cặp cửa sổ liên tiếp của luồng kiểm thử cho thấy:
- Độ dịch chuyển chuẩn hóa trung vị giữa hai cửa sổ liên tiếp là:
  $$
  \operatorname{median}\left(\|\Delta \mathbf{z}\|_\infty\right) = 3.6349
  $$
- Trong khi đó, bán kính hình hộp lớn nhất mà bộ xác minh CROWN có thể chứng nhận được cho mạng `SmallCNN1D` mà vẫn giữ được cận dưới logit dương ($\min_j \ell_{aj} > 0$) chỉ đạt:
  $$
  \rho^* \approx 0.0650
  $$

Khoảng cách tín hiệu thực tế lớn gấp **$55.9$ lần** bán kính chứng nhận tối đa của bộ xác minh! Do đó, điều kiện thuộc miền $\|\mathbf{z}_{t+1} - \mathbf{z}_t\|_\infty \le \rho^*$ bị vi phạm trên $100\%$ các bước nhảy.

### 2.2. Cơ Chế Trực Giao Dịch Pha (Phase-Shift Orthogonality)
Tín hiệu IMU của hoạt động người (như đi bộ, leo cầu thang) có tính tuần hoàn sinh cơ học với chu kỳ dáng đi khoảng $0.8 - 1.0\text{ s}$ ($40 - 50$ mẫu ở $50\text{ Hz}$).
Khi dịch chuyển cửa sổ một bước nhảy $S = 64$ mẫu ($1.28\text{ s}$):
1. **Lệch pha hoàn toàn:** $1.28\text{ s}$ tương đương với hơn một chu kỳ bước đi rưỡi. Đỉnh gia tốc (peak impact) của nửa bước chân trước bị đẩy lùi 64 vị trí trong tensor đầu vào.
2. **Xuất hiện 64 mẫu hoàn toàn mới:** $50\%$ dữ liệu của cửa sổ $t+1$ là thông tin chưa từng xuất hiện ở cửa sổ $t$.
3. **Phá vỡ tính tương đồng vector:** Xét tích vô hướng giữa hai cửa sổ đã trừ trung bình:
   $$
   \cos \theta = \frac{\langle \mathbf{x}_t, \mathbf{x}_{t+1} \rangle}{\|\mathbf{x}_t\|_2 \|\mathbf{x}_{t+1}\|_2} \approx 0
   $$
   Dưới góc nhìn hình học trong không gian $\mathbb{R}^{768}$, hai cửa sổ liên tiếp ở bước nhảy $S=64$ gần như vuông góc (trực giao) với nhau. Không một bộ xác minh lồi (convex relaxation verifier) nào có thể bao quát một khoảng cách dịch pha lớn như vậy mà không làm nổ lỏng cận (loose bound explosion).

---

## 3. Bẫy Lệch Pha Lưới Trượt Đối Với Hành Vi Chuyển Thế (Postural Transitions)

Một vấn đề nghiêm trọng khác được phát hiện trong nghiên cứu là sự thất bại của lưới trượt cố định $S=64$ trong việc nắm bắt 6 lớp chuyển thế tư thế ($K=12$):

```
Đoạn Chuyển Thế Thực Tế (labels.txt): [======== Chiều dài L = 131 mẫu ========]
Lưới Trượt Cố Định S = 64:
  Cửa sổ k:   [------- 128 mẫu -------] (Chỉ dính 30 mẫu chuyển thế -> Bị lọc bỏ)
  Cửa sổ k+1:                 [------- 128 mẫu -------] (Bị cắt ngang -> Bị lọc bỏ)
  
  Xác suất chứa trọn vẹn 1 cửa sổ thuần túy: P_hit = (131 - 127) / 64 = 6.25%!
  ===> 93.75% DỮ LIỆU CHUYỂN THẾ BỊ XÓA SỔ KHỎI TẬP HUẤN LUYỆN!
```

### 3.1. Xác Suất Va Chạm Cửa Sổ Thuần Túy $P_{\text{hit}}(L)$
Trong tập dữ liệu gốc `RawData/labels.txt`, các hành vi chuyển thế như `SIT_TO_STAND` (lớp 8) có độ dài trung vị $L = 131$ mẫu ($\ge W = 128$). Tuy nhiên, do lưới trượt $S=64$ được thả ngẫu nhiên theo thời gian bắt đầu ghi âm, xác suất để một đoạn chuyển thế có độ dài $L \in [128, 191]$ chứa trọn vẹn ít nhất một cửa sổ thuần túy (pure window) là:
$$
P_{\text{hit}}(L) = \frac{L - (W - 1)}{S} = \frac{L - 127}{64}
$$
Với $L = 131$:
$$
P_{\text{hit}}(131) = \frac{131 - 127}{64} = \frac{4}{64} = 6.25\%
$$
Nghĩa là **$93.75\%$ các đoạn chuyển thế hợp lệ trong thực tế đã bị loại bỏ một cách giả tạo** bởi chính sách lấy mẫu lưới thô, tạo ra tình trạng thiếu hụt dữ liệu trầm trọng (18 điểm nghẽn hỗ trợ mẫu - blockers).

### 3.2. Giải Pháp Đóng Cổng G2 Toàn Diện: Span-Anchored Policy & Focal Loss
Để giải quyết triệt để vấn đề này, nhóm nghiên cứu đã triển khai chính sách lấy mẫu neo theo đoạn (**Span-Anchored Transition Policy**):
- Đặt các cửa sổ neo trực tiếp vào tâm và các vị trí nội vi của từng đoạn chuyển thế ($M=9$ cửa sổ/đoạn).
- Kết hợp với hàm mất mát hội tụ cân bằng lớp (**Class-Balanced Focal Loss**):
  $$
  \mathcal{L}_{\text{CB-Focal}} = - \frac{1 - \beta}{1 - \beta^{N_y}} \left(1 - p_y\right)^\gamma \log p_y, \quad \beta = 0.35, \; \gamma = 1.5
  $$
- **Kết quả:** Nâng số lượng mẫu có nhãn từ $12,155$ lên $15,500$ cửa sổ, xóa bỏ $100\%$ các điểm nghẽn hỗ trợ mẫu, và đẩy Macro-F1 toàn bộ 12 lớp từ $0.7567$ lên **$0.8537 \pm 0.0020$**.

---

## 4. Sự Chuyển Pha Ngoạn Mục Tại Bước Trượt Mịn: Bước Nhảy $S=1$

Khi phân tích nguyên nhân gốc rễ là sự lệch pha giữa các cửa sổ, một thí nghiệm bản lề đã được thiết kế: *Điều gì sẽ xảy ra nếu hệ thống hoạt động ở chế độ streaming thời gian thực mật độ cao với bước trượt $S=1$ mẫu ($20\text{ ms}$)?*

```
[Lưới Trượt Mịn S = 1 (Bước nhảy 20 ms)]
  Cửa sổ t:     [======================== 128 mẫu ========================]
  Cửa sổ t+1:    [======================== 128 mẫu ========================]
                 <--- 127 mẫu trùng ---> <- 1 mẫu mới ->
  
  Khoảng cách chuẩn hóa thực tế:   ||Delta z||_infinity <= 0.0450
  Bán kính chứng nhận tối đa CROWN: rho*                = 0.0650
  
  ===> ||Delta z||_infinity NẰM HOÀN TOÀN TRONG BÁN KÍNH CHỨNG NHẬN!
  ===> TỶ LỆ CHỨNG NHẬN VỌT LÊN: R_cert = 87.31% (100% ĐÚNG ĐẮN TOÁN HỌC)!
```

### 4.1. Kết Quả Thực Nghiệm Tại $S=1$
Khi bước trượt giảm xuống $S=1$:
- Hai cửa sổ kề nhau chia sẻ tới $127/128$ mẫu tín hiệu ($99.22\%$ tương đồng).
- Độ dịch chuyển chuẩn hóa rơi vào khoảng $\|\Delta \mathbf{z}\|_\infty \in [0.012, 0.048]$, nằm hoàn toàn bên trong bán kính chứng nhận an toàn $\rho^* = 0.0650$.
- Tỷ lệ tái sử dụng có chứng nhận tăng vọt từ $0.00\%$ lên:
  $$
  R_{\text{cert}} = 87.31\%
  $$
- **Tính đúng đắn (Soundness):** Trong toàn bộ các cửa sổ được chứng nhận tái sử dụng, tỷ lệ bảo toàn quyết định đạt **chính xác $100.00\%$ (0 trường hợp vi phạm)** so với mô hình tham chiếu.

---

## 5. Hạch Toán Chi Phí Hệ Thống & Điểm Hòa Vốn Phần Cứng (Hardware Break-Even)

Một câu hỏi cốt tử của kỹ thuật hệ thống: *Liệu việc chứng nhận tái sử dụng có thực sự giúp giảm thời gian chạy (latency) và tiết kiệm năng lượng trên phần cứng thực tế hay không?*

### 5.1. Mô Hình Chi Phí Trung Bình Đầu-Cuối
Thời gian xử lý kỳ vọng cho một cửa sổ tín hiệu trong hệ thống ECDR được mô hình hóa bởi phương trình:
$$
\mathbb{E}[T] = T_{\text{event}} + T_{\text{member}} + (1 - r) T_f + q T_{\text{cert}}
$$
trong đó:
- $T_{\text{event}}$: Chi phí tính toán bộ chọn sự kiện ($< 2\ \mu\text{s}$).
- $T_{\text{member}}$: Chi phí kiểm tra thuộc miền $\mathcal{O}(d)$ ($\approx 0.5\ \mu\text{s}$).
- $r$: Tỷ lệ tái sử dụng thực tế ($r = R_{\text{cert}}$).
- $T_f$: Thời gian thực thi một lần forward mạng CNN tham chiếu.
- $q$: Tần suất phải tính toán/tạo mới chứng chỉ trên mỗi cửa sổ ($q \le 1 - r$).
- $T_{\text{cert}}$: Thời gian giải bài toán lan truyền cận CROWN để sinh chứng chỉ.

**Điều kiện để hệ thống đạt điểm hòa vốn và bắt đầu có lợi ích tăng tốc:**
$$
\text{Net Saving} > 0 \iff r T_f > T_{\text{event}} + T_{\text{member}} + q T_{\text{cert}}
$$

### 5.2. Nghịch Lý Mạng Nhỏ vs Mạng Lớn
Đo đạc thực tế thời gian thực thi trên CPU:

```
[Mạng Nhỏ: SmallCNN1D (283,692 tham số)]
  Thời gian chạy mạng forward:    T_f    = 0.1592 ms
  Thời gian tạo chứng chỉ CROWN: T_cert = 1.0820 ms
  
  Tỷ số chi phí: T_cert / T_f \approx 6.8 lần!
  ===> TĂNG TỐC ÂM: S_e2e = 0.9746x (Hệ thống bị chậm đi 2.5% do overhead của CROWN!)

[Mạng Lớn: 1D-ResNet / InceptionTime (Hàng triệu tham số)]
  Thời gian chạy mạng forward:    T_f    = 12.5000 ms
  Thời gian tạo chứng chỉ CROWN: T_cert = 1.8500 ms (áp dụng Lazy Certification)
  
  Tại r = 87.31%:
  ===> TĂNG TỐC DƯƠNG VƯỢT TRỘI: S_e2e = 5.88x - 6.31x!
```

1. **Đối với mô hình `SmallCNN1D`:**
   Bản thân mạng CNN quá nhỏ và nhẹ ($T_f \approx 0.16\text{ ms}$). Chi phí chạy thuật toán tối ưu CROWN để tính toán cận giải tích lớn gấp gần 7 lần chi phí chạy thẳng mạng CNN ($T_{\text{cert}} / T_f \approx 6.8$). Do đó, việc cố gắng chứng nhận từng mỏ neo mới làm triệt tiêu toàn bộ thời gian tiết kiệm được, khiến tốc độ hệ thống đầu-cuối đạt $S_{\text{e2e}} = 0.9746\times$ (chậm hơn chạy trực tiếp $2.54\%$).

2. **Đối với các mô hình Backbone lớn:**
   Khi áp dụng ECDR cho các kiến trúc mạng sâu (như 1D-ResNet-50, InceptionTime, hoặc WaveNet) có thời gian suy luận $T_f \ge 10\text{ ms}$, chi phí forward áp đảo hoàn toàn chi phí tạo chứng chỉ. Kết hợp với chính sách **Chứng nhận lười (Lazy On-Demand Certification)** — chỉ sinh chứng chỉ khi trạng thái tín hiệu ổn định — hệ thống đạt tốc độ tăng tốc thực tế từ **$5.88\times$ đến $6.31\times$**, tiết kiệm tới hơn $80\%$ năng lượng tiêu thụ trên thiết bị biên.

---

## 6. Kết Luận Bài 3

Nghiên cứu thực nghiệm đầu-cuối của ECDR đã mang lại những bài học vô giá cho cộng đồng Học Máy Hệ Thống (Systems for Machine Learning):
1. **Lưới trượt là rào cản vật lý:** Bước trượt thô $S=64$ ($1.28\text{ s}$) tạo ra sự trực giao dịch pha, khiến các phương pháp chứng nhận lồi tĩnh hoàn toàn bất lực ($R_{\text{cert}} = 0\%$).
2. **Streaming mịn giải phóng tiềm năng:** Bước trượt mịn $S=1$ đưa độ lệch tín hiệu về đúng lân cận hội tụ của CROWN, mở khóa tỷ lệ chứng nhận $87.31\%$ với độ an toàn $100\%$.
3. **Bài học về quy mô phần cứng:** Chứng nhận toán học chỉ mang lại lợi ích kinh tế khi chi phí forward của mô hình đủ lớn để bù đắp chi phí phân tích cận của bộ xác minh.

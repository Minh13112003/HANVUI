# HanVui — Nghiệp vụ, luật chơi, cách dùng

> Tài liệu gốc (source of truth) của dự án. **Chưa code** cho đến khi hai bên thống nhất và user nói bắt đầu.
> Mỗi mục có nhãn: **[CHỐT]** đã thống nhất · **[CẦN CHỐT]** đang bàn, chưa được code · **[SAU NÀY]** hoãn.
> Cập nhật lần cuối: 2026-10-15 (xem Changelog cuối file).

---

## 0. Mục tiêu

- Web responsive ưu tiên điện thoại (PWA) để học tiếng Trung cho người Việt.
- Học qua: bảng từ vựng theo chủ đề, hội thoại nghe và trả lời, viết chữ từng nét, kiểm tra, trò chơi và sự kiện truyện.
- Toàn bộ nội dung (từ vựng, hội thoại, câu hỏi, truyện, đề thi) do **AI sinh sẵn**, người biết tiếng Trung duyệt trước khi công khai.
- Giao diện tiếng Việt. Nội dung học là tiếng Trung kèm pinyin và bản dịch.
- **Hướng sản phẩm [CHỐT]**: vừa học vừa chơi. Kiến thức học vốn khô ("thô"), nên cần lớp trò chơi (sự kiện truyện, nhiệm vụ, mốc, huy chương, trò chơi nhỏ) để người học không chán khi học liên tục.

## 1. Thuật ngữ

| Thuật ngữ | Nghĩa | Trạng thái |
|---|---|---|
| **Truyện** | Một câu chuyện hư cấu theo ngôi thứ nhất, ví dụ "Ga cũ trong đêm mưa". Sự kiện kéo dài 1 tháng | CHỐT |
| **Chương** | Một đợt của truyện, kéo dài 1 tuần, gồm 4 hồi và 12 ô từ khóa | CHỐT |
| **Hồi** | Mỗi hồi gồm 3 từ khóa. Tìm đủ 3 từ khóa thì mở 1 đoạn truyện | CHỐT |
| **Ô từ khóa** | Một từ khóa ẩn của chương, hiện thành 1 ô trên bảng 12 ô. Mỗi ô có bộ gợi ý riêng | CHỐT |
| **Lượt gợi ý** | Đơn vị dùng để mở gợi ý, chỉ lấy từ nhiệm vụ, thưởng, gói theo kịp, đền bù. **Không bán lượt** | CHỐT |
| **Point** | Tiền trong ví của app, 1 point = 1 đồng, dùng để **thanh toán gói VIP** (không dùng để mua lượt gợi ý). Mỗi point phát ra là một khoản chi phí | CHỐT |
| **Điểm sự kiện** | Điểm kiếm được khi giải ô, dùng để xếp hạng (mốc tính theo số từ khóa, không theo điểm). Khác với **Point** (tiền ví) | CHỐT |
| **Túi đồ** | Nơi chứa vật phẩm thưởng (ví dụ VIP 3 ngày). Người chơi bấm mở thì kích hoạt và đếm ngược | CHỐT |
| **Bài học thường** | Hội thoại trong thư viện bài học, gắn cấp HSK và chủ đề | CHỐT |
| **Bài học event** | Đoạn truyện đã mở, lưu ở mục "Bài học event: Ga cũ trong đêm mưa", học như bài thường | CHỐT |
| **Cấp HSK** | Cấp của người học, quyết định nội dung được ưu tiên | CHỐT |
| **Đề nâng cấp** | Đề thi thử theo định dạng HSK để lên cấp | CHỐT |

> Cách đặt cũ (hồi có 3 chương, mỗi chương 1 từ khóa) đã bị **thay thế**.

---

## 2. Cấp HSK, hồ sơ người học

- **[CHỐT]** Mỗi người học có một cấp HSK hiện tại. Cấp quyết định hội thoại nào được ưu tiên gợi ý.
- **[CHỐT]** Số giờ học và số từ đã học được ghi lại cho từng cấp.
- **[CHỐT] Hai chuẩn HSK song song**: **HSK 2.0** (6 cấp) và **HSK 3.0** (9 cấp). Có nút chuyển giữa hai chuẩn.
- **[CHỐT] Nhãn song song**: mỗi từ vựng và mỗi hội thoại ghi **cả hai chuẩn**, hiển thị dạng **2.0·1 | 3.0·2** (cấp 1 của HSK 2.0 và cấp 2 của HSK 3.0). Người học nhìn là biết bài này thuộc cấp nào ở mỗi chuẩn.
- Cấp của một hội thoại ở mỗi chuẩn được **tính tự động** = cấp cao nhất trong các từ của hội thoại (tra theo bảng từ của chuẩn đó), không gắn tay. Vì hai chuẩn chia từ khác nhau nên số cấp hai bên có thể khác nhau.
- Nhãn có nghĩa "từ cấp này trở lên". Người học cấp cao vẫn học lại được hội thoại cấp thấp; cấp thấp thấy hội thoại cấp cao bị khóa hoặc đánh dấu "khó".
- Nút chuyển chuẩn chỉ đổi **cách lọc và nhãn hiển thị** (danh sách từ, hội thoại, tên cấp). Cấp của người học lưu theo chuẩn họ chọn. Hai chuẩn **không tương ứng 1-1** nên cần bảng quy đổi gần đúng khi chuyển, người biết tiếng Trung duyệt.
- **[CẦN CHỐT]** **Đề thi phải làm riêng cho từng chuẩn** (định dạng khác nhau). Đề xuất v1 chỉ làm bộ đề HSK 2.0; HSK 3.0 làm sau khi định dạng chính thức ổn định (các nguồn đang mâu thuẫn về ngày triển khai và một số con số).
- Số từ mỗi cấp (tích lũy): **HSK 2.0**: 150 / 300 / 600 / 1.200 / 2.500 / 5.000. **HSK 3.0** (đề cương chính thức công bố 11/2025): 300 / 500 / 1.000 / 2.000 / 3.600 / 5.400, cấp 7-9 chung một dải khoảng 11.000. HSK 3.0 không theo thang 1.000 cho cấp 2: cấp 2 là **500 từ** (HSK 2.0 cấp 2 là 300). Kỳ thi HSK 3.0 mở trên toàn thế giới từ **13/12/2026**; trước đó các kỳ thi cấp 1-6 thường kỳ vẫn theo HSK 2.0. Thang điểm và điểm đạt của HSK 3.0 cấp 1-3 **chưa xác minh được**, cần xem chinesetest.cn. Danh sách từ: đối chiếu bản chính thức; bản cộng đồng (GitHub, kèm nghĩa CC-CEDICT) chỉ dùng tham khảo, có thể có lỗi.
- **[CẦN CHỐT]** Cấp ban đầu: mặc định HSK 1, có lựa chọn thi xếp lớp.

## 3. Nội dung học

### 3.1 Từ vựng [CHỐT]
- Theo chủ đề. Bảng gồm chữ Hán, pinyin, nghĩa tiếng Việt, loại từ.
- Có nút che nghĩa để tự kiểm tra, nút nghe (thường và chậm).
- Chạm một từ: xem **cách viết từng nét** (chấm đỏ chỉ chỗ bắt đầu, đường nét đứt chỉ hướng, số thứ tự nét, quy tắc thứ tự nét) và chế độ **tập viết** bằng ngón tay.
- Dữ liệu nét lấy từ Hanzi Writer (nguồn mở).
- Từ người học tự thêm nằm ở mục "Từ của tôi".

### 3.2 Hội thoại [CHỐT]
Luồng một bài: **Nghe (chưa xem chữ) → Trả lời câu hỏi → Xem lời thoại (transcript)**.
- **[CHỐT] Lời thoại luôn ở cuối bài và khóa** cho tới khi trả lời xong câu hỏi: nghe trước, xem đáp án sau. Màn bài học hiện 3 bước (Nghe, Trả lời, Xem lời thoại) để người học biết mình đang ở đâu.
- **[CHỐT]** "Bỏ qua, xem lời thoại" vẫn được, nhưng bài đó **không tính** vào nhiệm vụ.
- Mỗi hội thoại thuộc **một hoặc vài chủ đề**.
- Câu hỏi và đáp án bằng **tiếng Trung**. Công tắc "Dịch câu hỏi" hiện bản tiếng Việt (mặc định tắt). Sau khi trả lời, bản dịch tự hiện.
- Transcript có pinyin và bản dịch, bật tắt được.
- **[CHỐT] Lưu từ bằng "Chế độ lưu từ"**: người học bấm nút để bật chế độ này ở phần lời thoại, rồi mới chọn được từ. Không dùng bôi đen kiểu hệ điều hành (trên điện thoại hay lẫn với menu sao chép, khó chọn đúng).
  - Lời thoại được **tách sẵn thành từ** (AI tách khi sinh bài, người duyệt). Chạm một từ để chọn; chạm thêm một từ khác trong cùng câu để chọn **cả cụm**; chạm lại để bỏ chọn.
  - **Cụm từ được lưu luôn**, như một mục riêng.
  - Thanh dưới cùng hiện chữ, pinyin, nghĩa và nút **Lưu**. Từ chưa có trong từ điển thì lưu ngay, **AI điền nghĩa sau** (hiện "AI sẽ điền nghĩa").
  - Áp dụng cả cho truyện sự kiện (hồi đã mở). Bài đọc thì chạm từng từ để xem nghĩa và lưu.
- Từ đã lưu vào **Sổ tay** (mục 3.7) và quay lại bài kiểm tra, ôn tập.

**Gắn nhãn cho mỗi hội thoại:**
- **[CHỐT]** Cấp HSK theo cả hai chuẩn, tính tự động từ các từ trong bài (mục 2).
- **[CHỐT]** Chủ đề tình huống, khác chủ đề từ vựng, để người học phát triển toàn diện.
- **[CHỐT]** 12 chủ đề ban đầu (sẽ cập nhật sau): Chào hỏi và làm quen · Gia đình và bạn bè · Ăn uống · Mua sắm · Di chuyển và du lịch · Công việc và văn phòng · Học tập · Sức khỏe · Sở thích và giải trí · Thời tiết và thời gian · Dịch vụ (ngân hàng, khách sạn, bưu điện) · Văn hóa và lễ hội.
- **[CHỐT] Danh sách hội thoại theo chủ đề**, có **ô tìm kiếm** để tìm bài (ví dụ khi đang dò từ khóa của sự kiện). Có các nút lọc chủ đề. Mỗi bài hiện chủ đề, bối cảnh (nơi chốn, nhân vật), cấp HSK, trạng thái đã học.
- **[CHỐT] Tìm kiếm chỉ nhìn tên bài, chủ đề và bối cảnh, KHÔNG nhìn nội dung câu thoại.** Nếu tìm được trong nội dung, người chơi gõ thử từ khóa vào ô tìm kiếm là biết bài nào có từ đó, thành cách thử từ khóa miễn phí, phá cơ chế gợi ý và giới hạn 3 lần sai.
- Khi đang theo dõi gợi ý của sự kiện, danh sách bài hiện thẻ "Manh mối bạn đang theo dõi" (các gợi ý đã mở) để đối chiếu, chạm vào thì lọc theo chủ đề.
- **[CHỐT] Giọng nhân vật**: mỗi vai trong hội thoại có **giới tính (nam/nữ)** và **1 trong 3 khoảng giọng (trầm, vừa, cao)** chọn theo vai (ví dụ trưởng nhóm: nam trầm; lễ tân: nữ cao; người kể truyện: nam trẻ, giọng cao). Hai vai trong cùng một bài không trùng cả giới tính lẫn khoảng giọng. Đầu bài hiện thẻ từng vai ("Trưởng nhóm · nam, giọng trầm"), chạm để nghe thử. Bản demo dùng giọng đọc có sẵn của trình duyệt: máy có giọng tiếng Trung nam và nữ thì dùng đúng giọng; máy chỉ có một giọng thì đổi cao độ để phân biệt. **Bản demo từ lần 24 đã dùng file âm thanh tạo sẵn** (94 câu, giọng thần kinh Microsoft tiếng Phổ thông, nhúng trong trang); câu nào chưa có file thì lùi về giọng trình duyệt. **Bản thật** nên dùng dịch vụ đọc văn bản trên máy chủ (nhiều giọng nam/nữ tiếng Trung cố định), tạo sẵn file âm thanh cho từng câu, để mọi máy nghe giống nhau.
- **[CHỐT] Nút chọn cấp HSK 1 / HSK 2** ở đầu danh sách hội thoại (app nhớ lựa chọn). Mỗi chủ đề có bản HSK 1 (4-6 câu, câu ngắn) và bản HSK 2 (9-10 câu, dài hơn, nhiều từ hơn). Trong bài có nút "Bản HSK 2 →" (hoặc "Bản HSK 1 →") để đổi sang bản cùng chủ đề. Bài HSK 2 vẫn chứa các từ khóa sự kiện của bài HSK 1 cùng chủ đề, nên học ở cấp nào cũng dò được từ khóa; bài HSK 2 cũng tính cho nhiệm vụ ngày.
- Người học cấp cao có thể **học lại** hội thoại cấp thấp. Người học cấp thấp thấy hội thoại cấp cao bị khóa hoặc đánh dấu "khó".

### 3.3 Kiểm tra từ vựng [CHỐT]
- 8 câu ngẫu nhiên. Kiểu: Việt→Hán, Hán→Việt, nghe→Hán, hoặc trộn.
- Câu hỏi bằng tiếng Trung, có công tắc dịch. Cuối bài có danh sách từ cần ôn.
- Hoàn thành một bài tính vào nhiệm vụ hằng ngày (mục 5.6).

### 3.4 Trò chơi [CHỐT: lật thẻ; SAU NÀY: các trò khác]
- Hiện có: lật thẻ ghép chữ Hán với nghĩa.
- Sau này: ghép nét theo thứ tự, đua thời gian, đoán chữ bị che, nghe và điền chỗ trống.

### 3.5 Bốn kỹ năng: nghe, nói, đọc, viết [CẦN CHỐT, đã có bản mẫu giao diện]
- Học ngôn ngữ cần 4 kỹ năng. Hiện đã làm: **nghe** (hội thoại) và **từ vựng**. Bổ sung 3 phần sau, nội dung sơ sài để hình dung:
- **Nói**: đọc theo mẫu (nghe mẫu, nghe chậm, ghi âm, xem âm nào cần luyện, pinyin tô màu theo thanh điệu) và nhập vai hội thoại. **Chấm phát âm thật cần dịch vụ nhận dạng phát âm riêng** (không phải chatbot AI thông thường). Bản đầu **chỉ nghe mẫu và tự đối chiếu, chưa chấm tự động**; chấm tự động để giai đoạn sau sau khi thử nghiệm trên máy thật.
- **Đọc**: bài đọc theo cấp HSK, tin ngắn biên tập lại từ báo ở đúng cấp (AI viết lại, người duyệt), và truyện sự kiện. Chạm từng từ để xem nghĩa, bôi đen để thêm vào từ vựng, có câu hỏi hiểu bài.
- **Viết**: tập viết từng nét (đã có), sắp xếp câu, điền chữ, dịch ngắn. Đều là dạng **chấm tự động được**. Bài viết luận để sau (xem mục 10).
- Mục "Học" gom: Từ vựng, Nghe, Nói, Đọc, Viết.

### 3.6 Trang chủ và điều hướng [CẦN CHỐT, đã có bản mẫu giao diện]
- **Giao diện bản demo 11**: thẻ nổi bóng mềm thay viền; thanh tab nổi có vệt chọn trượt theo tab; mỗi lần đổi màn các khối trượt lên lần lượt; bảng trượt lên có độ nảy; con dấu 汉 đóng xuống khi mở app; pháo giấy khi giải đúng một ô. Người bật "giảm chuyển động" trong máy thì tắt hết hiệu ứng.
- Thanh dưới: **Trang chủ · Học · Sổ tay · Sự kiện · Thêm**. "Thêm" chứa tài khoản và VIP, túi đồ, luật sự kiện, kế hoạch. Ôn tập (kiểm tra, lật thẻ) nằm trong Sổ tay.
- Dễ thao tác: vùng chạm tối thiểu khoảng 40px, thanh chọn kỹ năng và trình phát âm thanh dính trên đầu khi cuộn, nút "Nhập từ khóa" nổi ở góc dưới trong bài học, bảng trượt từ dưới lên có tay nắm.
- Chào theo giờ, chuỗi ngày đăng nhập, số lượt gợi ý. Thẻ nhiệm vụ hôm nay (vòng tiến độ 0/3 và nút "Học tiếp"). Bốn thẻ kỹ năng có thanh tiến độ. Thẻ sự kiện (12 chấm màu theo ô, huy chương, cảnh báo ô đang sáng, hồi mới). Nhiệm vụ tuần.

### 3.7 Sổ tay từ vựng [CẦN CHỐT, đã có bản mẫu giao diện]
- **Đề xuất: một danh sách duy nhất, nhiều cách xem**, không bắt người học chọn thư mục khi lưu. Mỗi mục lưu kèm: ngày lưu, bài nguồn, chủ đề của bài nguồn (tự lấy), cấp HSK, là từ hay cụm từ, trạng thái ôn.
- **Xem theo ngày** (mặc định): nhóm "Hôm nay", "Hôm qua", "Thứ tư, 14/10"... Hợp với thói quen "hôm nay học được gì" và ôn ngay trong ngày, lúc trí nhớ còn mới. Cũng là số liệu cho trang chủ ("hôm nay lưu 5 từ").
- **Xem theo chủ đề**: nhóm theo chủ đề của bài nguồn. Một từ lưu từ bài có 2 chủ đề thì hiện ở cả 2 nhóm (không nhân bản dữ liệu). Từ không có chủ đề vào nhóm "Chưa có chủ đề". Hợp với ôn theo ngữ cảnh (đi du lịch thì ôn nhóm Du lịch).
- Mỗi nhóm có nút **"Ôn nhóm này"** mở bài kiểm tra chỉ với các từ của nhóm. Có ô tìm kiếm (chữ Hán, pinyin, nghĩa).
- **Sau này**: thêm cách xem "Cần ôn" theo lặp lại ngắt quãng (mục 3.8), và cho người học tự gắn nhãn riêng.
- Dữ liệu: một bảng `user_word(user_id, zh, pinyin, vi, pos, is_phrase, source_id, topics[], saved_at, review_box, due_at)`. Hai cách xem chỉ là truy vấn khác nhau.

### 3.8 Ôn tập ngắt quãng [SAU NÀY]
- Từ sai hiện lại sớm, từ đúng giãn dần (SM-2). Từ lưu và từ khóa tự vào danh sách ôn.

---

## 4. Đề nâng cấp (thi thử theo định dạng HSK)

- **[CHỐT]** Mỗi lần lên cấp có **3 đến 4 đề**. Khi thi, hệ thống **chọn ngẫu nhiên 1 đề**.
- **[CHỐT]** Đạt điểm là **lên cấp**. Lên cấp xong, được **làm lại các đề còn lại** (và đề cũ), nhiều lần, vì mục đích là thi thử xem có đạt không.
- **[CHỐT]** Đề **giống đề HSK thật**: cùng cấu trúc phần, số câu, thời gian, thang điểm. Ngưỡng đạt **60%** như HSK thật (HSK 2.0 cấp 1-2: 120/200, cấp 3-6: 180/300).
- **[CHỐT]** Đề thi do AI sinh sẵn, người duyệt, lưu cố định (không sinh lúc thi).
- Cấu trúc tham khảo HSK 2.0 (đối chiếu đề chính thức trước khi dựng): thời gian cấp 1 là 40 phút, cấp 2 là 55, cấp 3 là 90, cấp 4 là 105, cấp 5 là 125, cấp 6 là 140. Các phần: nghe, đọc, và từ cấp 3 có viết (sắp xếp từ thành câu, điền chữ).
- **[CẦN CHỐT]** Phần viết chỉ làm dạng chấm tự động được (sắp xếp câu, điền chữ). Bài viết luận cấp 6 và phần nói (HSKK) **[SAU NÀY]**.
- **[CẦN CHỐT]** Giờ học và số từ **không tự nâng cấp**. Chúng dùng để gợi ý "bạn có thể thi lên cấp" và để ưu tiên nội dung. Người học thi nâng cấp bất cứ lúc nào.
- Âm thanh phần nghe: TTS tạo sẵn.

---

## 5. Sự kiện truyện: "Ga cũ trong đêm mưa"

### 5.0 Mục đích sự kiện [CHỐT]
- Sự kiện để **tăng hấp dẫn, lôi kéo người học vào học, và tặng huy chương tượng trưng cho người chăm chỉ**. **Không nhằm thu lợi** (không bán lượt, VIP không có tác dụng trong sự kiện).
- Người nghỉ quá lâu thì **tự chịu**, không có cơ chế cứu thêm ngoài những gì đã chốt (bù ngày vắng, bù tuần, gói theo kịp, ngày dự trữ).
- Kiểm tra mục tiêu "đủ lượt mở hết gợi ý": mở hết 3 gợi ý của 48 ô cần **144 lượt**. Người nghỉ 3/7 ngày mỗi tuần mà làm đủ nhiệm vụ tuần được 38 lượt mỗi tuần, cộng 9 lượt cuối tháng là **161 lượt**, vẫn đủ. Làm tối thiểu (chỉ nhiệm vụ ngày) thì 28 lượt mỗi tuần, tổng 121, đủ để chơi cạnh tranh (96).

### 5.1 Cấu trúc và nhịp [CHỐT]
- Truyện = **4 chương** (1 tháng). Mỗi chương = **1 tuần** = **4 hồi** = **12 ô từ khóa** (mỗi hồi 3 từ khóa).
- Tối đa 4 hồi mỗi tuần vì truyện đủ dài để có nhiều đoạn đa dạng. Truyện ngắn hơn thì giảm còn 3 hồi mỗi tuần (9 ô).
- **Cách mở hồi**: người học tự chọn ô nào để tìm. **Tìm được 3 ô bất kỳ thì mở hồi 1**, 3 ô tiếp theo mở hồi 2, rồi hồi 3, hồi 4. Hồi luôn mở theo thứ tự.
- **[CHỐT]** Sự kiện chạy theo **tháng dương lịch**. Tuần 1 đến 4 = ngày 1-7, 8-14, 15-21, 22-28. Ngày 29, 30, 31 (nếu có) là **ngày dự trữ**. **Sang tháng mới là sự kiện mới.** **Ngày đổi lúc 00:00 giờ Việt Nam.** Tổng kết bằng huy chương.
- **[CHỐT]** **Không có hạn thời gian cho hồi** và không tự mở hồi (mục 5.8). Hồi chỉ mở khi người học tự tìm đủ từ khóa.

### 5.2 Bảng 12 ô từ khóa [CHỐT]
- Đầu chương, người học thấy bảng 12 ô. Mỗi ô là một từ khóa chưa biết.
- Chạm một ô để xem gợi ý và mở gợi ý cho ô đó. Ngoài bảng, mỗi ô hiển thị **số gợi ý đã dùng** (ví dụ 2/3) và trạng thái bằng **màu** (xem bảng dưới).
- **[CHỐT] Màu trạng thái ô** (đi từ lạnh sang nóng: càng dùng nhiều gợi ý càng ấm). Luôn kèm biểu tượng hoặc số chấm, không chỉ dựa vào màu (người mù màu vẫn phân biệt được), có bản sáng và tối:

| Trạng thái | Màu | Biểu tượng |
|---|---|---|
| Chưa mở gợi ý nào | Xám | dấu "?" |
| Đã mở gợi ý 1 | Xanh dương | 1 chấm |
| Đã mở gợi ý 2 | Vàng | 2 chấm |
| Đã mở gợi ý 3 | Cam | 3 chấm |
| Đã trả lời đúng | Xanh lá | dấu tick |

- Ô đang **nhấp nháy viền** (cùng màu của ô) khi bài vừa học chứa từ khóa của ô ấy (xem 5.5).
- Gợi ý đã mở hiện lại trong ô khi người học quay lại.
- Một hồi mở khi đủ số ô đã tìm: 3, 6, 9, 12. Hồi của chương nào tính theo ô của chương đó.
- **[CHỐT] Khóa ô theo ngày**: ô chưa tới ngày chỉ hiện "Mở vào ngày N" (chi tiết ở mục 5.6).

### 5.3 Từ khóa [CHỐT]
- Từ khóa là từ **phổ thông**, dùng được cho mọi cấp.
- Mỗi từ khóa xuất hiện trong **nhiều hội thoại** (ít nhất một hội thoại cho mỗi nhóm cấp). Gợi ý 2 trỏ người học tới hội thoại **hợp cấp của họ**. Cấp cao được ưu tiên hội thoại cấp cao cho đỡ nhàm.
- Đoán đúng nếu từ khóa **nằm trong bài vừa học** (bài bất kỳ chứa từ đó, không chỉ bài được gợi ý).
- **[CHỐT] Xáo từ khóa theo từng người**: cùng 12 từ khóa của chương, nhưng mỗi người một thứ tự trong 12 ô (máy chủ xáo theo mã người dùng). "Ô 3 là từ gì" của người này không đúng với người khác. Lịch mở ô 6/3/3 vẫn tính theo vị trí ô.
- **[CHỐT] Từ khóa chỉ hiện khi người học tự đoán đúng.** Không có cách nào khác làm lộ từ khóa (không tự công bố, kho lưu trữ vẫn ẩn).
- Người học đổi cấp giữa chương: gợi ý đã mở không đổi; gợi ý chưa mở theo cấp mới.

### 5.4 Gợi ý (mỗi ô) [CHỐT]
- **Gợi ý chung**: luôn hiện, rất mơ hồ, chỉ nói loại từ (sự vật, hành động, tính chất, người, nơi chốn, lời nói cố định, con số).
- **Gợi ý 1**: chủ đề từ vựng.
- **Gợi ý 2**: bối cảnh và tình huống ở mức **chung chung**, chỉ đủ để người học nhớ lại đúng bài hội thoại, **chưa đủ để chắc chắn** từ khóa là gì. Không nhắc tới hành động liên quan trực tiếp đến từ khóa.
- **Gợi ý 3**: một **câu hỏi trực tiếp** mà câu trả lời chính là từ khóa. Người học phải tìm lại câu trả lời trong bài và viết đúng chữ Hán.
- Câu hỏi ở gợi ý 3 **không được trùng** với các câu hỏi đã có trong chính hội thoại đó (kiểm tra tự động độ giống và người duyệt).
- Mở **tuần tự** (phải mở gợi ý trước mới mở gợi ý sau). Mỗi gợi ý tốn 1 lượt gợi ý.
- **[CHỐT] Bắt buộc mở gợi ý 1 của ô mới đoán được ô đó.** Ô chưa mở gợi ý nào thì không nhận đáp án; đoán trúng từ khóa của ô đó cũng tính như **đáp án sai**, để không ai dò từ khóa mà không tốn lượt. Màn nhập từ khóa chỉ liệt kê các ô đã mở gợi ý 1.
- Viết bằng **tiếng Trung đơn giản kèm bản dịch** (nút "Dịch gợi ý"), để người mới vẫn tiếp cận được.
- Quy tắc viết: không gợi ý nào chứa chữ Hán, pinyin hay bản dịch của đáp án (gợi ý 3 hỏi ra từ khóa chứ không nói ra). Có kiểm tra tự động và người duyệt.

Ví dụ (từ 咖啡): chung "một sự vật bạn có thể cầm" · 1 "Ăn uống" · 2 "hai đồng nghiệp gặp nhau buổi sáng ở văn phòng, một người trông rất mệt" · 3 "Trả lời câu hỏi sau: A và B quyết định uống gì để khỏi buồn ngủ?"

### 5.5 Điền đáp án [CHỐT]
- **Ô nhập không bao giờ tự bật**. Người học mở qua **icon "Nhập từ khóa"** ở cuối mọi hội thoại.
- **[CHỐT] Icon luôn ở trạng thái bình thường, không có animation hay chữ gợi ý nào khác (ví dụ không ghi "Bài này có từ khóa").** App không bao giờ chỉ ra bài vừa học có chứa từ khóa hay không, kể cả bằng đèn báo, rung hay sáng ô trên bảng 12 ô. Chạm vào icon mở ô nhập; bên dưới hiện **các gợi ý đã mở** của các ô chưa giải để xem lại. Máy chủ kiểm tra: từ đoán là từ khóa chưa giải của chương hiện tại **và** nằm trong bài vừa học.
- **[CHỐT] VIP không có tác dụng trong sự kiện** (mục 5.10). Cơ chế "bốc secret" và đèn báo "bài này có từ khóa" **đều đã bỏ hẳn**: không có đặc quyền VIP, không có gợi ý riêng cho ai. Người học tự đối chiếu gợi ý đã mở với các bài đã nghe.
- Nút: **Đoán**, **Đóng** (nghe lại hội thoại, giữ nguyên số lượt và gợi ý), **Không tham gia sự kiện** (bật lại được bất cứ lúc nào).
- **[CHỐT]** Người tắt sự kiện: nhiệm vụ ngày và tuần **không tính lượt**; bật lại thì tính từ lúc bật.
- **[CHỐT] Đoán sai**: mỗi 3 lần sai thì **trừ điểm** và trả lại đủ 3 lượt đoán: 3 lần đầu **−20**, 3 lần tiếp **−30**, 3 lần tiếp **−40** (tối đa −90). Từ lần sai thứ 10, mỗi 3 lần sai thì **khóa 15 phút** (không trừ thêm). Điểm phạt trừ vào ô bạn trả lời đúng kế tiếp rồi xóa (đoán sai không gắn với ô nào). Số lần sai, điểm phạt và giờ khóa lưu trên máy chủ.
- Đáp án chỉ nhận **tiếng Trung**: ghép ô chữ (mặc định), hoặc gõ chữ Hán, hoặc gõ pinyin (có hoặc không dấu). **Không nhận tiếng Việt** (báo lỗi, không tốn lượt).
- Từ khác trong cùng hội thoại: báo "Từ này có trong hội thoại nhưng không phải từ khóa", tính 1 lượt sai.
- **[CHỐT] Ghép ô chữ: một bảng 21 chữ lấy từ chính bài vừa học** (ưu tiên chữ của mọi từ khóa có trong bài, phần còn lại lấy ngẫu nhiên các chữ khác trong bài; chỉ mượn chữ ngoài bài khi bài quá ngắn). Dùng chung cho mọi ô trong bài, không cần chọn ô trước khi ghép — gõ ra từ nào, máy tự đối chiếu với các từ khóa. Không hiện số ô trống. Vì vậy **mỗi hội thoại phải đủ dài để có ít nhất 21 chữ Hán khác nhau** (đã kiểm: 6 bài HSK 1 hiện có 23–32 chữ khác nhau mỗi bài, 6 bài HSK 2 có 68–83 chữ, bài truyện có 90 chữ).
- Vẽ chữ bằng tay: **[SAU NÀY]**.

### 5.6 Lượt gợi ý và kinh tế lượt [CHỐT nguyên tắc; CẦN CHỐT con số, đang bàn]

**Đã chốt**
- Mỗi chương mặc định **4 hồi**, mỗi hồi 3 từ khóa = **12 ô**. Nhu cầu lượt của một chương = số ô × 3 gợi ý = **9 × số hồi** (4 hồi = 36 lượt để mở hết mọi gợi ý).
- **[CHỐT] Không bán lượt gợi ý.** Lượt chỉ đến từ nhiệm vụ, thưởng, gói theo kịp và đền bù (đã có nhiều nguồn bảo hiểm nên không cần mua). Hệ quả: không còn "lượt mua", không còn hoàn point, không còn giá 3.000 point mỗi lượt.
- Lượt dư **không đổi thành điểm xếp hạng**.
- Nếu chưa nghĩ ra kịch bản đủ dài, **kéo dài truyện**.
- **Chống gian lận nhiệm vụ**: "3 đoạn hội thoại" phải là 3 bài **khác nhau**, nghe đủ từ 80% thời lượng và trả lời hết câu hỏi; "online" chỉ tính thời gian đang thao tác (ngừng tính sau 2 phút không thao tác).

**Nhiệm vụ hằng ngày (4 lượt mỗi ngày, 28 lượt mỗi tuần)**
- Đăng nhập: +1. **[CHỐT] Nghe và trả lời hết câu hỏi của 2 bài hội thoại khác nhau**: **+2** (chỉ nghe mà không trả lời hết thì không tính). **Online 30 phút**: +1. Tổng 1 + 2 + 1 = 4.
- **[CHỐT]** Nhiệm vụ tuần "Học bài nghe" hạ xuống **6/10/14 bài** (khớp nhiệm vụ ngày 2 bài).
- **[CHỐT]** 4 lượt mỗi ngày (28 mỗi tuần) và nhiệm vụ tuần giữ tối đa 21 lượt. Tối đa **49 lượt mỗi tuần** (dư 13 so với nhu cầu 36). Dư vô hại vì khóa ô 6/3/3 chặn mở hết chương trong 1 ngày.

**Nhiệm vụ tuần (mỗi nhiệm vụ 3 mốc, giá trị 2/3/2, tổng 21 lượt)** [CHỐT 2/3/2]

| Nhiệm vụ | Mốc 1 | Mốc 2 | Mốc 3 | Tổng |
|---|---|---|---|---|
| Đăng nhập | 3 ngày: +2 | 5 ngày: +3 | 7 ngày: +2 | 7 |
| Online tổng | 2 giờ: +2 | 3 giờ: +3 | 4 giờ: +2 | 7 |
| Học bài nghe | 6 bài: +2 | 10 bài: +3 | 14 bài: +2 | 7 |
| **Cộng** | **6** | **9** | **6** | **21** |

- Mốc 1 và mốc 2 của cả 3 nhiệm vụ = **15 lượt lõi**. Cùng 28 lượt nhiệm vụ ngày cho **43 lượt**, vượt nhu cầu 36 để bù cho người chưa làm đủ mọi nhiệm vụ.
- Làm đủ mọi nhiệm vụ: 28 + 21 = **49 lượt**.

**Bù ngày vắng: mỗi ngày vắng +2 lượt, tối đa 12 lượt mỗi lần vắng, nhận khi quay lại** [CHỐT]
- **Một "lần vắng"** là một chuỗi ngày liên tiếp không đăng nhập. Nghỉ từ 6 ngày trở lên thì đủ 12 lượt. Lượt bù cộng ngay khi người học đăng nhập lại.
- **Ngày vắng chỉ tính từ ngày tham gia** (xem "Ngày tham gia" bên dưới) và chỉ khi không tắt sự kiện. Người tắt sự kiện rồi bật lại thì không được bù cho thời gian tắt.
- **Logic và DB**: chỉ cần nhớ `last_login` (ngày đăng nhập gần nhất). Khi đăng nhập, bù = 2 × min(6, số ngày từ lần đăng nhập trước tới hôm nay, trừ 1). Không cần chốt tuần, không cần bảng riêng.
- **Nguyên tắc thiết kế**: người vào đều và làm nhiệm vụ mỗi ngày phải luôn có lợi nhất. Mỗi ngày vắng chỉ +2, trong khi ngày có làm nhiệm vụ được +3 trở lên, cộng thêm nhiệm vụ tuần mà người nghỉ không với tới. Vì vậy càng vào nhiều ngày thì tổng lượt mỗi tuần càng nhiều (xem bảng). Không cộng thẳng 12 lượt cho người không vào ngày nào, vì khi đó người bỏ cả tuần sẽ nhận nhiều hơn người vào 1 ngày.
- Kết quả mỗi tuần khi các ngày vắng liền nhau (làm tối thiểu = chỉ nhiệm vụ ngày; làm cố gắng = đạt hết mốc tuần):

| Số ngày có vào | Từ nhiệm vụ (tối thiểu) | Bù | Tổng (tối thiểu) |
|---|---|---|---|
| 7/7 | 47 | 0 | **47** (làm cố gắng: 49) |
| 6/7 | 39 | 2 | **41** (45) |
| 5/7 | 32 | 4 | **36** (43) |
| 4/7 | 22 | 6 | **28** (38) |
| 3/7 | 16 | 8 | **24** (36) |
| 2/7 | 8 | 10 | **18** |
| 1/7 | 4 | 12 | **16** |
| 0/7 | 0 | 12 | **12** |

- Người nghỉ 3 ngày liền mỗi tuần mà làm đủ nhiệm vụ tuần được **38** lượt mỗi tuần, cộng 9 lượt cuối tháng là **161**, đủ để mở hết (144). Thay đổi này chỉ ảnh hưởng người nghỉ **trên 3 ngày liền**.
- **Nhiệm vụ tuần** (đăng nhập 3/5/7 ngày) chính là phần thưởng chuyên cần. Không có thêm thưởng chuyên cần riêng.

**Ngày tham gia** [CHỐT]
- **Ngày tham gia = ngày đăng nhập đầu tiên trong tháng** (mọi người mặc định có trong sự kiện, trừ ai tắt). Không tính theo lúc bấm vào trang sự kiện, để không ai chờ đến giữa tháng mới bấm nhằm nhận gói theo kịp.
- Gói theo kịp chỉ áp dụng khi ngày tham gia là ngày 8 đến 28 (xem bên dưới).

**Khóa ô theo ngày (chống mở hết trong một ngày)** [CHỐT]
- Mỗi tuần, ô từ khóa mở dần theo lịch: **ngày 1 mở 6 ô, ngày 2 mở thêm 3 (9 ô), ngày 3 mở thêm 3 (12 ô)**. Lịch tính theo ngày dương lịch (00:00 giờ Việt Nam), **không phụ thuộc người học có đăng nhập hay không**.
- Mục tiêu: dù tích nhiều lượt, **sớm nhất ngày thứ 3 mới giải xong chương**; người chăm chỉ không tích lượt thường xong khoảng ngày 6 đến 7. Câu chuyện ra đều: 2 hồi, rồi 1, rồi 1. Mỗi ngày đăng nhập có ô mới để mở.
- Ô chưa mở chỉ hiện **"Mở vào ngày N"**, không xem được gợi ý, không mở được gợi ý. Đoán trúng từ khóa của ô chưa mở **tính là đáp án sai** (không tiết lộ ô đó có tồn tại).
- Chương đã qua tuần của nó mở đủ 12 ô. Người vào muộn không bị khóa chương cũ. Chương mới chỉ có từ đầu tuần của nó, nên không thể dùng lượt tích để mở sớm chương sau.
- Điểm "tìm trong tuần của chương" (+30) giữ nguyên.

**Thưởng cuối tháng**
- **[CHỐT] Ngày 26, 27, 28**: đăng nhập mỗi ngày +3 lượt (chỉ cần đăng nhập), tổng **+9 lượt**. Cộng thêm với nhiệm vụ ngày.
- **[CHỐT] Ngày dự trữ 29, 30, 31 (nếu có)**: nhiệm vụ ngày vẫn cho 4 lượt mỗi ngày, **chỉ cho người chưa giải hết từ khóa**. **Không có tuần thứ 5**: tiến độ nhiệm vụ tuần của tuần 4 giữ nguyên. Tháng 2 (28 ngày) không có ngày dự trữ; năm nhuận có 1 ngày.
- **[CHỐT]** Cộng thêm +3 lượt đăng nhập mỗi ngày dự trữ (tổng +9, cộng 12 của nhiệm vụ ngày thành 21 lượt cho 3 ngày), **chỉ cho người chưa giải hết**.

**Lượt dư cuối sự kiện [CHỐT]**
- **[CHỐT]** Lượt **tặng** (nhiệm vụ, bảo hiểm, thưởng cuối tháng, gói theo kịp, đền bù) **hết hạn khi sự kiện kết thúc**. **Không** giữ sang sự kiện sau (tránh mất cân bằng và lộ truyện quá sớm), **không** đổi thành point.
- Báo trước cho người chơi vào ngày 26 đến 28: lượt tặng sẽ hết hạn khi sự kiện kết thúc.
- **[CHỐT] Gói theo kịp**: người vào muộn nhận **một lần**, chỉ khi vào từ ngày 8 đến 28. Vào ngày 8 đến 14: **12 lượt**. Vào ngày 15 đến 21: **24 lượt** (tối đa). Vào ngày 22 đến 28 (tuần cuối): chỉ **1 gói 12 lượt** (còn ít thời gian). Vào từ ngày 29: không có gói.
- **[CHỐT] Đền bù sự cố**: nếu app lỗi giữa chừng, tặng người chơi lượt của ngày bị ảnh hưởng và quà trong game. Cần chức năng quản trị tặng lượt và quà hàng loạt, ghi lý do vào sổ lượt.

**Tối ưu DB (đề xuất)**
- Một dòng cho mỗi người mỗi sự kiện: `login_bits` (bitmask 31 ngày), số bài nghe và số giây online theo từng tuần (4 tuần), cờ mốc tuần đã nhận, cờ thưởng cuối tháng đã nhận.
- Số ngày đăng nhập mỗi tuần tính từ `login_bits`. Bù ngày vắng tính khi đăng nhập, dựa vào `last_login`. Thêm `join_day` (ngày đăng nhập đầu tiên trong tháng).
- Sổ lượt (`token_ledger`) chỉ ghi các giao dịch lượt: mở gợi ý, cộng nhiệm vụ và bù ngày vắng, thưởng cuối tháng, gói theo kịp, đền bù. Không còn giao dịch mua hoặc chuyển sang point. Không ghi từng nhiệm vụ nhỏ.

**Tính cho cả sự kiện (4 chương, 48 từ khóa)**
- Tối đa: 4 × 49 + 9 (ngày 26-28) = **205**; làm tối thiểu cả 4 tuần: 4 × 47 + 9 = **197**. Ngày dự trữ cộng thêm cho người chưa xong.
- Nhu cầu: mở hết gợi ý = 144. Chơi cạnh tranh (chỉ mở tới gợi ý 2) = 96. Người chơi đều tay thường còn dư khoảng 60 đến 80 lượt.
- Người chỉ làm nhiệm vụ ngày và nghỉ 3 ngày liền mỗi tuần có khoảng 4 × 28 + 9 = 121 lượt, vừa đủ để chơi cạnh tranh (96). Vì không bán lượt nên cơ chế bù là chỗ dựa duy nhất cho người bận.

### 5.7 Điểm, mốc thưởng, bảng xếp hạng [CHỐT nguyên tắc; CẦN CHỐT con số, sẽ bàn lại]
- **[CHỐT] Bảng điểm mỗi ô**: đoán đúng khi mới mở **gợi ý 1: 230**, mở **2 gợi ý: 200**, mở **3 gợi ý: 150**, trừ điểm phạt đoán sai (mục 5.4). Cộng **+30** nếu tìm được trong tuần của chương. Không có điểm cho lượt dư. Lý do gợi ý 1 cao nhất: người giỏi chỉ cần gợi ý 1 và gợi ý chung là đoán được; chênh 30 điểm để mở thêm gợi ý còn đáng đổi 1 lượt.
- **[CHỐT] Chống dò ở mức vừa phải**: người cầm danh sách 12 từ khóa thử lần lượt vẫn làm được nhưng mất khoảng 20 đến 50 điểm mỗi ô, và sau 9 lần sai thì bị khóa. Chấp nhận như vậy: điểm chỉ để xếp hạng, không cần gắt hơn. Không dùng bộ từ khóa riêng cho từng người.
- Kiểm tra: tối đa 48 × 260 = 12.480 điểm; giải cả 48 ô bằng gợi ý 3 được 48 × 180 = 8.640. Ô thấp nhất sau phạt tối đa: 150 − 90 = 60 (+30).
- **[CHỐT] 4 mốc theo số từ khóa đã giải**: **10%, 30%, 60%, 90%** tổng số từ khóa của truyện, **làm tròn lên** 1 từ khóa nếu số lẻ. Truyện 48 từ khóa (4 chương × 12) thì mốc là **5, 15, 29, 44**.
- **[CHỐT]** **Mốc cuối (90%) tặng gói VIP 3 ngày.** Quà các mốc khác (point, huy hiệu...) **để sau**.
- **[CHỐT]** Có **bảng xếp hạng chung** (không chia nhóm cấp). Huy chương hiển thị là huy chương mốc kèm số hạng, cho mọi người đã đạt huy chương (không có huy chương riêng cho top).
- **[CHỐT] Thứ tự xếp hạng**: nhiều **điểm sự kiện** hơn xếp trên; bằng điểm thì huy chương cao hơn xếp trên; vẫn bằng thì ai giải xong sớm hơn xếp trên.
- **[Đề xuất]** Công bằng xếp hạng: điểm xếp hạng chỉ phụ thuộc số gợi ý đã mở và việc tìm sớm; lượt (thưởng, dư) không ảnh hưởng. Đồng điểm: ai giải xong sớm hơn xếp trên. Người chơi đều tay có 157 đến 177 lượt, đủ cho chơi cạnh tranh (96 lượt).
- **[CHỐT]** 4 mốc chính là **4 huy chương** (Đồng, Bạc, Vàng, Ngọc theo thứ tự). Huy chương hiển thị là huy chương mốc đã đạt, **kèm số hạng bên cạnh** (ví dụ Vàng #12).

### 5.8 Chương hết tuần, hết sự kiện [CHỐT]
- **Không có bảo hiểm tự động mở hồi** theo thời gian. Hồi chỉ mở khi người học tự tìm đủ từ khóa.
- Người học chưa mở hết hồi khi chương hết tuần: **chương vẫn chơi được đến hết sự kiện**, và được cộng thêm lượt gợi ý theo cơ chế lượt bù (mục 5.6). Cơ chế lượt bù chính là "bảo hiểm" mới.
- Điểm "tìm sớm" +30 chỉ tính khi tìm trong tuần của chương đó (mục 5.7).
- **[CHỐT] Sau sự kiện**: truyện vào mục "Bài học event" làm kho lưu trữ, mở toàn bộ nội dung cho mọi người đọc, **không có điểm**. Hiển thị tiến độ sưu tập: **"đã khám phá X/48 từ khóa"**.
- **[CHỐT]** Kho lưu trữ chỉ hiện các từ khóa **người đó đã giải** (và tự thêm vào "Từ của tôi"). Từ khóa chưa giải **giữ ẩn**, vẫn giải được như chế độ luyện tập (không điểm, không xếp hạng, mở gợi ý bằng cách luyện tập, chưa chốt chi tiết). Lý do: giữ được câu đố cho người vào sau hoặc các lần chạy lại. Vì lượt tặng đã hết hạn và không bán lượt, đề xuất: nghe hoàn thành 2 bài bất kỳ thì được 1 gợi ý trong kho.
- **[CHỐT] Lịch** theo tháng dương lịch (mục 5.1). Ngày dự trữ xem mục 5.6.

### 5.9 Bài học event [CHỐT]
- Mở một hồi sẽ mở **một đoạn truyện** như một bài học thông thường: nghe, dịch, pinyin, câu hỏi, bôi đen thêm từ.
- Lưu ở mục riêng: **Bài học event: Ga cũ trong đêm mưa**, xếp theo chương và hồi.
- **[CHỐT]** Chỉ **một phiên bản**, thuộc **cấp Trung: khoảng HSK 3-4 (HSK 2.0)**. Cho phép dùng từ khó hơn khi cốt truyện cần (có chạm từ xem nghĩa). Lý do: vốn từ HSK 1-2 không đủ để kể chuyện hấp dẫn, hài hước hay bi kịch.
- **[CHỐT]** Người học trung và cao đọc hiểu trực tiếp, không cần dịch, chỉ dịch một vài từ để học (chạm từ để xem nghĩa; AI sinh sẵn bảng nghĩa từng từ cho mỗi đoạn).
- **[CHỐT]** Người mới học: bản dịch tiếng Việt **bật mặc định** để đọc và học theo truyện.
- **[CHỐT]** **Không khóa theo cấp.** Người cấp thấp vẫn học được bài event. Chỉ hiện **cảnh báo kèm tag cấp**, ví dụ: "Bạn có thể đọc nội dung bằng tiếng Việt, nhưng chữ trong truyện thuộc HSK 3 (2.0). Hãy cân nhắc khi học nội dung này."

### 5.10 VIP [SAU NÀY]
- **[CHỐT] Nguyên tắc: app không pay-to-win.** VIP **chỉ mở khóa tính năng giúp học dễ hơn** (ví dụ sơ đồ từ nâng cao), hoặc ưu đãi giảm giá. VIP **không có tác dụng gì khi tham gia sự kiện**: không thêm lượt, không đèn báo, không đổi điểm, không đổi thứ hạng.
- Hệ quả: VIP 3 ngày ở mốc cuối không cần hạn chế riêng, vì không ảnh hưởng sự kiện.
- Còn bàn sau: giá gói, danh sách tính năng VIP, giảm giá áp dụng cho gì (xem câu hỏi mở).
- **[CHỐT]** Point dùng để thanh toán gói VIP. Mốc cuối (90%) tặng VIP 3 ngày.
- **[CHỐT]** VIP 3 ngày là **vật phẩm trong túi đồ**: người chơi bấm mở thì kích hoạt và bắt đầu đếm ngược 3 ngày. Vật phẩm **có hạn dùng nếu không mở**: ví dụ **90 ngày** kể từ lúc nhận (số ngày chính thức quyết sau).

### 5.11 Chống lộ từ khóa trên cộng đồng [SAU NÀY]
- Vấn đề: từ khóa bị chia sẻ ngoài app, người học gõ thẳng mà không mở gợi ý nào, vẫn nhận điểm suy luận.
- Chưa chốt cách xử lý. User yêu cầu **đề xuất sau**.

---

## 6. Hướng dẫn người dùng (chống bỡ ngỡ) [CHỐT bản demo; chi tiết còn bổ sung]

**[CHỐT] Chỉ dẫn trên màn hình (đã có trong demo)**: lần đầu mở mỗi màn (Trang chủ, danh sách bài, bài học, Sự kiện, Sổ tay), app làm tối màn hình và chỉ lần lượt từng phần kèm lời giải thích ngắn. Có nút Trước, Tiếp, "Bỏ qua" và "Không hiện hướng dẫn nữa". **Tắt/bật và "Xem lại hướng dẫn từ đầu"** ở Thêm → Hướng dẫn; trang này có thêm "Cách dùng HanVui trong 5 bước".


**Lần đầu mở app** (tour 5 bước, có nút "Bỏ qua"):
1. Chọn chuẩn và cấp HSK (hoặc thi xếp lớp).
2. Từ vựng: chạm một từ để xem cách viết từng nét và nghe phát âm.
3. Hội thoại: nghe trước, trả lời, rồi mới xem transcript. Bôi đen để thêm từ.
4. Kiểm tra và nhiệm vụ hằng ngày.
5. Sự kiện: bảng 12 ô, gợi ý, lượt gợi ý, icon "Nhập từ khóa" ở cuối mỗi hội thoại.

**Trong lúc dùng:**
- Gợi ý ngắn có ngữ cảnh ở lần đầu mỗi tính năng (ví dụ lần đầu vào bài hội thoại: "Nghe trước, chưa cần xem chữ").
- Trang "Cách chơi sự kiện" xem qua một lần trước khi tham gia, ngắn, có ví dụ.
- Mục "Hướng dẫn" luôn nằm ở tab Thêm, xem lại bất cứ lúc nào, kèm câu hỏi thường gặp.
- Trạng thái rỗng luôn nói rõ bước tiếp theo (ví dụ "Chưa có từ nào. Sang Hội thoại, bôi đen một từ để thêm").

**Luồng học đề xuất mỗi ngày:** Đăng nhập → làm nhiệm vụ → học một bài hội thoại → thêm từ → kiểm tra → xem bảng ô từ khóa.

---

## 7. Nội dung AI sinh và kiểm duyệt [CẦN CHỐT]

- Sinh trước, lưu DB. Không sinh lúc người học mở bài.
- Mỗi bài hội thoại: 4 đến 8 câu, kèm pinyin, dịch, câu hỏi (tiếng Trung + dịch), từ vựng, nhãn cấp HSK (cả hai chuẩn) và chủ đề.
- Mỗi ô từ khóa: 1 từ phổ thông + các hội thoại chứa từ đó theo nhóm cấp + 4 gợi ý (1 chung, 3 mở dần, mỗi gợi ý có bản tiếng Trung và bản dịch).
- Mỗi hồi: 1 đoạn truyện. Mỗi chương: 12 ô, 4 đoạn truyện.
- Pinyin kiểm bằng thư viện (AI hay sai thanh điệu). Gợi ý kiểm tự động không chứa đáp án; câu hỏi ở gợi ý 2 kiểm tự động không trùng câu hỏi của hội thoại.
- Người biết tiếng Trung duyệt trước khi công khai.
- Đề nâng cấp: 3 đến 4 đề mỗi cấp, cố định sau khi duyệt.
- Ước lượng khối lượng một chương: 12 từ khóa × 3 nhóm cấp = 36 hội thoại, 12 bộ gợi ý, 4 đoạn truyện.

## 8. Công nghệ đề xuất [CẦN CHỐT]
- Giao diện: PWA (React hoặc Next.js), mobile trước.
- Âm thanh: tạo sẵn bằng TTS neural zh-CN (giọng của trình duyệt khác nhau giữa máy). **[Đề xuất, chờ chốt]** Quy trình: khi bài được duyệt, máy chủ chạy một tác vụ nền sinh **từng file âm thanh cho từng câu** (đúng giọng của vai theo mục 3.2), tải lên **Cloudflare R2** (S3-tương thích, không tính phí băng thông tải xuống, bật tên miền CDN riêng), rồi lưu **khóa file** (không lưu URL đầy đủ) vào cột `audio_key` của từng câu. Định dạng MP3 mono 48-64 kbps (chạy được trên mọi trình duyệt, kể cả iOS). Tên file có mã băm nội dung (`audio/{lesson_id}/{line_idx}-{voice}-{hash}.mp3`), cache 1 năm; chỉ sinh lại khi đổi chữ hoặc đổi giọng. Tốc độ chậm dùng `playbackRate` (giữ cao độ), không sinh file riêng. Bản PWA lưu sẵn âm thanh của bài đã mở để nghe lại khi không có mạng.
- **[CHỐT TẠM, 16/10/2026] Giai đoạn dựng và thử: tạo âm thanh bằng công cụ edge-tts (không chính thức, không cần tài khoản), như bản demo.** Lý do: tài khoản Azure bị từ chối đăng ký (cả gói miễn phí lẫn pay-as-you-go), Google Cloud đòi nạp trước 800.000 ₫. **[SAU NÀY, bắt buộc trước khi phát hành]** chuyển sang dịch vụ có hợp đồng (Azure hoặc Google) và tạo lại toàn bộ âm thanh; rủi ro của edge-tts: không có điều khoản dùng thương mại, có thể bị chặn hoặc đổi bất cứ lúc nào. Để chuyển dễ: `audio_key` và `voice_id` không gắn với nhà cung cấp, băm âm thanh `audio_hash` có chứa tên nhà cung cấp và giọng nên đổi là tự sinh lại.
- **[CHỐT] Dịch vụ giọng đọc: Azure Speech (Microsoft), tài khoản và hợp đồng của chủ app.** Gói miễn phí F0: 0,5 triệu **ký tự tính phí** mỗi tháng (chữ Hán ×2, nên khoảng 250.000 chữ Hán, khoảng 13.000 câu hay 1.300 bài mỗi tháng), giới hạn 20 yêu cầu mỗi 60 giây, không có tổng hợp hàng loạt. Hạn mức chỉ tốn khi **tạo** file; người học nghe file trên R2 không tốn hạn mức Azure. Số liệu tra ngày 16/10/2026 từ bảng giá chính thức (API giá của Azure, trang giá Google, OpenAI, ElevenLabs, MiniMax, Tencent, AWS):
  - **Azure**: giọng Neural tiêu chuẩn **15 USD / 1 triệu ký tự tính phí**, Neural HD 22 USD, miễn phí 0,5 triệu ký tự mỗi tháng. **Mỗi chữ Hán tính là 2 ký tự**, thẻ SSML (trừ speak, voice) cũng tính. zh-CN có 12 giọng nữ và 9 giọng nam tiêu chuẩn; Xiaomo, Yunye có vai (Boy, Girl, YoungAdult, OlderAdult, Senior), Yunxi có Boy, Narrator, YoungAdultMale; chỉnh cao độ 0,5 đến 1,5 lần bằng prosody.
  - **Google Cloud**: Standard và WaveNet 4 USD (miễn phí 4 triệu ký tự mỗi tháng; có nguồn cũ ghi WaveNet 16 USD), Chirp 3 HD 30 USD (miễn phí 1 triệu). Mỗi chữ Hán tính 1 ký tự. cmn-CN: Standard 2 nữ 2 nam, WaveNet 2 nữ 2 nam, Chirp 3 HD 14 nữ 16 nam.
  - **Amazon Polly**: tiếng Phổ thông chỉ có 1 giọng nữ (Zhiyu), loại.
  - **OpenAI**: tts-1 15 USD, tts-1-hd 30 USD / 1 triệu ký tự; gpt-4o-mini-tts tính theo token. Giọng không riêng cho tiếng Trung, chưa kiểm chất lượng.
  - **ElevenLabs**: 0,04 USD (Flash) đến 0,08 USD (Multilingual v2, v3) mỗi 1.000 ký tự, có hỗ trợ tiếng Phổ thông.
  - **MiniMax**: 60 USD (turbo) đến 100 USD (HD) / 1 triệu ký tự.
  - **Tencent Cloud**: 0,125 USD (chuẩn) và 0,185 USD (cao cấp) mỗi 10.000 ký tự; chưa lấy được danh sách giọng Phổ thông theo giới tính.
  - **Dự toán 2.000 bài** (20.000 câu × 18 chữ = 360.000 chữ Hán, cộng dấu câu): Azure khoảng 0,8 triệu ký tự tính phí → 0 đến khoảng 5 USD (chia 2 tháng thì nằm trong gói miễn phí); nếu mỗi câu thêm thẻ vai hoặc cao độ thì khoảng 1,8 triệu → khoảng 20 USD. Google Standard/WaveNet: 0 USD trong gói miễn phí. Chênh lệch giữa các bên rất nhỏ, chọn Azure vì nhiều giọng, có vai theo tuổi và giống giọng bản demo.
  - **Trước khi phát hành**: tạo bằng tài khoản Azure của chủ app (giữ hóa đơn và ảnh chụp điều khoản), ghi "Giọng đọc do AI tạo" trong app, đọc điều khoản dùng thương mại, hỏi luật sư một lần nếu bán app. Khóa Azure chỉ để ở máy chủ, không đưa vào app hay trang demo.
- Backend: Claude API cho nội dung, Postgres (Supabase) cho người dùng, tiến độ, sự kiện. Số lượt, giờ khóa, điểm danh tính theo giờ máy chủ để chống gian lận.
- **[CHỐT 18/10/2026] Bộ công nghệ bản thật** (mục 10 câu 7 đã chốt): Backend **NestJS**; web **Next.js (PWA) làm trước**, **React Native làm sau**; ORM **Prisma**; cơ sở dữ liệu **PostgreSQL**, giai đoạn đầu đặt ở Supabase, sau chuyển sang VPS riêng.
  - **Quy tắc để chuyển Supabase → VPS không đau**: chỉ dùng Supabase như **một máy chủ Postgres thuần**. Không dùng Supabase Auth, Supabase Storage, Realtime, Edge Functions, thư viện `supabase-js` phía app, và không viết chính sách RLS. Đăng nhập, phân quyền, tải file đều làm trong NestJS (âm thanh nằm ở Cloudflare R2, không ở Supabase Storage). Nhờ đó cả hệ thống chỉ cần một chuỗi kết nối `DATABASE_URL`; đổi sang VPS là đổi chuỗi này.
  - **Cách chuyển**: `pg_dump` rồi `pg_restore` (cùng họ Postgres, cùng phiên bản chính hoặc mới hơn); chỉ bật extension chuẩn (ví dụ `pgcrypto`, `uuid-ossp`). Mọi thay đổi cấu trúc bảng đi qua **migration của ORM** (Prisma hoặc TypeORM) lưu trong git, không sửa tay trên giao diện Supabase.
  - **Lưu ý khi dùng**: nếu kết nối qua bộ gộp kết nối (pooler) của Supabase thì cấu hình ORM cho phù hợp (Prisma cần `pgbouncer=true` và một chuỗi kết nối trực tiếp riêng cho migration); gói miễn phí có giới hạn dung lượng và có thể bị tạm dừng khi lâu không dùng (kiểm tra lại trên trang giá trước khi dựa vào).
  - **[CHỐT 18/10/2026]** Bản đầu chỉ làm **web PWA (Next.js)**; React Native để sau khi web chạy ổn.
- **[CHỐT] Cấu trúc thư mục và công cụ** (16/10/2026, cập nhật 18/10): thư mục dự án `D:\HanVui\HANVUI` gồm `BE` (NestJS) và `FE` (Next.js); trình quản lý gói **pnpm** (không dùng npm); ORM **Prisma 7** (schema ở `BE/prisma/schema.prisma`, migration lưu trong `BE/prisma/migrations`, kết nối bằng `@prisma/adapter-pg`).
- **[CHỐT] Đăng nhập**: email + mật khẩu (bcrypt, 12 vòng), **JWT access token** 15 phút + **refresh token** ngẫu nhiên 30 ngày chỉ lưu mã băm SHA-256 trong bảng `RefreshToken`, xoay vòng mỗi lần làm mới; dùng lại token đã thu hồi thì hủy cả phiên (cùng `family`). Giới hạn 10 lần/phút cho nhóm `/auth`, 120 lần/phút chung. Vai trò `USER`/`ADMIN`. Các API: `POST /api/v1/auth/register|login|refresh|logout`, `GET /api/v1/auth/me`, `GET /api/v1/health`.
- **[CHỐT] API nội dung và sự kiện (BE, tiền tố `/api/v1`)**: `GET topics`, `topics/:id/words`, `lessons?level&topic&q` (tìm không nhìn nội dung câu thoại), `lessons/:id` (lời thoại và bản dịch câu hỏi chỉ trả sau khi trả lời hoặc bỏ qua), `POST lessons/:id/answers|skip`; `GET|POST|DELETE notebook` (xem theo ngày hoặc chủ đề); `PATCH auth/me` (đổi chuẩn HSK, cấp, tên hiển thị); `GET event/today` (tiến độ nhiệm vụ ngày cho trang chủ); `POST event/checkin` (gọi mỗi lần mở app, cộng lượt đăng nhập, bù ngày vắng, thưởng cuối tháng, gói theo kịp), `POST event/ping` (tính online, mỗi lần báo cộng tối đa 2 phút), `GET event`, `POST event/slots/:id/hint`, `POST event/guess`, `POST event/opt-out`, `GET event/leaderboard`, `GET event/inventory`, `POST event/inventory/:id/open`. Luật nằm ở `BE/src/event/event.rules.ts` (hàm thuần, có test). Dữ liệu mẫu nạp bằng `pnpm db:seed` (lấy từ bản demo; chỉ Chương 1, chương 2-4 chờ nội dung).
- **Chưa làm ở BE**: kho lưu trữ luyện tập sau sự kiện, đề nâng cấp (chỉ có bảng), chấm phát âm, sinh âm thanh (chờ Cloudflare R2), thông báo đẩy, API quản trị tặng lượt hàng loạt.
- **[CHỐT 18/10/2026] Nội dung hiện có**: 18 hội thoại (6 chủ đề × HSK 1/2/3) + 4 đoạn truyện chương 1, 112 từ trong từ điển, 12 ô từ khóa. Nhãn HSK của mọi bài đã tính tự động (`pnpm db:hsk`). Nút đổi bản trong bài xoay vòng HSK 1 → 2 → 3 → 1.
- **[CHỐT 19/10/2026] Giao diện "vừa học vừa chơi"**: lớp màu mới ở `FE/app/theme.css` (nạp sau `globals.css`, giữ nguyên bố cục và tên lớp của bản demo). Mỗi mảng một dải màu: **nghe xanh dương · nói cam · đọc vàng · viết ngọc bích · sự kiện tím · sổ tay hồng**; thẻ lớn có dải màu và chữ Hán mờ làm hoa văn; nút chính dày có bóng nhấn xuống; ô số liệu màu ở trang chủ; chuỗi ngày hiện ngọn lửa; huy chương tô kiểu kim loại (đồng, bạc, vàng, ngọc); pháo giấy khi trả lời đúng hết câu hỏi và khi giải đúng một ô từ khóa. Chữ trên nền màu luôn trắng, điểm đầu dải màu đủ tối để đạt tương phản; trạng thái vẫn luôn kèm chữ hoặc số (không chỉ dựa vào màu); vẫn tôn trọng "giảm chuyển động" của máy. **Nhân vật dẫn đường để sau** (con dấu 汉 đang giữ chỗ).
- **[CHỐT 18/10/2026] FE (Next.js 16, App Router, TypeScript)**: không dùng thư viện giao diện ngoài, bê nguyên bảng màu và CSS của bản demo 11 vào `FE/app/globals.css`. PWA bằng `manifest.webmanifest` + service worker tự viết (`FE/public/sw.js`). Chữ viết từng nét dùng **hanzi-writer**; dữ liệu nét tải từ CDN jsdelivr (`hanzi-writer-data`). Token lưu ở `localStorage`, tự làm mới khi access token hết hạn. Biến môi trường FE: `NEXT_PUBLIC_API_BASE` (mặc định `http://localhost:3001/api/v1`) và `NEXT_PUBLIC_AUDIO_BASE` (tên miền CDN của Cloudflare R2; để trống thì lùi về giọng trình duyệt).
- **[CHỐT 18/10/2026, đã chạy thử] Lưu âm thanh trên Cloudflare R2**: bucket `ecourselearning`, kết nối kiểu S3 (`S3_ENDPOINT` dạng `https://<ma-tai-khoan>.r2.cloudflarestorage.com`, `S3_ACCESS_KEY`/`S3_SECRET_KEY` từ R2 API Token, `S3_REGION=auto`), đọc công khai qua **Public Development URL** `https://pub-<ma>.r2.dev` (`S3_PUBLIC_URL`, cũng là `NEXT_PUBLIC_AUDIO_BASE` của FE). Script `pnpm audio` (`BE/scripts/tts-upload.ts`): sinh MP3 **từng câu theo vai** bằng edge-tts → tải lên R2 với `Content-Type: audio/mpeg` và `Cache-Control: max-age=31536000, immutable` → ghi `audioKey` + `audioHash` vào `LessonLine`. Khóa file `audio/{lessonId}/{idx}-{voice}-{hash}.mp3`; `audioHash` chứa tên nhà cung cấp, giọng và cao độ nên đổi bất cứ thứ nào là tự sinh lại. Hai vai dùng cùng một giọng thì script tự lệch cao độ ±12Hz. Đã làm thật bài `cafe` (6 câu, 77 KB) ngày 18/10/2026 và nghe được từ FE.
- **[CẦN CHỐT] Tên miền r2.dev chỉ dùng khi dựng**: Cloudflare giới hạn tần suất và không cache tốt trên tên miền này. Trước khi phát hành nên gắn **custom domain** cho bucket rồi chỉ cần đổi `S3_PUBLIC_URL` và `NEXT_PUBLIC_AUDIO_BASE`.
- **[CHỐT 19/10/2026] Đã tạo âm thanh cho toàn bộ nội dung hiện có**: 166 câu của 22 bài (18 hội thoại + 4 đoạn truyện), 3,01 MB trên R2, mỗi câu một file MP3 theo đúng vai. `pnpm audio --verify` đối chiếu DB với R2: đủ 166 file, không có file rác. FE phát theo `audioKey`; câu nào chưa có file thì lùi về giọng trình duyệt.
- **[CHỐT 18/10/2026] Nhãn cấp HSK song song**: dùng danh sách từ **bản cộng đồng** (HSK 2.0 sáu cấp, HSK 3.0 chín cấp) lưu ở `BE/prisma/seed/hsk/`, gán `Word.hsk2`/`Word.hsk3`, rồi tính nhãn bài = **cấp cao nhất** trong các từ của bài (`Lesson.hsk2`/`hsk3`). Chạy bằng `pnpm db:hsk`. Số liệu bản cộng đồng **cần người biết tiếng Trung duyệt** trước khi công khai.
- Biến môi trường (`BE/.env`, cũng đọc được `../.env` để cả BE và FE dùng chung một file; không commit): `DATABASE_URL` (một chuỗi duy nhất; Supabase "Session pooler" cổng 5432 dùng được cho cả chạy lẫn migrate), `JWT_ACCESS_SECRET` (>= 32 ký tự), `JWT_ACCESS_TTL`, `REFRESH_TTL_DAYS`, `PORT`, `CORS_ORIGINS`. Mẫu ở `BE/.env.example`.
- Thông báo đẩy khi hồi mở.

## 9. Mô hình dữ liệu (nháp)
```
topic(id, name)                         word(id, topic_id, zh, pinyin, vi, pos, phrase, hsk2, hsk3)
lesson(id, title, situation, hsk2[], hsk3[], lines[], questions[])
lesson_role(lesson_id, who, gender, pitch_range, voice_id)   -- giọng nhân vật (mục 3.2)
lesson_line(lesson_id, idx, who, zh, pinyin, vi, audio_key, audio_hash)
story(id, title) / chapter(id, story_id, idx, starts_at)
hoi(id, chapter_id, idx, story_lesson_id)
key_slot(id, chapter_id, idx, word_id, hint_general, hint1, hint2_by_level, hint3_by_level)
key_slot_lesson(slot_id, lesson_id, hsk_group)   -- hội thoại chứa từ khóa
user(id, hsk_standard, hsk_level, hours, words_learned, is_vip)
exam(id, standard, hsk, idx, sections[]) / exam_attempt(user_id, exam_id, score, at)
user_slot(user_id, slot_id, hints_opened, found_at, expired, points)
user_event(user_id, wrong_left, locked_until, opted_out)
user_mission(user_id, day, login, quizzes, online_sec) / user_token(user_id, balance)
user_week(user_id, week_start, earned, topup) / user_score(user_id, points)
user_word(user_id, word_id, source, box, due_at)
```

---

## 10. Câu hỏi mở (cần chốt trước khi code)

1. (đã chốt) Chống dò: giữ mức phạt hiện tại (trừ 20/30/40, khóa sau 9 lần sai), không siết thêm. Điểm phạt trừ vào ô trả lời đúng kế tiếp.
1a. (đã chốt) 4 lượt mỗi ngày, nhiệm vụ tuần tối đa 21, mốc Nghe bài 6/10/14. (5.6)
1c. **Sổ tay** (3.7): đồng ý một danh sách, xem theo ngày và theo chủ đề như đề xuất?
1d. **Giao diện** (3.6): thanh điều hướng Trang chủ, Học, Sổ tay, Sự kiện, Thêm; đồng ý?
1b. **Kho lưu trữ** (5.8): nghe 2 bài thì mở 1 gợi ý, đồng ý không? (vì không bán lượt)
3. **Chấm phát âm** (3.5): chọn dịch vụ nào, hay bản đầu chỉ nghe mẫu và tự đối chiếu?
4. **VIP** (5.10): giá gói và danh sách tính năng học bàn sau. Vì đã bỏ bán lượt nên mục giảm giá lượt không còn.
5. **Để design sau**: bảng điểm theo số gợi ý, quà của 4 mốc, các trò chơi nhỏ.
6. **Đang cân nhắc**: cấp ban đầu (HSK 1 mặc định hay thi xếp lớp), đề thi v1 (chỉ HSK 2.0?), phần viết trong đề.
7. (đã chốt 18/10/2026) NestJS + **Next.js PWA trước**, React Native sau; ORM **Prisma**; Postgres (Supabase rồi VPS). Xem mục 8.
8. **Việc còn nợ trước khi dựng bản thật** (ghi để không quên):
   - **[Hoãn]** Việc tài khoản dịch vụ giọng đọc có hợp đồng (Azure/Google) để sau, xem mục 8 "CHỐT TẠM". Các mục sau chỉ làm khi quay lại việc này.
   - Bạn tạo tài khoản Azure, tạo tài nguyên Speech (gói F0), tự giữ khóa và vùng; **không dán khóa vào chat**, chỉ đặt vào biến môi trường ở máy chủ.
   - Tạo bucket Cloudflare R2 và tên miền CDN cho âm thanh.
   - Viết script tạo âm thanh: đọc câu thoại → chọn giọng theo vai (`lesson_role`) → gọi Azure (tối đa 20 yêu cầu/phút ở F0, tự đợi và thử lại) → tải lên R2 → ghi `audio_key`, `audio_hash` vào DB. Bỏ qua câu đã có file (theo mã băm).
   - Còn phải kiểm tra thật trên cổng Azure: khi F0 hết hạn mức thì bị từ chối hay bị tính tiền; hạn mức có cộng dồn sang tháng sau không; gói trả phí S0 có kèm phần miễn phí không.
   - Đọc điều khoản dùng thương mại, giữ hóa đơn, ghi "Giọng đọc do AI tạo" trong app (mục 8).
   - Bản dựng thật chỉ bắt đầu khi bạn chốt câu 7 và ra lệnh.

---

## Changelog
- 2026-10-15: Tạo file. Ghi nhận luật sự kiện (gợi ý, lượt, điểm, bảo hiểm), hồi mở bài học event, hội thoại theo cấp HSK và chủ đề, đề nâng cấp, hướng dẫn người dùng.
- 2026-10-15 (lần 2): Đổi cấu trúc sự kiện: chương = 1 tuần = 4 hồi = 12 ô từ khóa, tìm 3 ô bất kỳ mở 1 hồi, mỗi ô có gợi ý riêng và hiện số gợi ý đã dùng. Từ khóa là từ phổ thông, gợi ý trỏ hội thoại hợp cấp. Đề nâng cấp theo định dạng HSK, ngưỡng đạt 60%. Thêm phân tích hai chuẩn HSK song song, hai phương án đặt ô nhập từ khóa, cân bằng lượt gợi ý (24 mỗi tuần), vấn đề bảo hiểm 4 hồi × 48 giờ > 1 tuần.
- 2026-10-15 (lần 3): Chốt cấu trúc chương/hồi/ô, cân bằng lượt gợi ý và điểm. Chốt hai chuẩn HSK 2.0 và 3.0 song song với nhãn 2.0·x | 3.0·y tính tự động. Đổi nguyên tắc gợi ý (gợi ý 2 đủ để suy luận, gợi ý 3 rõ ràng, câu hỏi gợi ý không trùng câu hỏi bài). Ô nhập từ khóa không tự bật, mở qua icon; VIP có "bốc secret" (icon và ô trên bảng animation mạnh). Ghi nhận rủi ro VIP và chống lộ từ khóa [SAU NÀY].
- 2026-10-15 (lần 4): Bỏ bảo hiểm tự động mở; thay bằng điểm danh, lượt bù cuối tuần, ngày thứ 31 tặng lượt (lượt tặng không tính bảng xếp hạng). Gợi ý 2 chung chung hơn, gợi ý 3 là câu hỏi trực tiếp. Truyện event một phiên bản cấp Trung, không khóa theo cấp, chỉ cảnh báo kèm tag, bản dịch bật mặc định cho người mới, chạm từ để xem nghĩa. Thêm bảng xếp hạng (top có huy chương đẹp hơn), phần thưởng theo điểm mốc. Chốt 12 chủ đề hội thoại. VIP để sau.
- 2026-10-15 (lần 5): Lượt bù đảm bảo đủ 12 lượt mỗi tuần (thay điểm danh cuối tuần). Ngày thứ 31 là ngày dự phòng, mở gợi ý để mở hết ô. Lượt dư không đổi thành điểm. Điểm tính theo số gợi ý đã mở (gợi ý 1-2 nhiều điểm, gợi ý 3 ít). Mốc thưởng là hoàn thành hồi 1, 2, 3, quà quyết sau. Chương hết tuần vẫn chơi được, sau sự kiện mở kho lưu trữ. Truyện cấp HSK 3-4 (2.0), cho phép từ khó khi cần. Điểm và lượt gợi ý sẽ bàn lại.
- 2026-10-15 (lần 6): Chốt mỗi chương mặc định 4 hồi (9 × số hồi = lượt cần), mua lượt 1 lượt = 3.000 point, ngày dư 6 lượt mỗi ngày, kéo dài truyện nếu cần. Tính toán kinh tế lượt: lịch 4/4/4/4/6/7/7 = 36 mỗi tuần, bảo hiểm bù 2 lượt mỗi ngày vắng tối đa 3 ngày (sàn 22), bỏ giới hạn giữ 12 lượt. Tách tên Point và điểm sự kiện. Đề xuất gợi ý 3 cho 0 điểm xếp hạng.
- 2026-10-15 (lần 7): Chốt 4 mốc thưởng theo số từ khóa đã giải (10/30/60/90%, làm tròn lên). Đổi nhiệm vụ hằng ngày (đăng nhập, 3 hội thoại, online 20 phút = 21 lượt mỗi tuần) và thêm nhiệm vụ tuần 3 nhiệm vụ × 3 mốc (4/2/1) = 21 lượt, đủ 42 lượt mỗi tuần (36 + 6 dư). Bảo hiểm bù 2 lượt mỗi ngày vắng (tối đa 6) để người nghỉ 3 ngày làm cố gắng vẫn đạt 36. Lượt dư chuyển thành point (tỉ lệ đề xuất 300). Gần cuối tháng +9 lượt.
- 2026-10-15 (lần 8): Chốt mốc tuần 2/3/2 (lõi 15 + dư 6), nhiệm vụ hội thoại bất kỳ, chống gian lận (3 bài khác nhau, nghe đủ 80%, online tính thời gian thao tác). Sự kiện theo tháng dương lịch, tuần 1-4 = ngày 1-28, ngày 29-31 dự trữ, sang tháng là sự kiện mới. Thưởng ngày 26-28 (+3 mỗi ngày đăng nhập). Ngày dự trữ chỉ cho người chưa giải hết. Tối ưu DB: login_bits, bảo hiểm tính khi chốt tuần. Đề xuất cách xử lý lượt dư và kho lưu trữ.
- 2026-10-15 (lần 9): Chốt bù 2 lượt mỗi ngày vắng (không thêm bảng DB), ngày dự trữ +3 lượt đăng nhập (chỉ người chưa giải hết), kho lưu trữ ẩn từ khóa chưa giải. 4 mốc 10/30/60/90% = 4 huy chương kèm số hạng, mốc cuối tặng VIP 3 ngày. Giải bằng gợi ý 3 vẫn có điểm. Point là tiền trả VIP nên đề xuất không đổi lượt dư thành point, giữ sang sự kiện sau tối đa 12.
- 2026-10-15 (lần 10): Lượt tặng hết hạn khi sự kiện kết thúc (không giữ sang sự kiện sau, không đổi point). Chốt gói theo kịp (12 lượt mỗi tuần đã trôi, tối đa 24). Người tắt sự kiện không tính lượt nhiệm vụ. Giờ đổi ngày 00:00 giờ Việt Nam. Bảng xếp hạng chung, thứ tự: điểm sự kiện, huy chương, thời gian giải xong. VIP 3 ngày là vật phẩm trong túi đồ. Đền bù sự cố bằng lượt và quà. Ghi hướng sản phẩm: vừa học vừa chơi.
- 2026-10-15 (lần 11): Chốt mốc 2 = 30% (15 từ khóa), vật phẩm túi đồ có hạn dùng (ví dụ 90 ngày). Gói theo kịp chỉ khi vào ngày 8-28: ngày 8-14 được 12, ngày 15-21 được 24, tuần cuối (22-28) chỉ 12.
- 2026-10-15 (lần 12): Chốt nguyên tắc không pay-to-win: VIP chỉ mở khóa tính năng học dễ hơn hoặc giảm giá, không có tác dụng trong sự kiện. Bỏ "bốc secret" khỏi đặc quyền VIP; đèn báo chuyển thành tính năng chung (chờ chốt).
- 2026-10-15 (lần 13): Chốt không bán lượt gợi ý (đã có nhiều bảo hiểm, nên bỏ mua lượt, bỏ hoàn point). Point chỉ dùng trả VIP. Chốt đèn báo cho mọi người từ gợi ý 2 và bảng màu trạng thái ô (xám, xanh dương, vàng, cam, xanh lá).
- 2026-10-15 (lần 14): Chốt khóa ô theo ngày 6/3/3 (ô chưa mở chỉ hiện "Mở vào ngày N"), bù ngày vắng theo lần vắng (mỗi ngày +2, tối đa 12 lượt mỗi lần, nhận khi quay lại), ngày tham gia là ngày đăng nhập đầu tiên trong tháng, hội thoại theo chủ đề có tìm kiếm (không tìm theo nội dung câu thoại), mục đích sự kiện không thu lợi. Thêm bản nháp bốn kỹ năng (nói, đọc, viết) và trang chủ.
- 2026-10-16 (lần 15): Chốt bắt buộc mở gợi ý 1 mới đoán được, xáo thứ tự từ khóa theo từng người, từ khóa chỉ hiện khi đoán đúng, điểm 200 (gợi ý 2) và 150 (gợi ý 3), mới mở gợi ý 1 thì 0 điểm (chờ xác nhận). Nhiệm vụ ngày: 2 bài hội thoại trả lời hết câu hỏi = +1. Điểm sự kiện (xếp hạng) tách tên với Point (ví). Lời thoại luôn ở cuối bài, lưu từ qua "Chế độ lưu từ", cho lưu cụm từ. Thêm đề xuất sổ tay (theo ngày, theo chủ đề) và điều hướng mới.
- 2026-10-16 (lần 16): Chốt nhiệm vụ tuần "Học bài nghe" = 6/10/14 bài. Người chơi muốn 4 lượt mỗi ngày: ghi [CẦN CHỐT], chờ chọn mức tối đa nhiệm vụ tuần.
- 2026-10-16 (lần 17): Chốt 4 lượt mỗi ngày (thêm nhiệm vụ nghe 4 bài), nhiệm vụ tuần giữ tối đa 21 (tối đa 49 mỗi tuần), điểm gợi ý 1 = 210, gợi ý 2 = 200, gợi ý 3 = 150. Cập nhật bảng bù lượt và kiểm tra mục tiêu đủ lượt.
- 2026-10-16 (lần 18): Sửa nhiệm vụ ngày: đăng nhập +1, nghe và trả lời hết 2 bài +2, online 30 phút +1 (bỏ mốc 4 bài, online từ 20 lên 30 phút). Tính lại bảng bù lượt.
- 2026-10-16 (lần 19): Điểm gợi ý 1 = 230. Đoán sai: mỗi 3 lần trừ 20, 30, 40 điểm rồi trả lại 3 lượt, từ lần sai thứ 10 khóa 15 phút mỗi 3 lần (thay khóa 15 phút ngay lần sai thứ 3).
- 2026-10-16 (lần 20): Chốt chống dò ở mức hiện tại. Ghi số từ HSK 3.0 chính thức (300/500/1.000, thi từ 13/12/2026). Thêm 6 hội thoại HSK 2 cùng chủ đề, nút chọn cấp HSK 1/HSK 2 và nút đổi bản trong bài. Thêm chỉ dẫn trên màn hình (tắt/bật, xem lại) và trang Cách dùng. Làm lại giao diện có hiệu ứng (demo bản 11).
- 2026-10-16 (lần 21): Bỏ hẳn đèn báo "bài này có từ khóa" ở mọi nơi (icon, bảng 12 ô, trang chủ) — app không còn gợi ý bài vừa học có từ khóa hay không. Đổi ghép ô chữ từ 10 ô theo từng ô sang một bảng 21 chữ lấy từ chính bài, dùng chung cho cả bài; yêu cầu hội thoại đủ dài để có 21 chữ khác nhau (đã kiểm tra, bài ngắn nhất cũ chỉ 19 chữ nên thêm 2 câu cho đủ).
- 2026-10-16 (lần 22): Thêm giọng nhân vật: mỗi vai có giới tính và 1 trong 3 khoảng giọng (trầm/vừa/cao) theo vai; hiện thẻ vai và cho nghe thử. Bản thật nên dùng giọng đọc từ máy chủ.
- 2026-10-16 (lần 23): Ghi đề xuất lưu âm thanh: sinh sẵn từng file MP3 theo câu và vai, lưu Cloudflare R2 + CDN, DB giữ khóa file; thêm bảng lesson_role, lesson_line (chờ chốt).
- 2026-10-16 (lần 24): Làm file âm thanh thật cho demo: 94 câu (1.244 chữ Hán) bằng giọng thần kinh zh-CN (nam: Yunjian trầm, Yunyang vừa, Yunxi cao; nữ: Xiaoxiao vừa, Xiaoyi cao), nhúng trong trang, phát bằng một phần tử audio dùng chung, tốc độ chậm bằng playbackRate; câu thiếu file lùi về giọng trình duyệt. Truyện: người kể đổi sang nam giọng cao (Yunxi).
- 2026-10-16 (lần 25): Chốt hướng dùng Azure Speech cho giọng đọc bản thật; ghi so sánh giá với Google, Amazon Polly, Tencent, Alibaba và dự toán khoảng 0 đến 6 USD cho 2.000 bài.
- 2026-10-16 (lần 26): Tra giá chính thức các dịch vụ giọng đọc. Sửa: Azure Neural 15 USD/1 triệu ký tự (không phải 16), mỗi chữ Hán tính 2 ký tự nên dự toán 2.000 bài là khoảng 0,8 triệu ký tự tính phí. Ghi số giọng zh-CN và vai theo tuổi của Azure, giọng cmn-CN của Google.
- 2026-10-16 (lần 27): Chốt Azure Speech. Ghi rõ gói miễn phí F0 tính theo ký tự tính phí (chữ Hán ×2), giới hạn 20 yêu cầu/60 giây, và chỉ tốn khi tạo file.
- 2026-10-16 (lần 28): Ghi hướng bộ công nghệ bản thật (NestJS, Next.js, React Native, Postgres Supabase rồi chuyển VPS) và quy tắc chỉ dùng Supabase như Postgres thuần để chuyển dễ. Thêm mục 10, câu 7 (chọn bộ công nghệ) và câu 8 (danh sách việc còn nợ: tài khoản Azure, R2, script tạo âm thanh, các điểm cần kiểm tra).
- 2026-10-16 (lần 29): Bắt đầu dựng backend theo lệnh của chủ dự án: thư mục BE (NestJS 12, pnpm, Prisma 7), schema Postgres theo mục 9 (tài khoản, nội dung học, sự kiện, tiến độ), đăng nhập JWT + refresh token xoay vòng, kiểm tra health. Chưa nối database (chờ chuỗi kết nối Supabase trong BE/.env), chưa chạy migration, chưa có API nội dung và sự kiện.
- 2026-10-16 (lần 30): Bỏ DIRECT_URL: Prisma 7 chỉ cần một DATABASE_URL (khai báo trong prisma.config.ts). Dùng Supabase Session pooler cổng 5432.
- 2026-10-16 (lần 31): Chạy migration `init` lên Supabase (Postgres 17). Viết lại schema theo rule.md (chủ đề, từ vựng, hội thoại, vai/giọng, truyện, ô từ khóa, sổ lượt, túi đồ, đề thi, sổ tay). Dựng module nội dung, sổ tay, sự kiện (khóa ô 6/3/3, gợi ý tuần tự, đoán sai, điểm, huy chương, bảng xếp hạng, nhiệm vụ ngày/tuần, bù ngày vắng, gói theo kịp, túi đồ VIP) và seed từ bản demo (94 câu). 14 test đơn vị và 11 test e2e qua. Thay `User.isVip` bằng `vipUntil`; bỏ bảng `UserToken`, `UserScore`, `UserWeek` (gộp vào `UserEvent`).
- 2026-10-16 (lần 31): Hoãn vấn đề bản quyền giọng đọc. Azure đăng ký không được, Google đòi nạp trước 800.000 ₫; chốt tạm dùng edge-tts khi dựng và thử, bắt buộc đổi sang dịch vụ có hợp đồng và tạo lại âm thanh trước khi phát hành.
- 2026-10-18 (lần 32): Chốt bộ công nghệ (mục 10 câu 7): làm **web PWA Next.js trước**, React Native sau. Dựng FE: Next.js 16 App Router, 5 tab (Trang chủ, Học, Sổ tay, Sự kiện, Thêm), bê CSS bản demo 11, đăng nhập/đăng ký nối BE, chi tiết từ vựng có **cách viết từng nét và tập viết** (hanzi-writer) cùng nghe thường/chậm. Hoãn tạo file âm thanh để chờ Cloudflare R2; FE phát theo `audioKey` nếu có, không thì dùng giọng trình duyệt. Thêm danh sách từ HSK bản cộng đồng để gán nhãn song song 2.0 | 3.0 (`pnpm db:hsk`). Soạn thêm 6 hội thoại HSK 3 cho 6 chủ đề đang có.
- 2026-10-18 (lần 33): Gán nhãn HSK song song cho 112 từ và 22 bài bằng danh sách cộng đồng (`pnpm db:hsk`). Soạn 6 hội thoại HSK 3 (`BE/prisma/seed/hsk3-dialogs.json`, mỗi bài 12 câu, 85-96 chữ khác nhau, vẫn chứa từ khóa sự kiện của chủ đề). Thêm `PATCH /auth/me` và `GET /event/today`. BE đọc được `.env` ở thư mục dự án. **Cần bàn**: nhãn bài tính theo cấp cao nhất nên bài HSK 1 "Gọi cà phê" hiện ra nhãn 2.0·3 — xem mục 2.
- 2026-10-18 (lần 34): Nối **Cloudflare R2**: kiểm tra kết nối (`pnpm audio --check`), viết script `BE/scripts/tts-upload.ts` sinh MP3 từng câu bằng edge-tts rồi tải lên R2 và ghi `audioKey`/`audioHash`. Đã tạo thật 6 file của bài `cafe`, kiểm tra URL công khai trả về 200 `audio/mpeg` và FE phát được. Thêm `@aws-sdk/client-s3`, biến `S3_*` vào `.env.example`, `NEXT_PUBLIC_AUDIO_BASE` cho FE. Ghi chú: r2.dev là tên miền tạm, nên gắn custom domain trước khi phát hành; edge-tts vẫn là giải pháp tạm, chưa có điều khoản thương mại.
- 2026-10-19 (lần 35): Tạo âm thanh cho 160 câu còn lại (tổng 166 câu, 3,01 MB trên R2). Thêm `pnpm audio --verify` để đối chiếu DB với R2 (câu thiếu file, file rác, thử tải ngẫu nhiên 5 file). Kết quả: đủ 166 file, không có file rác, các URL công khai trả về 200 `audio/mpeg`. Thêm `pnpm audio:page` sinh trang nghe thử `FE/public/audio-test.html` (166 trình phát, không cần đăng nhập, chỉ dùng khi dựng — xóa được). Kiểm tra giải mã 8 file ngẫu nhiên ở 8 bài: MP3 MPEG-2 48 kbps 24 kHz mono, 2,6-4,2 giây mỗi câu.
- 2026-10-19 (lần 36): Làm lại giao diện cho bắt mắt theo hướng "rực rỡ kiểu game" (chủ dự án chọn), đủ cả 5 tab: thêm `FE/app/theme.css`, `FE/components/Bits.tsx` (pháo giấy, chuỗi ngày, số chạy lên, vòng tiến độ, huy chương kim loại). Trang chủ có 3 ô số liệu màu; danh sách bài có dải màu theo cấp; nút chọn cấp HSK đổi màu theo cấp; 12 ô từ khóa dày hơn và tô dải màu theo số gợi ý đã mở. Giữ nguyên luồng và tính năng. Nhân vật dẫn đường hoãn sang đợt sau.

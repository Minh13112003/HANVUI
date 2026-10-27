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
- **[CHỐT] Nhãn song song**: mỗi từ vựng và mỗi hội thoại ghi **cả hai chuẩn**, hiển thị dạng **2.0 cấp 1 | 3.0 cấp 2** (cấp 1 của HSK 2.0 và cấp 2 của HSK 3.0). Người học nhìn là biết bài này thuộc cấp nào ở mỗi chuẩn.
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

### 3.3 Kiểm tra từ vựng [CHỐT, đổi 23/10/2026]
- **Tự luận, 3 cách** (bỏ trắc nghiệm 8 câu cũ): **Hán → Việt** (cho chữ Hán, viết một nghĩa tiếng Việt), **Việt → Hán** (cho nghĩa, gõ chữ Hán), **Nghe → viết** (nghe, viết cả chữ Hán và nghĩa; **mỗi phần nửa điểm**), hoặc **Trộn**.
- **Nguồn**: Sổ tay (cả sổ hoặc nhóm đang ôn qua "Ôn nhóm này", từ 1 câu) hoặc **bộ từ HSK 1, 2, 3** theo danh sách HSK 2.0 (150 / 147 / 298 từ). Người học tự gõ số câu: **tối thiểu 20, tối đa cả bộ**; từ chọn ngẫu nhiên.
- **Chấm cứng ở máy chủ**: phần tiếng Trung chỉ nhận **chữ Hán** (không nhận pinyin), phải đúng từng chữ; phần tiếng Việt phải khớp **một** nghĩa trong bảng từ hoặc danh sách nghĩa chấp nhận thêm (`BE/src/vocab-test/alt-meanings.ts`, chưa duyệt), chỉ bỏ qua hoa/thường, dấu câu, chữ "cái/con/chiếc" ở đầu; **dấu tiếng Việt phải đúng**. Đề Việt → Hán nhận từ khác có chung nghĩa trong từ điển (ví dụ 会/能 "có thể"). Trợ từ (了, 吗…) chỉ hỏi theo chiều Việt → Hán.
- Kết quả: phần trăm điểm, danh sách câu sai/thiếu điểm (chữ Hán, pinyin, nghĩa, câu trả lời của bạn từng phần), chạm để xem từ.
- **Mức sẵn sàng thi lên cấp (chỉ tham khảo, KHÔNG khóa đề)**: thi đề cấp N (để lên N+1) được gợi ý khi **kiểm tra bộ từ HSK N ≥ 80%** (ưu tiên điểm khi làm toàn bộ bộ), **hội thoại HSK N đã học ≥ 70%**, **bài đọc HSK N đã đọc ≥ 70%**. Hiện ở trang Kiểm tra, trang Làm đề lên cấp và sau khi làm bộ từ HSK. Chưa đạt vẫn làm đề bình thường.
- API: `GET vocab-test` (bộ từ, điểm cao nhất, mức sẵn sàng), `POST vocab-test/start {source: hsk|notebook, level, ids, count, mode}`, `POST vocab-test/:id/submit {answers:[{zh, vi}]}`. Bảng `VocabTest`; cột `Word.hsk2List` (từ có đúng trong danh sách HSK 2.0, gán bởi `pnpm db:hsk`). Bổ sung 20 từ HSK 1-2 còn thiếu (`extra-words.ts`).

### 3.4 Trò chơi [SAU NÀY]
- **Lật thẻ đã bỏ khỏi app (23/10/2026)** theo yêu cầu chủ dự án; thay bằng kiểm tra từ vựng tự luận (mục 3.3).
- Sau này: ghép nét theo thứ tự, đua thời gian, đoán chữ bị che, nghe và điền chỗ trống.

### 3.5 Bốn kỹ năng: nghe, nói, đọc, viết [CẦN CHỐT, đã có bản mẫu giao diện]
- Học ngôn ngữ cần 4 kỹ năng. Hiện đã làm: **nghe** (hội thoại) và **từ vựng**. Bổ sung 3 phần sau, nội dung sơ sài để hình dung:
- **Nói**: đọc theo mẫu (nghe mẫu, nghe chậm, ghi âm, xem âm nào cần luyện, pinyin tô màu theo thanh điệu) và nhập vai hội thoại. **Chấm phát âm thật cần dịch vụ nhận dạng phát âm riêng** (không phải chatbot AI thông thường). Bản đầu **chỉ nghe mẫu và tự đối chiếu, chưa chấm tự động**; chấm tự động để giai đoạn sau sau khi thử nghiệm trên máy thật.
- **[CHỐT 27/10/2026] "Đọc để máy chấm" miễn phí**: dùng **nhận dạng giọng nói có sẵn của trình duyệt** (Web Speech API, `zh-CN`) để chép câu người học đọc thành chữ, rồi `POST speak/compare {target, heard}` so với câu mẫu **theo pinyin từng âm tiết** (không so chữ, vì máy hay chọn chữ đồng âm): đúng · **đồng âm** (đọc đúng, máy chọn chữ khác cùng âm — vẫn tính đúng) · **sai thanh** (nửa điểm) · sai âm · thiếu · thừa; lấy kết quả tốt nhất trong tối đa 3 cách nghe. Chọn đọc từ hoặc câu mẫu. **Hạn chế**: chạy tốt trên Chrome/Edge (máy tính, Android, âm thanh được Google xử lý); **Safari/iPhone chỉ hỗ trợ một phần, cần thử trên máy thật** — máy không hỗ trợ thì báo và giữ ghi âm tự nghe lại. Máy nhận dạng có thể tự "sửa" lỗi thanh nhẹ theo ngữ cảnh, nên đọc từng từ ngắn được chấm chặt hơn. HanVui không lưu giọng nói. Phương án sau nếu iPhone không chạy: Whisper chạy trên máy (tải mô hình vài chục–200 MB).
- **Đọc**: bài đọc theo cấp HSK, tin ngắn biên tập lại từ báo ở đúng cấp (AI viết lại, người duyệt), và truyện sự kiện. Chạm từng từ để xem nghĩa, bôi đen để thêm vào từ vựng, có câu hỏi hiểu bài.
- **Viết**: tập viết từng nét (đã có), sắp xếp câu, điền chữ, dịch ngắn. Đều là dạng **chấm tự động được**. Bài viết luận để sau (xem mục 10).
- Mục "Học" gom: Từ vựng, Nghe, Nói, Đọc, Viết.

### 3.6 Trang chủ và điều hướng [CẦN CHỐT, đã có bản mẫu giao diện]
- **Giao diện bản demo 11**: thẻ nổi bóng mềm thay viền; thanh tab nổi có vệt chọn trượt theo tab; mỗi lần đổi màn các khối trượt lên lần lượt; bảng trượt lên có độ nảy; con dấu 汉 đóng xuống khi mở app; pháo giấy khi giải đúng một ô. Người bật "giảm chuyển động" trong máy thì tắt hết hiệu ứng.
- Thanh dưới: **Trang chủ · Học · Sổ tay · Sự kiện · Tài khoản**. "Tài khoản" (trước đây tên "Thêm") chứa hồ sơ và VIP, túi đồ, luật sự kiện, kế hoạch. Ôn tập (kiểm tra, lật thẻ) nằm trong Sổ tay.
- **[CHỐT] Hộp thư** (trong tab Tài khoản): mỗi thư có chủ đề, nội dung, người gửi và quà. Chia **theo người gửi** (thư do **quản trị** gửi, thư tự động của **hệ thống** như chào mừng) và **theo quà** (có quà / không quà); lọc thêm theo chưa đọc. Thư có quà: bấm nhận một lần (lượt gợi ý hoặc vật phẩm VIP 3 ngày vào túi đồ), có thể đặt hạn nhận quà; **thư còn quà chưa nhận thì không xóa được**. Chấm đỏ tab "Thêm" lấy từ số thư chưa đọc và số thư còn quà. Quản trị gửi cho một người (theo email) hoặc cho mọi người đã có tài khoản lúc gửi. Quà bằng lượt cộng vào lượt của tháng hiện tại và hết hạn cùng sự kiện (mục 5.6).
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
- **[CHỐT TẠM, bản demo]** Đã soạn **3 đề cho HSK 2.0 cấp 1 và 3 đề cho cấp 2** (chưa qua duyệt), mỗi đề **20 câu** (nghe 8, đọc 8, viết 4: sắp xếp câu) thay vì đủ số câu như đề thật; vẫn giữ **tổng 200 điểm, đạt 120 (60%)** và thời gian 40/55 phút. Điểm mỗi câu = 200 / số câu. Đạt đề của **đúng cấp hiện tại** thì lên cấp kế; thi lại cấp cũ không lên thêm. Nộp trễ quá 2 phút so với giờ làm bài thì không tính. Câu sắp xếp chấp nhận nhiều cách đúng, bỏ qua khoảng trắng và dấu câu. HSK 3.0 chưa có đề. Còn phải làm trước khi phát hành: đủ số câu theo đề chính thức, thêm đề cấp 3-6, người biết tiếng Trung duyệt.
- **[CHỐT TẠM, bản demo] Đề HSK 2.0 cấp 3 (thi để lên cấp 4)**: 4 đề (chưa duyệt), mỗi đề **24 câu** (nghe 10, đọc 8, viết 6: sắp xếp câu), giữ thang đề thật cấp 3: **300 điểm, đạt 180 (60%), 90 phút**; điểm mỗi câu = 300/24. Cùng cơ chế chọn đề ngẫu nhiên, chấm tự động, nộp trễ tối đa 2 phút. Đạt đề cấp 3 khi đang ở đúng cấp 3 thì lên cấp 4. Chưa có đề cấp 4 trở lên.
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
- **Gợi ý 2** [ĐỔI 20/10/2026 theo yêu cầu chủ dự án]: **chỉ thẳng một bài** chứa từ khóa (hợp cấp người học; đúng một bài, chọn ổn định) kèm nút nghe bài, cộng bối cảnh/tình huống chung chung như cũ. Lý do: chủ đề có thể có cả chục bài, bắt nghe hết để mở gợi ý 2 gây nản. **Tên bài trùng từ khóa (chữ Hán hoặc nghĩa tiếng Việt) được che bằng "…"** trong thẻ gợi ý (25/123 bài hiện có trùng, ví dụ "Gọi cà phê"); mở bài thì thấy tên thật. Người học vẫn phải nghe bài rồi tự đoán từ.
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
- **[CHỐT]** Kho lưu trữ chỉ hiện các từ khóa **người đó đã giải** (người học tự bấm lưu vào Sổ tay, lần 52). Từ khóa chưa giải **giữ ẩn**, vẫn giải được như chế độ luyện tập (không điểm, không xếp hạng, mở gợi ý bằng cách luyện tập, chưa chốt chi tiết). Lý do: giữ được câu đố cho người vào sau hoặc các lần chạy lại. Vì lượt tặng đã hết hạn và không bán lượt, đề xuất: nghe hoàn thành 2 bài bất kỳ thì được 1 gợi ý trong kho.
- **[CHỐT] Luyện tập trong kho** (đã làm ở BE): chỉ với sự kiện **đã kết thúc** (tháng trước). Mở gợi ý tốn **lượt luyện tập**, mỗi ngày **nghe và trả lời hết 2 bài khác nhau được 1 lượt** (kể cả khi tắt sự kiện); vẫn phải mở gợi ý 1 mới đoán được; chỉ nhận tiếng Trung. **Không điểm, không phạt, không khóa, không xếp hạng**; từ đúng không tự vào sổ tay (người học tự lưu); hiển thị "đã khám phá X/48". Truyện của sự kiện đã kết thúc đọc được hết, không cần giải ô.
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

**[CHỐT] Chỉ dẫn trên màn hình (đã có trong demo)**: lần đầu mở mỗi màn (Trang chủ, danh sách bài, bài học, Sự kiện, Sổ tay), app làm tối màn hình và chỉ lần lượt từng phần kèm lời giải thích ngắn. Có nút Trước, Tiếp, "Bỏ qua" và "Không hiện hướng dẫn nữa". **Tắt/bật và "Xem lại hướng dẫn từ đầu"** ở Tài khoản → Hướng dẫn; trang này có thêm "Cách dùng HanVui trong 5 bước".


**[CHỐT 27/10/2026] Lộ trình cho người mới** (`/lo-trinh`; lối vào: thẻ ở Trang chủ cho người HSK 1–2, Tài khoản → "Lộ trình cho người mới", trang Hướng dẫn): đi từ số 0 tới **thi đạt HSK 2** thì dừng. Ba giai đoạn, mỗi giai đoạn có "Mỗi ngày nên làm" (khoảng 20–30 phút) và các bước; mỗi bước ghi **thao tác cụ thể** (bấm gì trước, bấm gì sau) và nút **"Làm ngay"** mở đúng chức năng. Đầu trang luôn hiện **"Bước tiếp theo"**.
- **Nhập môn** (1–2 tuần, 9 bài ngắn ngay trong app, `/lo-trinh/<bài>`): Tiếng Trung là gì và học thế nào · 4 thanh điệu (so với dấu tiếng Việt) · phụ âm đầu (cặp bật hơi, j q x, zh ch sh r, z c s — nhóm người Việt hay nhầm) · vần · biến điệu (3+3, 不, 一) · 8 nét cơ bản và 7 quy tắc thứ tự nét (xem/tập viết từng chữ) · 14 bộ thủ hay gặp · số đếm, giờ, tiền (二 và 两) · 12 câu dùng được ngay. Bấm ô để nghe (giọng trình duyệt hoặc file từ vựng nếu có); bài có phần luyện tự chấm trên máy (nghe chọn thanh, chọn pinyin, chọn nghĩa), **đạt 80% là xong**.
- **HSK 1** (ước lượng 6–8 tuần) và **HSK 2** (8–10 tuần), mỗi cấp 8 bước: từ vựng + lưu Sổ tay (50 / 150 từ) · nghe hội thoại · ngữ pháp (kèm luyện dịch) · bài đọc · đọc cho máy chấm · viết từ trí nhớ · kiểm tra bộ từ ≥ 80% · thi đề lên cấp.
- **Tiến độ**: bước có số liệu ở máy chủ **tự đánh dấu** (số từ trong Sổ tay, % hội thoại và bài đọc của cấp ≥ 70%, ngữ pháp thuộc ≥ 80% số điểm của cấp, điểm kiểm tra bộ từ ≥ 80%, đã thi đạt cấp); bước còn lại (nói, viết) người học **tự đánh dấu**. Phần tự đánh dấu và điểm bài nhập môn **lưu trên trình duyệt** (localStorage theo tài khoản: đổi máy hoặc xóa dữ liệu trình duyệt thì mất, phần tự tính vẫn còn). Nội dung **CHƯA QUA DUYỆT**; thời gian mỗi giai đoạn chỉ là ước lượng.

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
- **[CHỐT TẠM, bản demo] Hai cờ riêng cho bản demo** (đặt trong `BE/.env`, mặc định tắt; khi phát hành thật đặt `EVENT_OPEN_ALL=false` và `DEMO_STARTER_TOKENS=0` hoặc xóa hai dòng): `EVENT_OPEN_ALL=true` mở sẵn mọi ô của cả 4 chương, không khóa theo ngày/tuần, và mọi ô đều tính là "tìm sớm" (+30 điểm); mọi luật còn lại giữ nguyên. `DEMO_STARTER_TOKENS=999` tặng 999 lượt gợi ý sự kiện **và** 999 lượt luyện tập khi tạo tài khoản (ghi sổ lượt loại `STARTER`). Mã liên quan nằm ở `BE/src/config/demo.ts` (tìm `demo.` để gỡ hẳn khỏi mã). Một hội thoại chứa được nhiều từ khóa; đoán từng từ, chỉ cần ô đó đã mở gợi ý 1.
- **[CHỐT] API mới**: `GET mailbox?sender=ADMIN|SYSTEM&reward=true|false&unread=true&page=`, `mailbox/counts`, `GET|DELETE mailbox/:id`, `POST mailbox/:id/claim|read-all|claim-all`; quản trị `POST|GET admin/mails` (body: subject, body, rewardTokens, rewardItem, toEmail, expiresInDays). Kho lưu trữ: `GET event/archive`, `event/archive/:month`, `POST event/archive/slots/:slotId/hint`, `event/archive/guess`. Đề thi: `GET exams`, `POST exams/start {level}`, `POST exams/attempts/:id/submit {answers}`, `GET exams/attempts[/:id]`. `GET event` trả thêm `openAll`.
- **[CHỐT] Nội dung chương 2-4** (soạn 19/10/2026, **chưa qua duyệt**): 12 chủ đề hội thoại mới × 2 cấp (24 bài), 36 ô từ khóa, 12 hồi truyện, đặt ở `BE/prisma/seed/content/` và nạp bằng `pnpm db:seed:chapters` (thêm/làm lại chương 2-4, **không xóa bài cũ nên giữ âm thanh**; `pnpm db:seed` đầy đủ thì xóa bài rồi tạo lại nên mất `audioKey`, phải chạy lại `pnpm audio --all`). Pinyin của bài mới **sinh bằng pinyin-pro**, không gõ tay; tách từ khớp theo danh sách HSK; nghĩa tiếng Việt lấy từ bảng từ vựng (khoảng 78% từ có nghĩa, phần còn lại chờ AI điền). Tự kiểm khi nạp: gợi ý không chứa từ khóa hay nghĩa của nó, bài HSK 1 đủ 21 chữ khác nhau, câu hỏi bài không giống gợi ý 3, truyện không chứa bất kỳ từ khóa nào. Nhãn cấp HSK của bài và từ: `pnpm db:hsk` (dữ liệu cấp từ là bản cộng đồng, cần người duyệt). Đề thi: `pnpm db:seed:exams` rồi `pnpm audio:exams` (tạo âm thanh câu nghe).
- **[CHỐT 19/10/2026] Bài khóa theo cấp (vượt ải)**: bài hội thoại có `level` cao hơn cấp HSK của người học hiện **"Khóa"** kèm cảnh báo "thi đạt đề lên cấp HSK N để mở khóa"; vào bài hoặc nộp bài trả 403. **Ngoại lệ**: bài chứa từ khóa sự kiện không khóa (để mọi cấp dò được từ khóa, mục 5.3). Mỗi chủ đề có nhiều bài làm quen ở cấp thấp (mục tiêu 10–12) và bài cấp cao hơn cùng chủ đề hoặc chủ đề mới của cấp đó, mở khi thi đạt đề lên cấp (mục 4). Đã soạn thử (chưa duyệt, `content/ladder.ts`, nạp bằng `pnpm db:seed:ladder`, chỉ thêm, bỏ qua bài đã có): chủ đề **Giới thiệu bản thân** (10 bài HSK 1 + 4 bài HSK 2 khóa) và **Công việc** (6 bài HSK 2 khóa, chưa đủ 10–12). Danh sách bài trả thêm `locked`, `unlockLevel`.
- **[CHỐT 19/10/2026] Gợi ý từ vựng và tiến độ lên cấp**: sau khi xem lời thoại, `GET lessons/:id/suggest-words` trả tối đa 8 từ của bài nên lưu (ưu tiên từ cấp kế, rồi cấp hiện tại; bỏ từ đã lưu; **bỏ từ khóa sự kiện gắn với bài** để app không lộ bài có từ khóa). `GET vocab/progress` đếm từ đã lưu có nhãn HSK 2.0 tới cấp kế so với số từ tích lũy của cấp đó (150/300/600/1.200/2.500/5.000). Số liệu **tương đối**: chỉ để định hướng, điều kiện lên cấp vẫn là thi đạt đề.
- **[CHỐT 19/10/2026] Tập viết có gợi ý từng bước (FE)**: trong tab Tập viết, nút gợi ý cho nét kế tiếp tăng dần: 1) chớp sáng nét cần viết, 2) chạy thử nét, 3) hiện cả chữ giây lát; hiển thị "đang viết nét N/tổng" và số lần xin gợi ý. Viết sai 2 lần thì máy vẫn tự gợi ý như trước. Không cần chuyển sang tab xem cách viết.
- **[CHỐT TẠM 20/10/2026, bản demo] Nút Hạ cấp / Lên cấp** ở Tài khoản: đổi `hskLevel` ngay (qua `PATCH auth/me`), không cần thi, để thử khóa/mở bài song song với làm đề; **bản thật bỏ nút này**, chỉ lên cấp khi thi đạt.
- **[CHỐT TẠM 20/10/2026] Quy đổi gần đúng HSK 3.0 → 2.0** (theo số từ tích lũy, `BE/src/common/hsk.ts`, cần người biết tiếng Trung duyệt): 3.0·1 ≈ 2.0·2 · 3.0·2 ≈ 2.0·3 · 3.0·3 ≈ 2.0·4 · 3.0·4 ≈ 2.0·5 · 3.0·5-9 ≈ 2.0·6. Dùng để khóa/mở bài, chọn đề và tính tiến độ từ cho người đang ở chuẩn 3.0; giao diện hiện "HSK 3.0 · cấp N ≈ HSK 2.0 cấp M". **Đề thi HSK 3.0 chưa soạn riêng**: người dùng 3.0 thi đề HSK 2.0 cấp tương đương; đạt thì lên 1 cấp của chuẩn 3.0.
- **[CHỐT 20/10/2026] Từ vựng đầy đủ**: `pnpm audit:vocab` kiểm tra từ điển (nghĩa, pinyin, dữ liệu nét để tập viết). Kết quả: 766 từ đều có nghĩa và pinyin; 573 chữ Hán trong từ vựng và lời thoại đều có dữ liệu nét (tập viết được); mọi token trong lời thoại đều có nghĩa (bổ sung 354 từ/chữ bằng `pnpm db:fill-vocab`, nguồn `prisma/seed/extra-words.ts`, chưa duyệt) và 746/766 từ có câu ví dụ lấy từ chính lời thoại. Từ **chưa có file âm thanh riêng**: nút nghe từ dùng giọng trình duyệt (chỉ câu thoại mới có file trên R2).
- **[CHỐT 20/10/2026] Âm thanh riêng cho từng từ vựng**: `pnpm audio:words` tạo MP3 từng từ bằng Azure (một giọng nữ Xiaoxiao, khóa `audio/words/{id}-{hash}.mp3`, lưu ở `Word.audioKey/audioHash`, dùng chung bộ đếm quota Azure). `GET words/audio` trả bảng chữ → khóa file, FE nạp một lần nên mọi nút nghe một từ (bảng từ vựng, sổ tay, kiểm tra, lật thẻ, bảng chạm từ) tự dùng file; từ chưa có file vẫn lùi về giọng trình duyệt. `pnpm audio --prune` tính cả khóa của từ.
- **[CHỐT 20/10/2026] Bỏ từ khỏi Sổ tay ngay trong bảng từ**: `GET words/lookup?zh=` trả nghĩa, ví dụ, file âm thanh và `savedId` (đã lưu chưa); bảng từ hiện **"Bỏ khỏi Sổ tay"** khi đã lưu, **"Lưu vào Sổ tay"** khi chưa (xóa qua `DELETE notebook/:id`, như nút xóa sẵn có trong danh sách Sổ tay).
- **[CHỐT 20/10/2026] Kỹ năng Đọc (HSK 1-2)**: bài đọc là `Lesson` loại `READING` (`GET lessons?kind=READING&level=`), **chữ hiện ngay** (khác hội thoại), chạm từ để xem nghĩa và lưu, bật/tắt pinyin và bản dịch, câu hỏi hiểu bài tự chấm, gợi ý từ nên lưu. Bài HSK 2 khóa với người HSK 1; đọc **không** tính nhiệm vụ nghe. Đã soạn 12 bài (6 HSK 1 + 6 HSK 2, chưa duyệt) tại `content/reading.ts`; có file âm thanh người đọc (nữ, giọng vừa).
- **[CHỐT 23/10/2026] Bài đọc dài hơn, không có âm thanh**: viết lại 16 bài đọc dài gấp khoảng 3 lần (mỗi bài 13-15 câu; HSK 1 khoảng 160-175 chữ Hán, HSK 2 khoảng 205-260, HSK 3 khoảng 270-335) và **thêm 12 bài** (HSK 1: Thời tiết hôm nay, Đi nhà hàng, Trường của chúng tôi, Một cuộc điện thoại; HSK 2: Chuyển nhà, Sinh nhật đặc biệt, Mua quần áo, Lần đầu nấu cơm; HSK 3: Lần phỏng vấn đầu tiên, Chiếc điện thoại không rời tay, Chiếc xe đạp của ông, Bắt đầu từ việc nhỏ). Tổng **28 bài** (HSK 1: 10, HSK 2: 10, HSK 3: 8), mỗi bài 4 câu hỏi, vị trí đáp án đúng xáo đều; **CHƯA QUA DUYỆT**. Nội dung ở `content/reading-hsk1|2|3.ts`, nạp bằng `pnpm db:seed:readings` (giữ mã bài, thay câu và câu hỏi, đặt lại tiến độ trả lời của bài đọc). **Bài đọc không có âm thanh**: bỏ nút nghe cả bài ở trang Đọc, bỏ giọng người đọc, `pnpm audio` bỏ qua bài đọc (file cũ trên R2 thành file mồ côi, chưa xóa; xem bằng `pnpm audio --prune`). Bổ sung nghĩa 196 từ cho bài đọc (`extra-words.ts`, chưa duyệt); vài câu được viết lại để bộ tách từ không ghép sai (ví dụ 是非常, 把手机). **Rà văn phong 27/10/2026**: sửa câu lặp từ hoặc chưa xuôi (ví dụ "以后" ba lần trong một bài, "我们班… 我们班…", "帮我写汉字" → "教我写汉字", câu bắt đầu bằng 因为 thiếu vế chính), viết lại 2 bài HSK 1 trùng cốt truyện với bài khác ("Thời tiết hôm nay" trùng kiểu "quên ô, đứng đợi" với "Ngày mưa"; "Đi nhà hàng" trùng chủ đề sinh nhật + tặng sách) và bổ sung nghĩa 晚饭, 选, 总.
- **[CHỐT 20/10/2026] Kỹ năng Viết (HSK 1-2)**: ngoài tập viết từng nét có thêm 3 dạng tự chấm: **sắp xếp câu**, **điền chữ**, **chọn câu tiếng Trung đúng nghĩa** (`GET writing?type=ORDER|FILL|CHOOSE&count=`, `POST writing/check`, `GET writing/stats`). Đáp án chỉ ở máy chủ; ưu tiên bài chưa làm hoặc làm sai; bài cấp cao hơn bị khóa. Đã soạn 64 bài tập (mỗi cấp 12 sắp xếp + 12 điền + 8 chọn, chưa duyệt). Dịch tự do (gõ câu) chưa làm vì chấm tự động không đáng tin.
- **Từ khóa sự kiện theo cấp**: mỗi từ khóa hiện nằm trong bài HSK 1 và HSK 2 của chủ đề (chương 1 có thêm HSK 3). Gợi ý 2 và 3 nói tới bài hợp cấp của người học (theo chữ trong gợi ý). Từ lần 46, **gợi ý 2 chỉ thẳng một bài** (mục 5.4); gợi ý 1 và gợi ý chung vẫn không chỉ bài. Quy tắc khi mở rộng nội dung: mỗi chủ đề mới 10–15 bài ở mỗi cấp phải được soạn kèm từ khóa phân bổ đều ở mọi cấp; bài chứa từ khóa không khóa theo cấp.
- **[CHỐT 20/10/2026] Nội dung HSK 3 (HSK 2.0 cấp 3, chưa duyệt)**: (1) **Từ vựng**: 183 từ cấp 3 còn thiếu, chia 9 chủ đề từ vựng "HSK 3 · …" (Học tập, Cơ thể và cảm xúc, Ăn uống, Quần áo và đồ dùng, Thiên nhiên và mùa, Đi lại giải trí, Con người và quan hệ, Từ nối và phó từ, Lượng từ và số), nạp bằng `pnpm db:seed:hsk3-vocab`; đối chiếu danh sách cộng đồng thì đủ 298/298 từ cấp 3. (2) **Hội thoại**: 16 bài ở 4 chủ đề mới (Học tập và thi cử, Thể thao và rèn luyện, Khách sạn và hành lý, Mùa và lễ hội), khóa tới khi lên HSK 3. (3) **Đọc**: 4 bài HSK 3. (4) **Viết**: 32 bài tập tự chấm. (5) **Đề**: 4 đề cấp 3 (mục 4). Gợi ý học từ: sau mỗi bài hiện từ nên lưu (ưu tiên cấp kế) và thanh tiến độ tới số từ tích lũy của cấp kế (cấp 3→4: 1.200 từ).
- **[CHỐT 20/10/2026] Ngữ pháp trong kỹ năng Viết**: tab **Viết → Ngữ pháp** (API `GET grammar`, `GET grammar/:slug`; bài luyện chấm bằng `POST writing/check`). Mỗi điểm ngữ pháp có **công thức, giải thích tiếng Việt, so sánh với tiếng Việt/tiếng Anh, lỗi hay gặp, 3 ví dụ (pinyin sinh tự động, có nút nghe) và 4 bài luyện** (sắp xếp, điền chữ, chọn câu); điểm cấp cao hơn cấp người học bị khóa. Đã soạn **24 điểm (chưa duyệt, `content/grammar.ts`, nạp bằng `pnpm db:seed:grammar`)**: HSK 1 (吗/呢, 是, 有/没有, 不 và 没, 的 sở hữu, 想/会/能/可以, lượng từ), HSK 2 (了, 过, 正在, 比, 得, 因为…所以/虽然…但是, 希望, 一边…一边, 说/告诉/问), HSK 3 (如果…就, 的 làm mệnh đề quan hệ, 被, 把, 要是…就好了, 除了…还/都, 越来越, 是…的). Đối chiếu với các cấu trúc người học tiếng Anh quen: **câu điều kiện** (如果/要是…就), **mệnh đề quan hệ** (cả cụm đứng trước danh từ + 的, không có who/which), **câu ước muốn** (希望, 要是…就好了; không đổi dạng động từ), **câu tường thuật** (说/告诉/问; không lùi thì như tiếng Anh).
- **[CHỐT 20/10/2026] Mở rộng ngữ pháp lên 58 điểm (HSK 1: 12, HSK 2: 17, HSK 3: 19, HSK 4: 10; chưa duyệt, `content/grammar2.ts`) và độ phù hợp theo cấp người học**: thêm từ để hỏi, 在, trật tự thời gian, 也/都, 吧, 从…到…, 离, 给, 已经, 着, 还是/或者, 一…就…, 不但…而且…, bổ ngữ kết quả, 让, 就/才, 听说…; HSK 4: 只要…就…, 只有…才…, 即使…也…, 既然…就…, 无论…都…, 连…都…, bổ ngữ khả năng, 对…来说, 要不是…就…, 与其…不如…. `GET grammar` trả thêm cho mỗi điểm `fit` (**ôn lại** = cấp thấp hơn · **đúng cấp** · **cấp kế** · **còn xa**), `mastered` (làm đúng hết bài luyện), `recommended` (tối đa 3 điểm "Nên học tiếp": điểm đúng cấp chưa thuộc trước, rồi điểm cấp thấp còn làm sai/chưa làm), `levels` (tiến độ từng cấp) và `readyForExam` (thuộc hết điểm của cấp → gợi ý thi lên cấp). FE: thẻ tiến độ ngữ pháp, khối "Nên học tiếp", nút lọc "Phù hợp với tôi" (mặc định, chỉ cấp ≤ cấp của bạn) / "Tất cả cấp". Chưa có HSK 5–6. Bài sắp xếp hỗ trợ `alt` (nhiều thứ tự đúng).
- **[CHỐT 20/10/2026] Ngữ pháp đa dạng và dễ nhìn hơn**: thêm dạng bài **"Tìm câu SAI"** (`WritingType.WRONG`, migration `grammar_wrong`): 3 câu ví dụ đúng + 1 câu sai lấy từ bài chọn câu, tự dựng khi nạp (`pnpm db:seed:grammar`), nên mỗi điểm có 5 bài (sắp xếp · điền · chọn câu · tìm câu sai). Màn chi tiết chia thẻ: Công thức (từ ngữ pháp chính tô sáng, cũng tô sáng trong ví dụ) · Cách dùng · So sánh · Lỗi hay gặp (dòng đỏ ✗ / xanh ✓) · Ví dụ · Luyện tập. Danh sách có thẻ tiến độ, thanh tiến độ từng điểm, nhãn độ phù hợp có màu và lọc theo nhóm (Câu điều kiện, Mệnh đề quan hệ…).
- **[CHỐT 20/10/2026] Sửa theo góp ý dùng thử**: (1) tab **Thêm đổi tên thành Tài khoản**; mọi trang con có nút **‹ Quay lại**. (2) Mở gợi ý: `POST event/slots/:id/hint` trả thêm `tokens` (lượt còn lại) để số lượt trong bảng gợi ý trừ ngay. (3) **Mã quà** ở Tài khoản (`POST redeem {code}`, bảng `RedeemCode`/`RedeemUse`, mỗi tài khoản một mã một lần, có `maxUses`/`expiresAt`, giới hạn 10 lần/phút): mã demo **HV999LUOT = +999 lượt gợi ý** (`pnpm db:seed:codes`; **bản thật xóa mã này**, xem cờ demo). (4) Biểu tượng bài hội thoại dùng **chữ Hán đại diện chủ đề** (`Topic.glyph`, API trả `topics[].glyph`) thay chữ cái đầu tiếng Việt. (5) Tài khoản: giữ khung chuẩn/cấp HSK + nút Hạ/Lên cấp, **giao diện chọn bằng danh sách thả xuống** (để thêm giao diện theo chủ đề sau), thêm **Làm đề lên cấp** (`/them/thi`: chọn cấp, làm đề có đồng hồ, nộp, xem điểm, tự lên cấp nếu đạt đúng cấp). (6) Nhãn cấp viết rõ "**2.0 cấp 5 | 3.0 cấp 4**" = cấp 5 của HSK 2.0 và cấp 4 của HSK 3.0. (7) **Rà văn phong gợi ý**: gợi ý phải đứng một mình được; vì thứ tự ô xáo riêng từng người nên cấm "vẫn là…", "cũng là…", "lúc nãy…"; gợi ý chung không nói điều hiển nhiên ("hành động, không phải đồ vật"). Đã sửa 13 ô (`prisma/seed/hint-fixes.ts`, tự áp dụng khi seed, hoặc `pnpm db:fix-hints`).
- **[CHỐT 20/10/2026] Cách gọi cấp để khỏi nhầm hai chuẩn** (FE `levelName`/`hskLabel`): **HSK 2.0 gọi "HSK 1…6"**; **HSK 3.0 gọi theo giai đoạn: Sơ cấp 1-3 (cấp 1-3), Trung cấp 1-3 (cấp 4-6), Cao cấp 1-3 (cấp 7-9)**. Nhãn song song ví dụ "HSK 5 | Trung cấp 1". Nội dung đã soạn đầy đủ tới **HSK 3 (HSK 2.0)**; HSK 4-5 chỉ có một số từ khó xuất hiện lẻ, một số điểm ngữ pháp HSK 4, chưa có bài. Thông báo khóa của BE vẫn nói "HSK N" theo HSK 2.0 tương đương [CẦN CHỐT: có đổi sang cách gọi mới cho người dùng 3.0 không].
- **[CHỐT 20/10/2026] Sửa bảng gợi ý và biểu tượng bài (lần 2)**: (1) **"Dịch gợi ý" thật sự là công tắc**: mặc định chỉ hiện tiếng Trung, bật mới hiện bản tiếng Việt bên dưới (trước đây bản dịch luôn hiện). (2) Chữ Hán đổi bộ phông (bỏ SimSun làm phông chính vì nét vỡ khi in đậm trên Windows; ưu tiên Noto Serif SC → Songti → PingFang → Microsoft YaHei). (3) Biểu tượng bài lấy **chủ đề chính** của bài (`LessonTopic.sort = 0`, chủ đề đầu tiên trong dữ liệu nguồn), không còn lấy theo thứ tự chữ cái; chủ đề phụ (chủ đề của gợi ý 1) chỉ để lọc. `pnpm db:fix-topic-order` ghi lại thứ tự cho bài đã nạp. (4) Bấm thẻ "Manh mối bạn đang theo dõi" lọc danh sách theo chủ đề (gợi ý 1); khi đã mở gợi ý 2 thì thẻ có thêm liên kết **📖 Bài: …** vào thẳng bài (xem 5.4).
- **[CHỐT 20/10/2026] Giao diện mới (Soft UI phẳng) và nhãn cấp của bài**: lớp `FE/app/theme-v2.css` (nạp sau `theme.css`, chỉ ghi đè) theo mẫu artifact "HanVui giao diện mới": bỏ nền chuyển sắc (mỗi kỹ năng một màu phẳng: Nghe xanh dương, Nói cam, Đọc vàng đậm, Viết ngọc, Sự kiện tím), thẻ kỹ năng trắng có ô chữ Hán, thẻ bài bỏ dải màu bên trái và có ô chữ Hán lớn, tab nổi bo tròn, chip chọn màu mực. **Nhãn cấp của BÀI nay là cấp hiển thị** (`Lesson.hskShown`, ví dụ "HSK 2 | Sơ cấp 1"): bằng cấp đã soạn, **chỉ nâng lên khi hơn 70% từ (tra được) của bài thuộc cấp cao hơn**, khi đó lấy cấp trung vị của nhóm từ cao hơn; không còn lấy cấp của từ khó nhất như mục 2 (vì một bài HSK 1-2 chứa vài từ HSK 4 lại hiện "HSK 4"). Tính lại bằng `pnpm db:hsk`; hiện chưa bài nào vượt 70% nên mọi bài giữ cấp đã soạn (bài HSK 1 có 5-14 từ cao hơn trên 13-29 từ, tức khoảng 20-60%). Nhãn của **từ** vẫn tính theo danh sách từ HSK.
- **[CHỐT 20/10/2026] Hộp thư trên giao diện (Tài khoản → Hộp thư, `/them/hop-thu`)**: danh sách thư ghi **người gửi** (Quản trị viên HanVui / Hệ thống HanVui), tiêu đề, đoạn đầu nội dung, ngày, nhãn quà (còn nhận / đã nhận / hết hạn), thư chưa đọc có vạch đỏ; lọc Tất cả / Chưa đọc / Có quà và theo người gửi; "Đánh dấu đã đọc hết", "Nhận tất cả quà". Mở thư: người gửi, thời gian, tiêu đề, nội dung, khung quà kèm nút **Nhận quà**; thư còn quà chưa nhận thì không xóa được. **Khung nhận quà** (`RewardDialog`) hiện giữa màn hình, có pháo giấy, dùng chung cho nhận quà thư, nhận tất cả và **mã quà**. Số thư chưa đọc hiện ở dòng Hộp thư, chấm đỏ ở tab Tài khoản khi còn thư chưa đọc hoặc quà chưa nhận. **Chưa có thư do người dùng khác gửi** (chỉ quản trị và hệ thống) [CẦN CHỐT nếu muốn thêm]. **Thư theo dịp cho tài khoản mới** (`BE/src/mailbox/campaigns.ts`, người gửi là quản trị): tài khoản tạo từ 18/10 đến 31/10/2026 (giờ Việt Nam) nhận "Thư chúc mừng 20/10 + Cảm ơn bạn đã trải nghiệm HanVui" có tên người đăng ký, lời cảm ơn đã dùng thử (không mời góp ý, không kèm kênh liên hệ), lời chúc 20/10 và quà 20 lượt gợi ý; tài khoản cũ không nhận.
- **[CHỐT 20/10/2026] Ô đã giải hiện lại mọi gợi ý đã mở; màu nhận diện gợi ý ↔ bài**: bảng ô đã giải hiện từ khóa cùng gợi ý chung và các gợi ý đã mở (kể cả nút nghe bài của gợi ý 2). Ô đã mở **từ 2 gợi ý trở lên** được tô màu (12 màu theo vị trí ô trong chương, `FE/lib/clue.ts`, luôn kèm số "Ô n"): vạch màu bên trái các thẻ gợi ý trong bảng, nút nghe bài, nhãn "Ô n" ở thẻ Manh mối, và **thẻ bài được gợi ý 2 chỉ tới có viền màu cùng nhãn "Gợi ý của Ô n"** trong danh sách bài. Ô mới mở 1 gợi ý thì chưa tô màu.
- **[CHỐT 20/10/2026] Ô "Nhập từ khóa" cuối bài hiện đủ gợi ý đã mở**: danh sách "Gợi ý đã mở" gồm cả ô đã giải (làm mờ, ghi "đã giải"); ô mở từ 2 gợi ý có vạch màu và nhãn "Ô n" như ở bảng gợi ý; ô có gợi ý 2 chỉ tới **chính bài đang nghe** được xếp lên đầu, ghi "Gợi ý 2 của ô này chỉ tới bài bạn vừa nghe" và danh sách tự mở. Câu cũ "App không cho biết bài này có từ khóa hay không" đã bỏ vì trái luật gợi ý 2 mới (mục 5.4).
- **[CHỐT 20/10/2026, sửa lần 52] Màu và lưu từ khóa**: ở ô "Nhập từ khóa" cuối bài, **chỉ ô có gợi ý 2 chỉ tới chính bài đang nghe mới có màu**, các ô khác để trắng. Bảng ô đã giải ở tab Sự kiện thu gọn phần từ khóa để **4 gợi ý (chung + 3 gợi ý) hiện ngay** bên dưới. **Từ khóa đã giải không còn tự vào Sổ tay** (cả sự kiện lẫn kho lưu trữ): có nút **"+ Lưu vào Sổ tay" / "Bỏ khỏi Sổ tay"** ở bảng ô đã giải và ở thẻ đoán đúng (thay cho mục 5.8 "tự thêm vào Từ của tôi").
- **[CHỐT 27/10/2026] Hình trực quan cho ngữ pháp**: mỗi điểm (58) có **sơ đồ khối màu** của công thức (mỗi vai một màu: chủ ngữ, động từ, tính từ, tân ngữ, thời gian/nơi chốn, số lượng, mệnh đề; từ ngữ pháp chính tô đỏ đậm; khối nét đứt = có thể bỏ; luôn có nhãn chữ dưới khối) và **biểu tượng tình huống (emoji) cho từng câu ví dụ**. Không dùng ảnh nên không vướng bản quyền. Dữ liệu `content/grammar-visual.ts` (chưa duyệt), cột `GrammarPoint.visual`, nạp cùng `pnpm db:seed:grammar` (thiếu sơ đồ thì báo lỗi).
- **[CHỐT 27/10/2026] Luyện dịch câu Trung ↔ Việt** (trong từng điểm ngữ pháp): **164 câu** (3 câu mỗi điểm HSK 1-3, 2 câu mỗi điểm HSK 4; chưa duyệt; `content/translate.ts`, `translate2.ts`, `pnpm db:seed:translate`, bảng `TranslateItem`/`TranslateDone`). Vì dịch không có một đáp án duy nhất: **chấm theo cụm** — mỗi câu chia cụm, mỗi cụm có vài nghĩa được nhận; Trung → Việt đạt cụm nếu câu dịch chứa một nghĩa của cụm (không bắt thứ tự, khớp nguyên từ, phải đúng dấu), đủ cụm = "đúng ý", ≥60% = "gần đúng". Việt → Trung có **ghép thẻ** (dễ, chấm chắc chắn) và **tự gõ chữ Hán** (đúng nguyên câu hoặc cách viết khác được nhận; không thì chỉ cụm còn thiếu). Sau khi nộp hiện **bản dịch tự nhiên** và **bản dịch sát chữ** (để thấy dịch từng chữ nghe không xuôi), và nút **"Tôi dịch đúng ý"** để người học tự xác nhận khi dùng cách nói khác. Đề chỉ gửi một chiều, bản tham khảo chỉ trả sau khi nộp. API `GET translate/grammar/:slug?direction=`, `POST translate/check`, `POST translate/self`. Chấm bằng AI: để sau (tốn tiền mỗi lượt).
- **[CHỐT 27/10/2026] Từ vựng: nhớ mặt chữ và nghĩa** (đánh vào điểm yếu "đọc được mà không viết được, không nắm nghĩa"; tham khảo Skritter, Pleco, Hanly, và tab 释文/辨析/句库 của các app từ điển): bảng từ có thêm 3 tab. (1) **Nhớ chữ**: tách từng chữ thành bộ phận, đánh dấu **bộ chỉ nghĩa** (viền xanh lá) và **bộ chỉ âm** (viền xanh dương), loại cấu tạo (tượng hình / hội ý / hình thanh), kèm **câu chuyện nhớ** (ví dụ 糕 = 米 gạo + 羔 chỉ âm gāo). Dữ liệu tách chữ từ **Make Me a Hanzi** (`dictionary.txt`, **giấy phép LGPL**, phải kèm giấy phép — `prisma/seed/hanzi/LICENSE.md`; cần kiểm tra pháp lý trước khi phát hành thương mại), lọc bằng `scripts/build-hanzi.ts` thành `hanzi/hanzi.json` (1.139 chữ/bộ phận), nghĩa tiếng Việt của bộ thủ/bộ phận trong `hanzi/components-vi.ts` (bộ phận chưa có nghĩa chỉ hiện chữ + pinyin). (2) **Cụm từ & ví dụ**: mẫu cụm từ hay đi kèm (ví dụ 一块/个 + 蛋糕) + 2 câu ví dụ có pinyin, nghĩa, nút nghe. (3) **Phân biệt**: 22 nhóm từ dễ nhầm (会/能/可以, 二/两, 不/没, 的/得/地, 就/才…) với cách dùng, ví dụ và câu hay sai. **Đã soạn cách nhớ + cụm từ cho 150 từ HSK 1; HSK 2-3 làm đợt sau.** Nạp bằng `pnpm db:seed:word-extra` (bảng `Hanzi`, `WordCompare`, cột `Word.mnemonic`/`colloc`); `GET words/lookup` trả thêm `chars`, `mnemonic`, `colloc`, `compare`. Tất cả nội dung tự soạn **chưa qua duyệt**.
- **[CHỐT 27/10/2026] Viết chữ từ trí nhớ** (Sổ tay → "Viết từ trí nhớ", `/so-tay/viet-nho`): kiểu Skritter — chỉ cho nghĩa + âm thanh (pinyin bấm mới hiện), người học tự viết từng chữ trên **khung trống không có nét mờ**; sai 3 lần một nét thì máy gợi ý nét đó; "Không nhớ, xem cách viết" cho chạy mẫu (tính là chưa nhớ). Cuối bài: số từ viết được (sai ≤ 2 nét, không xem mẫu) và danh sách cần ôn. Nguồn: bộ HSK 1-3 hoặc Sổ tay, 5/10/20 từ (`GET vocab-test/write-words`). Chấm nét ngay trên máy bằng hanzi-writer.
- **[CẦN CHỐT] Âm Hán Việt** (đề xuất): rất hợp với người Việt (学生 = học sinh, 注意 = chú ý). Dữ liệu Unihan (`kVietnamese`) **không dùng được** vì trộn âm Nôm (吗 ghi "mửa", 们 ghi "món") và thiếu nhiều chữ giản thể; nếu làm thì phải tự soạn âm Hán Việt cho khoảng 800 chữ và người biết chữ Hán duyệt.
- **[CHỐT 20/10/2026] Nút "?" của kỹ năng Viết**: ở đầu màn Viết, bấm mới mở bảng hướng dẫn các tính năng (nét, ngữ pháp, sắp xếp, điền chữ, chọn câu); **không tự bật** để không làm phiền người đã quen dùng.
- **[CHỐT 27/10/2026] Lộ trình học cho người mới**: đã làm tới HSK 2, xem mục 6. Lộ trình **không khóa** đề lên cấp (chỉ hướng dẫn). HSK 3 trở lên chưa có lộ trình.
- **[CẦN CHỐT] Chấm phát âm (Nói)**: đề xuất bản đầu dùng Azure Pronunciation Assessment (tài nguyên Speech gói Free hiện có), giới hạn số lần chấm mỗi ngày; cần xác nhận hạn mức giờ âm thanh của gói Free và mức chi tiết thanh điệu tiếng Trung. Phương án thay thế: Whisper (mã nguồn mở) so sánh văn bản, hoặc tự dựng căn chỉnh âm tiết + đo cao độ thanh điệu. Không khuyến nghị tự huấn luyện mô hình.
- **Chưa làm ở BE**: chấm phát âm, thông báo đẩy, API quản trị tặng lượt hàng loạt, đề thi HSK 3.0 và đủ số câu theo đề chính thức, đề cấp 3-6.
- **[CHỐT 18/10/2026] Nội dung hiện có**: 18 hội thoại (6 chủ đề × HSK 1/2/3) + 4 đoạn truyện chương 1, 112 từ trong từ điển, 12 ô từ khóa. Nhãn HSK của mọi bài đã tính tự động (`pnpm db:hsk`). Nút đổi bản trong bài xoay vòng HSK 1 → 2 → 3 → 1.
- **[CHỐT 19/10/2026] Giao diện "vừa học vừa chơi"**: lớp màu mới ở `FE/app/theme.css` (nạp sau `globals.css`, giữ nguyên bố cục và tên lớp của bản demo). Mỗi mảng một dải màu: **nghe xanh dương · nói cam · đọc vàng · viết ngọc bích · sự kiện tím · sổ tay hồng**; thẻ lớn có dải màu và chữ Hán mờ làm hoa văn; nút chính dày có bóng nhấn xuống; ô số liệu màu ở trang chủ; chuỗi ngày hiện ngọn lửa; huy chương tô kiểu kim loại (đồng, bạc, vàng, ngọc); pháo giấy khi trả lời đúng hết câu hỏi và khi giải đúng một ô từ khóa. Chữ trên nền màu luôn trắng, điểm đầu dải màu đủ tối để đạt tương phản; trạng thái vẫn luôn kèm chữ hoặc số (không chỉ dựa vào màu); vẫn tôn trọng "giảm chuyển động" của máy. **Nhân vật dẫn đường để sau** (con dấu 汉 đang giữ chỗ).
- **[CHỐT 18/10/2026] FE (Next.js 16, App Router, TypeScript)**: không dùng thư viện giao diện ngoài, bê nguyên bảng màu và CSS của bản demo 11 vào `FE/app/globals.css`. PWA bằng `manifest.webmanifest` + service worker tự viết (`FE/public/sw.js`). Chữ viết từng nét dùng **hanzi-writer**; dữ liệu nét tải từ CDN jsdelivr (`hanzi-writer-data`). Token lưu ở `localStorage`, tự làm mới khi access token hết hạn. Biến môi trường FE: `NEXT_PUBLIC_API_BASE` (mặc định `/api/v1`: gọi cùng nguồn, Next chuyển tiếp sang BE theo `BE_ORIGIN`, mặc định `http://localhost:3001`) và `NEXT_PUBLIC_AUDIO_BASE` (tên miền CDN của Cloudflare R2; để trống thì lùi về giọng trình duyệt).
- **[CHỐT 18/10/2026, đã chạy thử] Lưu âm thanh trên Cloudflare R2**: bucket `ecourselearning`, kết nối kiểu S3 (`S3_ENDPOINT` dạng `https://<ma-tai-khoan>.r2.cloudflarestorage.com`, `S3_ACCESS_KEY`/`S3_SECRET_KEY` từ R2 API Token, `S3_REGION=auto`), đọc công khai qua **Public Development URL** `https://pub-<ma>.r2.dev` (`S3_PUBLIC_URL`, cũng là `NEXT_PUBLIC_AUDIO_BASE` của FE). Script `pnpm audio` (`BE/scripts/tts-upload.ts`): sinh MP3 **từng câu theo vai** bằng edge-tts → tải lên R2 với `Content-Type: audio/mpeg` và `Cache-Control: max-age=31536000, immutable` → ghi `audioKey` + `audioHash` vào `LessonLine`. Khóa file `audio/{lessonId}/{idx}-{voice}-{hash}.mp3`; `audioHash` chứa tên nhà cung cấp, giọng và cao độ nên đổi bất cứ thứ nào là tự sinh lại. Hai vai dùng cùng một giọng thì script tự lệch cao độ ±12Hz. Đã làm thật bài `cafe` (6 câu, 77 KB) ngày 18/10/2026 và nghe được từ FE.
- **[CHỐT 20/10/2026] Chuyển giọng đọc sang Azure Speech** (tài nguyên gói Free F0, vùng East US của chủ dự án): script `pnpm audio` và `pnpm audio:exams` dùng Azure khi `.env` có `AZURE_SPEECH_KEY` (hoặc `TTS_PROVIDER=azure`), không thì lùi về edge-tts. Có bộ đếm ký tự theo tháng (`BE/.azure-usage.json`, không commit) và **tự dừng ở `AZURE_SPEECH_MONTHLY_LIMIT` (mặc định 400.000, thấp hơn hạn mức Free 500.000)**; tự đợi ~3,2 giây giữa các lần gọi (giới hạn 20 yêu cầu/phút). Tên nhà cung cấp nằm trong `audioHash` nên đổi sang Azure là sinh lại mọi file mà **không xóa file cũ**; sau khi tạo xong và `pnpm audio --verify` đủ thì `pnpm audio --prune` liệt kê file mồ côi trên R2, `--prune --yes` mới xóa. Ước lượng toàn bộ nội dung hiện có (bài học + đề thi): ~14.000 ký tự tính phí (~3% hạn mức tháng).
- **[CẦN CHỐT] Tên miền r2.dev chỉ dùng khi dựng**: Cloudflare giới hạn tần suất và không cache tốt trên tên miền này. Trước khi phát hành nên gắn **custom domain** cho bucket rồi chỉ cần đổi `S3_PUBLIC_URL` và `NEXT_PUBLIC_AUDIO_BASE`.
- **[CHỐT 19/10/2026] Đã tạo âm thanh cho toàn bộ nội dung hiện có**: 166 câu của 22 bài (18 hội thoại + 4 đoạn truyện), 3,01 MB trên R2, mỗi câu một file MP3 theo đúng vai. `pnpm audio --verify` đối chiếu DB với R2: đủ 166 file, không có file rác. FE phát theo `audioKey`; câu nào chưa có file thì lùi về giọng trình duyệt.
- **[CHỐT 18/10/2026] Nhãn cấp HSK song song**: dùng danh sách từ **bản cộng đồng** (HSK 2.0 sáu cấp, HSK 3.0 chín cấp) lưu ở `BE/prisma/seed/hsk/`, gán `Word.hsk2`/`Word.hsk3`, rồi tính nhãn bài = **cấp cao nhất** trong các từ của bài (`Lesson.hsk2`/`hsk3`). Chạy bằng `pnpm db:hsk`. Số liệu bản cộng đồng **cần người biết tiếng Trung duyệt** trước khi công khai.
- Biến môi trường (`BE/.env`, cũng đọc được `../.env` để cả BE và FE dùng chung một file; không commit): `DATABASE_URL` (một chuỗi duy nhất; Supabase "Session pooler" cổng 5432 dùng được cho cả chạy lẫn migrate), `JWT_ACCESS_SECRET` (>= 32 ký tự), `JWT_ACCESS_TTL`, `REFRESH_TTL_DAYS`, `PORT`, `CORS_ORIGINS`. Mẫu ở `BE/.env.example`.
- **[CHỐT] Lưu file**: **âm thanh và ảnh đều ở Cloudflare R2** (cùng bucket, biến `S3_*`; âm thanh tiền tố `audio/` tải lên bằng `pnpm audio`, ảnh tiền tố `img/` tải lên qua API). Lý do bỏ Cloudinary (đã thử, chạy được): gói Free chỉ có 25 credits dùng chung cho lưu trữ, băng thông và biến đổi ảnh, hết thì tài khoản có thể bị khóa; còn băng thông R2 miễn phí. Âm thanh chỉ chiếm khoảng 0,4 GB cho 2.000 bài (ước tính) nên 10 GB miễn phí đủ cho cả ảnh. DB chỉ lưu **khóa gốc** (`User.avatarId`, `Lesson.coverId`, `LessonRole.avatarId`, ví dụ `img/avatars/<id>-ab12`); mỗi cỡ ảnh là file `<khóa>-<cỡ>.webp`, URL ghép từ `S3_PUBLIC_URL` nên chuyển R2 → VPS chỉ đổi biến này và chép bucket (rclone). Khi tải lên, BE dùng `sharp` thu nhỏ sẵn, đổi sang WebP (chất lượng 80), tự xoay theo EXIF, bỏ metadata, không phóng to ảnh nhỏ, chặn ảnh quá 40 triệu điểm ảnh. Cỡ: avatar 256×256 và chat 96×96 (ảnh người dùng và ảnh nhân vật), cover rộng tối đa 1080 và thumb 320×180 (ảnh bối cảnh). Tên file có mã ngẫu nhiên và không ghi đè nên cache trình duyệt 1 năm. Bảng `MediaAsset` ghi sổ mọi ảnh để dọn ảnh mồ côi; đổi ảnh thì xóa mọi cỡ của ảnh cũ. Backup: R2 không tự sao lưu và chưa xác nhận có lưu nhiều phiên bản file; nên định kỳ chép sang nơi khác bằng `rclone copy` (không dùng `sync` vì sync xóa theo nguồn).
- **[CHỐT] API ảnh** (multipart, trường `file`, chỉ JPEG/PNG/WebP, kiểm tra theo nội dung thật chứ không theo đuôi file; 10 lần/phút): `POST|DELETE users/me/avatar` (≤ 2MB, trả `avatarUrl`); `POST admin/lessons/:id/cover` (≤ 5MB) và `POST admin/lessons/:id/roles/:who/avatar` (≤ 2MB) chỉ cho vai trò `ADMIN`. `auth/me`, `lessons` và `lessons/:id` trả thêm `avatarUrl`, `thumbUrl`, `coverUrl` (null khi chưa có ảnh hoặc chưa cấu hình `S3_PUBLIC_URL`). Chưa có công cụ tạo tài khoản ADMIN: hiện đổi `role` trực tiếp trong DB.
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
- 2026-10-19 (lần 32): Thêm lưu ảnh: cột `avatarId`/`coverId`/`avatarId` (người dùng, bài, vai) và bảng `MediaAsset` (migration `media_assets`), module `media`, API avatar và ảnh hội thoại (quản trị). Bản đầu dùng Cloudinary, sau đó đổi sang R2 ngay trong ngày (lần 33).
- 2026-10-19 (lần 33): Chuyển ảnh sang Cloudflare R2 (tiền tố `img/`), bỏ Cloudinary vì gói Free dùng chung 25 credits cho cả băng thông. Thu nhỏ sẵn bằng `sharp` thành WebP (avatar 256, chat 96, cover 1080, thumb 320×180). Giữ nguyên API và cột DB. Thử thật: tải lên, xem qua URL công khai, xóa đều đúng.
- 2026-10-19 (lần 34): Soạn và nạp chương 2-4 (12 chủ đề × 2 cấp, 36 ô, 12 hồi, pinyin sinh tự động, nghĩa từ cho 78% từ); mở hết từ khóa cho bản demo và tặng 999 lượt khi tạo tài khoản (hai cờ trong .env, gỡ được); hộp thư (thư quản trị/hệ thống, có quà/không quà, nhận quà một lần); kho lưu trữ luyện tập sau sự kiện (lượt luyện tập: nghe 2 bài mỗi ngày được 1); đề nâng cấp HSK 2.0 cấp 1-2 (3 đề mỗi cấp, 20 câu, chấm tự động, lên cấp khi đạt); nhãn cấp HSK tự tính đã có (`pnpm db:hsk`). 26 test đơn vị và 38 test e2e qua.
- 2026-10-19 (lần 35): Bài khóa theo cấp (vượt ải, trừ bài chứa từ khóa sự kiện), soạn thử 20 bài mới (Giới thiệu bản thân HSK 1+2, Công việc HSK 2; chưa duyệt, chưa đủ 10–12 bài mỗi chủ đề), gợi ý từ vựng sau bài và tiến độ từ để lên cấp kế, gợi ý từng bước khi tập viết chữ. 26 test đơn vị và 40 test e2e qua.
- 2026-10-20 (lần 36): Nút Hạ/Lên cấp để thử (bản demo); quy đổi gần đúng HSK 3.0 → 2.0 để khóa bài, chọn đề, tiến độ từ; kiểm tra từ vựng toàn app (thêm nghĩa cho 354 từ/chữ, câu ví dụ cho hầu hết từ); kỹ năng Đọc (12 bài HSK 1-2) và Viết (64 bài tập tự chấm: sắp xếp câu, điền chữ, chọn câu) nối với BE thay bản mẫu. 26 test đơn vị và 43 test e2e qua.
- 2026-10-20 (lần 37): Script tạo âm thanh dùng được Azure Speech (có bộ đếm và giới hạn ký tự theo tháng, tự đợi theo giới hạn yêu cầu), thêm `pnpm audio --prune` để dọn file cũ trên R2 sau khi tạo lại.
- 2026-10-20 (lần 38): Tạo âm thanh Azure cho từng từ vựng (cột `audioKey` mới của `Word`, `pnpm audio:words`); bảng từ có nút Lưu/Bỏ khỏi Sổ tay theo trạng thái; thêm `GET words/lookup` và `GET words/audio`. 26 test đơn vị, 44 test e2e qua.
- 2026-10-20 (lần 39): Soạn nội dung HSK 3: 183 từ vựng (9 chủ đề), 16 hội thoại (4 chủ đề), 4 bài đọc, 32 bài tập viết, 4 đề thi cấp 3 → 4 (24 câu, 300 điểm, đạt 180). 26 test đơn vị, 45 test e2e qua.
- 2026-10-20 (lần 40): Thêm mục Ngữ pháp trong kỹ năng Viết (24 điểm HSK 1-3, 96 bài luyện, bảng `GrammarPoint`, cột `WritingItem.grammarId`) và nút "?" hướng dẫn kỹ năng Viết. Ghi đề xuất lộ trình học và chấm phát âm (chờ chốt). 26 test đơn vị, 46 test e2e qua.
- 2026-10-20 (lần 41): Mở rộng ngữ pháp từ 24 lên 58 điểm (thêm HSK 4), mỗi điểm gắn độ phù hợp với cấp người học (ôn lại / đúng cấp / cấp kế / còn xa), thẻ tiến độ, gợi ý "Nên học tiếp", lọc "Phù hợp với tôi". 26 test đơn vị, 46 test e2e qua.
- 2026-10-20 (lần 42): Ngữ pháp đa dạng và dễ nhìn hơn: thêm dạng bài "Tìm câu sai", tô sáng công thức trong ví dụ, tách lỗi sai/đúng thành dòng màu, lọc theo nhóm, thanh tiến độ từng điểm. 26 test đơn vị, 46 test e2e qua.
- 2026-10-20 (lần 43): Đổi tab Thêm → Tài khoản, thêm nút Quay lại ở mọi trang con; số lượt trừ ngay khi mở gợi ý; mã quà (HV999LUOT +999 lượt, demo); biểu tượng bài dùng chữ Hán; Tài khoản có giao diện dạng danh sách thả xuống và mục Làm đề lên cấp (trang thi mới); nhãn cấp "2.0 cấp N | 3.0 cấp M"; sửa văn phong 13 gợi ý. 47 test e2e qua.
- 2026-10-20 (lần 44): Đổi cách gọi cấp: HSK 2.0 = HSK 1…6, HSK 3.0 = Sơ/Trung/Cao cấp 1-3; nhãn song song "HSK 5 | Trung cấp 1"; ghi rõ phạm vi nội dung tới HSK 3.
- 2026-10-20 (lần 45): "Dịch gợi ý" thành công tắc thật, đổi phông chữ Hán, biểu tượng bài theo chủ đề chính (cột LessonTopic.sort).
- 2026-10-20 (lần 46): Đổi luật gợi ý 2: chỉ thẳng một bài chứa từ khóa (che tên bài nếu trùng từ khóa), có nút nghe bài ở bảng gợi ý và ở thẻ Manh mối; `hint2Lesson` trong `GET event`, `POST event/slots/:id/hint` và kho lưu trữ. 47 test e2e qua.
- 2026-10-20 (lần 47): Áp dụng giao diện mới (theme-v2.css, thẻ kỹ năng ở trang chủ); nhãn cấp của bài lấy từ cấp đã soạn thay cho từ khó nhất.
- 2026-10-20 (lần 48): Nhãn cấp của bài chỉ nâng khi hơn 70% từ thuộc cấp cao hơn (cột Lesson.hskShown, tính trong db:hsk).
- 2026-10-20 (lần 49): Giao diện hộp thư (danh sách, lọc, đọc, nhận quà, xóa), khung nhận quà dùng chung (thư và mã quà), số thư chưa đọc và chấm đỏ ở tab Tài khoản; thư chúc mừng 20/10 tự gửi cho tài khoản mới (18/10-31/10, quà 20 lượt). 26 test đơn vị, 47 test e2e qua.
- 2026-10-20 (lần 50): Ô đã giải hiện lại các gợi ý đã mở; ô mở từ 2 gợi ý được tô màu đồng bộ giữa bảng gợi ý, thẻ Manh mối và thẻ bài được chỉ ở gợi ý 2.
- 2026-10-20 (lần 51): Ô nhập từ khóa hiện gợi ý của cả ô đã giải, tô màu ô mở từ 2 gợi ý, ghi chú ô chỉ tới bài đang nghe.
- 2026-10-20 (lần 52): Ô nhập từ khóa chỉ tô màu ô chỉ tới bài đang nghe; ô đã giải hiện ngay 4 gợi ý; bỏ tự lưu từ khóa vào Sổ tay, thay bằng nút Lưu/Bỏ. 47 test e2e qua.
- 2026-10-23 (lần 53): Viết lại bài đọc dài gấp ~3 lần, thêm 12 bài (tổng 28, HSK 1-3, 4 câu hỏi mỗi bài), bỏ âm thanh của bài đọc, thêm `pnpm db:seed:readings`, bổ sung nghĩa 196 từ. 47 test e2e qua.
- 2026-10-23 (lần 54): Kiểm tra từ vựng tự luận 3 cách (Hán → Việt, Việt → Hán, nghe → viết, mỗi phần nửa điểm), bộ từ HSK 1-3 (tối thiểu 20 câu, tối đa cả bộ), chấm cứng ở máy chủ, thẻ mức sẵn sàng thi (từ vựng 80%, hội thoại 70%, bài đọc 70%; chỉ tham khảo). Bỏ Lật thẻ khỏi Sổ tay. 31 test đơn vị, 48 test e2e qua.
- 2026-10-27 (lần 55): "Đọc để máy chấm" bằng nhận dạng giọng nói của trình duyệt (miễn phí) + so pinyin từng âm tiết; sơ đồ khối màu và biểu tượng cho 58 điểm ngữ pháp; luyện dịch Trung ↔ Việt chấm theo cụm (164 câu, ghép thẻ / tự gõ, bản dịch tự nhiên và sát chữ, tự đánh dấu đúng ý); từ vựng có tab Nhớ chữ (tách chữ từ Make Me a Hanzi, LGPL + câu chuyện nhớ), Cụm từ & ví dụ (150 từ HSK 1), Phân biệt (22 nhóm); trang Viết chữ từ trí nhớ. Nội dung mới chưa qua duyệt.
- 2026-10-27 (lần 56): Rà lại 28 bài đọc (sửa câu lặp từ, câu chưa xuôi; viết lại 2 bài HSK 1 trùng cốt truyện; thêm nghĩa 3 từ). Thêm **Lộ trình cho người mới** (`/lo-trinh`): 9 bài nhập môn có nghe và luyện tự chấm (thanh điệu, phụ âm, vần, biến điệu, nét, bộ thủ, số đếm, câu chào), rồi 8 bước HSK 1 và 8 bước HSK 2 với thao tác cụ thể và nút "Làm ngay"; tiến độ tự tính từ máy chủ hoặc tự đánh dấu (lưu trên trình duyệt). Trang Viết mở thẳng tab qua `?tab=`. 51 test e2e qua, FE build qua.

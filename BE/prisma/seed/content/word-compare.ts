// Phân biệt từ dễ nhầm (kiểu "辨析") cho HSK 1-3 (soạn 27/10/2026, CHƯA QUA DUYỆT).
// Mỗi nhóm: các từ, tiêu đề, giải thích chung, từng từ dùng khi nào (kèm ví dụ), và một câu hay sai.
export interface CompareSeed {
  slug: string;
  level: number;
  words: string[];
  title: string;
  explain: string;
  /** [từ, dùng khi nào, ví dụ tiếng Trung, nghĩa] */
  uses: [string, string, string, string][];
  /** [câu sai, câu đúng, vì sao] */
  trap?: [string, string, string];
}

export const WORD_COMPARE: CompareSeed[] = [
  {
    slug: 'hui-neng-keyi', level: 1, words: ['会', '能', '可以'], title: '会, 能, 可以 — đều là "có thể"?',
    explain: 'Tiếng Việt đều dịch là "có thể/biết", nhưng tiếng Trung chia theo LÝ DO làm được.',
    uses: [
      ['会', 'Kỹ năng phải HỌC mới có (biết bơi, biết nói tiếng Trung); hoặc dự đoán "sẽ".', '我会游泳。', 'Tôi biết bơi.'],
      ['能', 'Có KHẢ NĂNG / điều kiện để làm (sức khỏe, thời gian, năng lực đạt mức).', '我今天不能来。', 'Hôm nay tôi không đến được.'],
      ['可以', 'Được PHÉP (xin phép, cho phép).', '这里可以拍照吗？', 'Ở đây chụp ảnh được không?'],
    ],
    trap: ['我能说汉语。(khi muốn nói "tôi biết tiếng Trung")', '我会说汉语。', 'Biết một ngôn ngữ là kỹ năng học được → dùng 会.'],
  },
  {
    slug: 'er-liang', level: 1, words: ['二', '两'], title: '二 và 两 — số 2',
    explain: 'Cả hai đều là "hai", khác nhau ở chỗ đứng.',
    uses: [
      ['二', 'Đếm số, số thứ tự, số điện thoại, ngày tháng, chữ số hàng đơn vị (十二, 二十).', '二月二号', 'ngày hai tháng hai'],
      ['两', 'Đứng trước LƯỢNG TỪ để nói số lượng.', '两个人', 'hai người'],
    ],
    trap: ['二个苹果', '两个苹果', 'Trước lượng từ 个 phải dùng 两.'],
  },
  {
    slug: 'bu-mei', level: 1, words: ['不', '没'], title: '不 và 没 — đều là "không"',
    explain: 'Khác nhau ở THỜI GIAN và loại phủ định.',
    uses: [
      ['不', 'Phủ định ý muốn, thói quen, hiện tại/tương lai; phủ định tính từ và 是.', '我明天不去。', 'Mai tôi không đi.'],
      ['没', 'Phủ định việc ĐÃ xảy ra (chưa/không làm), và phủ định 有.', '我昨天没去。', 'Hôm qua tôi không đi.'],
    ],
    trap: ['我不有钱。', '我没有钱。', '有 chỉ đi với 没, không đi với 不.'],
  },
  {
    slug: 'kan-kanjian', level: 1, words: ['看', '看见'], title: '看 và 看见 — nhìn và thấy',
    explain: '看 là hành động nhìn (có thể không thấy gì); 看见 là nhìn và THẤY được (có kết quả).',
    uses: [
      ['看', 'Hành động nhìn, xem, đọc.', '我在看电视。', 'Tôi đang xem ti vi.'],
      ['看见', 'Nhìn thấy (kết quả).', '我看见他了。', 'Tôi thấy anh ấy rồi.'],
    ],
    trap: ['我看了，可是没看。', '我看了，可是没看见。', 'Muốn nói "nhìn rồi mà không thấy" phải dùng 看见.'],
  },
  {
    slug: 'zai-zhengzai', level: 2, words: ['在', '正在'], title: '在 và 正在 — đang',
    explain: 'Cả hai đứng trước động từ để nói "đang làm". 正在 nhấn mạnh "đúng lúc này".',
    uses: [
      ['在', '"Đang" nói chung; cũng là "ở" khi đứng trước nơi chốn.', '他在学习。', 'Anh ấy đang học.'],
      ['正在', 'Đang (ngay tại thời điểm đó), nhấn mạnh hơn.', '我正在吃饭，等一下。', 'Tôi đang ăn, đợi chút.'],
    ],
  },
  {
    slug: 'dui-xiang', level: 2, words: ['对', '向', '往'], title: '对, 向, 往 — hướng về',
    explain: 'Đều có nghĩa "về phía/với" nhưng dùng khác nhau.',
    uses: [
      ['对', 'Đối xử, thái độ với ai; nói với ai.', '他对我很好。', 'Anh ấy đối xử với tôi rất tốt.'],
      ['向', 'Hướng về (phương hướng hoặc người nhận hành động).', '向老师学习。', 'Học hỏi thầy giáo.'],
      ['往', 'Đi về hướng (phương hướng di chuyển).', '往前走。', 'Đi thẳng về phía trước.'],
    ],
  },
  {
    slug: 'shuo-gaosu-jiang', level: 2, words: ['说', '告诉', '讲'], title: '说, 告诉, 讲 — nói',
    explain: '告诉 bắt buộc có người nghe ngay sau; 说 thì không.',
    uses: [
      ['说', 'Nói (nội dung); nói với ai dùng 跟/对 + người + 说.', '他说他很忙。', 'Anh ấy nói anh ấy rất bận.'],
      ['告诉', 'Nói cho ai biết: 告诉 + người + việc.', '请告诉我你的名字。', 'Hãy cho tôi biết tên của bạn.'],
      ['讲', 'Kể, giảng (chuyện, bài).', '老师给我们讲故事。', 'Thầy kể chuyện cho chúng tôi.'],
    ],
    trap: ['他说我明天不来。(khi muốn nói "anh ấy bảo tôi")', '他告诉我他明天不来。', 'Nói cho ai đó biết phải dùng 告诉 + người.'],
  },
  {
    slug: 'youdian-yidian', level: 3, words: ['有点儿', '一点儿'], title: '有点儿 và 一点儿 — một chút',
    explain: 'Vị trí khác nhau: 有点儿 đứng TRƯỚC tính từ, 一点儿 đứng SAU tính từ/động từ.',
    uses: [
      ['有点儿', 'Trước tính từ, thường ý không hài lòng: "hơi…".', '这件衣服有点儿贵。', 'Cái áo này hơi đắt.'],
      ['一点儿', 'Sau tính từ để so sánh/yêu cầu: "… hơn một chút"; hoặc "một ít" trước danh từ.', '便宜一点儿吧。', 'Rẻ hơn chút đi.'],
    ],
    trap: ['这个一点儿贵。', '这个有点儿贵。', 'Muốn nói "hơi đắt" thì 有点儿 đứng trước tính từ.'],
  },
  {
    slug: 'huozhe-haishi', level: 3, words: ['或者', '还是'], title: '或者 và 还是 — hoặc / hay',
    explain: 'Đều là "hoặc/hay"; 还是 dùng trong CÂU HỎI lựa chọn, 或者 dùng trong câu kể.',
    uses: [
      ['还是', 'Câu hỏi lựa chọn: A hay B?', '你喝茶还是咖啡？', 'Bạn uống trà hay cà phê?'],
      ['或者', 'Câu kể: A hoặc B đều được.', '我周六或者周日去。', 'Tôi đi vào thứ bảy hoặc chủ nhật.'],
    ],
    trap: ['你去或者不去？', '你去还是不去？', 'Câu hỏi lựa chọn dùng 还是.'],
  },
  {
    slug: 'zhidao-renshi', level: 2, words: ['知道', '认识', '了解'], title: '知道, 认识, 了解 — biết',
    explain: 'Tiếng Việt đều là "biết", tiếng Trung chia theo biết CÁI GÌ.',
    uses: [
      ['知道', 'Biết một thông tin, sự việc.', '我知道他的电话。', 'Tôi biết số điện thoại của anh ấy.'],
      ['认识', 'Quen biết người; nhận ra chữ, đường.', '我认识这个字。', 'Tôi biết (nhận ra) chữ này.'],
      ['了解', 'Hiểu rõ, nắm sâu (người, tình hình).', '我很了解他。', 'Tôi rất hiểu anh ấy.'],
    ],
    trap: ['我知道王老师。(khi muốn nói "tôi quen thầy Vương")', '我认识王老师。', 'Quen biết một người dùng 认识.'],
  },
  {
    slug: 'cong-li', level: 2, words: ['从', '离'], title: '从 và 离 — từ / cách',
    explain: '从 chỉ điểm XUẤT PHÁT; 离 chỉ KHOẢNG CÁCH giữa hai điểm.',
    uses: [
      ['从', 'Từ (điểm bắt đầu về nơi chốn, thời gian).', '我从越南来。', 'Tôi đến từ Việt Nam.'],
      ['离', 'Cách (bao xa), A 离 B 近/远.', '我家离学校很近。', 'Nhà tôi cách trường rất gần.'],
    ],
    trap: ['我家从学校很近。', '我家离学校很近。', 'Nói khoảng cách gần/xa dùng 离.'],
  },
  {
    slug: 'jiu-cai', level: 3, words: ['就', '才'], title: '就 và 才 — sớm hay muộn',
    explain: 'Cùng một thời điểm, người nói thấy SỚM/NHANH thì dùng 就, thấy MUỘN/CHẬM thì dùng 才.',
    uses: [
      ['就', 'Sớm hơn, nhanh hơn dự đoán (thường có 了 cuối câu).', '他七点就来了。', 'Mới bảy giờ anh ấy đã đến rồi.'],
      ['才', 'Muộn hơn, chậm hơn dự đoán (không có 了).', '他十点才来。', 'Mười giờ anh ấy mới đến.'],
    ],
    trap: ['他十点才来了。', '他十点才来。', '才 (muộn) không đi với 了 cuối câu.'],
  },
  {
    slug: 'de-three', level: 3, words: ['的', '得', '地'], title: '的, 得, 地 — ba chữ "de"',
    explain: 'Cùng đọc "de" (thanh nhẹ) nhưng đứng ở ba vị trí khác nhau.',
    uses: [
      ['的', 'Trước DANH TỪ: của, mà (我的书, 漂亮的衣服).', '这是我的手机。', 'Đây là điện thoại của tôi.'],
      ['得', 'Sau ĐỘNG TỪ, nối với kết quả/mức độ.', '他跑得很快。', 'Anh ấy chạy rất nhanh.'],
      ['地', 'Trước ĐỘNG TỪ, biến tính từ thành trạng từ.', '他高兴地说。', 'Anh ấy vui vẻ nói.'],
    ],
    trap: ['他说的很好。', '他说得很好。', 'Sau động từ chỉ mức độ dùng 得.'],
  },
  {
    slug: 'canjia-cajia', level: 3, words: ['参加', '参观'], title: '参加 và 参观 — tham gia / tham quan',
    explain: 'Cùng chữ 参 nhưng hành động khác hẳn.',
    uses: [
      ['参加', 'Tham gia (hoạt động, cuộc thi, bữa tiệc) — mình là một phần.', '我参加了比赛。', 'Tôi đã tham gia cuộc thi.'],
      ['参观', 'Tham quan, đi xem (bảo tàng, trường, nhà máy).', '我们去参观博物馆。', 'Chúng tôi đi tham quan bảo tàng.'],
    ],
  },
  {
    slug: 'gei-song', level: 2, words: ['给', '送'], title: '给 và 送 — cho, tặng',
    explain: '给 là đưa/cho nói chung; 送 là tặng (quà) hoặc tiễn, đưa người đi.',
    uses: [
      ['给', 'Đưa cho, cho (không nhất thiết là quà); làm gì cho ai.', '请给我一杯水。', 'Cho tôi một cốc nước.'],
      ['送', 'Tặng quà; tiễn/đưa ai đi.', '我送你一本书。', 'Tôi tặng bạn một quyển sách.'],
    ],
  },
  {
    slug: 'xiang-yao', level: 1, words: ['想', '要'], title: '想 và 要 — muốn',
    explain: '想 là mong muốn (nhẹ, chưa chắc); 要 là muốn chắc chắn, sắp làm, hoặc "cần, phải".',
    uses: [
      ['想', 'Muốn, nghĩ đến; cũng là "nhớ".', '我想去中国。', 'Tôi muốn đi Trung Quốc.'],
      ['要', 'Muốn (dứt khoát), sắp, cần.', '我要一杯咖啡。', 'Tôi lấy một cốc cà phê.'],
    ],
    trap: ['(gọi món) 我想一杯咖啡。', '我要一杯咖啡。', 'Khi gọi món/đòi lấy thứ gì, dùng 要 + danh từ.'],
  },
  {
    slug: 'ye-dou', level: 1, words: ['也', '都'], title: '也 và 都 — cũng / đều',
    explain: '也 là "cũng" (giống người/việc khác); 都 là "đều, tất cả" (bao hết những thứ đứng trước).',
    uses: [
      ['也', 'Cũng, giống như người/việc vừa nói.', '我也是学生。', 'Tôi cũng là học sinh.'],
      ['都', 'Đều, tất cả (chủ ngữ số nhiều đứng trước).', '我们都是学生。', 'Chúng tôi đều là học sinh.'],
    ],
    trap: ['我们是都学生。', '我们都是学生。', '也/都 đứng trước động từ (是), không đứng sau.'],
  },
  {
    slug: 'hui-lai', level: 2, words: ['回来', '回去'], title: '回来 và 回去 — về',
    explain: 'Hướng di chuyển so với NGƯỜI NÓI: 来 là lại gần người nói, 去 là rời xa người nói.',
    uses: [
      ['回来', 'Về đây (về chỗ người nói đang ở).', '你什么时候回来？', 'Khi nào bạn về (đây)?'],
      ['回去', 'Về đó (rời chỗ người nói).', '我明天回去。', 'Mai tôi về (bên đó).'],
    ],
  },
  {
    slug: 'ci-bian', level: 2, words: ['次', '遍'], title: '次 và 遍 — lần',
    explain: '次 đếm số lần xảy ra; 遍 nhấn mạnh làm TRỌN từ đầu đến cuối một lượt.',
    uses: [
      ['次', 'Số lần (đi, gặp, ăn…).', '我去过两次北京。', 'Tôi đã đi Bắc Kinh hai lần.'],
      ['遍', 'Một lượt trọn vẹn (đọc hết, xem hết).', '请再说一遍。', 'Xin nói lại một lượt nữa.'],
    ],
  },
  {
    slug: 'gang-gangcai', level: 3, words: ['刚', '刚才'], title: '刚 và 刚才 — vừa',
    explain: '刚 là phó từ đứng TRƯỚC động từ; 刚才 là danh từ chỉ thời gian ("lúc nãy"), đứng trước hoặc sau chủ ngữ.',
    uses: [
      ['刚', 'Vừa mới (làm gì), đứng ngay trước động từ.', '我刚到家。', 'Tôi vừa về đến nhà.'],
      ['刚才', 'Lúc nãy, vừa rồi (thời điểm).', '刚才你去哪儿了？', 'Lúc nãy bạn đi đâu thế?'],
    ],
    trap: ['刚我看见他了。', '刚才我看见他了。', '刚 không đứng đầu câu, đầu câu dùng 刚才.'],
  },
  {
    slug: 'yiding-kending', level: 3, words: ['一定', '必须'], title: '一定 và 必须 — nhất định / phải',
    explain: '一定 nói về sự chắc chắn hoặc quyết tâm; 必须 là bắt buộc phải làm.',
    uses: [
      ['一定', 'Nhất định, chắc chắn (dự đoán, lời hứa).', '我一定来。', 'Tôi nhất định sẽ đến.'],
      ['必须', 'Bắt buộc phải (quy định, yêu cầu).', '你必须带护照。', 'Bạn bắt buộc phải mang hộ chiếu.'],
    ],
  },
  {
    slug: 'yihou-houlai', level: 3, words: ['以后', '后来'], title: '以后 và 后来 — sau này / sau đó',
    explain: '以后 dùng cho cả quá khứ và tương lai; 后来 chỉ dùng kể chuyện QUÁ KHỨ.',
    uses: [
      ['以后', 'Sau khi…, sau này (tương lai hoặc sau một mốc).', '以后我想当医生。', 'Sau này tôi muốn làm bác sĩ.'],
      ['后来', 'Sau đó (kể lại chuyện đã xảy ra).', '后来他去了北京。', 'Sau đó anh ấy đã đi Bắc Kinh.'],
    ],
    trap: ['后来我要去中国。', '以后我要去中国。', 'Nói về tương lai không dùng 后来.'],
  },
];

// Ngữ pháp HSK 1-3 (soạn 20/10/2026, CHƯA QUA DUYỆT: người biết tiếng Trung cần kiểm lại từng điểm).
// Mỗi điểm: công thức, giải thích tiếng Việt, so sánh, lỗi hay gặp, ví dụ (pinyin sinh tự động) và bài luyện tự chấm.

export type Practice =
  | { type: 'ORDER'; vi: string; parts: string[]; alt?: string[] }
  | { type: 'FILL'; vi: string; parts: string[]; answer: string; options: string[] }
  | { type: 'CHOOSE'; vi: string; answer: string; wrong: string[] };

export interface GrammarSeed {
  slug: string;
  level: number;
  category: string;
  title: string;
  pattern: string;
  explain: string;
  compare: string;
  mistake: string;
  examples: [zh: string, vi: string][];
  practice: Practice[];
}

const o = (vi: string, parts: string[]): Practice => ({ type: 'ORDER', vi, parts });
const f = (vi: string, parts: string[], answer: string, options: string[]): Practice => ({ type: 'FILL', vi, parts, answer, options });
const c = (vi: string, answer: string, wrong: string[]): Practice => ({ type: 'CHOOSE', vi, answer, wrong });

export const GRAMMAR: GrammarSeed[] = [
  // ───────────── HSK 1 ─────────────
  {
    slug: 'ma-ne', level: 1, category: 'Câu hỏi', title: 'Câu hỏi với 吗 và 呢',
    pattern: 'Câu trần thuật + 吗？   ·   A 呢？',
    explain: 'Thêm 吗 vào cuối câu trần thuật để thành câu hỏi có/không. 呢 dùng để hỏi lại "còn … thì sao?" khi đã nói về một việc trước đó.',
    compare: 'Giống "…à?/…không?" trong tiếng Việt. Tiếng Trung không đảo trật tự từ như tiếng Anh (Do you…?), chỉ thêm 吗 ở cuối.',
    mistake: 'Không dùng 吗 cùng với từ để hỏi như 什么, 谁, 哪儿: ✗ 你叫什么名字吗？ → ✓ 你叫什么名字？',
    examples: [['你是学生吗？', 'Bạn là học sinh à?'], ['我很好，你呢？', 'Mình khỏe, còn bạn?'], ['你喝茶吗？', 'Bạn uống trà không?']],
    practice: [
      o('Bạn uống trà không?', ['你', '喝', '茶', '吗']),
      f('Bạn là giáo viên à?', ['你是老师', ''], '吗', ['吗', '呢', '吧']),
      f('Mình khỏe, còn bạn?', ['我很好，你', ''], '呢', ['呢', '吗', '了']),
      c('Bạn có phải học sinh không?', '你是学生吗？', ['你是学生呢？', '你是不学生吗？']),
    ],
  },
  {
    slug: 'shi', level: 1, category: 'Câu cơ bản', title: 'Câu có 是 (là)',
    pattern: 'A 是 B   ·   A 不是 B',
    explain: '是 nối hai danh từ, nghĩa là "A là B". Phủ định là 不是. Trước tính từ thường KHÔNG dùng 是.',
    compare: 'Giống "là" của tiếng Việt, nhưng tiếng Việt cũng không nói "anh ấy là cao", tiếng Trung cũng vậy: 他很高.',
    mistake: '✗ 我是很好。 → ✓ 我很好。 (tính từ đứng trực tiếp sau chủ ngữ, thường có 很)',
    examples: [['我是学生。', 'Tôi là học sinh.'], ['他不是老师。', 'Anh ấy không phải giáo viên.'], ['这是我的书。', 'Đây là sách của tôi.']],
    practice: [
      o('Anh ấy là bạn của tôi.', ['他', '是', '我的', '朋友']),
      f('Tôi không phải người Trung Quốc.', ['我', '', '中国人'], '不是', ['不是', '没是', '不']),
      c('Cô ấy rất đẹp.', '她很漂亮。', ['她是漂亮。', '她漂亮是。']),
      f('Đây là điện thoại của tôi.', ['这', '', '我的手机'], '是', ['是', '有', '在']),
    ],
  },
  {
    slug: 'you', level: 1, category: 'Câu cơ bản', title: 'Câu có 有 và 没有',
    pattern: 'A 有 B   ·   A 没有 B',
    explain: '有 diễn tả sở hữu hoặc tồn tại ("có"). Phủ định của 有 luôn là 没有 (hoặc 没), không bao giờ là 不有.',
    compare: 'Giống "có / không có". Với địa điểm: 桌子上有一本书 = "Trên bàn có một quyển sách".',
    mistake: '✗ 我不有钱。 → ✓ 我没有钱。',
    examples: [['我有一个哥哥。', 'Tôi có một người anh trai.'], ['我没有钱。', 'Tôi không có tiền.'], ['桌子上有一本书。', 'Trên bàn có một quyển sách.']],
    practice: [
      o('Tôi không có thời gian.', ['我', '没有', '时间']),
      f('Nhà tôi có bốn người.', ['我家', '', '四口人'], '有', ['有', '是', '在']),
      f('Anh ấy không có sách tiếng Hán.', ['他', '', '汉语书'], '没有', ['没有', '不有', '不']),
      c('Tôi không có tiền.', '我没有钱。', ['我不有钱。', '我没钱有。']),
    ],
  },
  {
    slug: 'bu-mei', level: 1, category: 'Câu cơ bản', title: 'Phủ định: 不 và 没',
    pattern: '不 + động từ/tính từ   ·   没(有) + động từ',
    explain: '不 phủ định thói quen, hiện tại, tương lai hoặc tính chất (我不喝咖啡, 他不高). 没(有) phủ định việc đã/chưa xảy ra hoặc phủ định 有 (昨天我没去).',
    compare: 'Tiếng Việt dùng "không" cho cả hai, còn "chưa/không đã" tùy ngữ cảnh. Tiếng Trung phải chọn 不 hay 没.',
    mistake: '✗ 他没是学生。 → ✓ 他不是学生。   ✗ 昨天我没去了。 → ✓ 昨天我没去。 (không dùng 了 cùng 没)',
    examples: [['我不喝咖啡。', 'Tôi không uống cà phê.'], ['昨天我没去学校。', 'Hôm qua tôi không đến trường.'], ['他不高。', 'Anh ấy không cao.']],
    practice: [
      f('Hôm qua tôi không đến trường.', ['昨天我', '', '去学校'], '没', ['没', '不', '别']),
      f('Anh ấy không phải học sinh.', ['他', '', '是学生'], '不', ['不', '没', '别']),
      c('Hôm qua tôi không đi làm.', '昨天我没去上班。', ['昨天我没有去上班了。', '昨天我不去上班了。']),
      o('Tôi không uống cà phê.', ['我', '不', '喝', '咖啡']),
    ],
  },
  {
    slug: 'de-possess', level: 1, category: 'Câu cơ bản', title: 'Sở hữu với 的',
    pattern: 'Người/vật 1 + 的 + Danh từ 2',
    explain: '的 nối người sở hữu với vật ("của"). Với người thân hoặc tập thể thân thiết có thể bỏ 的: 我妈妈, 我们学校.',
    compare: 'Trật tự ngược tiếng Việt: tiếng Việt "sách của tôi", tiếng Trung "我的书" (người sở hữu đứng trước).',
    mistake: '✗ 书我的 → ✓ 我的书',
    examples: [['这是我的书。', 'Đây là sách của tôi.'], ['他是我的老师。', 'Ông ấy là thầy của tôi.'], ['我妈妈很好。', 'Mẹ tôi khỏe.']],
    practice: [
      o('Đây là sách của thầy giáo.', ['这是', '老师的', '书']),
      f('Đây là sách của tôi.', ['这是我', '', '书'], '的', ['的', '得', '地']),
      c('Đây là sách của tôi.', '这是我的书。', ['这是书我的。', '这是我书的。']),
      f('Anh ấy là bạn của tôi.', ['他是我', '', '朋友'], '的', ['的', '了', '过']),
    ],
  },
  {
    slug: 'modal', level: 1, category: 'Câu cơ bản', title: 'Động từ năng nguyện: 想, 会, 能, 可以',
    pattern: 'S + 想/会/能/可以 + động từ',
    explain: '想 = muốn; 会 = biết (đã học được) hoặc sẽ; 能 = có khả năng/điều kiện cho phép; 可以 = được phép. Đứng ngay trước động từ chính.',
    compare: 'Tiếng Việt "biết nói" = 会说, "có thể đến" = 能来, "được ngồi" = 可以坐.',
    mistake: '✗ 我会汉语说 → ✓ 我会说汉语 (động từ năng nguyện đứng trước động từ chính)',
    examples: [['我想喝茶。', 'Tôi muốn uống trà.'], ['我会说汉语。', 'Tôi biết nói tiếng Hán.'], ['这里可以坐吗？', 'Ở đây ngồi được không?']],
    practice: [
      o('Tôi biết nói tiếng Hán.', ['我', '会', '说', '汉语']),
      f('Tôi muốn uống một cốc nước.', ['我', '', '喝一杯水'], '想', ['想', '会', '是']),
      f('Ở đây ngồi được không?', ['这里', '', '坐吗'], '可以', ['可以', '想', '会']),
      c('Bạn có thể giúp tôi không?', '你可以帮我吗？', ['你帮可以我吗？', '你可以帮吗我？']),
    ],
  },
  {
    slug: 'liangci', level: 1, category: 'Lượng từ', title: 'Lượng từ: 个, 本, 杯, 件…',
    pattern: 'Số + lượng từ + danh từ   ·   这/那 + lượng từ + danh từ',
    explain: 'Giữa số (hoặc 这/那/几) và danh từ phải có lượng từ: 个 (chung), 本 (sách), 杯 (cốc), 件 (áo, việc), 口 (người trong nhà). Trước lượng từ dùng 两, không dùng 二.',
    compare: 'Giống "một cuốn sách, hai cốc trà" trong tiếng Việt: danh từ không đi thẳng sau số.',
    mistake: '✗ 二个人 → ✓ 两个人   ✗ 我有三书 → ✓ 我有三本书',
    examples: [['我有两个哥哥。', 'Tôi có hai anh trai.'], ['他买了三本书。', 'Anh ấy mua ba quyển sách.'], ['我要一杯茶。', 'Tôi muốn một cốc trà.']],
    practice: [
      f('Tôi có ba quyển sách.', ['我有三', '书'], '本', ['本', '个', '杯']),
      f('Tôi muốn một cốc trà.', ['我要一', '茶'], '杯', ['杯', '本', '件']),
      f('Nhà tôi có hai người.', ['', '个人在家'], '两', ['两', '二', '俩']),
      o('Anh ấy có hai anh trai.', ['他', '有', '两个', '哥哥']),
    ],
  },

  // ───────────── HSK 2 ─────────────
  {
    slug: 'le', level: 2, category: 'Thời gian và trạng thái', title: '了: việc đã hoàn thành',
    pattern: 'S + động từ + 了 + (số lượng) + tân ngữ   ·   …了 (cuối câu: đổi trạng thái)',
    explain: 'Tiếng Trung không chia thì. 了 báo hiệu việc đã hoàn thành hoặc trạng thái đã đổi. Phủ định dùng 没(有) và bỏ 了.',
    compare: 'Gần với "đã … rồi" của tiếng Việt, khác với thì quá khứ của tiếng Anh vì 了 là "hoàn thành" chứ không phải "quá khứ".',
    mistake: '✗ 昨天我没去了。 → ✓ 昨天我没去。',
    examples: [['我吃了早饭。', 'Tôi đã ăn sáng.'], ['他已经走了。', 'Anh ấy đã đi rồi.'], ['天气冷了。', 'Trời lạnh rồi.']],
    practice: [
      o('Tôi đã mua một quyển sách.', ['我', '买', '了', '一本', '书']),
      f('Tôi đã ăn sáng.', ['我吃', '', '早饭'], '了', ['了', '过', '着']),
      c('Hôm qua tôi không đi.', '昨天我没去。', ['昨天我没去了。', '昨天我不去。']),
      f('Trời lạnh rồi.', ['天气冷', ''], '了', ['了', '过', '的']),
    ],
  },
  {
    slug: 'guo', level: 2, category: 'Thời gian và trạng thái', title: '过: đã từng',
    pattern: 'S + động từ + 过 + tân ngữ   ·   S + 没(有) + động từ + 过',
    explain: '过 diễn tả đã từng trải qua một việc ít nhất một lần. Phủ định: 没(有) + động từ + 过 (chưa từng).',
    compare: 'Giống "đã từng/chưa từng" trong tiếng Việt, tương đương "have been/have never" của tiếng Anh.',
    mistake: '✗ 我不去过中国。 → ✓ 我没去过中国。',
    examples: [['我去过北京。', 'Tôi đã từng đến Bắc Kinh.'], ['他没吃过饺子。', 'Anh ấy chưa từng ăn sủi cảo.'], ['你看过这个电影吗？', 'Bạn đã xem bộ phim này chưa?']],
    practice: [
      o('Tôi đã từng đến Trung Quốc.', ['我', '去', '过', '中国']),
      f('Bạn đã ăn sủi cảo bao giờ chưa?', ['你吃', '', '饺子吗'], '过', ['过', '了', '着']),
      c('Tôi chưa từng đến Trung Quốc.', '我没去过中国。', ['我不去过中国。', '我没去了中国。']),
      f('Tôi đã học qua tiếng Hán.', ['我学', '', '汉语'], '过', ['过', '了', '着']),
    ],
  },
  {
    slug: 'zai', level: 2, category: 'Thời gian và trạng thái', title: '正在 / 在: đang làm gì',
    pattern: 'S + (正)在 + động từ (+ 呢)',
    explain: '(正)在 đặt trước động từ để diễn tả việc đang diễn ra. 呢 ở cuối câu làm câu mềm hơn.',
    compare: 'Giống "đang" trong tiếng Việt; không dùng đuôi -ing như tiếng Anh.',
    mistake: '✗ 他看电视正在 → ✓ 他正在看电视 (正在 đứng trước động từ)',
    examples: [['他正在看电视。', 'Anh ấy đang xem ti vi.'], ['我在吃饭。', 'Tôi đang ăn cơm.'], ['她在打电话呢。', 'Cô ấy đang gọi điện thoại đấy.']],
    practice: [
      o('Anh ấy đang xem ti vi.', ['他', '正在', '看', '电视']),
      f('Mẹ đang nấu cơm.', ['妈妈', '', '做饭'], '正在', ['正在', '过', '了']),
      c('Cô ấy đang gọi điện thoại.', '她正在打电话。', ['她打电话过。', '她在打了电话。']),
      f('Tôi đang ăn cơm.', ['我', '', '吃饭'], '在', ['在', '过', '了']),
    ],
  },
  {
    slug: 'bi', level: 2, category: 'So sánh', title: 'So sánh với 比',
    pattern: 'A 比 B + tính từ (+ 一点儿/多了)   ·   A 没有 B + tính từ',
    explain: '比 đặt giữa hai đối tượng so sánh; tính từ đứng sau, không thêm 很. Phủ định thường dùng 没有: A 没有 B + tính từ.',
    compare: 'Giống "A hơn B" nhưng tiếng Trung đặt 比 trước B, không có "hơn" đứng sau tính từ.',
    mistake: '✗ 他比我很高。 → ✓ 他比我高。 (không dùng 很 trong câu 比)',
    examples: [['他比我高。', 'Anh ấy cao hơn tôi.'], ['今天比昨天冷。', 'Hôm nay lạnh hơn hôm qua.'], ['这个没有那个贵。', 'Cái này không đắt bằng cái kia.']],
    practice: [
      o('Anh ấy cao hơn tôi.', ['他', '比', '我', '高']),
      f('Hôm nay lạnh hơn hôm qua.', ['今天', '', '昨天冷'], '比', ['比', '和', '给']),
      c('Cái này rẻ hơn cái kia.', '这个比那个便宜。', ['这个比那个很便宜。', '这个那个比便宜。']),
      f('Tôi không cao bằng anh trai.', ['我没有哥哥', ''], '高', ['高', '很', '比']),
    ],
  },
  {
    slug: 'de-complement', level: 2, category: 'Thời gian và trạng thái', title: 'Bổ ngữ trạng thái với 得',
    pattern: 'S + động từ + 得 + tính từ   ·   S + (động từ) + tân ngữ + động từ + 得 + tính từ',
    explain: '得 nối động từ với phần đánh giá cách thức ("làm … thế nào"). Khi có tân ngữ, lặp động từ: 她说汉语说得很好 (hoặc 她汉语说得很好).',
    compare: 'Giống "chạy rất nhanh / nói rất giỏi" trong tiếng Việt, nhưng tiếng Trung cần 得.',
    mistake: '✗ 他跑很快。 → ✓ 他跑得很快。',
    examples: [['他跑得很快。', 'Anh ấy chạy rất nhanh.'], ['她汉语说得很好。', 'Cô ấy nói tiếng Hán rất giỏi.'], ['你写得真漂亮。', 'Bạn viết đẹp thật.']],
    practice: [
      o('Anh ấy chạy rất nhanh.', ['他', '跑', '得', '很', '快']),
      f('Cô ấy hát rất hay.', ['她唱', '', '很好听'], '得', ['得', '的', '地']),
      c('Cô ấy nói tiếng Hán rất giỏi.', '她汉语说得很好。', ['她说得汉语很好。', '她汉语说很好得。']),
      f('Bạn viết đẹp thật.', ['你写', '', '真漂亮'], '得', ['得', '的', '地']),
    ],
  },
  {
    slug: 'yinwei', level: 2, category: 'Nối câu', title: '因为…所以…, 虽然…但是…',
    pattern: '因为 A，所以 B   ·   虽然 A，但是 B',
    explain: 'Tiếng Trung dùng cả cặp: 因为 và 所以 cùng xuất hiện; 虽然 và 但是 cùng xuất hiện. 因为 chỉ nguyên nhân, 虽然 chỉ nhượng bộ (tuy… nhưng…).',
    compare: 'Giống tiếng Việt "vì… nên…", "tuy… nhưng…" (khác tiếng Anh: không dùng "because… so" cùng lúc).',
    mistake: '✗ 虽然很贵，所以我买了。 → ✓ 虽然很贵，但是我还是买了。',
    examples: [['因为下雨，所以我没去。', 'Vì trời mưa nên tôi không đi.'], ['虽然很累，但是我很高兴。', 'Tuy rất mệt nhưng tôi rất vui.'], ['因为他生病了，所以没来上课。', 'Vì anh ấy bị ốm nên không đến lớp.']],
    practice: [
      o('Vì trời mưa nên tôi không đi.', ['因为', '下雨', '所以', '我', '没', '去']),
      f('Tuy rất mệt nhưng tôi rất vui.', ['', '很累，但是我很高兴'], '虽然', ['虽然', '因为', '如果']),
      c('Tuy rất đắt nhưng tôi vẫn mua.', '虽然很贵，但是我还是买了。', ['因为很贵，但是我还是买了。', '虽然很贵，所以我买了。']),
      f('Vì tôi bị ốm nên tôi không đi làm.', ['因为我生病了，', '我没去上班'], '所以', ['所以', '但是', '如果']),
    ],
  },
  {
    slug: 'xiwang', level: 2, category: 'Câu ước muốn', title: 'Mong muốn với 希望',
    pattern: 'S + 希望 + (người khác) + động từ/mệnh đề   ·   祝 + bạn + …',
    explain: '希望 = hy vọng, mong. Sau 希望 có thể là một mệnh đề đầy đủ với chủ ngữ riêng. Khác 想 (muốn làm gì), 希望 thường nói điều mình mong xảy ra.',
    compare: 'Tương đương "I hope… / I wish…" ở mức đơn giản. Không đổi dạng động từ (không có thể giả định).',
    mistake: '✗ 我希望了明天不下雨。 → ✓ 我希望明天不下雨。 (không thêm 了)',
    examples: [['我希望明天不下雨。', 'Tôi hy vọng ngày mai không mưa.'], ['我希望你快点儿好起来。', 'Tôi mong bạn mau khỏe lại.'], ['他希望当医生。', 'Anh ấy mong được làm bác sĩ.']],
    practice: [
      o('Tôi hy vọng ngày mai không mưa.', ['我', '希望', '明天', '不', '下雨']),
      f('Tôi mong bạn mau khỏe lại.', ['我', '你快点儿好起来'], '希望', ['希望', '愿意', '喜欢']),
      c('Tôi hy vọng ngày mai trời đẹp.', '我希望明天天气好。', ['我希望了明天天气好。', '希望我明天好天气。']),
      f('Anh ấy mong được làm bác sĩ.', ['他', '当医生'], '希望', ['希望', '已经', '正在']),
    ],
  },
  {
    slug: 'yibian', level: 2, category: 'Nối câu', title: '一边…一边…: vừa… vừa…',
    pattern: 'S + 一边 + động từ 1 + 一边 + động từ 2',
    explain: 'Diễn tả hai hành động diễn ra đồng thời. Cùng một chủ ngữ, hai động từ đặt song song.',
    compare: 'Giống "vừa … vừa …" trong tiếng Việt.',
    mistake: '✗ 她唱歌一边跳舞一边。 → ✓ 她一边唱歌一边跳舞。',
    examples: [['他一边吃饭一边看电视。', 'Anh ấy vừa ăn cơm vừa xem ti vi.'], ['我一边走路一边听音乐。', 'Tôi vừa đi bộ vừa nghe nhạc.'], ['妈妈一边做饭一边唱歌。', 'Mẹ vừa nấu cơm vừa hát.']],
    practice: [
      o('Tôi vừa ăn cơm vừa xem ti vi.', ['我', '一边', '吃饭', '一边', '看', '电视']),
      f('Anh ấy vừa đi bộ vừa nghe nhạc.', ['他', '', '走路', '一边听音乐'], '一边', ['一边', '一起', '一样']),
      c('Cô ấy vừa hát vừa nhảy.', '她一边唱歌一边跳舞。', ['她一边唱歌一起跳舞。', '她唱歌一边跳舞一边。']),
      f('Mẹ vừa nấu cơm vừa hát.', ['妈妈', '做饭一边唱歌'], '一边', ['一边', '一起', '一样']),
    ],
  },
  {
    slug: 'shuo', level: 2, category: 'Câu tường thuật', title: 'Câu tường thuật: 说, 告诉, 问',
    pattern: 'A 说：“…”   →   A 说 + (他) + …   ·   A 告诉 B + …   ·   A 问 B + …',
    explain: 'Trực tiếp: 他说：“我明天来。” Gián tiếp: 他说他明天来. Tiếng Trung KHÔNG lùi thì như tiếng Anh; chỉ đổi đại từ nếu cần. 告诉 + người nghe + nội dung; 问 + người nghe + câu hỏi (有 吗, 什么, 去不去).',
    compare: 'Khác tiếng Anh ("He said he would come"), tiếng Trung giữ nguyên động từ: 他说他明天来. Câu hỏi gián tiếp giữ nguyên dạng nghi vấn: 他问我去不去.',
    mistake: '✗ 他说他明天来了。 (了 làm nghĩa thành "đã đến") → ✓ 他说他明天来。',
    examples: [['他说他明天来。', 'Anh ấy nói ngày mai anh ấy sẽ đến.'], ['妈妈告诉我早点儿回家。', 'Mẹ bảo tôi về nhà sớm.'], ['老师问我去不去。', 'Cô giáo hỏi tôi có đi không.']],
    practice: [
      o('Anh ấy nói ngày mai anh ấy sẽ đến.', ['他', '说', '他', '明天', '来']),
      f('Mẹ bảo tôi về nhà sớm.', ['妈妈', '我早点儿回家'], '告诉', ['告诉', '问', '看']),
      f('Cô giáo hỏi tôi có đi không.', ['老师', '我去不去'], '问', ['问', '告诉', '说']),
      c('Anh ấy nói ngày mai anh ấy sẽ đến.', '他说他明天来。', ['他说他明天来了。', '他说明天来他。']),
    ],
  },

  // ───────────── HSK 3 ─────────────
  {
    slug: 'ruguo', level: 3, category: 'Câu điều kiện', title: 'Câu điều kiện: 如果/要是…就…',
    pattern: '如果/要是 + điều kiện，(S) + 就 + kết quả',
    explain: 'Vế đầu nêu điều kiện, vế sau nêu kết quả và thường có 就 đứng ngay trước động từ. 要是 mang sắc thái khẩu ngữ. Cuối vế đầu có thể thêm 的话 ("nếu … thì").',
    compare: 'Giống "nếu … thì …". Khác tiếng Anh: không đổi dạng động từ (không có will/would), vế đầu dùng thẳng hiện tại.',
    mistake: '✗ 如果你累了，所以休息一下。 → ✓ 如果你累了，就休息一下。 (không dùng 所以 trong câu điều kiện)',
    examples: [['如果明天下雨，我们就不去了。', 'Nếu mai mưa thì chúng ta không đi nữa.'], ['要是你有时间，就来我家吧。', 'Nếu bạn có thời gian thì đến nhà mình nhé.'], ['如果你不舒服的话，就回家休息。', 'Nếu bạn thấy không khỏe thì về nhà nghỉ.']],
    practice: [
      o('Nếu mai mưa thì chúng ta không đi nữa.', ['如果', '明天', '下雨', '我们', '就', '不去', '了']),
      f('Nếu bạn có thời gian thì đến nhà mình.', ['', '你有时间，就来我家'], '要是', ['要是', '虽然', '因为']),
      c('Nếu bạn mệt thì hãy nghỉ ngơi.', '如果你累了，就休息一下。', ['如果你累了，所以休息一下。', '虽然你累了，就休息一下。']),
      f('Nếu bạn không đi thì tôi cũng không đi.', ['如果你不去，我', '不去'], '就', ['就', '才', '都']),
    ],
  },
  {
    slug: 'de-relative', level: 3, category: 'Mệnh đề quan hệ', title: 'Mệnh đề quan hệ với 的',
    pattern: '[mệnh đề / cụm động từ] + 的 + danh từ',
    explain: 'Tiếng Trung không có who/which/that. Cả cụm bổ nghĩa đứng TRƯỚC danh từ, nối bằng 的: 我昨天买的书 = "quyển sách mà hôm qua tôi mua".',
    compare: 'Ngược tiếng Anh (the book that I bought yesterday) và ngược tiếng Việt (quyển sách mà tôi mua): tiếng Trung đặt toàn bộ phần bổ nghĩa trước danh từ.',
    mistake: '✗ 书我昨天买的很好看。 → ✓ 我昨天买的书很好看。',
    examples: [['我昨天买的书很好看。', 'Quyển sách mà hôm qua tôi mua rất hay.'], ['在桌子上的杯子是我的。', 'Cái cốc ở trên bàn là của tôi.'], ['教我们汉语的老师很年轻。', 'Cô giáo dạy chúng tôi tiếng Hán rất trẻ.']],
    practice: [
      o('Quyển sách mà hôm qua tôi mua rất hay.', ['我', '昨天', '买', '的', '书', '很', '好看']),
      f('Cô giáo dạy chúng tôi tiếng Hán rất trẻ.', ['教我们汉语', '老师很年轻'], '的', ['的', '得', '地']),
      c('Người mà tôi quen là giáo viên.', '我认识的人是老师。', ['我的认识人是老师。', '人我认识的是老师。']),
      f('Đây là quyển sách mà bạn tôi tặng.', ['这是我朋友送给我', '书'], '的', ['的', '得', '了']),
    ],
  },
  {
    slug: 'bei', level: 3, category: 'Bị động và xử lý', title: 'Câu bị động với 被',
    pattern: 'A + 被 + B + động từ + thành phần khác',
    explain: '被 giới thiệu người/vật tác động ("bị/được"). Động từ phải có thành phần đi kèm như 了, 走, 完, bổ ngữ…; không để động từ trơ trọi. Thường mang sắc thái không mong muốn.',
    compare: 'Giống "bị / được" trong tiếng Việt, và tương đương câu bị động "was taken by…" trong tiếng Anh.',
    mistake: '✗ 我的书被借。 → ✓ 我的书被朋友借走了。',
    examples: [['我的手机被朋友拿走了。', 'Điện thoại của tôi bị bạn cầm đi rồi.'], ['杯子被他打破了。', 'Cái cốc bị anh ấy làm vỡ rồi.'], ['他被老师叫走了。', 'Anh ấy bị thầy gọi đi rồi.']],
    practice: [
      o('Sách của tôi bị bạn mượn đi rồi.', ['我的', '书', '被', '朋友', '借走', '了']),
      f('Cái cốc bị anh ấy làm vỡ rồi.', ['杯子', '他打破了'], '被', ['被', '把', '比']),
      c('Điện thoại của tôi bị bạn cầm đi rồi.', '我的手机被朋友拿走了。', ['我的手机被朋友拿。', '我的手机把朋友拿走了。']),
      f('Túi của tôi bị người khác cầm nhầm.', ['我的包', '别人拿错了'], '被', ['被', '把', '比']),
    ],
  },
  {
    slug: 'ba', level: 3, category: 'Bị động và xử lý', title: 'Câu chữ 把: xử lý tân ngữ',
    pattern: 'S + 把 + tân ngữ xác định + động từ + thành phần khác',
    explain: '把 đưa tân ngữ lên trước động từ để nhấn mạnh việc tác động lên nó và kết quả. Tân ngữ phải xác định (cái sách này, cửa…); động từ phải có thành phần đi kèm (关上, 完, 了, 在桌子上…).',
    compare: 'Không có tương đương trực tiếp trong tiếng Anh; tiếng Việt gần với "đem/lấy … đi làm gì". Dùng khi muốn nói "làm cho vật ấy thành kết quả thế nào".',
    mistake: '✗ 我把书看。 → ✓ 我把书看完了。 (thiếu thành phần kết quả)',
    examples: [['请把门关上。', 'Xin hãy đóng cửa lại.'], ['我把作业做完了。', 'Tôi đã làm xong bài tập.'], ['他把书放在桌子上。', 'Anh ấy đặt sách lên bàn.']],
    practice: [
      o('Xin hãy đóng cửa lại.', ['请', '把', '门', '关上']),
      f('Tôi đã làm xong bài tập.', ['我', '作业做完了'], '把', ['把', '被', '比']),
      c('Xin hãy đưa quyển sách cho tôi.', '请把书给我。', ['请把给我书。', '请书把给我。']),
      f('Anh ấy đặt sách lên bàn.', ['他', '书放在桌子上'], '把', ['把', '被', '比']),
    ],
  },
  {
    slug: 'yaoshi-jiuhao', level: 3, category: 'Câu ước muốn', title: 'Giá mà…: 要是…就好了',
    pattern: '要是 + giả thiết (không có thật) + 就好了   ·   如果我是…，我就…',
    explain: '就好了 ở cuối diễn tả mong ước hoặc tiếc nuối ("giá mà … thì tốt"). Tiếng Trung không đổi dạng động từ (không có thể giả định); ngữ cảnh và 要是/如果/就好了 báo hiệu điều không có thật.',
    compare: 'Tương đương "I wish… / If only…" và "If I were you…". Tiếng Việt cũng nói "giá mà … thì tốt biết bao".',
    mistake: '✗ 要是我会飞好了。 → ✓ 要是我会飞就好了。 (thiếu 就)',
    examples: [['要是我会飞就好了。', 'Giá mà tôi biết bay thì tốt.'], ['要是明天不下雨就好了。', 'Giá mà ngày mai không mưa thì tốt.'], ['如果我是你，我就去。', 'Nếu tôi là bạn thì tôi sẽ đi.']],
    practice: [
      o('Giá mà tôi biết bay thì tốt.', ['要是', '我', '会', '飞', '就', '好', '了']),
      f('Giá mà ngày mai không mưa thì tốt.', ['要是明天不下雨', '好了'], '就', ['就', '才', '都']),
      c('Giá mà tôi có nhiều tiền thì tốt.', '要是我有很多钱就好了。', ['要是我有很多钱了好就。', '我要是很多钱有就好了。']),
      f('Nếu tôi là bạn thì tôi sẽ đi.', ['如果我', '你，我就去'], '是', ['是', '有', '在']),
    ],
  },
  {
    slug: 'chule', level: 3, category: 'Nối câu', title: '除了…(以外)，还/都…',
    pattern: '除了 A (以外)，还 B   ·   除了 A (以外)，都 B',
    explain: '除了 … 还 …: ngoài A còn có B (thêm vào). 除了 … 都 …: trừ A ra, tất cả đều B (loại trừ).',
    compare: 'Giống "ngoài … ra còn …" và "trừ … ra, ai cũng …". Cùng một chữ 除了, ý nghĩa phụ thuộc vào 还 hay 都.',
    mistake: '✗ 除了英语，我都会说汉语。 (nghĩa: ngoài tiếng Anh, tôi đều biết tiếng Hán — không phải ý "ngoài ra còn") → ✓ 除了英语，我还会说汉语。',
    examples: [['除了英语，我还会说汉语。', 'Ngoài tiếng Anh, tôi còn biết nói tiếng Hán.'], ['除了他，大家都来了。', 'Trừ anh ấy ra, mọi người đều đến rồi.'], ['除了数学，我还喜欢历史。', 'Ngoài toán, tôi còn thích lịch sử.']],
    practice: [
      o('Ngoài toán, tôi còn thích lịch sử.', ['除了', '数学', '我', '还', '喜欢', '历史']),
      f('Trừ anh ấy ra, mọi người đều đến rồi.', ['除了他，大家', '来了'], '都', ['都', '还', '也']),
      f('Ngoài táo, tôi còn thích chuối.', ['', '苹果，我还喜欢香蕉'], '除了', ['除了', '为了', '关于']),
      c('Ngoài tiếng Anh, tôi còn biết tiếng Hán.', '除了英语，我还会说汉语。', ['除了英语，我都会说汉语。', '除了汉语，我还会说英语。']),
    ],
  },
  {
    slug: 'yuelaiyue', level: 3, category: 'Thời gian và trạng thái', title: '越来越 và 越…越…',
    pattern: '越来越 + tính từ/động từ   ·   越 A 越 B',
    explain: '越来越 = càng ngày càng (thay đổi theo thời gian). 越 A 越 B = càng A càng B (hai việc cùng tăng).',
    compare: 'Giống "càng ngày càng …" và "càng … càng …" trong tiếng Việt.',
    mistake: '✗ 天气越越来冷。 → ✓ 天气越来越冷。',
    examples: [['天气越来越冷了。', 'Trời càng ngày càng lạnh.'], ['他的汉语越说越好。', 'Tiếng Hán của anh ấy càng nói càng giỏi.'], ['越快越好。', 'Càng nhanh càng tốt.']],
    practice: [
      o('Trời càng ngày càng lạnh.', ['天气', '越来越', '冷', '了']),
      f('Tiếng Hán của anh ấy càng nói càng giỏi.', ['他的汉语', '说越好'], '越', ['越', '更', '很']),
      c('Cô ấy càng ngày càng xinh.', '她越来越漂亮。', ['她来越越漂亮。', '她越来漂亮越。']),
      f('Tôi càng ngày càng thích tiếng Hán.', ['我', '来越喜欢汉语了'], '越', ['越', '更', '很']),
    ],
  },
  {
    slug: 'shi-de', level: 3, category: 'Nhấn mạnh', title: '是…的: nhấn mạnh thông tin',
    pattern: 'S + 是 + (thời gian / nơi chốn / cách thức) + động từ + 的',
    explain: 'Dùng khi việc đã xảy ra rồi và muốn nhấn mạnh hoặc hỏi về thời gian, nơi chốn, cách thức hay người thực hiện. 是 đứng trước thông tin cần nhấn mạnh, 的 đứng cuối.',
    compare: 'Giống cấu trúc "chính là … mà …" hoặc câu chẻ "It was yesterday that I came".',
    mistake: '✗ 你是在哪儿学汉语了？ → ✓ 你是在哪儿学汉语的？ (không dùng 了 trong câu 是…的)',
    examples: [['我是昨天来的。', 'Tôi đến vào hôm qua đấy.'], ['他是坐火车去的。', 'Anh ấy đi bằng tàu hỏa đấy.'], ['你是在哪儿学汉语的？', 'Bạn học tiếng Hán ở đâu vậy?']],
    practice: [
      o('Tôi đến vào hôm qua đấy.', ['我', '是', '昨天', '来', '的']),
      f('Anh ấy đi bằng tàu hỏa đấy.', ['他是坐火车去', ''], '的', ['的', '了', '过']),
      c('Bạn học tiếng Hán ở đâu vậy?', '你是在哪儿学汉语的？', ['你是在哪儿学汉语了？', '你在哪儿是学汉语的？']),
      f('Tôi sinh ra ở Bắc Kinh đấy.', ['我', '在北京出生的'], '是', ['是', '有', '不']),
    ],
  },
];

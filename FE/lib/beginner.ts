// Lộ trình cho người mới (rule.md mục 6, thêm 27/10/2026): nhập môn (pinyin, thanh điệu, nét, bộ thủ, số đếm, câu chào)
// rồi đi từng bước qua HSK 1 và HSK 2, mỗi bước chỉ thẳng tới chức năng cần bấm. Tiến độ tự đánh dấu và điểm bài nhập môn
// lưu trên trình duyệt (localStorage, theo từng tài khoản); các bước có số liệu ở máy chủ thì tự tính.
// Nội dung CHƯA QUA DUYỆT.

export interface Sound {
  zh: string;
  py: string;
  vi?: string;
  note?: string;
}

export interface QuizQ {
  /** Chữ hiện ra (bỏ trống với câu chỉ nghe). */
  show?: string;
  /** Chữ Hán để phát âm thanh. */
  say?: string;
  opts: string[];
  a: number;
  /** Giải thích hiện sau khi trả lời. */
  why?: string;
}

export type Block =
  | { k: 'text'; t: string }
  | { k: 'tip'; t: string }
  | { k: 'sounds'; title?: string; items: Sound[] }
  | { k: 'strokes'; title?: string; items: Sound[] }
  | { k: 'quiz'; title: string; qs: QuizQ[] };

export interface IntroLesson {
  slug: string;
  title: string;
  zh: string;
  mins: number;
  blocks: Block[];
}

const TONES = ['Thanh 1 ˉ', 'Thanh 2 ˊ', 'Thanh 3 ˇ', 'Thanh 4 ˋ'];
const tone = (say: string, py: string, t: number): QuizQ => ({ say, opts: TONES, a: t - 1, why: `${say} đọc là ${py} (thanh ${t}).` });
const pick = (say: string, opts: string[], a: number, why?: string): QuizQ => ({ say, opts, a, why });

export const INTRO: IntroLesson[] = [
  {
    slug: 'lam-quen',
    title: 'Tiếng Trung là gì, học thế nào',
    zh: '始',
    mins: 5,
    blocks: [
      { k: 'text', t: 'Tiếng Trung phổ thông (普通话) viết bằng chữ Hán giản thể. Mỗi chữ đọc thành một âm tiết và thường có nghĩa riêng; một từ thường gồm 1–2 chữ, ví dụ 学生 = 学 (học) + 生 (sinh) = học sinh.' },
      { k: 'sounds', items: [
        { zh: '普通话', py: 'pǔtōnghuà', vi: 'tiếng phổ thông' },
        { zh: '汉字', py: 'hànzì', vi: 'chữ Hán' },
        { zh: '拼音', py: 'pīnyīn', vi: 'phiên âm' },
        { zh: '学生', py: 'xuésheng', vi: 'học sinh' },
      ] },
      { k: 'text', t: 'Pinyin là chữ Latin ghi cách đọc, có dấu thanh điệu. Bạn học pinyin trước (1–2 tuần), sau đó dựa vào pinyin để đọc chữ Hán. Đừng chỉ đọc pinyin mãi: từ HSK 1 hãy nhìn chữ Hán trước, pinyin chỉ để kiểm tra.' },
      { k: 'tip', t: 'Lợi thế của người Việt: rất nhiều từ là từ Hán Việt, nghe gần giống và cùng nghĩa — 注意 (chú ý), 学生 (học sinh), 问题 (vấn đề). Đoán được nghĩa là nhớ nhanh hơn nhiều.' },
      { k: 'text', t: 'Mục tiêu của lộ trình: HSK 1 (150 từ, thi 40 phút) rồi HSK 2 (300 từ, thi 55 phút). Mỗi ngày 30 phút thì khoảng 3–5 tháng (ước lượng, tùy người).' },
      { k: 'tip', t: 'Học đều mỗi ngày tốt hơn học dồn: 30 phút mỗi ngày nhớ lâu hơn 3 tiếng vào cuối tuần.' },
    ],
  },
  {
    slug: 'thanh-dieu',
    title: 'Bốn thanh điệu',
    zh: '声',
    mins: 10,
    blocks: [
      { k: 'text', t: 'Tiếng Trung có 4 thanh và 1 thanh nhẹ. Cùng âm "ma" nhưng đổi thanh là đổi nghĩa. Bấm từng ô để nghe, đọc theo to thành tiếng.' },
      { k: 'sounds', items: [
        { zh: '妈', py: 'mā', vi: 'mẹ', note: 'Thanh 1: cao và đều, kéo dài — như thanh ngang nhưng cao hơn.' },
        { zh: '麻', py: 'má', vi: 'tê, gai', note: 'Thanh 2: đi lên từ giữa — gần thanh sắc, lên từ từ.' },
        { zh: '马', py: 'mǎ', vi: 'ngựa', note: 'Thanh 3: xuống thấp rồi hơi lên — gần thanh hỏi. Nói nhanh thì thường chỉ hạ thấp.' },
        { zh: '骂', py: 'mà', vi: 'mắng', note: 'Thanh 4: rơi nhanh từ cao xuống, dứt khoát — như khi ra lệnh "Đi!".' },
        { zh: '吗', py: 'ma', vi: 'không? (hỏi)', note: 'Thanh nhẹ: ngắn, nhẹ, không có dấu.' },
      ] },
      { k: 'tip', t: 'Dấu thanh đặt trên nguyên âm chính: mā, hǎo, guó. Bị lẫn thanh 2 và thanh 3? Thanh 2 đi thẳng lên; thanh 3 phải trầm xuống trước.' },
      { k: 'sounds', title: 'Nghe thêm', items: [
        { zh: '八', py: 'bā', vi: 'tám' },
        { zh: '拔', py: 'bá', vi: 'nhổ' },
        { zh: '把', py: 'bǎ', vi: 'cầm' },
        { zh: '爸', py: 'bà', vi: 'bố' },
        { zh: '汤', py: 'tāng', vi: 'canh' },
        { zh: '糖', py: 'táng', vi: 'đường' },
        { zh: '躺', py: 'tǎng', vi: 'nằm' },
        { zh: '烫', py: 'tàng', vi: 'bỏng' },
      ] },
      { k: 'quiz', title: 'Nghe và chọn thanh', qs: [
        tone('八', 'bā', 1), tone('来', 'lái', 2), tone('你', 'nǐ', 3), tone('是', 'shì', 4), tone('人', 'rén', 2), tone('书', 'shū', 1),
        tone('好', 'hǎo', 3), tone('去', 'qù', 4), tone('茶', 'chá', 2), tone('水', 'shuǐ', 3), tone('天', 'tiān', 1), tone('大', 'dà', 4),
      ] },
    ],
  },
  {
    slug: 'thanh-mau',
    title: 'Phụ âm đầu (thanh mẫu)',
    zh: '音',
    mins: 12,
    blocks: [
      { k: 'text', t: 'Phụ âm đầu là phần đứng trước của âm tiết (b trong bā). Nhiều âm giống tiếng Việt, chỉ cần chú ý vài nhóm dễ nhầm bên dưới.' },
      { k: 'sounds', title: 'Cặp bật hơi: âm sau đẩy mạnh hơi ra (đặt tờ giấy trước miệng sẽ thấy giấy rung)', items: [
        { zh: '爸', py: 'b · bà', note: 'b ≈ "p" tiếng Việt, không bật hơi' },
        { zh: '怕', py: 'p · pà', note: 'p = "p" bật mạnh hơi' },
        { zh: '大', py: 'd · dà', note: 'd ≈ "t", không bật hơi' },
        { zh: '他', py: 't · tā', note: 't ≈ "th"' },
        { zh: '哥', py: 'g · gē', note: 'g ≈ "c/k", không bật hơi' },
        { zh: '可', py: 'k · kě', note: 'k = "k" bật hơi' },
      ] },
      { k: 'sounds', title: 'Nhóm j q x: đầu lưỡi tì răng dưới, môi dẹt', items: [
        { zh: '家', py: 'j · jiā', note: 'j ≈ "ch" nhẹ' },
        { zh: '去', py: 'q · qù', note: 'q ≈ "ch" bật hơi (KHÔNG đọc là "qu")' },
        { zh: '小', py: 'x · xiǎo', note: 'x ≈ "x" tiếng Việt' },
      ] },
      { k: 'sounds', title: 'Nhóm uốn lưỡi zh ch sh r: cong đầu lưỡi lên vòm miệng', items: [
        { zh: '中', py: 'zh · zhōng', note: 'zh ≈ "tr"' },
        { zh: '吃', py: 'ch · chī', note: 'ch ≈ "tr" bật hơi' },
        { zh: '是', py: 'sh · shì', note: 'sh ≈ "s" uốn lưỡi' },
        { zh: '热', py: 'r · rè', note: 'r ≈ "r" nhẹ, uốn lưỡi (không rung)' },
      ] },
      { k: 'sounds', title: 'Nhóm đầu lưỡi thẳng z c s', items: [
        { zh: '在', py: 'z · zài', note: 'z ≈ "ch" đầu lưỡi, như "ts"' },
        { zh: '菜', py: 'c · cài', note: 'c ≈ "ts" bật hơi (KHÔNG đọc là "c")' },
        { zh: '四', py: 's · sì', note: 's ≈ "x"' },
      ] },
      { k: 'tip', t: 'Lỗi hay gặp của người Việt: đọc q như "qu", c như "c", và đọc 四 (sì, bốn) giống 是 (shì, là). Nghe kỹ hai nhóm z c s và zh ch sh.' },
      { k: 'quiz', title: 'Nghe và chọn pinyin đúng', qs: [
        pick('四', ['sì', 'shì'], 0, '四 = sì (bốn), đầu lưỡi thẳng.'),
        pick('是', ['sì', 'shì'], 1, '是 = shì (là), uốn lưỡi.'),
        pick('去', ['chù', 'qù'], 1),
        pick('吃', ['chī', 'qī'], 0),
        pick('七', ['chī', 'qī'], 1),
        pick('中', ['zōng', 'zhōng'], 1),
        pick('热', ['rè', 'lè'], 0),
        pick('菜', ['chài', 'cài'], 1),
        pick('爸', ['bà', 'pà'], 0),
        pick('他', ['dā', 'tā'], 1),
      ] },
    ],
  },
  {
    slug: 'van-mau',
    title: 'Vần (vận mẫu)',
    zh: '韵',
    mins: 10,
    blocks: [
      { k: 'text', t: 'Vần là phần sau của âm tiết (ao trong hǎo). Phần lớn đọc gần tiếng Việt; vài vần cần nhớ cách đọc riêng.' },
      { k: 'sounds', items: [
        { zh: '饿', py: 'e · è', note: 'e ≈ "ưa" ngắn (không phải "e")' },
        { zh: '鱼', py: 'ü · yú', note: 'ü ≈ "uy" tròn môi; sau j q x y viết là u nhưng vẫn đọc ü' },
        { zh: '天', py: 'ian · tiān', note: 'ian ≈ "iên" (không phải "ian")' },
        { zh: '冷', py: 'eng · lěng', note: 'eng ≈ "âng"' },
        { zh: '人', py: 'en · rén', note: 'en ≈ "ân"' },
        { zh: '中', py: 'ong · zhōng', note: 'ong ≈ "ung"' },
        { zh: '狗', py: 'ou · gǒu', note: 'ou ≈ "âu"' },
        { zh: '北', py: 'ei · běi', note: 'ei ≈ "ây"' },
        { zh: '谢', py: 'ie · xiè', note: 'ie ≈ "iê"' },
        { zh: '学', py: 'üe · xué', note: 'üe ≈ "uê" tròn môi' },
        { zh: '我', py: 'uo · wǒ', note: 'uo ≈ "ua/uô"' },
        { zh: '四', py: 'i · sì', note: 'i sau z c s zh ch sh r đọc gần "ư"' },
      ] },
      { k: 'tip', t: 'Không có phụ âm đầu thì viết thêm y/w: i → yi, u → wu, ü → yu, uo → wo.' },
      { k: 'quiz', title: 'Nghe và chọn pinyin đúng', qs: [
        pick('鱼', ['yóu', 'yú'], 1),
        pick('冷', ['lěng', 'lǐng'], 0),
        pick('天', ['tān', 'tiān'], 1),
        pick('人', ['rén', 'rán'], 0),
        pick('狗', ['gǎo', 'gǒu'], 1),
        pick('学', ['xué', 'xié'], 0),
        pick('北', ['bǎi', 'běi'], 1),
        pick('我', ['wǒ', 'wǔ'], 0),
      ] },
    ],
  },
  {
    slug: 'bien-dieu',
    title: 'Biến điệu: 3 quy tắc đổi thanh',
    zh: '变',
    mins: 6,
    blocks: [
      { k: 'text', t: 'Khi nói, một số thanh tự đổi. Nhiều sách vẫn ghi thanh gốc (nǐ hǎo), nhưng khi đọc phải đổi theo 3 quy tắc sau.' },
      { k: 'sounds', title: '1. Hai thanh 3 liền nhau: thanh 3 đầu đọc thành thanh 2', items: [
        { zh: '你好', py: 'nǐ hǎo → ní hǎo', vi: 'xin chào' },
        { zh: '很好', py: 'hěn hǎo → hén hǎo', vi: 'rất tốt' },
      ] },
      { k: 'sounds', title: '2. 不 (bù) đứng trước thanh 4 đọc thành bú', items: [
        { zh: '不是', py: 'bú shì', vi: 'không phải' },
        { zh: '不要', py: 'bú yào', vi: 'không cần' },
        { zh: '不来', py: 'bù lái', vi: 'không đến (giữ bù)' },
      ] },
      { k: 'sounds', title: '3. 一 (yī): trước thanh 4 đọc yí, trước thanh 1/2/3 đọc yì, đếm số thì giữ yī', items: [
        { zh: '一个', py: 'yí ge', vi: 'một cái' },
        { zh: '一天', py: 'yì tiān', vi: 'một ngày' },
        { zh: '一起', py: 'yìqǐ', vi: 'cùng nhau' },
        { zh: '十一', py: 'shíyī', vi: 'mười một' },
      ] },
      { k: 'quiz', title: 'Chọn cách ĐỌC đúng', qs: [
        { show: '你好', say: '你好', opts: ['nǐ hǎo', 'ní hǎo'], a: 1, why: 'Hai thanh 3 liền nhau: chữ đầu đọc thanh 2.' },
        { show: '不是', say: '不是', opts: ['bù shì', 'bú shì'], a: 1, why: '是 là thanh 4 nên 不 đọc bú.' },
        { show: '不来', say: '不来', opts: ['bù lái', 'bú lái'], a: 0, why: '来 là thanh 2 nên 不 giữ bù.' },
        { show: '一个', say: '一个', opts: ['yí ge', 'yì ge'], a: 0, why: '个 gốc là thanh 4 (gè) nên 一 đọc yí.' },
        { show: '一天', say: '一天', opts: ['yí tiān', 'yì tiān'], a: 1, why: '天 thanh 1 nên 一 đọc yì.' },
        { show: '很好', say: '很好', opts: ['hén hǎo', 'hěn hǎo'], a: 0 },
      ] },
    ],
  },
  {
    slug: 'net-chu',
    title: 'Nét cơ bản và thứ tự viết',
    zh: '笔',
    mins: 12,
    blocks: [
      { k: 'text', t: 'Mọi chữ Hán ghép từ vài loại nét. Viết đúng thứ tự thì chữ đẹp, nhớ lâu, và tra chữ bằng cách viết tay trên điện thoại mới ra đúng.' },
      { k: 'strokes', title: '8 nét cơ bản — chạm chữ để xem cách viết và tập viết', items: [
        { zh: '一', py: '横 héng', vi: 'Ngang: trái → phải' },
        { zh: '十', py: '竖 shù', vi: 'Sổ: trên → dưới' },
        { zh: '人', py: '撇 piě · 捺 nà', vi: 'Phẩy (chéo xuống trái) và mác (chéo xuống phải)' },
        { zh: '六', py: '点 diǎn', vi: 'Chấm' },
        { zh: '我', py: '提 tí', vi: 'Hất: từ dưới trái hất lên phải' },
        { zh: '口', py: '折 zhé', vi: 'Gập: ngang rồi gập xuống' },
        { zh: '小', py: '钩 gōu', vi: 'Móc: cuối nét móc lên' },
      ] },
      { k: 'strokes', title: '7 quy tắc thứ tự nét', items: [
        { zh: '十', py: 'Quy tắc 1', vi: 'Ngang trước, sổ sau' },
        { zh: '八', py: 'Quy tắc 2', vi: 'Phẩy trước, mác sau' },
        { zh: '三', py: 'Quy tắc 3', vi: 'Trên trước, dưới sau' },
        { zh: '你', py: 'Quy tắc 4', vi: 'Trái trước, phải sau' },
        { zh: '月', py: 'Quy tắc 5', vi: 'Ngoài trước, trong sau' },
        { zh: '回', py: 'Quy tắc 6', vi: 'Vào nhà trước, đóng cửa sau (nét đáy viết cuối)' },
        { zh: '小', py: 'Quy tắc 7', vi: 'Giữa trước, hai bên sau' },
      ] },
      { k: 'tip', t: 'Tập mỗi chữ 3 lần: lần 1 xem mẫu, lần 2 viết theo nét mờ, lần 3 tự viết không nhìn. Sau này dùng "Viết từ trí nhớ" trong Sổ tay để ôn.' },
    ],
  },
  {
    slug: 'bo-thu',
    title: 'Bộ thủ: chìa khóa nhớ chữ',
    zh: '部',
    mins: 8,
    blocks: [
      { k: 'text', t: 'Phần lớn chữ Hán gồm một bộ chỉ nghĩa và một phần chỉ âm. Thấy 氵 (nước) là đoán chữ liên quan đến nước: 河 sông, 洗 rửa. Thuộc khoảng 15 bộ dưới đây là đọc được "gợi ý nghĩa" của rất nhiều chữ HSK 1–2.' },
      { k: 'sounds', items: [
        { zh: '你', py: '亻 người', vi: '你 他 们 住' },
        { zh: '吃', py: '口 miệng', vi: '吃 喝 叫 吗' },
        { zh: '河', py: '氵 nước', vi: '河 洗 汉 没' },
        { zh: '打', py: '扌 tay', vi: '打 找 把' },
        { zh: '妈', py: '女 phụ nữ', vi: '妈 姐 她 好' },
        { zh: '树', py: '木 cây', vi: '树 桌 椅' },
        { zh: '说', py: '讠 lời nói', vi: '说 话 语 请' },
        { zh: '饭', py: '饣 ăn', vi: '饭 饿 馆' },
        { zh: '明', py: '日 mặt trời', vi: '明 晚 时' },
        { zh: '想', py: '心 / 忄 tim', vi: '想 您 忙 快' },
        { zh: '菜', py: '艹 cỏ', vi: '菜 茶 花' },
        { zh: '家', py: '宀 mái nhà', vi: '家 字 安' },
        { zh: '这', py: '辶 đi', vi: '这 进 远' },
        { zh: '钱', py: '钅 kim loại', vi: '钱 错' },
      ] },
      { k: 'tip', t: 'Mỗi khi chạm một từ trong app, mở tab "Nhớ chữ": app tách chữ thành bộ, tô xanh lá phần chỉ nghĩa và xanh dương phần chỉ âm, kèm câu chuyện nhớ.' },
    ],
  },
  {
    slug: 'so-dem',
    title: 'Số đếm, giờ và tiền',
    zh: '数',
    mins: 8,
    blocks: [
      { k: 'sounds', items: [
        { zh: '一', py: 'yī', vi: '1' }, { zh: '二', py: 'èr', vi: '2' }, { zh: '三', py: 'sān', vi: '3' }, { zh: '四', py: 'sì', vi: '4' },
        { zh: '五', py: 'wǔ', vi: '5' }, { zh: '六', py: 'liù', vi: '6' }, { zh: '七', py: 'qī', vi: '7' }, { zh: '八', py: 'bā', vi: '8' },
        { zh: '九', py: 'jiǔ', vi: '9' }, { zh: '十', py: 'shí', vi: '10' }, { zh: '百', py: 'bǎi', vi: 'trăm' },
      ] },
      { k: 'text', t: 'Ghép số giống tiếng Việt: 十一 = mười một (11), 二十 = hai mươi (20), 九十九 = 99, 一百 = 100.' },
      { k: 'sounds', title: 'Dùng trong đời sống', items: [
        { zh: '两个人', py: 'liǎng ge rén', vi: 'hai người', note: 'Đếm đồ vật, người thì "hai" là 两, không dùng 二.' },
        { zh: '三点', py: 'sān diǎn', vi: '3 giờ' },
        { zh: '三点半', py: 'sān diǎn bàn', vi: '3 giờ rưỡi' },
        { zh: '五块钱', py: 'wǔ kuài qián', vi: '5 đồng (tệ)' },
        { zh: '多少钱', py: 'duōshao qián', vi: 'bao nhiêu tiền?' },
      ] },
      { k: 'quiz', title: 'Chọn cách viết đúng', qs: [
        { show: '15', opts: ['十五', '五十'], a: 0 },
        { show: '50', opts: ['十五', '五十'], a: 1 },
        { show: '23', opts: ['二十三', '三十二'], a: 0 },
        { show: 'hai cái cốc', opts: ['二个杯子', '两个杯子'], a: 1, why: 'Trước lượng từ (个) dùng 两.' },
        { show: '8 giờ', opts: ['八点', '八块'], a: 0 },
        { say: '六', opts: ['6', '9', '7'], a: 0 },
      ] },
    ],
  },
  {
    slug: 'chao-hoi',
    title: '12 câu dùng được ngay',
    zh: '你',
    mins: 8,
    blocks: [
      { k: 'sounds', items: [
        { zh: '你好', py: 'nǐ hǎo', vi: 'Xin chào' },
        { zh: '您好', py: 'nín hǎo', vi: 'Chào (lịch sự)' },
        { zh: '谢谢', py: 'xièxie', vi: 'Cảm ơn' },
        { zh: '不客气', py: 'bú kèqi', vi: 'Không có gì' },
        { zh: '对不起', py: 'duìbuqǐ', vi: 'Xin lỗi' },
        { zh: '没关系', py: 'méi guānxi', vi: 'Không sao' },
        { zh: '再见', py: 'zàijiàn', vi: 'Tạm biệt' },
        { zh: '我叫小明', py: 'wǒ jiào Xiǎo Míng', vi: 'Tôi tên là Tiểu Minh' },
        { zh: '你叫什么名字', py: 'nǐ jiào shénme míngzi', vi: 'Bạn tên là gì?' },
        { zh: '我是越南人', py: 'wǒ shì Yuènán rén', vi: 'Tôi là người Việt Nam' },
        { zh: '我听不懂', py: 'wǒ tīng bu dǒng', vi: 'Tôi nghe không hiểu' },
        { zh: '请再说一遍', py: 'qǐng zài shuō yí biàn', vi: 'Xin nói lại một lần nữa' },
      ] },
      { k: 'tip', t: 'Bấm nghe rồi nói theo to ngay. Sau bài này vào Học → Nói, chọn "Đọc từ" để máy chấm phát âm của bạn.' },
      { k: 'quiz', title: 'Nghe và chọn nghĩa', qs: [
        { say: '谢谢', opts: ['Xin lỗi', 'Cảm ơn', 'Tạm biệt'], a: 1 },
        { say: '没关系', opts: ['Không sao', 'Không có gì', 'Không hiểu'], a: 0 },
        { say: '再见', opts: ['Xin chào', 'Cảm ơn', 'Tạm biệt'], a: 2 },
        { say: '对不起', opts: ['Xin lỗi', 'Cảm ơn', 'Không sao'], a: 0 },
        { say: '多少钱', opts: ['Mấy giờ rồi?', 'Bao nhiêu tiền?', 'Bạn tên gì?'], a: 1 },
        { say: '我听不懂', opts: ['Tôi là người Việt', 'Xin nói lại', 'Tôi nghe không hiểu'], a: 2 },
      ] },
    ],
  },
];

export const introBySlug = (slug: string) => INTRO.find((l) => l.slug === slug);

// ── Các bước của lộ trình ──

/** Số liệu tự tính từ máy chủ (không cần tự đánh dấu). */
export type Auto =
  | { kind: 'intro' }
  | { kind: 'notebook'; need: number }
  | { kind: 'dialogs' | 'readings'; level: number }
  | { kind: 'vocab'; level: number }
  | { kind: 'grammar'; level: number }
  | { kind: 'exam'; level: number };

export interface Step {
  id: string;
  title: string;
  /** Thao tác cụ thể, bấm gì trước, bấm gì sau. */
  how: string[];
  href?: string;
  cta?: string;
  auto?: Auto;
}

export interface Stage {
  id: string;
  title: string;
  zh: string;
  time: string;
  daily: string[];
  steps: Step[];
}

const levelSteps = (lv: 1 | 2): Step[] => [
  {
    id: `h${lv}-tu`,
    title: lv === 1 ? 'Học từ theo chủ đề, lưu 50 từ đầu tiên' : 'Lưu tổng cộng 150 từ vào Sổ tay',
    how: [
      'Bấm "Làm ngay" → chọn một chủ đề từ vựng.',
      'Chạm từng từ: nghe 2 lần, đọc theo, xem tab "Nhớ chữ" để biết chữ ghép từ bộ nào.',
      'Bấm "Lưu vào Sổ tay". Mỗi ngày 8–10 từ là vừa.',
    ],
    href: '/hoc',
    cta: 'Mở Từ vựng',
    auto: { kind: 'notebook', need: lv === 1 ? 50 : 150 },
  },
  {
    id: `h${lv}-nghe`,
    title: `Nghe hội thoại HSK ${lv}`,
    how: [
      `Bấm "Làm ngay" → chọn nút HSK ${lv} ở đầu danh sách → mở bài chưa học.`,
      'Nghe 2 lần, KHÔNG nhìn chữ → trả lời câu hỏi.',
      'Mở lời thoại, bật pinyin, nghe lại từng câu và nói theo. Bật "Chế độ lưu từ" để lưu từ mới.',
      'Mỗi ngày 2 bài (cũng là nhiệm vụ ngày).',
    ],
    href: '/hoc/nghe',
    cta: 'Mở Nghe',
    auto: { kind: 'dialogs', level: lv },
  },
  {
    id: `h${lv}-ngu-phap`,
    title: `Ngữ pháp HSK ${lv}`,
    how: [
      'Bấm "Làm ngay" → mở điểm có nhãn "Nên học tiếp".',
      'Xem sơ đồ công thức, đọc 3 ví dụ (bấm nghe), rồi làm hết 5 bài luyện.',
      'Cuối mỗi điểm có "Luyện dịch câu": dịch Trung → Việt và Việt → Trung.',
      'Mỗi ngày 1 điểm. Điểm nào làm sai thì hôm sau làm lại.',
    ],
    href: '/hoc/viet?tab=grammar',
    cta: 'Mở Ngữ pháp',
    auto: { kind: 'grammar', level: lv },
  },
  {
    id: `h${lv}-doc`,
    title: `Đọc bài đọc HSK ${lv}`,
    how: [
      `Bấm "Làm ngay" → chọn HSK ${lv} → mở bài chưa đọc.`,
      'Tắt pinyin, đọc to một lượt; từ nào không biết thì chạm để xem nghĩa và lưu.',
      'Trả lời 4 câu hỏi. Mỗi 2–3 ngày đọc 1 bài.',
    ],
    href: '/hoc/doc',
    cta: 'Mở Đọc',
    auto: { kind: 'readings', level: lv },
  },
  {
    id: `h${lv}-noi`,
    title: 'Đọc to cho máy chấm',
    how: [
      'Bấm "Làm ngay" → chọn "Đọc từ" hoặc "Đọc câu mẫu".',
      'Nghe mẫu → bấm micro → đọc. Âm tiết đỏ/vàng là chỗ cần sửa: nghe lại và đọc lại tới khi xanh.',
      'Mỗi ngày 5 phút. Tự đánh dấu xong khi đọc được 20 từ/câu mà phần lớn âm tiết xanh.',
    ],
    href: '/hoc/noi',
    cta: 'Mở Nói',
  },
  {
    id: `h${lv}-viet`,
    title: `Viết lại từ HSK ${lv} không nhìn mẫu`,
    how: [
      `Bấm "Làm ngay" → chọn bộ HSK ${lv} (hoặc "Sổ tay của tôi") → 10 từ.`,
      'App chỉ cho nghĩa và âm thanh: tự viết từng chữ trên khung trống.',
      'Từ nào "Cần ôn" thì chạm vào xem cách nhớ và viết lại. Tự đánh dấu xong khi viết đúng 8/10.',
    ],
    href: '/so-tay/viet-nho',
    cta: 'Mở Viết từ trí nhớ',
  },
  {
    id: `h${lv}-kiem-tra`,
    title: `Kiểm tra bộ từ HSK ${lv} đạt 80%`,
    how: [
      `Bấm "Làm ngay" → nguồn "Bộ từ HSK ${lv}" → chọn cách Trộn → gõ số câu (từ 20, muốn chắc thì làm cả bộ).`,
      'Câu sai: chạm vào để xem lại từ rồi lưu vào Sổ tay.',
    ],
    href: '/so-tay/kiem-tra',
    cta: 'Mở Kiểm tra',
    auto: { kind: 'vocab', level: lv },
  },
  {
    id: `h${lv}-thi`,
    title: lv === 1 ? 'Thi đề HSK 1 để lên HSK 2' : 'Thi đề HSK 2 — về đích!',
    how: [
      'Xem thẻ "Sẵn sàng thi lên cấp?" ở trang thi; chưa đủ vẫn thi thử được.',
      `Chọn HSK ${lv} → làm bài trong ${lv === 1 ? 40 : 55} phút. Đạt 120/200 thì lên cấp.`,
      'Không đạt: xem câu sai, ôn lại phần yếu (nghe / đọc / viết), vài ngày sau thi đề khác.',
    ],
    href: '/them/thi',
    cta: 'Mở Làm đề',
    auto: { kind: 'exam', level: lv },
  },
];

export const STAGES: Stage[] = [
  {
    id: 'nhap-mon',
    title: 'Nhập môn: phát âm và chữ viết',
    zh: '入',
    time: '1–2 tuần',
    daily: ['10 phút: một bài nhập môn bên dưới, nghe và nói theo to', '10 phút: làm lại phần nghe chọn thanh / pinyin tới khi đúng hết'],
    steps: INTRO.map((l) => ({
      id: 'intro-' + l.slug,
      title: l.title,
      how: [`Bài ngắn khoảng ${l.mins} phút. Bấm từng ô để nghe, đọc theo, làm phần luyện ở cuối (đạt 80% là xong).`],
      href: '/lo-trinh/' + l.slug,
      cta: 'Vào bài',
      auto: { kind: 'intro' as const },
    })),
  },
  {
    id: 'hsk1',
    title: 'HSK 1: 150 từ, câu đơn giản',
    zh: '一',
    time: '6–8 tuần',
    daily: ['5 phút: Kiểm tra 20 câu từ Sổ tay', '10 phút: 2 bài nghe HSK 1', '10 phút: 1 điểm ngữ pháp hoặc 1 bài đọc (xen kẽ)', '5 phút: viết từ trí nhớ hoặc đọc cho máy chấm'],
    steps: levelSteps(1),
  },
  {
    id: 'hsk2',
    title: 'HSK 2: 300 từ, kể chuyện hằng ngày',
    zh: '二',
    time: '8–10 tuần',
    daily: ['5 phút: Kiểm tra 20 câu từ Sổ tay', '10 phút: 2 bài nghe HSK 2', '10 phút: 1 điểm ngữ pháp hoặc 1 bài đọc (xen kẽ)', '5 phút: viết từ trí nhớ hoặc đọc cho máy chấm'],
    steps: levelSteps(2),
  },
];

// ── Lưu tiến độ trên trình duyệt ──

export interface PathState {
  /** Bước tự đánh dấu xong: id → ngày. */
  done: Record<string, string>;
  /** Điểm cao nhất phần luyện của bài nhập môn: slug → % */
  score: Record<string, number>;
}

const key = (uid: string) => 'hv.path.' + uid;

export function loadPath(uid: string): PathState {
  try {
    const raw = localStorage.getItem(key(uid));
    if (raw) {
      const s = JSON.parse(raw) as Partial<PathState>;
      return { done: s.done ?? {}, score: s.score ?? {} };
    }
  } catch {
    /* trình duyệt chặn lưu: dùng trạng thái trống */
  }
  return { done: {}, score: {} };
}

export function savePath(uid: string, s: PathState) {
  try {
    localStorage.setItem(key(uid), JSON.stringify(s));
  } catch {
    /* bỏ qua */
  }
}

/** Bài nhập môn coi là xong khi phần luyện đạt 80% (bài không có phần luyện thì tự bấm "Đã học xong"). */
export const PASS = 80;
export const hasQuiz = (l: IntroLesson) => l.blocks.some((b) => b.k === 'quiz');

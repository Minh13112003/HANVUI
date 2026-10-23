// Bài đọc HSK 1-3 (nội dung ở reading-hsk*.ts) và bài tập viết tự chấm (CHƯA QUA DUYỆT). Pinyin sinh bằng pinyin-pro lúc nạp.
import type { Q } from './types.js';
import { READINGS_HSK1 } from './reading-hsk1.js';
import { READINGS_HSK2 } from './reading-hsk2.js';
import { READINGS_HSK3 } from './reading-hsk3.js';

export interface Reading {
  id: string;
  level: number;
  title: [zh: string, vi: string];
  /** Mỗi phần tử là một câu: [tiếng Trung, tiếng Việt]. */
  sents: [string, string][];
  qs: Q[];
}

// Bài đọc tách theo cấp (viết lại dài gấp ~3 lần ngày 23/10/2026, thêm bài mới). Bài đọc không có âm thanh.
export const READINGS: Reading[] = [...READINGS_HSK1, ...READINGS_HSK2, ...READINGS_HSK3];

// ───────────── Bài tập viết tự chấm ─────────────
// order: sắp xếp các phần thành câu đúng · fill: điền chữ vào chỗ trống ('' là chỗ trống) · choose: chọn câu tiếng Trung đúng nghĩa.
export type WritingSeed =
  | { level: number; type: 'ORDER'; vi: string; parts: string[]; alt?: string[] }
  | { level: number; type: 'FILL'; vi: string; parts: string[]; answer: string; options: string[] }
  | { level: number; type: 'CHOOSE'; vi: string; answer: string; wrong: string[] };

const o = (level: number, vi: string, parts: string[]): WritingSeed => ({ level, type: 'ORDER', vi, parts });
const f = (level: number, vi: string, parts: string[], answer: string, options: string[]): WritingSeed => ({ level, type: 'FILL', vi, parts, answer, options });
const c = (level: number, vi: string, answer: string, wrong: string[]): WritingSeed => ({ level, type: 'CHOOSE', vi, answer, wrong });

export const WRITING: WritingSeed[] = [
  // HSK 1 · sắp xếp câu
  o(1, 'Tôi muốn uống cà phê.', ['我', '想', '喝', '咖啡']),
  o(1, 'Anh ấy là thầy giáo của tôi.', ['他', '是', '我的', '老师']),
  o(1, 'Bạn tên là gì?', ['你', '叫', '什么', '名字']),
  o(1, 'Nhà tôi có bốn người.', ['我家', '有', '四口人']),
  o(1, 'Hôm nay thời tiết rất đẹp.', ['今天', '天气', '很', '好']),
  o(1, 'Tôi học tiếng Hán ở trường.', ['我', '在', '学校', '学习', '汉语']),
  o(1, 'Cái này bao nhiêu tiền?', ['这个', '多少', '钱']),
  o(1, 'Cô ấy thích ăn cơm.', ['她', '喜欢', '吃', '米饭']),
  o(1, 'Ngày mai chúng ta đến cửa hàng.', ['明天', '我们', '去', '商店']),
  o(1, 'Bạn biết nói tiếng Anh không?', ['你', '会', '说', '英语', '吗']),
  o(1, 'Tôi không quen anh ấy.', ['我', '不', '认识', '他']),
  o(1, 'Bây giờ là tám giờ.', ['现在', '是', '八点']),
  // HSK 1 · điền chữ
  f(1, 'Tôi uống trà.', ['我', '', '茶'], '喝', ['喝', '吃', '买']),
  f(1, 'Anh ấy là giáo viên.', ['他', '', '老师'], '是', ['是', '有', '在']),
  f(1, 'Nhà tôi có ba người.', ['我家', '', '三口人'], '有', ['有', '是', '在']),
  f(1, 'Bạn tên là gì?', ['你', '', '什么名字'], '叫', ['叫', '说', '看']),
  f(1, 'Hôm nay rất nóng.', ['今天', '很', ''], '热', ['热', '吃', '大']),
  f(1, 'Tôi học ở trường.', ['我', '', '学校学习'], '在', ['在', '是', '有']),
  f(1, 'Cái này bao nhiêu tiền?', ['这个', '', '钱'], '多少', ['多少', '什么', '哪']),
  f(1, 'Anh ấy biết nói tiếng Hán.', ['他', '会', '', '汉语'], '说', ['说', '看', '听']),
  f(1, 'Tôi muốn mua một quyển sách.', ['我', '想', '', '一本书'], '买', ['买', '吃', '喝']),
  f(1, 'Tôi không quen anh ấy.', ['我', '不', '', '他'], '认识', ['认识', '喜欢', '看']),
  f(1, 'Bây giờ mấy giờ?', ['现在', '', '点'], '几', ['几', '多', '什么']),
  f(1, 'Năm nay tôi hai mươi tuổi.', ['我', '今年', '二十', ''], '岁', ['岁', '个', '口']),
  // HSK 1 · chọn câu đúng nghĩa
  c(1, 'Tôi muốn uống cà phê.', '我想喝咖啡。', ['我想买咖啡。', '他想喝咖啡。']),
  c(1, 'Cô ấy là giáo viên của tôi.', '她是我的老师。', ['她是我的学生。', '我是她的老师。']),
  c(1, 'Ngày mai trời mưa.', '明天下雨。', ['昨天下雨。', '明天不下雨。']),
  c(1, 'Tôi không biết nói tiếng Anh.', '我不会说英语。', ['我会说英语。', '我不会说汉语。']),
  c(1, 'Nhà tôi có năm người.', '我家有五口人。', ['我家有四口人。', '他家有五口人。']),
  c(1, 'Cái này bao nhiêu tiền?', '这个多少钱？', ['那个多少钱？', '这个是什么？']),
  c(1, 'Chúng tôi đi học.', '我们去上学。', ['我们去上班。', '他们去上学。']),
  c(1, 'Bạn sống ở đâu?', '你住在哪儿？', ['你是哪国人？', '你在做什么？']),

  // HSK 2 · sắp xếp câu
  o(2, 'Tôi đi làm bằng tàu điện ngầm mỗi ngày.', ['我', '每天', '坐', '地铁', '上班']),
  o(2, 'Anh ấy hơn tôi ba tuổi.', ['他', '比', '我', '大', '三岁']),
  o(2, 'Xin bạn nói lại một lần nữa.', ['请', '你', '再', '说', '一次']),
  o(2, 'Tôi đã ăn sáng rồi.', ['我', '已经', '吃', '过', '早饭', '了']),
  o(2, 'Chiếc áo này đắt quá.', ['这件', '衣服', '太', '贵', '了']),
  o(2, 'Bạn có thể giúp tôi một việc không?', ['你', '可以', '帮', '我', '一个', '忙', '吗']),
  o(2, 'Anh ấy đang xem ti vi.', ['他', '正在', '看', '电视']),
  o(2, 'Vì trời mưa nên tôi không đi.', ['因为', '下雨', '所以', '我', '没', '去']),
  o(2, 'Chúng ta cùng ra công viên chơi nhé.', ['我们', '一起', '去', '公园', '玩', '吧']),
  o(2, 'Câu hỏi này rất đơn giản.', ['这个', '问题', '很', '简单']),
  o(2, 'Anh ấy chạy rất nhanh.', ['他', '跑', '得', '很', '快']),
  o(2, 'Tôi thấy tiếng Hán rất thú vị.', ['我', '觉得', '中文', '很', '有意思']),
  // HSK 2 · điền chữ
  f(2, 'Tôi đã ăn cơm rồi.', ['我', '', '吃过饭了'], '已经', ['已经', '正在', '还']),
  f(2, 'Anh ấy chạy rất nhanh.', ['他', '跑', '', '很快'], '得', ['得', '的', '地']),
  f(2, 'Anh ấy cao hơn tôi.', ['他', '', '我', '高'], '比', ['比', '和', '给']),
  f(2, 'Vì trời mưa nên tôi không đi.', ['因为下雨，', '', '我没去'], '所以', ['所以', '但是', '如果']),
  f(2, 'Chúng ta cùng đi công viên chơi.', ['我们', '', '去公园玩'], '一起', ['一起', '一样', '一些']),
  f(2, 'Xin bạn xem qua cái này một chút.', ['请你', '', '一下这个'], '看', ['看', '问', '读']),
  f(2, 'Anh ấy đang ngủ.', ['他', '', '在睡觉'], '正', ['正', '再', '又']),
  f(2, 'Bạn có thể giúp tôi không?', ['你', '', '帮我吗'], '可以', ['可以', '可是', '可爱']),
  f(2, 'Tôi đã mua một quyển sách.', ['我买', '', '一本书'], '了', ['了', '过', '着']),
  f(2, 'Câu hỏi này không khó.', ['这个问题', '', '难'], '不', ['不', '没', '别']),
  f(2, 'Tôi muốn giới thiệu bạn tôi cho bạn.', ['我想', '', '你介绍我的朋友'], '给', ['给', '对', '在']),
  f(2, 'Chiếc áo này quá nhỏ.', ['这件衣服', '', '小了'], '太', ['太', '很', '最']),
  // HSK 2 · chọn câu đúng nghĩa
  c(2, 'Anh ấy chạy rất nhanh.', '他跑得很快。', ['他跑得很慢。', '他走得很快。']),
  c(2, 'Tôi đã ăn cơm rồi.', '我已经吃饭了。', ['我还没吃饭。', '我想吃饭。']),
  c(2, 'Bởi vì mệt nên tôi muốn nghỉ ngơi.', '因为很累，所以我想休息。', ['因为我想休息，所以很累。', '虽然很累，但是我想休息。']),
  c(2, 'Chiếc áo này rẻ hơn chiếc kia.', '这件衣服比那件便宜。', ['这件衣服比那件贵。', '那件衣服比这件便宜。']),
  c(2, 'Xin hãy nói chậm một chút.', '请你说慢一点儿。', ['请你说快一点儿。', '请你再说一次。']),
  c(2, 'Ngày mai tôi sẽ đến công ty lúc tám giờ.', '明天我八点去公司。', ['昨天我八点去公司。', '明天我八点回家。']),
  c(2, 'Cô ấy đang đợi bạn ở cửa.', '她正在门口等你。', ['她在门口等我。', '你正在门口等她。']),
  c(2, 'Tôi chưa từng đến Trung Quốc.', '我没去过中国。', ['我去过中国。', '我不想去中国。']),
  // HSK 3 · sắp xếp câu
  o(3, 'Tôi rất có hứng thú với lịch sử Trung Quốc.', ['我', '对', '中国', '历史', '很', '有', '兴趣']),
  o(3, 'Tuy rất mệt nhưng tôi rất vui.', ['虽然', '很累', '但是', '我', '很', '高兴']),
  o(3, 'Anh ấy bị thầy giáo gọi đi rồi.', ['他', '被', '老师', '叫', '走', '了']),
  o(3, 'Xin hãy cho anh ấy mượn quyển sách này.', ['请', '把', '这本', '书', '借给', '他']),
  o(3, 'Bạn nên tập thể dục nhiều hơn.', ['你', '应该', '多', '锻炼', '身体']),
  o(3, 'Tôi vừa ăn cơm vừa xem tin tức.', ['我', '一边', '吃饭', '一边', '看', '新闻']),
  o(3, 'Cô ấy cùng bạn đi leo núi rồi.', ['她', '跟', '朋友', '一起', '去', '爬山', '了']),
  o(3, 'Câu hỏi này dễ hơn tôi nghĩ.', ['这个', '问题', '比', '我', '想的', '容易']),
  o(3, 'Ngoài toán, tôi còn thích lịch sử.', ['除了', '数学', '我', '还', '喜欢', '历史']),
  o(3, 'Để nâng cao thành tích, anh ấy rất cố gắng.', ['为了', '提高', '成绩', '他', '很', '努力']),
  o(3, 'Tôi thấy chiếc áo sơ mi này rất đẹp.', ['我', '觉得', '这件', '衬衫', '很', '好看']),
  o(3, 'Anh ấy thường quên tắt đèn.', ['他', '经常', '忘记', '关灯']),
  // HSK 3 · điền chữ
  f(3, 'Tuy rất mệt nhưng tôi rất vui.', ['', '很累，但是我很高兴'], '虽然', ['虽然', '因为', '如果']),
  f(3, 'Tôi đi du lịch cùng bạn.', ['我', '', '朋友一起去旅游'], '跟', ['跟', '把', '被']),
  f(3, 'Xin đưa quyển sách này cho tôi.', ['请', '', '这本书给我'], '把', ['把', '被', '让']),
  f(3, 'Bạn nên tập thể dục nhiều hơn.', ['你', '', '多锻炼身体'], '应该', ['应该', '已经', '正在']),
  f(3, 'Tôi rất có hứng thú với âm nhạc.', ['我对音乐很有', ''], '兴趣', ['兴趣', '意思', '办法']),
  f(3, 'Hôm nay lạnh hơn hôm qua.', ['今天', '', '昨天冷'], '比', ['比', '和', '跟']),
  f(3, 'Anh ấy vừa đi vừa nghe nhạc.', ['他', '', '走路', '一边听音乐'], '一边', ['一边', '一起', '一样']),
  f(3, 'Ngoài toán, tôi còn thích lịch sử.', ['', '数学，我还喜欢历史'], '除了', ['除了', '为了', '关于']),
  f(3, 'Để nâng cao thành tích, anh ấy học đến rất khuya.', ['', '提高成绩，他每天学习到很晚'], '为了', ['为了', '虽然', '关于']),
  f(3, 'Nếu mai mưa thì chúng ta không đi nữa.', ['', '明天下雨，我们就不去了'], '如果', ['如果', '虽然', '因为']),
  f(3, 'Sách của tôi bị bạn mượn đi rồi.', ['我的书', '', '朋友借走了'], '被', ['被', '把', '比']),
  f(3, 'Tôi biết không nhiều về lịch sử Trung Quốc.', ['', '中国历史，我知道得不多'], '关于', ['关于', '为了', '除了']),
  // HSK 3 · chọn câu đúng nghĩa
  c(3, 'Tuy trời mưa nhưng chúng tôi vẫn đi.', '虽然下雨，但是我们还是去了。', ['因为下雨，所以我们没去。', '如果下雨，我们就不去。']),
  c(3, 'Tôi quên mang ô.', '我忘记带伞了。', ['我忘记带钱了。', '我记得带伞了。']),
  c(3, 'Anh ấy vừa đi vừa nghe nhạc.', '他一边走路一边听音乐。', ['他一边吃饭一边听音乐。', '他走路的时候没听音乐。']),
  c(3, 'Chiếc va-li này nặng hơn chiếc kia.', '这个行李箱比那个重。', ['那个行李箱比这个重。', '这个行李箱和那个一样重。']),
  c(3, 'Ngoài tiếng Anh, tôi còn biết tiếng Hán.', '除了英语，我还会说汉语。', ['除了汉语，我还会说英语。', '我只会说英语。']),
  c(3, 'Tôi nghĩ bạn nên nghỉ ngơi.', '我觉得你应该休息。', ['我觉得你不应该休息。', '我希望你去工作。']),
  c(3, 'Thời tiết ngày mai có thể sẽ lạnh hơn.', '明天的天气可能会更冷。', ['明天的天气可能会更热。', '明天的天气不会变化。']),
  c(3, 'Cô ấy đồng ý đến tham dự buổi tiệc.', '她同意来参加晚会。', ['她不同意来参加晚会。', '她还没决定来不来。']),
];

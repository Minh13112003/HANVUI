// Bài hội thoại "vượt ải" theo cấp (soạn 19/10/2026, CHƯA QUA DUYỆT). Mỗi chủ đề có nhiều bài ở cấp thấp để làm quen,
// và bài cấp cao hơn cùng chủ đề (hoặc chủ đề mới của cấp đó) bị khóa tới khi người học thi đạt đề lên cấp.
// Pinyin KHÔNG gõ tay: sinh bằng pinyin-pro lúc nạp (seed-ladder.ts).
import type { Level, Word } from './types.js';

export interface Ladder extends Level {
  /** Mã bài (duy nhất). */
  id: string;
  /** Cấp HSK 2.0 của bài; người học chưa tới cấp này thì bài bị khóa. */
  level: number;
  topic: string;
  tags: string[];
  words: Word[];
}

const A = (g: 'm' | 'f', r: 1 | 2 | 3) => ({ g, r });

export const TOPIC_GLYPH_LADDER: Record<string, string> = {
  'Giới thiệu bản thân': '我',
  'Công việc': '工',
};

const intro = 'Giới thiệu bản thân';
const work = 'Công việc';

export const LADDER: Ladder[] = [
  // ───────────── Giới thiệu bản thân · HSK 1 (làm quen) ─────────────
  {
    id: 'intro-name', level: 1, topic: intro, tags: ['tên', 'làm quen', 'chào'], words: [],
    title: 'Bạn tên gì?', situation: 'Hai người mới gặp nhau',
    who: { A: 'Vương Minh', B: 'Lý Hoa' }, cast: { A: A('m', 2), B: A('f', 3) },
    lines: [
      ['A', '你好！我叫王明，你叫什么名字？', 'Xin chào! Mình tên Vương Minh, bạn tên gì?'],
      ['B', '我叫李花。认识你很高兴。', 'Mình tên Lý Hoa. Rất vui được quen bạn.'],
      ['A', '我也很高兴。你是学生吗？', 'Mình cũng rất vui. Bạn là học sinh à?'],
      ['B', '是，我是学生。你呢？', 'Vâng, mình là học sinh. Còn bạn?'],
      ['A', '我也是学生。', 'Mình cũng là học sinh.'],
    ],
    qs: [
      { q: ['女的叫什么名字？', 'Người nữ tên gì?'], o: [['李花', 'Lý Hoa'], ['王明', 'Vương Minh'], ['小英', 'Tiểu Anh']], a: 0 },
      { q: ['他们是什么人？', 'Họ là người làm nghề gì?'], o: [['学生', 'Học sinh'], ['老师', 'Giáo viên'], ['医生', 'Bác sĩ']], a: 0 },
    ],
  },
  {
    id: 'intro-country', level: 1, topic: intro, tags: ['quốc gia', 'quốc tịch', 'làm quen'], words: [],
    title: 'Bạn là người nước nào?', situation: 'Làm quen ở lớp học',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('f', 3), B: A('m', 1) },
    lines: [
      ['A', '你是哪国人？', 'Bạn là người nước nào?'],
      ['B', '我是越南人。你呢？', 'Mình là người Việt Nam. Còn bạn?'],
      ['A', '我是中国人，我住在北京。', 'Mình là người Trung Quốc, mình sống ở Bắc Kinh.'],
      ['B', '北京大吗？', 'Bắc Kinh có lớn không?'],
      ['A', '很大，人也很多。', 'Rất lớn, người cũng rất đông.'],
      ['B', '我想去看看。', 'Mình muốn đến xem thử.'],
    ],
    qs: [
      { q: ['男的是哪国人？', 'Người nam là người nước nào?'], o: [['越南人', 'Người Việt Nam'], ['中国人', 'Người Trung Quốc'], ['美国人', 'Người Mỹ']], a: 0 },
      { q: ['女的住在哪儿？', 'Người nữ sống ở đâu?'], o: [['北京', 'Bắc Kinh'], ['上海', 'Thượng Hải'], ['河内', 'Hà Nội']], a: 0 },
    ],
  },
  {
    id: 'intro-age', level: 1, topic: intro, tags: ['tuổi', 'số đếm'], words: [],
    title: 'Bạn bao nhiêu tuổi?', situation: 'Trò chuyện với bạn mới',
    who: { A: 'Anh', B: 'Cô' }, cast: { A: A('m', 1), B: A('f', 2) },
    lines: [
      ['A', '你今年几岁？', 'Năm nay bạn bao nhiêu tuổi?'],
      ['B', '我今年二十岁。你呢？', 'Năm nay mình hai mươi tuổi. Còn bạn?'],
      ['A', '我二十五岁。', 'Mình hai mươi lăm tuổi.'],
      ['B', '你是我的哥哥！', 'Anh là anh trai của em rồi!'],
      ['A', '哈哈，对，你叫我哥哥吧。', 'Haha, đúng rồi, em gọi anh là anh nhé.'],
    ],
    qs: [
      { q: ['女的今年几岁？', 'Năm nay người nữ bao nhiêu tuổi?'], o: [['二十岁', '20 tuổi'], ['二十五岁', '25 tuổi'], ['三十岁', '30 tuổi']], a: 0 },
      { q: ['男的几岁？', 'Người nam bao nhiêu tuổi?'], o: [['二十五岁', '25 tuổi'], ['二十岁', '20 tuổi'], ['十五岁', '15 tuổi']], a: 0 },
    ],
  },
  {
    id: 'intro-job', level: 1, topic: intro, tags: ['nghề nghiệp', 'công việc'], words: [],
    title: 'Bạn làm nghề gì?', situation: 'Hai người nói về nghề nghiệp',
    who: { A: 'Bác sĩ', B: 'Giáo viên' }, cast: { A: A('f', 2), B: A('m', 2) },
    lines: [
      ['A', '你做什么工作？', 'Bạn làm nghề gì?'],
      ['B', '我是老师，在学校工作。你呢？', 'Mình là giáo viên, làm ở trường. Còn bạn?'],
      ['A', '我是医生，在医院工作。', 'Mình là bác sĩ, làm ở bệnh viện.'],
      ['B', '你喜欢你的工作吗？', 'Bạn có thích công việc của mình không?'],
      ['A', '喜欢。你呢？', 'Thích. Còn bạn?'],
      ['B', '我也喜欢，学生们都很好。', 'Mình cũng thích, các học sinh đều rất ngoan.'],
    ],
    qs: [
      { q: ['女的是做什么的？', 'Người nữ làm nghề gì?'], o: [['医生', 'Bác sĩ'], ['老师', 'Giáo viên'], ['学生', 'Học sinh']], a: 0 },
      { q: ['男的在哪儿工作？', 'Người nam làm việc ở đâu?'], o: [['学校', 'Trường học'], ['医院', 'Bệnh viện'], ['商店', 'Cửa hàng']], a: 0 },
    ],
  },
  {
    id: 'intro-live', level: 1, topic: intro, tags: ['nơi ở', 'nhà'], words: [],
    title: 'Nhà bạn ở đâu?', situation: 'Hỏi nơi ở',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('m', 3), B: A('f', 2) },
    lines: [
      ['A', '你家在哪儿？', 'Nhà bạn ở đâu?'],
      ['B', '我家在上海。', 'Nhà mình ở Thượng Hải.'],
      ['A', '你一个人住吗？', 'Bạn sống một mình à?'],
      ['B', '不是，我和爸爸妈妈住在一起。', 'Không, mình sống cùng bố mẹ.'],
      ['A', '你家大吗？', 'Nhà bạn có to không?'],
      ['B', '不大，但是我很喜欢。', 'Không to, nhưng mình rất thích.'],
    ],
    qs: [
      { q: ['女的家在哪儿？', 'Nhà người nữ ở đâu?'], o: [['上海', 'Thượng Hải'], ['北京', 'Bắc Kinh'], ['学校', 'Trường học']], a: 0 },
      { q: ['她和谁住在一起？', 'Cô ấy sống cùng ai?'], o: [['爸爸妈妈', 'Bố mẹ'], ['朋友', 'Bạn bè'], ['一个人', 'Một mình']], a: 0 },
    ],
  },
  {
    id: 'intro-phone', level: 1, topic: intro, tags: ['điện thoại', 'số điện thoại', 'số đếm'], words: [],
    title: 'Số điện thoại của bạn', situation: 'Trao đổi số điện thoại',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('f', 3), B: A('m', 2) },
    lines: [
      ['A', '请问，你的电话号码是多少？', 'Cho hỏi, số điện thoại của bạn là bao nhiêu?'],
      ['B', '一三九，零八七六，五四三二。', 'Một ba chín, không tám bảy sáu, năm bốn ba hai.'],
      ['A', '请再说一次，好吗？', 'Bạn nói lại một lần nữa được không?'],
      ['B', '好的。一三九，零八七六，五四三二。', 'Được. Một ba chín, không tám bảy sáu, năm bốn ba hai.'],
      ['A', '谢谢你！', 'Cảm ơn bạn!'],
      ['B', '不客气。', 'Đừng khách sáo.'],
    ],
    qs: [
      { q: ['女的在问什么？', 'Người nữ đang hỏi gì?'], o: [['电话号码', 'Số điện thoại'], ['名字', 'Tên'], ['年纪', 'Tuổi']], a: 0 },
      { q: ['号码最后一个数字是几？', 'Chữ số cuối của số là mấy?'], o: [['二', '2'], ['三', '3'], ['四', '4']], a: 0 },
    ],
  },
  {
    id: 'intro-family', level: 1, topic: intro, tags: ['gia đình', 'người thân'], words: [],
    title: 'Nhà bạn có mấy người?', situation: 'Nói về gia đình',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('m', 2), B: A('f', 3) },
    lines: [
      ['A', '你家有几口人？', 'Nhà bạn có mấy người?'],
      ['B', '我家有四口人，爸爸、妈妈、弟弟和我。', 'Nhà mình có bốn người, bố, mẹ, em trai và mình.'],
      ['A', '你弟弟多大了？', 'Em trai bạn bao nhiêu tuổi rồi?'],
      ['B', '他十二岁，是学生。', 'Em ấy mười hai tuổi, là học sinh.'],
      ['A', '你们是好朋友吗？', 'Hai người là bạn thân à?'],
      ['B', '是，我们常常一起玩。', 'Vâng, bọn mình thường chơi cùng nhau.'],
    ],
    qs: [
      { q: ['她家有几口人？', 'Nhà cô ấy có mấy người?'], o: [['四口', '4 người'], ['三口', '3 người'], ['五口', '5 người']], a: 0 },
      { q: ['她弟弟几岁？', 'Em trai cô ấy mấy tuổi?'], o: [['十二岁', '12 tuổi'], ['二十岁', '20 tuổi'], ['七岁', '7 tuổi']], a: 0 },
    ],
  },
  {
    id: 'intro-like', level: 1, topic: intro, tags: ['sở thích', 'ăn uống'], words: [],
    title: 'Bạn thích ăn gì?', situation: 'Nói về món thích ăn',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('f', 2), B: A('m', 3) },
    lines: [
      ['A', '你喜欢吃什么？', 'Bạn thích ăn gì?'],
      ['B', '我喜欢吃米饭和鱼。', 'Mình thích ăn cơm và cá.'],
      ['A', '我喜欢吃面条，不喜欢吃鱼。', 'Mình thích ăn mì, không thích ăn cá.'],
      ['B', '你喜欢喝茶吗？', 'Bạn có thích uống trà không?'],
      ['A', '喜欢，我每天都喝茶。', 'Thích, ngày nào mình cũng uống trà.'],
    ],
    qs: [
      { q: ['女的不喜欢吃什么？', 'Người nữ không thích ăn gì?'], o: [['鱼', 'Cá'], ['面条', 'Mì'], ['米饭', 'Cơm']], a: 0 },
      { q: ['女的每天喝什么？', 'Người nữ ngày nào cũng uống gì?'], o: [['茶', 'Trà'], ['水', 'Nước'], ['咖啡', 'Cà phê']], a: 0 },
    ],
  },
  {
    id: 'intro-birthday', level: 1, topic: intro, tags: ['sinh nhật', 'ngày tháng'], words: [],
    title: 'Sinh nhật của bạn', situation: 'Hỏi ngày sinh',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('m', 1), B: A('f', 3) },
    lines: [
      ['A', '你的生日是几月几号？', 'Sinh nhật bạn là ngày mấy tháng mấy?'],
      ['B', '我的生日是五月二十号。', 'Sinh nhật mình là ngày hai mươi tháng năm.'],
      ['A', '今天是五月十八号，两天后就是你的生日！', 'Hôm nay là mười tám tháng năm, hai ngày nữa là sinh nhật bạn rồi!'],
      ['B', '对！你来我家吃饭，好吗？', 'Đúng rồi! Bạn đến nhà mình ăn cơm nhé?'],
      ['A', '好，谢谢你！', 'Được, cảm ơn bạn!'],
    ],
    qs: [
      { q: ['女的的生日是哪天？', 'Sinh nhật người nữ là ngày nào?'], o: [['五月二十号', '20 tháng 5'], ['五月十八号', '18 tháng 5'], ['六月二十号', '20 tháng 6']], a: 0 },
      { q: ['男的要去哪儿？', 'Người nam sẽ đi đâu?'], o: [['女的家', 'Nhà người nữ'], ['学校', 'Trường học'], ['商店', 'Cửa hàng']], a: 0 },
    ],
  },
  {
    id: 'intro-language', level: 1, topic: intro, tags: ['ngôn ngữ', 'tiếng Hán', 'tiếng Anh'], words: [],
    title: 'Bạn biết nói tiếng gì?', situation: 'Nói về ngôn ngữ',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('f', 3), B: A('m', 2) },
    lines: [
      ['A', '你会说汉语吗？', 'Bạn có biết nói tiếng Hán không?'],
      ['B', '我会说一点儿。你呢？', 'Mình biết nói một chút. Còn bạn?'],
      ['A', '我会说汉语和英语。', 'Mình biết nói tiếng Hán và tiếng Anh.'],
      ['B', '你的汉语真好！', 'Tiếng Hán của bạn thật giỏi!'],
      ['A', '谢谢，你也很好。', 'Cảm ơn, bạn cũng giỏi.'],
    ],
    qs: [
      { q: ['女的会说什么？', 'Người nữ biết nói gì?'], o: [['汉语和英语', 'Tiếng Hán và tiếng Anh'], ['只会汉语', 'Chỉ tiếng Hán'], ['只会英语', 'Chỉ tiếng Anh']], a: 0 },
      { q: ['男的会说汉语吗？', 'Người nam có biết nói tiếng Hán không?'], o: [['会一点儿', 'Biết một chút'], ['不会', 'Không biết'], ['说得很好', 'Nói rất giỏi']], a: 0 },
    ],
  },

  // ───────────── Giới thiệu bản thân · HSK 2 (bài nâng cao, khóa tới khi lên HSK 2) ─────────────
  {
    id: 'intro-friend', level: 2, topic: intro, tags: ['giới thiệu bạn', 'đồng nghiệp'],
    words: [['同事', 'đồng nghiệp', 'danh từ'], ['聊天', 'trò chuyện', 'động từ']],
    title: 'Giới thiệu một người bạn', situation: 'Hẹn dẫn bạn đến gặp',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('m', 2), B: A('f', 3) },
    lines: [
      ['A', '周末我想带一个朋友来见你。', 'Cuối tuần mình muốn dẫn một người bạn đến gặp bạn.'],
      ['B', '好啊，他是做什么的？', 'Được chứ, anh ấy làm nghề gì?'],
      ['A', '他是我的同事，在一家公司工作，已经工作三年了。', 'Anh ấy là đồng nghiệp của mình, làm ở một công ty, đã làm được ba năm rồi.'],
      ['B', '他会说汉语吗？', 'Anh ấy có biết nói tiếng Hán không?'],
      ['A', '他的汉语很好，因为他在中国学习过两年。', 'Tiếng Hán của anh ấy rất giỏi, vì anh ấy từng học ở Trung Quốc hai năm.'],
      ['B', '太好了，我们可以用汉语聊天。', 'Tuyệt quá, chúng ta có thể trò chuyện bằng tiếng Hán.'],
    ],
    qs: [
      { q: ['那个朋友是谁？', 'Người bạn đó là ai?'], o: [['男的的同事', 'Đồng nghiệp của người nam'], ['女的的老师', 'Giáo viên của người nữ'], ['男的的哥哥', 'Anh trai của người nam']], a: 0 },
      { q: ['他的汉语为什么很好？', 'Vì sao tiếng Hán của anh ấy giỏi?'], o: [['在中国学习过', 'Từng học ở Trung Quốc'], ['在家学的', 'Học ở nhà'], ['是中国人', 'Là người Trung Quốc']], a: 0 },
    ],
  },
  {
    id: 'intro-self', level: 2, topic: intro, tags: ['tự giới thiệu', 'lớp học', 'sở thích'],
    words: [['爱好', 'sở thích', 'danh từ'], ['足球', 'bóng đá', 'danh từ']],
    title: 'Tự giới thiệu trước lớp', situation: 'Buổi học đầu tiên',
    who: { A: 'Giáo viên', B: 'Học sinh' }, cast: { A: A('f', 2), B: A('m', 3) },
    lines: [
      ['A', '同学们好，请你先介绍一下自己。', 'Chào các bạn, mời em giới thiệu một chút về bản thân.'],
      ['B', '大家好，我叫阮明，今年十九岁，是越南人。', 'Chào mọi người, em tên Nguyễn Minh, năm nay mười chín tuổi, là người Việt Nam.'],
      ['B', '我现在在北京学习汉语，已经学了半年。', 'Hiện giờ em đang học tiếng Hán ở Bắc Kinh, đã học được nửa năm.'],
      ['A', '你有什么爱好？', 'Em có sở thích gì?'],
      ['B', '我喜欢唱歌，也喜欢踢足球。', 'Em thích hát, cũng thích đá bóng.'],
      ['A', '很好，欢迎你！', 'Rất tốt, chào mừng em!'],
    ],
    qs: [
      { q: ['他学汉语学了多长时间？', 'Cậu ấy đã học tiếng Hán được bao lâu?'], o: [['半年', 'Nửa năm'], ['两年', 'Hai năm'], ['三个月', 'Ba tháng']], a: 0 },
      { q: ['他的爱好是什么？', 'Sở thích của cậu ấy là gì?'], o: [['唱歌和踢足球', 'Hát và đá bóng'], ['看书', 'Đọc sách'], ['游泳', 'Bơi lội']], a: 0 },
    ],
  },
  {
    id: 'intro-plan', level: 2, topic: intro, tags: ['ước mơ', 'kế hoạch', 'học tiếng Hán'], words: [],
    title: 'Sau này bạn muốn làm gì?', situation: 'Nói về dự định',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('m', 1), B: A('f', 2) },
    lines: [
      ['A', '你以后想做什么工作？', 'Sau này bạn muốn làm nghề gì?'],
      ['B', '我想当老师，因为我喜欢和孩子们在一起。', 'Mình muốn làm giáo viên, vì mình thích ở cùng bọn trẻ.'],
      ['A', '那你为什么学汉语？', 'Vậy sao bạn lại học tiếng Hán?'],
      ['B', '因为我想去中国玩，也想认识很多中国朋友。', 'Vì mình muốn đến Trung Quốc chơi, cũng muốn làm quen nhiều bạn Trung Quốc.'],
      ['A', '我觉得你一定能做到。', 'Mình thấy bạn nhất định sẽ làm được.'],
    ],
    qs: [
      { q: ['女的想做什么工作？', 'Người nữ muốn làm nghề gì?'], o: [['老师', 'Giáo viên'], ['医生', 'Bác sĩ'], ['学生', 'Học sinh']], a: 0 },
      { q: ['她为什么学汉语？', 'Vì sao cô ấy học tiếng Hán?'], o: [['想去中国玩', 'Muốn đến Trung Quốc chơi'], ['工作需要', 'Do công việc cần'], ['家人要她学', 'Gia đình bảo học']], a: 0 },
    ],
  },
  {
    id: 'intro-city', level: 2, topic: intro, tags: ['thành phố mới', 'nhớ nhà'], words: [['习惯', 'quen', 'động từ']],
    title: 'Sống ở thành phố mới', situation: 'Trò chuyện với người bạn mới',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('f', 3), B: A('m', 2) },
    lines: [
      ['A', '你来这个城市多长时间了？', 'Bạn đến thành phố này được bao lâu rồi?'],
      ['B', '快一年了。', 'Sắp được một năm rồi.'],
      ['A', '习惯这里的生活吗？', 'Bạn quen với cuộc sống ở đây chưa?'],
      ['B', '习惯了，只是天气有点儿冷。', 'Quen rồi, chỉ là thời tiết hơi lạnh.'],
      ['A', '你想家吗？', 'Bạn có nhớ nhà không?'],
      ['B', '有时候想，我常常给妈妈打电话。', 'Đôi lúc nhớ, mình thường gọi điện cho mẹ.'],
    ],
    qs: [
      { q: ['他来这个城市多久了？', 'Anh ấy đến thành phố này được bao lâu?'], o: [['快一年', 'Sắp một năm'], ['一个月', 'Một tháng'], ['三年', 'Ba năm']], a: 0 },
      { q: ['他觉得这里怎么样？', 'Anh ấy thấy nơi này thế nào?'], o: [['天气有点儿冷', 'Thời tiết hơi lạnh'], ['太热了', 'Quá nóng'], ['人太多', 'Quá đông người']], a: 0 },
    ],
  },

  // ───────────── Công việc · chủ đề mới của HSK 2 (khóa với người đang ở HSK 1) ─────────────
  {
    id: 'work-time', level: 2, topic: work, tags: ['giờ làm', 'đi làm', 'nghỉ trưa'],
    words: [['上班', 'đi làm', 'động từ'], ['下班', 'tan làm', 'động từ'], ['午饭', 'bữa trưa', 'danh từ']],
    title: 'Giờ đi làm', situation: 'Hỏi giờ làm việc',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: A('f', 2), B: A('m', 3) },
    lines: [
      ['A', '你每天几点上班？', 'Mỗi ngày bạn mấy giờ đi làm?'],
      ['B', '早上八点上班，下午五点下班。', 'Tám giờ sáng đi làm, năm giờ chiều tan làm.'],
      ['A', '中午可以休息吗？', 'Buổi trưa có được nghỉ không?'],
      ['B', '可以，休息一个小时。', 'Được, nghỉ một tiếng.'],
      ['A', '你一般在哪儿吃午饭？', 'Bạn thường ăn trưa ở đâu?'],
      ['B', '在公司旁边的饭店。', 'Ở nhà hàng bên cạnh công ty.'],
    ],
    qs: [
      { q: ['他几点下班？', 'Anh ấy mấy giờ tan làm?'], o: [['下午五点', 'Năm giờ chiều'], ['早上八点', 'Tám giờ sáng'], ['晚上七点', 'Bảy giờ tối']], a: 0 },
      { q: ['中午他休息多长时间？', 'Buổi trưa anh ấy nghỉ bao lâu?'], o: [['一个小时', 'Một tiếng'], ['半个小时', 'Nửa tiếng'], ['两个小时', 'Hai tiếng']], a: 0 },
    ],
  },
  {
    id: 'work-colleague', level: 2, topic: work, tags: ['đồng nghiệp mới', 'chỗ ngồi'],
    words: [['同事', 'đồng nghiệp', 'danh từ'], ['帮忙', 'giúp đỡ', 'động từ']],
    title: 'Đồng nghiệp mới', situation: 'Ngày đầu đi làm',
    who: { A: 'Chị Trương', B: 'Người mới' }, cast: { A: A('f', 2), B: A('m', 2) },
    lines: [
      ['A', '大家好，这是我们新来的同事。', 'Chào mọi người, đây là đồng nghiệp mới của chúng ta.'],
      ['B', '你们好，我叫小张，以后请多帮忙。', 'Chào mọi người, tôi tên Tiểu Trương, sau này nhờ mọi người giúp đỡ nhiều.'],
      ['A', '别客气，有问题就问我。', 'Đừng khách sáo, có vấn đề cứ hỏi tôi.'],
      ['B', '谢谢，我坐哪儿？', 'Cảm ơn, tôi ngồi ở đâu?'],
      ['A', '你的桌子在窗户旁边。', 'Bàn của bạn ở cạnh cửa sổ.'],
    ],
    qs: [
      { q: ['男的是谁？', 'Người nam là ai?'], o: [['新同事', 'Đồng nghiệp mới'], ['老师', 'Giáo viên'], ['经理', 'Quản lý']], a: 0 },
      { q: ['他的桌子在哪儿？', 'Bàn của anh ấy ở đâu?'], o: [['窗户旁边', 'Cạnh cửa sổ'], ['门口', 'Cửa ra vào'], ['经理旁边', 'Cạnh quản lý']], a: 0 },
    ],
  },
  {
    id: 'work-meeting', level: 2, topic: work, tags: ['họp', 'báo cáo', 'chuẩn bị'],
    words: [['开会', 'họp', 'động từ'], ['报告', 'báo cáo', 'danh từ'], ['电脑', 'máy tính', 'danh từ']],
    title: 'Chiều nay họp', situation: 'Nhắc nhau về cuộc họp',
    who: { A: 'Đồng nghiệp A', B: 'Đồng nghiệp B' }, cast: { A: A('m', 2), B: A('f', 3) },
    lines: [
      ['A', '下午三点开会，别忘了。', 'Ba giờ chiều họp, đừng quên nhé.'],
      ['B', '在哪个房间？', 'Họp ở phòng nào?'],
      ['A', '在二楼。', 'Ở tầng hai.'],
      ['B', '要带电脑吗？', 'Có cần mang máy tính không?'],
      ['A', '要，还要带昨天的报告。', 'Cần, còn phải mang báo cáo hôm qua nữa.'],
      ['B', '好，我马上去准备。', 'Được, mình đi chuẩn bị ngay.'],
    ],
    qs: [
      { q: ['会议几点开始？', 'Cuộc họp bắt đầu lúc mấy giờ?'], o: [['下午三点', 'Ba giờ chiều'], ['上午九点', 'Chín giờ sáng'], ['下午五点', 'Năm giờ chiều']], a: 0 },
      { q: ['女的要带什么？', 'Người nữ cần mang gì?'], o: [['电脑和报告', 'Máy tính và báo cáo'], ['只带电脑', 'Chỉ mang máy tính'], ['什么都不带', 'Không mang gì']], a: 0 },
    ],
  },
  {
    id: 'work-phone', level: 2, topic: work, tags: ['điện thoại', 'tìm người', 'quản lý'],
    words: [['经理', 'quản lý, giám đốc', 'danh từ'], ['分钟', 'phút', 'lượng từ']],
    title: 'Gọi điện tìm người', situation: 'Gọi điện đến công ty',
    who: { A: 'Người gọi', B: 'Lễ tân' }, cast: { A: A('m', 1), B: A('f', 3) },
    lines: [
      ['A', '喂，请问王经理在吗？', 'A lô, cho hỏi giám đốc Vương có ở đó không?'],
      ['B', '他正在开会，请问你是哪位？', 'Ông ấy đang họp, xin hỏi bạn là ai ạ?'],
      ['A', '我是新华公司的小李。', 'Tôi là Tiểu Lý của công ty Tân Hoa.'],
      ['B', '他还要二十分钟才能开完。', 'Ông ấy còn hai mươi phút nữa mới họp xong.'],
      ['A', '那我十分钟后再打电话。', 'Vậy mười phút nữa tôi gọi lại.'],
      ['B', '好的，再见。', 'Vâng, tạm biệt.'],
    ],
    qs: [
      { q: ['王经理现在在做什么？', 'Giám đốc Vương lúc này đang làm gì?'], o: [['开会', 'Họp'], ['吃饭', 'Ăn cơm'], ['休息', 'Nghỉ ngơi']], a: 0 },
      { q: ['男的打算怎么办？', 'Người nam định làm gì?'], o: [['十分钟后再打', 'Mười phút nữa gọi lại'], ['明天再来', 'Mai quay lại'], ['在这儿等', 'Chờ ở đây']], a: 0 },
    ],
  },
  {
    id: 'work-leave', level: 2, topic: work, tags: ['xin nghỉ', 'ốm', 'bệnh viện'],
    words: [['请假', 'xin nghỉ', 'động từ'], ['舒服', 'dễ chịu, khỏe', 'tính từ']],
    title: 'Xin nghỉ một ngày', situation: 'Nhân viên xin nghỉ với quản lý',
    who: { A: 'Nhân viên', B: 'Quản lý' }, cast: { A: A('f', 3), B: A('m', 1) },
    lines: [
      ['A', '经理，我明天想请一天假。', 'Thưa quản lý, ngày mai em muốn xin nghỉ một ngày.'],
      ['B', '怎么了？', 'Có chuyện gì vậy?'],
      ['A', '我身体不太舒服，想去医院看看。', 'Em thấy trong người không khỏe lắm, muốn đến bệnh viện khám.'],
      ['B', '好，身体最重要。你的工作有人帮你吗？', 'Được, sức khỏe là quan trọng nhất. Công việc của em có ai giúp không?'],
      ['A', '小张会帮我，我已经告诉他了。', 'Tiểu Trương sẽ giúp em, em đã báo cho cậu ấy rồi.'],
      ['B', '那就好，早点儿好起来。', 'Vậy thì tốt, chóng khỏe lại nhé.'],
    ],
    qs: [
      { q: ['她为什么要请假？', 'Vì sao cô ấy xin nghỉ?'], o: [['身体不舒服', 'Trong người không khỏe'], ['要出去玩', 'Muốn đi chơi'], ['家里有事', 'Nhà có việc']], a: 0 },
      { q: ['谁会帮她工作？', 'Ai sẽ làm giúp cô ấy?'], o: [['小张', 'Tiểu Trương'], ['经理', 'Quản lý'], ['没有人', 'Không ai']], a: 0 },
    ],
  },
  {
    id: 'work-late', level: 2, topic: work, tags: ['làm muộn', 'tan làm', 'báo cáo'],
    words: [['下班', 'tan làm', 'động từ'], ['累', 'mệt', 'tính từ']],
    title: 'Hôm nay về muộn', situation: 'Hai đồng nghiệp cuối giờ',
    who: { A: 'Đồng nghiệp A', B: 'Đồng nghiệp B' }, cast: { A: A('m', 3), B: A('f', 2) },
    lines: [
      ['A', '今天又要晚点儿下班吗？', 'Hôm nay lại phải tan làm muộn à?'],
      ['B', '对，有一个报告明天要交。', 'Đúng, có một bản báo cáo mai phải nộp.'],
      ['A', '要我帮你吗？', 'Cần mình giúp không?'],
      ['B', '不用，谢谢。你先回家吧。', 'Không cần, cảm ơn. Bạn về nhà trước đi.'],
      ['A', '那我走了，别太累。', 'Vậy mình đi nhé, đừng làm mệt quá.'],
      ['B', '好，再见。', 'Ừ, tạm biệt.'],
    ],
    qs: [
      { q: ['女的为什么晚下班？', 'Vì sao người nữ tan làm muộn?'], o: [['明天要交报告', 'Mai phải nộp báo cáo'], ['要开会', 'Phải họp'], ['想多工作', 'Muốn làm thêm']], a: 0 },
      { q: ['男的要做什么？', 'Người nam sẽ làm gì?'], o: [['先回家', 'Về nhà trước'], ['帮她工作', 'Giúp cô ấy làm'], ['去开会', 'Đi họp']], a: 0 },
    ],
  },
];

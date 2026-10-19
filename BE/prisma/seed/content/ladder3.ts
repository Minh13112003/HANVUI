// Hội thoại HSK 3 (HSK 2.0 cấp 3), soạn 20/10/2026, CHƯA QUA DUYỆT. 4 chủ đề × 4 bài; khóa tới khi người học lên HSK 3.
// Pinyin sinh bằng pinyin-pro lúc nạp (seed-ladder.ts).
import type { Ladder } from './ladder.js';

const M = (r: 1 | 2 | 3) => ({ g: 'm' as const, r });
const F = (r: 1 | 2 | 3) => ({ g: 'f' as const, r });

export const TOPIC_GLYPH_LADDER3: Record<string, string> = {
  'Học tập và thi cử': '考',
  'Thể thao và rèn luyện': '动',
  'Khách sạn và hành lý': '旅',
  'Mùa và lễ hội': '季',
};

const study = 'Học tập và thi cử';
const sport = 'Thể thao và rèn luyện';
const hotel = 'Khách sạn và hành lý';
const season = 'Mùa và lễ hội';

export const LADDER3: Ladder[] = [
  // ───────────── Học tập và thi cử ─────────────
  {
    id: 'study-score', level: 3, topic: study, tags: ['điểm thi', 'thi cử', 'ôn tập'], words: [],
    title: 'Hỏi điểm thi', situation: 'Hai bạn học gặp nhau sau kỳ thi',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: F(3), B: M(2) },
    lines: [
      ['A', '考试的成绩出来了吗？', 'Điểm thi đã có chưa?'],
      ['B', '出来了，我数学考了八十五分。', 'Có rồi, môn toán mình được tám mươi lăm điểm.'],
      ['A', '真不错！你一定复习得很认真。', 'Giỏi quá! Bạn chắc đã ôn bài rất nghiêm túc.'],
      ['B', '是的，考试以前我每天都在图书馆学习。', 'Đúng vậy, trước kỳ thi ngày nào mình cũng học ở thư viện.'],
      ['A', '我只考了六十五分，我很难过。', 'Mình chỉ được sáu mươi lăm điểm, mình rất buồn.'],
      ['B', '别难过，下次努力就可以提高成绩。', 'Đừng buồn, lần sau cố gắng là nâng cao được điểm.'],
      ['A', '你能教我怎么复习吗？', 'Bạn dạy mình cách ôn tập được không?'],
      ['B', '当然可以，我们明天一起去图书馆吧。', 'Tất nhiên được, ngày mai chúng ta cùng đến thư viện nhé.'],
    ],
    qs: [
      { q: ['男的数学考了多少分？', 'Người nam được bao nhiêu điểm môn toán?'], o: [['八十五分', '85 điểm'], ['六十五分', '65 điểm'], ['九十分', '90 điểm']], a: 0 },
      { q: ['女的为什么难过？', 'Vì sao người nữ buồn?'], o: [['成绩不好', 'Điểm không tốt'], ['忘了考试', 'Quên kỳ thi'], ['生病了', 'Bị ốm']], a: 0 },
      { q: ['他们明天打算做什么？', 'Ngày mai họ định làm gì?'], o: [['去图书馆', 'Đến thư viện'], ['去看电影', 'Đi xem phim'], ['去爬山', 'Đi leo núi']], a: 0 },
    ],
  },
  {
    id: 'study-library', level: 3, topic: study, tags: ['thư viện', 'mượn sách', 'từ điển'], words: [],
    title: 'Ở thư viện', situation: 'Sinh viên hỏi nhân viên thư viện',
    who: { A: 'Sinh viên', B: 'Thủ thư' }, cast: { A: M(3), B: F(2) },
    lines: [
      ['A', '你好，我想借一本汉语字典。', 'Chào chị, em muốn mượn một cuốn từ điển tiếng Hán.'],
      ['B', '字典在二层，你可以坐电梯上去。', 'Từ điển ở tầng hai, em có thể đi thang máy lên.'],
      ['A', '我找了很久，还是没有找到。', 'Em tìm lâu lắm rồi mà vẫn không thấy.'],
      ['B', '让我看一下……这本书已经被别人借走了。', 'Để chị xem… cuốn này đã bị người khác mượn rồi.'],
      ['A', '那什么时候可以还回来？', 'Vậy khi nào có thể trả lại ạ?'],
      ['B', '下个星期一。你可以先看看别的字典。', 'Thứ hai tuần sau. Em có thể xem thử các từ điển khác trước.'],
      ['A', '好的，谢谢你。这里的环境真安静。', 'Vâng, cảm ơn chị. Môi trường ở đây thật yên tĩnh.'],
      ['B', '是啊，请你记得小声说话。', 'Đúng vậy, nhớ nói nhỏ tiếng nhé.'],
    ],
    qs: [
      { q: ['男的想借什么？', 'Người nam muốn mượn gì?'], o: [['汉语字典', 'Từ điển tiếng Hán'], ['历史书', 'Sách lịch sử'], ['数学书', 'Sách toán']], a: 0 },
      { q: ['为什么没有找到？', 'Vì sao không tìm thấy?'], o: [['被别人借走了', 'Bị người khác mượn'], ['放在三层', 'Để ở tầng ba'], ['图书馆没有', 'Thư viện không có']], a: 0 },
      { q: ['书什么时候可以还回来？', 'Khi nào sách có thể trả lại?'], o: [['下个星期一', 'Thứ hai tuần sau'], ['明天', 'Ngày mai'], ['这个星期五', 'Thứ sáu tuần này']], a: 0 },
    ],
  },
  {
    id: 'study-math', level: 3, topic: study, tags: ['bài tập', 'giảng bài', 'toán'], words: [],
    title: 'Nhờ bạn giảng bài', situation: 'Làm bài tập toán buổi tối',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: M(2), B: F(3) },
    lines: [
      ['A', '这个数学题太难了，我做了半个小时也没做完。', 'Bài toán này khó quá, mình làm nửa tiếng vẫn chưa xong.'],
      ['B', '给我看看……其实这个问题很简单。', 'Cho mình xem… thật ra câu này rất đơn giản.'],
      ['A', '真的吗？你是怎么想的？', 'Thật sao? Bạn nghĩ thế nào?'],
      ['B', '你先把已经知道的写下来，然后再找办法。', 'Bạn hãy viết ra những điều đã biết trước, sau đó mới tìm cách.'],
      ['A', '原来是这样！我以为一定要用很难的方法。', 'Thì ra là vậy! Mình tưởng nhất định phải dùng cách rất khó.'],
      ['B', '很多题看起来难，其实并不难。', 'Nhiều bài trông có vẻ khó, thật ra không khó.'],
      ['A', '谢谢你，我终于解决了这个问题。', 'Cảm ơn bạn, cuối cùng mình đã giải quyết được bài này.'],
      ['B', '不客气，明天的考试我们一起复习吧。', 'Đừng khách sáo, kỳ thi ngày mai chúng ta cùng ôn nhé.'],
    ],
    qs: [
      { q: ['男的遇到了什么问题？', 'Người nam gặp vấn đề gì?'], o: [['数学题很难', 'Bài toán khó'], ['忘记带书', 'Quên mang sách'], ['听不懂老师', 'Nghe không hiểu thầy']], a: 0 },
      { q: ['女的让他先做什么？', 'Người nữ bảo anh ấy làm gì trước?'], o: [['写下已经知道的', 'Viết ra điều đã biết'], ['问老师', 'Hỏi thầy'], ['看答案', 'Xem đáp án']], a: 0 },
    ],
  },
  {
    id: 'study-choice', level: 3, topic: study, tags: ['chọn ngành', 'dự định', 'tương lai'], words: [],
    title: 'Chọn ngành học', situation: 'Nói chuyện với cô giáo về dự định',
    who: { A: 'Học sinh', B: 'Cô giáo' }, cast: { A: F(3), B: F(1) },
    lines: [
      ['A', '老师，我马上要毕业了，不知道应该选择什么专业。', 'Thưa cô, em sắp tốt nghiệp rồi mà không biết nên chọn ngành nào.'],
      ['B', '你对什么最有兴趣？', 'Em hứng thú nhất với điều gì?'],
      ['A', '我喜欢历史，也喜欢学习不同国家的文化。', 'Em thích lịch sử, cũng thích tìm hiểu văn hóa của các nước khác nhau.'],
      ['B', '那你可以考虑学习汉语或者历史。', 'Vậy em có thể cân nhắc học tiếng Hán hoặc lịch sử.'],
      ['A', '可是我父母希望我学数学。', 'Nhưng bố mẹ em lại mong em học toán.'],
      ['B', '你应该告诉他们你自己的想法。', 'Em nên nói cho họ biết suy nghĩ của chính em.'],
      ['A', '他们会同意吗？', 'Họ sẽ đồng ý không ạ?'],
      ['B', '只要你认真解释，他们一定会了解你的。', 'Chỉ cần em giải thích nghiêm túc, họ nhất định sẽ hiểu em.'],
    ],
    qs: [
      { q: ['女学生对什么有兴趣？', 'Nữ sinh có hứng thú với điều gì?'], o: [['历史和文化', 'Lịch sử và văn hóa'], ['数学', 'Toán'], ['体育', 'Thể thao']], a: 0 },
      { q: ['她的父母希望她学什么？', 'Bố mẹ cô ấy mong cô học gì?'], o: [['数学', 'Toán'], ['汉语', 'Tiếng Hán'], ['历史', 'Lịch sử']], a: 0 },
      { q: ['老师建议她怎么做？', 'Cô giáo khuyên cô ấy làm gì?'], o: [['告诉父母自己的想法', 'Nói với bố mẹ suy nghĩ của mình'], ['听父母的话', 'Nghe lời bố mẹ'], ['以后再决定', 'Quyết định sau']], a: 0 },
    ],
  },

  // ───────────── Thể thao và rèn luyện ─────────────
  {
    id: 'sport-run', level: 3, topic: sport, tags: ['chạy bộ', 'tập thể dục', 'sức khỏe'], words: [],
    title: 'Chạy bộ mỗi sáng', situation: 'Hai người hàng xóm gặp nhau ở công viên',
    who: { A: 'Anh Vương', B: 'Chị Lý' }, cast: { A: M(1), B: F(2) },
    lines: [
      ['A', '早上好！你经常来这里跑步吗？', 'Chào buổi sáng! Chị thường đến đây chạy bộ à?'],
      ['B', '对，我每天早上六点都来锻炼。', 'Đúng, sáu giờ sáng nào tôi cũng đến tập.'],
      ['A', '你跑多长时间？', 'Chị chạy bao lâu?'],
      ['B', '大概四十分钟。以前我很胖，现在好多了。', 'Khoảng bốn mươi phút. Trước đây tôi rất béo, bây giờ đỡ nhiều rồi.'],
      ['A', '难怪你看起来这么健康。', 'Thảo nào trông chị khỏe mạnh như vậy.'],
      ['B', '你也应该多锻炼，对身体很好。', 'Anh cũng nên tập nhiều hơn, rất tốt cho cơ thể.'],
      ['A', '我工作太忙，总是没有时间。', 'Công việc tôi bận quá, lúc nào cũng không có thời gian.'],
      ['B', '时间是挤出来的，明天我们一起跑吧。', 'Thời gian là do mình dành ra, ngày mai chúng ta cùng chạy nhé.'],
    ],
    qs: [
      { q: ['女的每天几点来锻炼？', 'Người nữ mấy giờ mỗi ngày đến tập?'], o: [['六点', 'Sáu giờ'], ['七点', 'Bảy giờ'], ['五点', 'Năm giờ']], a: 0 },
      { q: ['男的为什么不锻炼？', 'Vì sao người nam không tập?'], o: [['工作太忙', 'Công việc quá bận'], ['身体不好', 'Sức khỏe không tốt'], ['不喜欢', 'Không thích']], a: 0 },
    ],
  },
  {
    id: 'sport-mountain', level: 3, topic: sport, tags: ['leo núi', 'cuối tuần', 'kế hoạch'], words: [],
    title: 'Cuối tuần đi leo núi', situation: 'Rủ nhau đi chơi',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: F(3), B: M(2) },
    lines: [
      ['A', '这个周末天气很好，我们去爬山怎么样？', 'Cuối tuần này thời tiết đẹp, chúng ta đi leo núi nhé?'],
      ['B', '好主意！我已经很久没有爬山了。', 'Ý hay đấy! Mình đã lâu lắm rồi không leo núi.'],
      ['A', '我们早上七点出发，这样可以避开太阳。', 'Chúng ta bảy giờ sáng xuất phát, như vậy tránh được nắng.'],
      ['B', '要带什么东西？', 'Cần mang theo những gì?'],
      ['A', '带一些水和吃的，还有帽子和一双舒服的鞋。', 'Mang ít nước và đồ ăn, còn có mũ và một đôi giày thoải mái.'],
      ['B', '我也想带照相机，山上的风景一定很美。', 'Mình cũng muốn mang máy ảnh, phong cảnh trên núi chắc chắn rất đẹp.'],
      ['A', '别忘了，下午可能会刮风，要多穿一件衣服。', 'Đừng quên, chiều có thể có gió, nên mặc thêm một cái áo.'],
      ['B', '放心吧，我会准备好的。', 'Yên tâm đi, mình sẽ chuẩn bị xong.'],
    ],
    qs: [
      { q: ['他们几点出发？', 'Họ xuất phát lúc mấy giờ?'], o: [['早上七点', 'Bảy giờ sáng'], ['中午十二点', 'Mười hai giờ trưa'], ['下午两点', 'Hai giờ chiều']], a: 0 },
      { q: ['男的还想带什么？', 'Người nam còn muốn mang gì?'], o: [['照相机', 'Máy ảnh'], ['电脑', 'Máy tính'], ['雨伞', 'Ô']], a: 0 },
      { q: ['为什么要多穿一件衣服？', 'Vì sao nên mặc thêm áo?'], o: [['下午可能刮风', 'Chiều có thể có gió'], ['山上下雪', 'Trên núi có tuyết'], ['晚上很冷', 'Buổi tối rất lạnh']], a: 0 },
    ],
  },
  {
    id: 'sport-sick', level: 3, topic: sport, tags: ['ốm', 'đau đầu', 'chăm sóc'], words: [],
    title: 'Chăm sóc người ốm', situation: 'Hai đồng nghiệp nói chuyện',
    who: { A: 'Đồng nghiệp A', B: 'Đồng nghiệp B' }, cast: { A: M(2), B: F(2) },
    lines: [
      ['A', '你今天脸色不太好，怎么了？', 'Hôm nay sắc mặt bạn không tốt lắm, sao vậy?'],
      ['B', '我昨天晚上头疼，一晚上都没睡好。', 'Tối qua mình bị đau đầu, cả đêm không ngủ ngon.'],
      ['A', '你应该去医院检查一下。', 'Bạn nên đến bệnh viện kiểm tra một chút.'],
      ['B', '我怕医生说我要住院，工作还有很多没完成。', 'Mình sợ bác sĩ bảo phải nằm viện, mà công việc còn nhiều chưa xong.'],
      ['A', '身体最重要，工作我可以帮你做。', 'Sức khỏe quan trọng nhất, công việc mình có thể làm giúp bạn.'],
      ['B', '那太谢谢你了，你真关心我。', 'Vậy cảm ơn bạn nhiều lắm, bạn thật quan tâm mình.'],
      ['A', '别客气。看完病以后好好休息，多喝水。', 'Đừng khách sáo. Khám xong nhớ nghỉ ngơi, uống nhiều nước.'],
    ],
    qs: [
      { q: ['女的怎么了？', 'Người nữ bị sao?'], o: [['头疼', 'Đau đầu'], ['腿疼', 'Đau chân'], ['太饿', 'Quá đói']], a: 0 },
      { q: ['男的愿意帮她做什么？', 'Người nam sẵn lòng giúp cô ấy làm gì?'], o: [['做她的工作', 'Làm công việc của cô'], ['送她回家', 'Đưa cô về nhà'], ['买药', 'Mua thuốc']], a: 0 },
    ],
  },
  {
    id: 'sport-match', level: 3, topic: sport, tags: ['thi đấu', 'bóng đá', 'tiết thể dục'], words: [],
    title: 'Trận đấu của lớp', situation: 'Sau giờ thể dục ở trường',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: M(3), B: M(1) },
    lines: [
      ['A', '今天的体育比赛你们班赢了吗？', 'Hôm nay trận thi đấu thể thao lớp các cậu thắng không?'],
      ['B', '赢了，三比二，最后一分钟我们才进球。', 'Thắng rồi, ba hai, phút cuối chúng tớ mới ghi bàn.'],
      ['A', '太棒了！是谁进的球？', 'Tuyệt quá! Ai là người ghi bàn?'],
      ['B', '是我们的新同学，他踢得非常好。', 'Là bạn học mới của lớp tớ, cậu ấy đá rất giỏi.'],
      ['A', '我们班下个星期也要比赛，我有点儿担心。', 'Lớp tớ tuần sau cũng thi đấu, tớ hơi lo.'],
      ['B', '别担心，你们每天都在努力练习，一定没问题。', 'Đừng lo, các cậu ngày nào cũng cố gắng luyện tập, chắc chắn không sao.'],
    ],
    qs: [
      { q: ['比赛的结果是多少？', 'Kết quả trận đấu là bao nhiêu?'], o: [['三比二', '3-2'], ['二比三', '2-3'], ['一比一', '1-1']], a: 0 },
      { q: ['谁进了最后一个球？', 'Ai ghi bàn cuối cùng?'], o: [['新同学', 'Bạn học mới'], ['老师', 'Giáo viên'], ['男的', 'Người nam']], a: 0 },
    ],
  },

  // ───────────── Khách sạn và hành lý ─────────────
  {
    id: 'hotel-book', level: 3, topic: hotel, tags: ['đặt phòng', 'khách sạn', 'nhận phòng'], words: [],
    title: 'Đặt phòng khách sạn', situation: 'Gọi điện cho lễ tân',
    who: { A: 'Khách', B: 'Lễ tân' }, cast: { A: M(2), B: F(3) },
    lines: [
      ['A', '你好，我想订一个房间，住三天。', 'Xin chào, tôi muốn đặt một phòng, ở ba ngày.'],
      ['B', '请问你们几个人？要大床还是两张小床？', 'Xin hỏi quý khách đi mấy người? Cần giường lớn hay hai giường nhỏ?'],
      ['A', '我和妻子两个人，要一张大床。', 'Tôi và vợ hai người, cần một giường lớn.'],
      ['B', '可以。房间在八层，有电梯，离火车站很近。', 'Được ạ. Phòng ở tầng tám, có thang máy, rất gần ga tàu.'],
      ['A', '价格是多少？早饭包括吗？', 'Giá bao nhiêu? Có bao gồm bữa sáng không?'],
      ['B', '一晚三百块，包括早饭。', 'Một đêm ba trăm đồng, đã bao gồm bữa sáng.'],
      ['A', '很好，我们后天下午到。', 'Tốt quá, chiều ngày kia chúng tôi đến.'],
      ['B', '好的，我们会等你们的。', 'Vâng, chúng tôi sẽ đợi quý khách.'],
    ],
    qs: [
      { q: ['他们打算住几天？', 'Họ định ở mấy ngày?'], o: [['三天', 'Ba ngày'], ['两天', 'Hai ngày'], ['一个星期', 'Một tuần']], a: 0 },
      { q: ['房间在几层？', 'Phòng ở tầng mấy?'], o: [['八层', 'Tầng tám'], ['三层', 'Tầng ba'], ['十层', 'Tầng mười']], a: 0 },
      { q: ['价格包括什么？', 'Giá bao gồm gì?'], o: [['早饭', 'Bữa sáng'], ['晚饭', 'Bữa tối'], ['车票', 'Vé xe']], a: 0 },
    ],
  },
  {
    id: 'hotel-luggage', level: 3, topic: hotel, tags: ['hành lý', 'va-li', 'sân bay'], words: [],
    title: 'Tìm va-li bị lạc', situation: 'Ở quầy sân bay',
    who: { A: 'Hành khách', B: 'Nhân viên' }, cast: { A: F(3), B: M(1) },
    lines: [
      ['A', '你好，我的行李箱没有出来，你能帮我找一下吗？', 'Xin chào, va-li của tôi chưa ra, anh giúp tôi tìm được không?'],
      ['B', '请告诉我你的航班号，还有行李箱的样子。', 'Xin cho tôi biết số hiệu chuyến bay và hình dáng chiếc va-li.'],
      ['A', '我坐的是三点到的飞机，行李箱是黑色的，上面有一只熊猫。', 'Tôi đi chuyến bay đến lúc ba giờ, va-li màu đen, phía trên có hình một chú gấu trúc.'],
      ['B', '请稍等……找到了，它被送到别的地方去了。', 'Xin đợi một chút… tìm thấy rồi, nó bị chuyển nhầm sang nơi khác.'],
      ['A', '真的吗？那我什么时候能拿到？', 'Thật sao? Vậy khi nào tôi lấy được?'],
      ['B', '晚上八点以前我们会送到你住的宾馆。', 'Trước tám giờ tối chúng tôi sẽ đưa đến khách sạn nơi chị ở.'],
      ['A', '太好了，我放心了。谢谢你。', 'Tốt quá, tôi yên tâm rồi. Cảm ơn anh.'],
    ],
    qs: [
      { q: ['女的的行李箱是什么颜色的？', 'Va-li của người nữ màu gì?'], o: [['黑色', 'Màu đen'], ['红色', 'Màu đỏ'], ['白色', 'Màu trắng']], a: 0 },
      { q: ['行李箱现在在哪儿？', 'Hiện giờ va-li ở đâu?'], o: [['送到别的地方了', 'Bị chuyển sang nơi khác'], ['在宾馆', 'Ở khách sạn'], ['丢了', 'Bị mất']], a: 0 },
      { q: ['他们会把行李箱送到哪里？', 'Họ sẽ đưa va-li đến đâu?'], o: [['宾馆', 'Khách sạn'], ['机场', 'Sân bay'], ['她家', 'Nhà cô ấy']], a: 0 },
    ],
  },
  {
    id: 'hotel-road', level: 3, topic: hotel, tags: ['hỏi đường', 'đi qua', 'phố'], words: [],
    title: 'Hỏi đường đến bảo tàng', situation: 'Du khách hỏi người đi đường',
    who: { A: 'Du khách', B: 'Người đi đường' }, cast: { A: M(3), B: F(2) },
    lines: [
      ['A', '请问，去历史博物馆怎么走？', 'Xin hỏi, đến bảo tàng lịch sử đi thế nào?'],
      ['B', '你一直往前走，经过一个大花园就到了。', 'Anh cứ đi thẳng, đi qua một khu vườn hoa lớn là đến.'],
      ['A', '远吗？我走路去可以吗？', 'Có xa không? Tôi đi bộ có được không?'],
      ['B', '不太远，走路大概二十分钟，骑自行车更快。', 'Không xa lắm, đi bộ khoảng hai mươi phút, đi xe đạp thì nhanh hơn.'],
      ['A', '这条街道的名字是什么？', 'Con phố này tên là gì?'],
      ['B', '叫中山路。博物馆就在街道中间的右边。', 'Tên là đường Trung Sơn. Bảo tàng nằm ở giữa phố, bên tay phải.'],
      ['A', '谢谢你，你真热情。', 'Cảm ơn chị, chị thật nhiệt tình.'],
    ],
    qs: [
      { q: ['男的想去哪儿？', 'Người nam muốn đi đâu?'], o: [['历史博物馆', 'Bảo tàng lịch sử'], ['图书馆', 'Thư viện'], ['火车站', 'Ga tàu']], a: 0 },
      { q: ['走路去大概多长时间？', 'Đi bộ khoảng bao lâu?'], o: [['二十分钟', 'Hai mươi phút'], ['两个小时', 'Hai tiếng'], ['五分钟', 'Năm phút']], a: 0 },
    ],
  },
  {
    id: 'hotel-photo', level: 3, topic: hotel, tags: ['chụp ảnh', 'máy ảnh', 'du lịch'], words: [],
    title: 'Nhờ chụp giúp một tấm ảnh', situation: 'Hai du khách ở danh thắng',
    who: { A: 'Du khách A', B: 'Du khách B' }, cast: { A: F(2), B: M(2) },
    lines: [
      ['A', '不好意思，你能帮我们照一张相吗？', 'Xin lỗi, anh chụp giúp chúng tôi một tấm ảnh được không?'],
      ['B', '没问题。请站在中间，对，再靠近一点儿。', 'Không vấn đề. Mời đứng ở giữa, đúng rồi, đứng gần thêm chút nữa.'],
      ['A', '这是我的照相机，按这个红色的按钮就可以了。', 'Đây là máy ảnh của tôi, bấm cái nút màu đỏ này là được.'],
      ['B', '好，一、二、三！你们笑得很开心。', 'Được, một, hai, ba! Các bạn cười rất vui.'],
      ['A', '让我看看……照得真好，谢谢你。', 'Để tôi xem… chụp đẹp quá, cảm ơn anh.'],
      ['B', '不客气。你们是从哪个国家来的？', 'Đừng khách sáo. Các bạn từ nước nào đến vậy?'],
      ['A', '我们是越南人，这是我们第一次来中国旅游。', 'Chúng tôi là người Việt Nam, đây là lần đầu chúng tôi đến Trung Quốc du lịch.'],
    ],
    qs: [
      { q: ['女的请男的做什么？', 'Người nữ nhờ người nam làm gì?'], o: [['照相', 'Chụp ảnh'], ['问路', 'Hỏi đường'], ['买票', 'Mua vé']], a: 0 },
      { q: ['女的是哪国人？', 'Người nữ là người nước nào?'], o: [['越南人', 'Người Việt Nam'], ['中国人', 'Người Trung Quốc'], ['美国人', 'Người Mỹ']], a: 0 },
    ],
  },

  // ───────────── Mùa và lễ hội ─────────────
  {
    id: 'season-fav', level: 3, topic: season, tags: ['mùa', 'sở thích', 'thời tiết'], words: [],
    title: 'Mùa nào bạn thích nhất?', situation: 'Hai người bạn trò chuyện',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: M(3), B: F(2) },
    lines: [
      ['A', '一年有四个季节，你最喜欢哪一个？', 'Một năm có bốn mùa, bạn thích mùa nào nhất?'],
      ['B', '我最喜欢秋天，天气不冷也不热。', 'Mình thích mùa thu nhất, thời tiết không lạnh cũng không nóng.'],
      ['A', '可是我喜欢夏天，因为可以游泳，还有很多好吃的水果。', 'Nhưng mình thích mùa hè, vì có thể bơi, lại có nhiều trái cây ngon.'],
      ['B', '夏天太热了，我一出门就想回家。', 'Mùa hè nóng quá, mình vừa ra khỏi nhà là muốn về ngay.'],
      ['A', '那冬天呢？你喜欢下雪吗？', 'Còn mùa đông thì sao? Bạn có thích tuyết rơi không?'],
      ['B', '喜欢，不过我怕冷，所以更喜欢在家里看雪。', 'Thích, có điều mình sợ lạnh nên thích ngồi trong nhà ngắm tuyết hơn.'],
      ['A', '哈哈，每个人的想法都不一样。', 'Haha, suy nghĩ của mỗi người đều khác nhau.'],
    ],
    qs: [
      { q: ['女的最喜欢哪个季节？', 'Người nữ thích mùa nào nhất?'], o: [['秋天', 'Mùa thu'], ['夏天', 'Mùa hè'], ['冬天', 'Mùa đông']], a: 0 },
      { q: ['男的为什么喜欢夏天？', 'Vì sao người nam thích mùa hè?'], o: [['可以游泳，水果多', 'Được bơi, nhiều trái cây'], ['不用上学', 'Không phải đi học'], ['天气很冷', 'Trời rất lạnh']], a: 0 },
    ],
  },
  {
    id: 'season-festival', level: 3, topic: season, tags: ['lễ hội', 'Tết', 'gia đình'], words: [],
    title: 'Chuẩn bị đón lễ hội', situation: 'Mẹ và con gái ở nhà',
    who: { A: 'Mẹ', B: 'Con gái' }, cast: { A: F(1), B: F(3) },
    lines: [
      ['A', '再过一个星期就是春节了，我们要开始准备了。', 'Một tuần nữa là Tết rồi, chúng ta phải bắt đầu chuẩn bị thôi.'],
      ['B', '妈妈，今年我们要做什么菜？', 'Mẹ ơi, năm nay chúng ta làm món gì ạ?'],
      ['A', '饺子、鱼，还有你最爱吃的甜点。', 'Sủi cảo, cá, còn có món ngọt con thích ăn nhất.'],
      ['B', '太好了！我可以帮你打扫厨房吗？', 'Tuyệt quá! Con có thể giúp mẹ dọn bếp không?'],
      ['A', '当然可以，还要把房间都打扫干净。', 'Tất nhiên được, còn phải dọn sạch hết các phòng nữa.'],
      ['B', '奶奶和叔叔也会来我们家过节吗？', 'Bà nội và chú cũng sẽ đến nhà mình đón lễ chứ ạ?'],
      ['A', '会的，大家都想一起吃年夜饭。', 'Có chứ, mọi người đều muốn cùng ăn bữa cơm tất niên.'],
    ],
    qs: [
      { q: ['再过多长时间是春节？', 'Còn bao lâu nữa là Tết?'], o: [['一个星期', 'Một tuần'], ['一个月', 'Một tháng'], ['三天', 'Ba ngày']], a: 0 },
      { q: ['女儿想帮妈妈做什么？', 'Con gái muốn giúp mẹ làm gì?'], o: [['打扫厨房', 'Dọn bếp'], ['买菜', 'Đi chợ'], ['做饺子', 'Làm sủi cảo']], a: 0 },
      { q: ['谁会来她们家过节？', 'Ai sẽ đến nhà họ đón lễ?'], o: [['奶奶和叔叔', 'Bà nội và chú'], ['老师', 'Giáo viên'], ['同学', 'Bạn học']], a: 0 },
    ],
  },
  {
    id: 'season-wind', level: 3, topic: season, tags: ['thời tiết', 'gió', 'mây'], words: [],
    title: 'Trời sắp đổi', situation: 'Hai người nhìn ra cửa sổ',
    who: { A: 'Bạn A', B: 'Bạn B' }, cast: { A: M(2), B: F(3) },
    lines: [
      ['A', '你看，天上的云越来越多了。', 'Bạn xem, mây trên trời càng lúc càng nhiều.'],
      ['B', '风也很大，好像要下雨了。', 'Gió cũng rất lớn, hình như sắp mưa rồi.'],
      ['A', '天气预报说明天会变冷，温度会低很多。', 'Dự báo thời tiết nói ngày mai sẽ trở lạnh, nhiệt độ sẽ thấp đi nhiều.'],
      ['B', '那我要多带一件衣服，还要带伞。', 'Vậy mình phải mang thêm một cái áo, còn phải mang ô nữa.'],
      ['A', '这个季节的天气变化真快。', 'Thời tiết mùa này thay đổi nhanh thật.'],
      ['B', '是啊，早上还是晴天，现在已经这样了。', 'Đúng vậy, sáng còn nắng, giờ đã thế này rồi.'],
    ],
    qs: [
      { q: ['天气可能会怎么样？', 'Thời tiết có thể thế nào?'], o: [['下雨', 'Mưa'], ['下雪', 'Tuyết'], ['很热', 'Rất nóng']], a: 0 },
      { q: ['明天的温度怎么样？', 'Nhiệt độ ngày mai thế nào?'], o: [['会变低', 'Sẽ thấp đi'], ['会变高', 'Sẽ cao lên'], ['不变', 'Không đổi']], a: 0 },
    ],
  },
  {
    id: 'season-zoo', level: 3, topic: season, tags: ['sở thú', 'gấu trúc', 'động vật'], words: [],
    title: 'Đi xem gấu trúc', situation: 'Cả nhà đi sở thú dịp lễ',
    who: { A: 'Bố', B: 'Con trai' }, cast: { A: M(1), B: M(3) },
    lines: [
      ['A', '今天是节日，动物园里的人真多。', 'Hôm nay là ngày lễ, trong sở thú người đông thật.'],
      ['B', '爸爸，我最想看熊猫，它们在哪儿？', 'Bố ơi, con muốn xem gấu trúc nhất, chúng ở đâu ạ?'],
      ['A', '在前面，你看，那只熊猫正在吃东西。', 'Ở phía trước, con nhìn kìa, chú gấu trúc kia đang ăn.'],
      ['B', '它们真可爱！它们吃什么？', 'Chúng đáng yêu quá! Chúng ăn gì ạ?'],
      ['A', '主要吃竹子，有时候也吃水果。', 'Chủ yếu ăn tre, đôi khi cũng ăn trái cây.'],
      ['B', '我想给它们照相。', 'Con muốn chụp ảnh chúng.'],
      ['A', '好，不过要小声一点儿，别让它们害怕。', 'Được, nhưng phải nhỏ tiếng một chút, đừng làm chúng sợ.'],
    ],
    qs: [
      { q: ['男孩最想看什么动物？', 'Cậu bé muốn xem con vật nào nhất?'], o: [['熊猫', 'Gấu trúc'], ['马', 'Ngựa'], ['鸟', 'Chim']], a: 0 },
      { q: ['熊猫主要吃什么？', 'Gấu trúc chủ yếu ăn gì?'], o: [['竹子', 'Tre'], ['肉', 'Thịt'], ['鱼', 'Cá']], a: 0 },
    ],
  },
];

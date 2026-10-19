// Bài đọc HSK 1-2 và bài tập viết tự chấm (soạn 20/10/2026, CHƯA QUA DUYỆT). Pinyin sinh bằng pinyin-pro lúc nạp.
import type { Q } from './types.js';

export interface Reading {
  id: string;
  level: number;
  title: [zh: string, vi: string];
  /** Mỗi phần tử là một câu: [tiếng Trung, tiếng Việt]. */
  sents: [string, string][];
  qs: Q[];
}

export const READINGS: Reading[] = [
  // ───────────── HSK 1 ─────────────
  {
    id: 'doc-ngay', level: 1, title: ['我的一天', 'Một ngày của tôi'],
    sents: [
      ['我早上七点起床。', 'Tôi dậy lúc bảy giờ sáng.'],
      ['八点我去学校。', 'Tám giờ tôi đến trường.'],
      ['中午我在学校吃饭。', 'Buổi trưa tôi ăn cơm ở trường.'],
      ['下午五点我回家。', 'Năm giờ chiều tôi về nhà.'],
      ['晚上我看书，十点睡觉。', 'Buổi tối tôi đọc sách, mười giờ đi ngủ.'],
    ],
    qs: [
      { q: ['他几点起床？', 'Anh ấy dậy lúc mấy giờ?'], o: [['七点', 'Bảy giờ'], ['八点', 'Tám giờ'], ['十点', 'Mười giờ']], a: 0 },
      { q: ['他在哪儿吃午饭？', 'Anh ấy ăn trưa ở đâu?'], o: [['学校', 'Trường học'], ['家里', 'Ở nhà'], ['商店', 'Cửa hàng']], a: 0 },
    ],
  },
  {
    id: 'doc-jia', level: 1, title: ['我的家', 'Gia đình tôi'],
    sents: [
      ['我家有四口人。', 'Nhà tôi có bốn người.'],
      ['爸爸是医生，妈妈是老师。', 'Bố là bác sĩ, mẹ là giáo viên.'],
      ['我有一个哥哥。', 'Tôi có một anh trai.'],
      ['我们都很喜欢我们的家。', 'Chúng tôi đều rất yêu ngôi nhà của mình.'],
    ],
    qs: [
      { q: ['妈妈做什么工作？', 'Mẹ làm nghề gì?'], o: [['老师', 'Giáo viên'], ['医生', 'Bác sĩ'], ['学生', 'Học sinh']], a: 0 },
      { q: ['他家有几口人？', 'Nhà anh ấy có mấy người?'], o: [['四口', 'Bốn người'], ['三口', 'Ba người'], ['五口', 'Năm người']], a: 0 },
    ],
  },
  {
    id: 'doc-mao', level: 1, title: ['我的小猫', 'Chú mèo nhỏ của tôi'],
    sents: [
      ['我有一只小猫。', 'Tôi có một chú mèo nhỏ.'],
      ['它的名字叫小白。', 'Tên nó là Tiểu Bạch.'],
      ['小白很喜欢吃鱼。', 'Tiểu Bạch rất thích ăn cá.'],
      ['我每天都和它玩。', 'Ngày nào tôi cũng chơi với nó.'],
    ],
    qs: [
      { q: ['小猫叫什么名字？', 'Chú mèo tên gì?'], o: [['小白', 'Tiểu Bạch'], ['小黑', 'Tiểu Hắc'], ['小红', 'Tiểu Hồng']], a: 0 },
      { q: ['小猫喜欢吃什么？', 'Chú mèo thích ăn gì?'], o: [['鱼', 'Cá'], ['米饭', 'Cơm'], ['苹果', 'Táo']], a: 0 },
    ],
  },
  {
    id: 'doc-shangdian', level: 1, title: ['在商店', 'Ở cửa hàng'],
    sents: [
      ['今天我去商店买东西。', 'Hôm nay tôi đến cửa hàng mua đồ.'],
      ['我买了三个苹果和一杯水。', 'Tôi mua ba quả táo và một cốc nước.'],
      ['苹果五块钱，水两块钱。', 'Táo năm đồng, nước hai đồng.'],
      ['我给了他十块钱。', 'Tôi đưa anh ấy mười đồng.'],
    ],
    qs: [
      { q: ['他买了什么？', 'Anh ấy đã mua gì?'], o: [['苹果和水', 'Táo và nước'], ['米饭和茶', 'Cơm và trà'], ['书和笔', 'Sách và bút']], a: 0 },
      { q: ['水多少钱？', 'Nước giá bao nhiêu?'], o: [['两块', 'Hai đồng'], ['五块', 'Năm đồng'], ['十块', 'Mười đồng']], a: 0 },
    ],
  },
  {
    id: 'doc-zhoumo', level: 1, title: ['周末', 'Cuối tuần'],
    sents: [
      ['星期六我不上学。', 'Thứ bảy tôi không đi học.'],
      ['早上我和朋友去看电影。', 'Buổi sáng tôi cùng bạn đi xem phim.'],
      ['下午我们在家吃饭，喝茶。', 'Buổi chiều chúng tôi ăn cơm, uống trà ở nhà.'],
      ['星期天我在家看书。', 'Chủ nhật tôi đọc sách ở nhà.'],
    ],
    qs: [
      { q: ['星期六早上他做什么？', 'Sáng thứ bảy anh ấy làm gì?'], o: [['看电影', 'Xem phim'], ['上学', 'Đi học'], ['看书', 'Đọc sách']], a: 0 },
      { q: ['星期天他在哪儿？', 'Chủ nhật anh ấy ở đâu?'], o: [['家里', 'Ở nhà'], ['学校', 'Ở trường'], ['商店', 'Ở cửa hàng']], a: 0 },
    ],
  },
  {
    id: 'doc-pengyou', level: 1, title: ['我的朋友', 'Bạn của tôi'],
    sents: [
      ['我的朋友叫小明。', 'Bạn tôi tên là Tiểu Minh.'],
      ['他是中国人，今年二十岁。', 'Cậu ấy là người Trung Quốc, năm nay hai mươi tuổi.'],
      ['他会说汉语和英语。', 'Cậu ấy biết nói tiếng Hán và tiếng Anh.'],
      ['我们常常一起学习。', 'Chúng tôi thường học cùng nhau.'],
    ],
    qs: [
      { q: ['小明几岁？', 'Tiểu Minh mấy tuổi?'], o: [['二十岁', '20 tuổi'], ['十岁', '10 tuổi'], ['三十岁', '30 tuổi']], a: 0 },
      { q: ['小明会说什么？', 'Tiểu Minh biết nói gì?'], o: [['汉语和英语', 'Tiếng Hán và tiếng Anh'], ['只会英语', 'Chỉ tiếng Anh'], ['只会汉语', 'Chỉ tiếng Hán']], a: 0 },
    ],
  },

  // ───────────── HSK 2 (khóa tới khi lên HSK 2) ─────────────
  {
    id: 'doc-bing', level: 2, title: ['生病了', 'Bị ốm'],
    sents: [
      ['昨天晚上我觉得头很疼，还有一点儿发烧。', 'Tối qua tôi thấy rất đau đầu, còn hơi sốt.'],
      ['今天早上妈妈带我去医院。', 'Sáng nay mẹ đưa tôi đến bệnh viện.'],
      ['医生说我感冒了，要多喝水，多休息。', 'Bác sĩ nói tôi bị cảm, cần uống nhiều nước và nghỉ ngơi nhiều.'],
      ['他还给了我一些药，一天吃三次。', 'Bác sĩ còn cho tôi ít thuốc, một ngày uống ba lần.'],
      ['我现在好多了，明天可以去上课。', 'Giờ tôi đỡ nhiều rồi, ngày mai có thể đi học.'],
    ],
    qs: [
      { q: ['医生说他怎么了？', 'Bác sĩ nói anh ấy bị gì?'], o: [['感冒了', 'Bị cảm'], ['太累了', 'Quá mệt'], ['没有病', 'Không bệnh']], a: 0 },
      { q: ['药一天吃几次？', 'Thuốc uống mấy lần một ngày?'], o: [['三次', 'Ba lần'], ['一次', 'Một lần'], ['五次', 'Năm lần']], a: 0 },
    ],
  },
  {
    id: 'doc-beijing', level: 2, title: ['去北京', 'Đi Bắc Kinh'],
    sents: [
      ['下个月我想和朋友一起去北京玩。', 'Tháng sau tôi muốn cùng bạn đi chơi Bắc Kinh.'],
      ['我们打算坐火车去，因为火车票比飞机票便宜。', 'Chúng tôi định đi bằng tàu hỏa, vì vé tàu rẻ hơn vé máy bay.'],
      ['到了北京以后，我们先去看长城。', 'Đến Bắc Kinh rồi, chúng tôi sẽ đi xem Vạn Lý Trường Thành trước.'],
      ['朋友说那里的东西很好吃，我很想试试。', 'Bạn nói đồ ăn ở đó rất ngon, tôi rất muốn thử.'],
      ['我已经开始学一些汉语了。', 'Tôi đã bắt đầu học một ít tiếng Hán rồi.'],
    ],
    qs: [
      { q: ['他们怎么去北京？', 'Họ đi Bắc Kinh bằng gì?'], o: [['坐火车', 'Đi tàu hỏa'], ['坐飞机', 'Đi máy bay'], ['开车', 'Lái xe']], a: 0 },
      { q: ['为什么坐火车？', 'Vì sao đi tàu hỏa?'], o: [['火车票便宜', 'Vé tàu rẻ'], ['火车很快', 'Tàu rất nhanh'], ['没有飞机', 'Không có máy bay']], a: 0 },
    ],
  },
  {
    id: 'doc-yu', level: 2, title: ['下雨天', 'Ngày mưa'],
    sents: [
      ['今天早上天气很好，所以我没有带伞。', 'Sáng nay trời đẹp nên tôi không mang ô.'],
      ['下午我从公司出来的时候，突然下雨了。', 'Chiều lúc tôi ra khỏi công ty thì trời bỗng đổ mưa.'],
      ['雨越下越大，我只好在门口等。', 'Mưa càng lúc càng to, tôi đành đứng đợi ở cửa.'],
      ['这时候，一个同事看见了我，借给我一把伞。', 'Lúc đó, một đồng nghiệp trông thấy tôi và cho tôi mượn một chiếc ô.'],
      ['我很高兴，明天一定还给他。', 'Tôi rất vui, ngày mai nhất định sẽ trả lại anh ấy.'],
    ],
    qs: [
      { q: ['早上他为什么没带伞？', 'Sáng sao anh ấy không mang ô?'], o: [['天气很好', 'Trời đẹp'], ['找不到伞', 'Không tìm thấy ô'], ['忘了', 'Quên mất']], a: 0 },
      { q: ['谁帮了他？', 'Ai đã giúp anh ấy?'], o: [['一个同事', 'Một đồng nghiệp'], ['妈妈', 'Mẹ'], ['老师', 'Giáo viên']], a: 0 },
    ],
  },
  {
    id: 'doc-aihao', level: 2, title: ['我的爱好', 'Sở thích của tôi'],
    sents: [
      ['我最大的爱好是踢足球。', 'Sở thích lớn nhất của tôi là đá bóng.'],
      ['每个星期六下午，我都和同学们一起去公园踢球。', 'Chiều thứ bảy hằng tuần, tôi đều cùng các bạn học ra công viên đá bóng.'],
      ['虽然有时候很累，但是我觉得非常快乐。', 'Tuy đôi lúc rất mệt, nhưng tôi thấy vô cùng vui.'],
      ['我的妈妈不太喜欢，因为我回家的时候衣服总是很脏。', 'Mẹ tôi không thích lắm, vì lúc tôi về nhà quần áo luôn rất bẩn.'],
    ],
    qs: [
      { q: ['他什么时候踢足球？', 'Anh ấy đá bóng khi nào?'], o: [['星期六下午', 'Chiều thứ bảy'], ['星期天早上', 'Sáng chủ nhật'], ['每天晚上', 'Mỗi tối']], a: 0 },
      { q: ['妈妈为什么不太喜欢？', 'Vì sao mẹ không thích lắm?'], o: [['衣服总是很脏', 'Quần áo luôn bẩn'], ['太花时间', 'Tốn thời gian'], ['怕他受伤', 'Sợ anh bị thương']], a: 0 },
    ],
  },
  {
    id: 'doc-tongxue', level: 2, title: ['新同学', 'Bạn học mới'],
    sents: [
      ['今天我们班来了一个新同学，她叫阮玲。', 'Hôm nay lớp tôi có một bạn học mới, tên là Nguyễn Linh.'],
      ['她是越南人，来中国学习汉语已经三个月了。', 'Bạn ấy là người Việt Nam, sang Trung Quốc học tiếng Hán đã được ba tháng.'],
      ['老师请她介绍一下自己，她说得很清楚。', 'Cô giáo mời bạn ấy giới thiệu bản thân, bạn nói rất rõ ràng.'],
      ['下课以后，我问她愿意不愿意和我一起吃午饭。', 'Sau giờ học, tôi hỏi bạn ấy có muốn ăn trưa cùng tôi không.'],
      ['她笑着说：“好啊，谢谢你！”', 'Bạn ấy cười nói: "Được chứ, cảm ơn bạn!"'],
    ],
    qs: [
      { q: ['阮玲学汉语学了多久？', 'Nguyễn Linh đã học tiếng Hán bao lâu?'], o: [['三个月', 'Ba tháng'], ['三年', 'Ba năm'], ['三天', 'Ba ngày']], a: 0 },
      { q: ['下课以后他们做什么？', 'Sau giờ học họ làm gì?'], o: [['一起吃午饭', 'Cùng ăn trưa'], ['一起回家', 'Cùng về nhà'], ['去看电影', 'Đi xem phim']], a: 0 },
    ],
  },
  {
    id: 'doc-xin', level: 2, title: ['一封信', 'Một lá thư'],
    sents: [
      ['亲爱的妈妈：您好！', 'Mẹ thân yêu: Chào mẹ!'],
      ['我来到这个新城市已经一个月了，一切都很好。', 'Con đến thành phố mới này đã một tháng rồi, mọi thứ đều tốt.'],
      ['这里的天气比家里冷，不过我已经习惯了。', 'Thời tiết ở đây lạnh hơn ở nhà, có điều con đã quen rồi.'],
      ['我认识了几个新朋友，他们常常帮我学习。', 'Con làm quen được vài người bạn mới, họ thường giúp con học.'],
      ['请您不要担心我，也要注意身体。', 'Mẹ đừng lo cho con, mẹ cũng nhớ giữ gìn sức khỏe.'],
      ['想您的儿子，小文', 'Con trai nhớ mẹ, Tiểu Văn'],
    ],
    qs: [
      { q: ['这封信是写给谁的？', 'Lá thư này viết cho ai?'], o: [['妈妈', 'Mẹ'], ['朋友', 'Bạn'], ['老师', 'Giáo viên']], a: 0 },
      { q: ['那里的天气怎么样？', 'Thời tiết ở đó thế nào?'], o: [['比家里冷', 'Lạnh hơn ở nhà'], ['比家里热', 'Nóng hơn ở nhà'], ['一样', 'Giống nhau']], a: 0 },
    ],
  },

  // ───────────── HSK 3 (khóa tới khi lên HSK 3) ─────────────
  {
    id: 'doc3-chunjie', level: 3, title: ['过春节', 'Đón Tết'],
    sents: [
      ['春节是中国最重要的节日，大家都会回家和家人一起过。', 'Tết là ngày lễ quan trọng nhất của Trung Quốc, mọi người đều về nhà đón cùng gia đình.'],
      ['节日前一个星期，家家都开始打扫房间，准备好吃的东西。', 'Một tuần trước lễ, nhà nào cũng bắt đầu dọn dẹp, chuẩn bị đồ ăn ngon.'],
      ['年夜饭一定要有鱼，因为人们希望每年都有多余的好运。', 'Bữa cơm tất niên nhất định phải có cá, vì người ta mong năm nào cũng có dư may mắn.'],
      ['孩子们最高兴，因为他们可以拿到红包，还可以放假玩很多天。', 'Bọn trẻ vui nhất, vì được nhận lì xì và được nghỉ chơi nhiều ngày.'],
      ['虽然很忙很累，但是大家都觉得这样的日子特别幸福。', 'Tuy bận rộn và mệt, nhưng ai cũng thấy những ngày như thế đặc biệt hạnh phúc.'],
    ],
    qs: [
      { q: ['节日前一个星期，大家做什么？', 'Một tuần trước lễ, mọi người làm gì?'], o: [['打扫房间，准备食物', 'Dọn nhà, chuẩn bị đồ ăn'], ['出去旅游', 'Đi du lịch'], ['去上班', 'Đi làm']], a: 0 },
      { q: ['年夜饭为什么要有鱼？', 'Vì sao bữa tất niên phải có cá?'], o: [['希望每年有好运', 'Mong mỗi năm có may mắn'], ['鱼很便宜', 'Cá rẻ'], ['孩子爱吃', 'Trẻ thích ăn']], a: 0 },
      { q: ['孩子们为什么最高兴？', 'Vì sao bọn trẻ vui nhất?'], o: [['有红包，还能放假', 'Có lì xì, lại được nghỉ'], ['不用写作业', 'Không phải làm bài'], ['可以买东西', 'Được mua đồ']], a: 0 },
    ],
  },
  {
    id: 'doc3-lvxing', level: 3, title: ['难忘的旅行', 'Chuyến đi khó quên'],
    sents: [
      ['去年夏天，我和朋友一起去了云南旅游。', 'Mùa hè năm ngoái, tôi cùng bạn đi du lịch Vân Nam.'],
      ['我们先坐飞机到昆明，然后坐了五个小时的汽车去山里。', 'Chúng tôi bay đến Côn Minh trước, sau đó đi xe năm tiếng vào vùng núi.'],
      ['那里的空气很新鲜，天上的云好像就在头顶，我们拍了很多照片。', 'Không khí ở đó rất trong lành, mây trên trời như ở ngay trên đầu, chúng tôi chụp rất nhiều ảnh.'],
      ['可是最后一天，我的行李箱不见了，我很着急。', 'Nhưng ngày cuối cùng, va-li của tôi biến mất, tôi rất sốt ruột.'],
      ['幸好宾馆的服务员帮我找到了，原来被别的客人拿错了。', 'May mà nhân viên khách sạn giúp tôi tìm lại, thì ra bị vị khách khác cầm nhầm.'],
    ],
    qs: [
      { q: ['他们是怎么去山里的？', 'Họ vào vùng núi bằng gì?'], o: [['先坐飞机，再坐汽车', 'Bay trước rồi đi xe'], ['一直坐火车', 'Đi tàu suốt'], ['骑自行车', 'Đi xe đạp']], a: 0 },
      { q: ['最后一天发生了什么？', 'Ngày cuối xảy ra chuyện gì?'], o: [['行李箱不见了', 'Va-li biến mất'], ['下大雨了', 'Mưa lớn'], ['飞机晚点了', 'Máy bay trễ']], a: 0 },
      { q: ['行李箱怎么找到的？', 'Va-li tìm lại thế nào?'], o: [['服务员帮忙找到', 'Nhân viên giúp tìm'], ['自己找到', 'Tự tìm được'], ['警察找到', 'Cảnh sát tìm được']], a: 0 },
    ],
  },
  {
    id: 'doc3-xiguan', level: 3, title: ['好习惯', 'Thói quen tốt'],
    sents: [
      ['小李以前每天晚上都玩游戏到很晚，早上起不来。', 'Tiểu Lý trước đây ngày nào cũng chơi game đến khuya, sáng không dậy nổi.'],
      ['后来他的成绩越来越差，老师也很担心他。', 'Sau đó thành tích của cậu ấy ngày càng kém, thầy cô cũng rất lo cho cậu.'],
      ['他决定改变自己，每天晚上十点睡觉，早上六点起床锻炼。', 'Cậu quyết định thay đổi bản thân, mười giờ tối ngủ, sáu giờ sáng dậy tập thể dục.'],
      ['一个月以后，他不但身体更健康，学习也更认真了。', 'Một tháng sau, cậu không những khỏe hơn mà học cũng nghiêm túc hơn.'],
      ['小李说：“好习惯真的能改变一个人。”', 'Tiểu Lý nói: "Thói quen tốt thật sự có thể thay đổi một con người."'],
    ],
    qs: [
      { q: ['小李以前有什么问题？', 'Trước đây Tiểu Lý có vấn đề gì?'], o: [['玩游戏到很晚', 'Chơi game đến khuya'], ['不喜欢上学', 'Không thích đi học'], ['身体不好', 'Sức khỏe kém']], a: 0 },
      { q: ['他后来怎么做？', 'Sau đó cậu ấy làm gì?'], o: [['早睡早起，锻炼身体', 'Ngủ sớm dậy sớm, tập thể dục'], ['换了学校', 'Đổi trường'], ['不再学习', 'Thôi học']], a: 0 },
    ],
  },
  {
    id: 'doc3-xin', level: 3, title: ['给远方朋友的信', 'Thư gửi người bạn phương xa'],
    sents: [
      ['亲爱的小王：你好！', 'Tiểu Vương thân mến: Chào bạn!'],
      ['好久没有给你写信了，最近我一直很忙，请你不要生气。', 'Lâu rồi không viết thư cho bạn, dạo này mình luôn rất bận, mong bạn đừng giận.'],
      ['我已经搬到新的城市了，这里的环境不错，同事们也都很热情。', 'Mình đã chuyển đến thành phố mới, môi trường ở đây không tệ, đồng nghiệp cũng rất nhiệt tình.'],
      ['周末的时候，我常常和他们一起爬山或者去看电影。', 'Cuối tuần mình thường cùng họ đi leo núi hoặc xem phim.'],
      ['如果你有机会来这里，一定要告诉我，我会好好照顾你。', 'Nếu bạn có dịp đến đây, nhất định phải báo mình, mình sẽ chăm sóc bạn thật tốt.'],
      ['祝你身体健康，工作顺利！你的朋友小林', 'Chúc bạn khỏe mạnh, công việc thuận lợi! Bạn của bạn, Tiểu Lâm'],
    ],
    qs: [
      { q: ['小林为什么很久没写信？', 'Vì sao Tiểu Lâm lâu không viết thư?'], o: [['最近很忙', 'Dạo này rất bận'], ['生病了', 'Bị ốm'], ['忘记了', 'Quên mất']], a: 0 },
      { q: ['小林周末常做什么？', 'Cuối tuần Tiểu Lâm thường làm gì?'], o: [['爬山或看电影', 'Leo núi hoặc xem phim'], ['在家睡觉', 'Ngủ ở nhà'], ['去上班', 'Đi làm']], a: 0 },
    ],
  },
];

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

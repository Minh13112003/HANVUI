// Câu luyện dịch Trung ↔ Việt theo từng điểm ngữ pháp (soạn 27/10/2026, CHƯA QUA DUYỆT).
// Mỗi câu: [tiếng Trung, bản dịch tự nhiên, bản dịch sát chữ (word by word), các cụm, (cách viết tiếng Trung khác được nhận)].
// Cụm viết "chữ Hán=nghĩa 1|nghĩa 2", nối bằng " / ". Nghĩa "-" = cụm không cần dịch ra (trợ từ như 的, 了).
// Chấm Trung → Việt: mỗi cụm có một nghĩa được chấp nhận xuất hiện trong câu dịch là đạt cụm đó (không bắt đúng thứ tự,
// vì tiếng Việt đảo trật tự khác tiếng Trung). Chấm Việt → Trung: đúng nguyên câu (hoặc cách viết khác được nhận) mới đúng,
// không thì chỉ ra cụm còn thiếu. Ghép các cụm theo thứ tự phải ra đúng câu tiếng Trung (bỏ dấu câu) — script nạp tự kiểm.

export type TransSeed = [zh: string, vi: string, literal: string, chunks: string, alt?: string[]];

export const TRANSLATE: Record<string, TransSeed[]> = {
  // ───────────── HSK 1 ─────────────
  'ma-ne': [
    ['你是医生吗？', 'Bạn là bác sĩ à?', 'Bạn là bác sĩ không?', '你=bạn|anh|chị|cậu / 是=là / 医生=bác sĩ|bác sỹ / 吗=à|không|phải không|hả'],
    ['我喝茶，你呢？', 'Tôi uống trà, còn bạn?', 'Tôi uống trà, bạn thì sao?', '我=tôi|mình|em / 喝=uống / 茶=trà|chè / 你=bạn|cậu|anh|chị / 呢=còn|thì sao|thế nào'],
    ['他是中国人吗？', 'Anh ấy là người Trung Quốc à?', 'Anh ấy là người Trung Quốc không?', '他=anh ấy|ông ấy|cậu ấy|anh ta / 是=là / 中国人=người trung quốc|người hoa / 吗=à|không|phải không|hả'],
  ],
  shi: [
    ['她是我的老师。', 'Cô ấy là cô giáo của tôi.', 'Cô ấy là của tôi giáo viên.', '她=cô ấy|chị ấy|bà ấy / 是=là / 我的=của tôi|của mình|tôi / 老师=giáo viên|cô giáo|thầy giáo|cô|thầy'],
    ['我不是学生。', 'Tôi không phải là học sinh.', 'Tôi không là học sinh.', '我=tôi|mình / 不是=không phải|không là / 学生=học sinh|sinh viên'],
    ['那是他的手机。', 'Kia là điện thoại của anh ấy.', 'Kia là của anh ấy điện thoại.', '那=kia|đó|đấy|cái đó|cái kia / 是=là / 他的=của anh ấy|của cậu ấy|của ông ấy / 手机=điện thoại'],
  ],
  you: [
    ['我有两个妹妹。', 'Tôi có hai em gái.', 'Tôi có hai cái em gái.', '我=tôi|mình / 有=có / 两个=hai / 妹妹=em gái'],
    ['他没有车。', 'Anh ấy không có xe.', 'Anh ấy không có xe.', '他=anh ấy|cậu ấy|ông ấy / 没有=không có|chẳng có / 车=xe|ô tô'],
    ['桌子上有一个杯子。', 'Trên bàn có một cái cốc.', 'Bàn trên có một cái cốc.', '桌子上=trên bàn|trên mặt bàn / 有=có / 一个=một / 杯子=cốc|ly|cái cốc|cái ly'],
  ],
  'bu-mei': [
    ['我不喜欢下雨。', 'Tôi không thích trời mưa.', 'Tôi không thích xuống mưa.', '我=tôi|mình / 不=không|chẳng / 喜欢=thích / 下雨=mưa|trời mưa'],
    ['他今天没来学校。', 'Hôm nay cậu ấy không đến trường.', 'Cậu ấy hôm nay không đến trường.', '他=cậu ấy|anh ấy|nó / 今天=hôm nay / 没=không|chưa / 来=đến|tới|đi / 学校=trường|trường học'],
    ['这个菜不贵。', 'Món này không đắt.', 'Cái món này không đắt.', '这个=này|cái này / 菜=món|món ăn|rau / 不=không|chẳng / 贵=đắt|mắc'],
  ],
  'de-possess': [
    ['这是我朋友的书。', 'Đây là sách của bạn tôi.', 'Đây là bạn tôi của sách.', '这=đây|này / 是=là / 我朋友=bạn tôi|bạn của tôi|bạn mình / 的=- / 书=sách|quyển sách|cuốn sách'],
    ['我爸爸是医生。', 'Bố tôi là bác sĩ.', 'Tôi bố là bác sĩ.', '我爸爸=bố tôi|ba tôi|bố mình|cha tôi / 是=là / 医生=bác sĩ|bác sỹ'],
    ['他的衣服很漂亮。', 'Quần áo của anh ấy rất đẹp.', 'Của anh ấy quần áo rất đẹp.', '他的=của anh ấy|của cậu ấy|anh ấy / 衣服=quần áo|áo|đồ / 很=rất|khá / 漂亮=đẹp|xinh'],
  ],
  modal: [
    ['我想去北京。', 'Tôi muốn đi Bắc Kinh.', 'Tôi muốn đi Bắc Kinh.', '我=tôi|mình / 想=muốn / 去=đi|đến|tới / 北京=bắc kinh'],
    ['她会做中国菜。', 'Cô ấy biết nấu món Trung Quốc.', 'Cô ấy biết làm món Trung Quốc.', '她=cô ấy|chị ấy|bà ấy / 会=biết|có thể / 做=nấu|làm / 中国菜=món trung quốc|đồ ăn trung quốc|món ăn trung quốc|món hoa'],
    ['我可以用你的电脑吗？', 'Tôi dùng máy tính của bạn được không?', 'Tôi có thể dùng của bạn máy tính không?', '我=tôi|mình / 可以=được|có thể / 用=dùng|sử dụng|xài / 你的=của bạn|của cậu|bạn / 电脑=máy tính|máy vi tính|laptop / 吗=không|chứ|à'],
  ],
  liangci: [
    ['我买了三本书。', 'Tôi đã mua ba quyển sách.', 'Tôi mua rồi ba quyển sách.', '我=tôi|mình / 买了=đã mua|mua|mua rồi / 三本=ba quyển|ba cuốn|ba / 书=sách'],
    ['请给我一杯水。', 'Cho tôi một cốc nước.', 'Xin đưa tôi một cốc nước.', '请=xin|làm ơn|vui lòng|cho / 给我=cho tôi|đưa tôi|cho mình / 一杯=một cốc|một ly / 水=nước'],
    ['这件衣服是我的。', 'Bộ quần áo này là của tôi.', 'Này chiếc quần áo là của tôi.', '这件=này|chiếc này|bộ này|cái này / 衣服=quần áo|áo|đồ / 是=là / 我的=của tôi|của mình'],
  ],
  'wh-words': [
    ['你去哪儿？', 'Bạn đi đâu?', 'Bạn đi đâu?', '你=bạn|cậu|anh|chị / 去=đi|đến / 哪儿=đâu|chỗ nào|nơi nào'],
    ['这个多少钱？', 'Cái này bao nhiêu tiền?', 'Cái này bao nhiêu tiền?', '这个=cái này|này|món này / 多少=bao nhiêu|mấy / 钱=tiền|đồng'],
    ['谁是你的老师？', 'Ai là giáo viên của bạn?', 'Ai là của bạn giáo viên?', '谁=ai|người nào / 是=là / 你的=của bạn|của cậu|bạn / 老师=giáo viên|cô giáo|thầy giáo|thầy|cô'],
  ],
  'zai-place': [
    ['我在学校。', 'Tôi ở trường.', 'Tôi ở trường học.', '我=tôi|mình / 在=ở|đang ở|tại / 学校=trường|trường học'],
    ['他在家看电视。', 'Anh ấy xem ti vi ở nhà.', 'Anh ấy ở nhà xem ti vi.', '他=anh ấy|cậu ấy|ông ấy / 在家=ở nhà|tại nhà / 看=xem|coi / 电视=ti vi|tivi|truyền hình'],
    ['我们在饭馆吃饭。', 'Chúng tôi ăn cơm ở quán.', 'Chúng tôi ở quán ăn ăn cơm.', '我们=chúng tôi|chúng ta|chúng mình|bọn mình / 在饭馆=ở quán|ở nhà hàng|tại quán|ở quán ăn / 吃饭=ăn cơm|ăn'],
  ],
  'time-order': [
    ['我明天上午去医院。', 'Sáng mai tôi đi bệnh viện.', 'Tôi ngày mai buổi sáng đi bệnh viện.', '我=tôi|mình / 明天上午=sáng mai|sáng ngày mai / 去=đi|đến / 医院=bệnh viện|viện'],
    ['他七点吃早饭。', 'Anh ấy ăn sáng lúc bảy giờ.', 'Anh ấy bảy giờ ăn cơm sáng.', '他=anh ấy|cậu ấy|ông ấy / 七点=bảy giờ|7 giờ / 吃早饭=ăn sáng|ăn bữa sáng|ăn điểm tâm'],
    ['昨天我很忙。', 'Hôm qua tôi rất bận.', 'Hôm qua tôi rất bận.', '昨天=hôm qua / 我=tôi|mình / 很=rất|khá / 忙=bận|bận rộn'],
  ],
  'hen-adj': [
    ['今天很冷。', 'Hôm nay trời lạnh.', 'Hôm nay rất lạnh.', '今天=hôm nay / 很=rất|khá|- / 冷=lạnh|rét'],
    ['这本书太贵了。', 'Quyển sách này đắt quá.', 'Này quyển sách quá đắt rồi.', '这本书=quyển sách này|cuốn sách này|sách này / 太=quá / 贵=đắt|mắc / 了=-'],
    ['北京非常大。', 'Bắc Kinh rất rộng lớn.', 'Bắc Kinh vô cùng lớn.', '北京=bắc kinh / 非常=rất|vô cùng|cực kỳ|cực kì / 大=lớn|to|rộng'],
  ],
  'ye-dou': [
    ['他也喜欢喝咖啡。', 'Anh ấy cũng thích uống cà phê.', 'Anh ấy cũng thích uống cà phê.', '他=anh ấy|cậu ấy / 也=cũng / 喜欢=thích / 喝咖啡=uống cà phê'],
    ['我们都是越南人。', 'Chúng tôi đều là người Việt Nam.', 'Chúng tôi đều là người Việt Nam.', '我们=chúng tôi|chúng ta|bọn mình / 都=đều|tất cả / 是=là / 越南人=người việt nam|người việt'],
    ['他们都不来。', 'Họ đều không đến.', 'Họ đều không đến.', '他们=họ|bọn họ|các bạn ấy / 都=đều|tất cả|ai cũng / 不=không|chẳng / 来=đến|tới'],
  ],

  // ───────────── HSK 2 ─────────────
  le: [
    ['我买了一件新衣服。', 'Tôi đã mua một bộ quần áo mới.', 'Tôi mua rồi một chiếc mới quần áo.', '我=tôi|mình / 买了=đã mua|mua|mua rồi / 一件=một|một bộ|một chiếc / 新衣服=quần áo mới|áo mới|đồ mới'],
    ['他回家了。', 'Anh ấy về nhà rồi.', 'Anh ấy về nhà rồi.', '他=anh ấy|cậu ấy|nó / 回家=về nhà / 了=rồi|đã'],
    ['下雨了。', 'Trời mưa rồi.', 'Xuống mưa rồi.', '下雨=mưa|trời mưa / 了=rồi'],
  ],
  guo: [
    ['我吃过北京烤鸭。', 'Tôi đã từng ăn vịt quay Bắc Kinh.', 'Tôi ăn qua Bắc Kinh vịt quay.', '我=tôi|mình / 吃过=đã từng ăn|từng ăn|đã ăn / 北京烤鸭=vịt quay bắc kinh'],
    ['他没去过中国。', 'Anh ấy chưa từng đến Trung Quốc.', 'Anh ấy chưa đi qua Trung Quốc.', '他=anh ấy|cậu ấy / 没去过=chưa từng đến|chưa từng đi|chưa đến|chưa đi|chưa bao giờ đến|chưa bao giờ đi / 中国=trung quốc'],
    ['你学过汉语吗？', 'Bạn đã từng học tiếng Trung chưa?', 'Bạn học qua tiếng Hán không?', '你=bạn|cậu|anh|chị / 学过=đã từng học|từng học|đã học / 汉语=tiếng trung|tiếng hán|tiếng hoa / 吗=chưa|không|à'],
  ],
  zai: [
    ['妈妈正在做饭。', 'Mẹ đang nấu cơm.', 'Mẹ đang làm cơm.', '妈妈=mẹ|má / 正在=đang / 做饭=nấu cơm|nấu ăn|làm cơm'],
    ['你在干什么？', 'Bạn đang làm gì thế?', 'Bạn đang làm cái gì?', '你=bạn|cậu|anh|chị / 在=đang / 干什么=làm gì|làm cái gì'],
    ['他们在开会呢。', 'Họ đang họp.', 'Họ đang mở cuộc họp đấy.', '他们=họ|bọn họ / 在=đang / 开会=họp|họp hành|có cuộc họp / 呢=-'],
  ],
  bi: [
    ['哥哥比我高。', 'Anh trai cao hơn tôi.', 'Anh trai so với tôi cao.', '哥哥=anh trai|anh / 比我=hơn tôi|hơn mình|so với tôi / 高=cao'],
    ['今天比昨天热多了。', 'Hôm nay nóng hơn hôm qua nhiều.', 'Hôm nay so với hôm qua nóng nhiều rồi.', '今天=hôm nay / 比昨天=hơn hôm qua|so với hôm qua / 热=nóng / 多了=nhiều|hơn nhiều|nhiều lắm'],
    ['我的手机没有你的贵。', 'Điện thoại của tôi không đắt bằng của bạn.', 'Của tôi điện thoại không có của bạn đắt.', '我的手机=điện thoại của tôi|điện thoại của mình|điện thoại tôi / 没有=không bằng|không|chẳng bằng / 你的=của bạn|bạn|của cậu / 贵=đắt|mắc'],
  ],
  'de-complement': [
    ['她唱得很好。', 'Cô ấy hát rất hay.', 'Cô ấy hát đến rất tốt.', '她=cô ấy|chị ấy|bạn ấy / 唱=hát / 得=- / 很好=rất hay|rất tốt|giỏi|hay|tốt'],
    ['你说得太快了。', 'Bạn nói nhanh quá.', 'Bạn nói đến quá nhanh rồi.', '你=bạn|cậu|anh|chị / 说=nói / 得=- / 太快了=nhanh quá|quá nhanh'],
    ['他汉字写得很漂亮。', 'Anh ấy viết chữ Hán rất đẹp.', 'Anh ấy chữ Hán viết đến rất đẹp.', '他=anh ấy|cậu ấy / 汉字=chữ hán|chữ trung|chữ / 写=viết / 得=- / 很漂亮=rất đẹp|đẹp'],
  ],
  yinwei: [
    ['因为我生病了，所以没去上班。', 'Vì tôi bị ốm nên không đi làm.', 'Bởi vì tôi sinh bệnh rồi, cho nên không đi đi làm.', '因为=vì|bởi vì|do / 我=tôi|mình / 生病了=bị ốm|ốm|bị bệnh|bệnh / 所以=nên|cho nên|vì vậy|vì thế / 没去上班=không đi làm|không đến công ty|nghỉ làm'],
    ['虽然很贵，但是我很喜欢。', 'Tuy đắt nhưng tôi rất thích.', 'Tuy rằng rất đắt, nhưng mà tôi rất thích.', '虽然=tuy|tuy rằng|mặc dù|dù / 很贵=đắt|rất đắt|mắc / 但是=nhưng|nhưng mà / 我=tôi|mình / 很喜欢=rất thích|thích'],
    ['因为太累了，所以他睡得很早。', 'Vì mệt quá nên anh ấy ngủ rất sớm.', 'Bởi vì quá mệt rồi, cho nên anh ấy ngủ đến rất sớm.', '因为=vì|bởi vì|do / 太累了=mệt quá|quá mệt|rất mệt / 所以=nên|cho nên|vì vậy / 他=anh ấy|cậu ấy / 睡得很早=ngủ rất sớm|ngủ sớm|đi ngủ sớm'],
  ],
  xiwang: [
    ['我希望你喜欢这个礼物。', 'Tôi mong bạn thích món quà này.', 'Tôi hy vọng bạn thích cái quà này.', '我=tôi|mình / 希望=mong|hy vọng|hi vọng|mong là / 你=bạn|cậu|anh|chị / 喜欢=thích / 这个礼物=món quà này|quà này|cái quà này'],
    ['他希望明年去中国学习。', 'Anh ấy mong năm sau sang Trung Quốc học.', 'Anh ấy hy vọng năm sau đi Trung Quốc học tập.', '他=anh ấy|cậu ấy / 希望=mong|hy vọng|hi vọng|muốn / 明年=năm sau|năm tới / 去中国=sang trung quốc|đi trung quốc|đến trung quốc / 学习=học|học tập|du học'],
    ['希望明天是晴天。', 'Mong mai trời nắng.', 'Hy vọng ngày mai là ngày nắng.', '希望=mong|hy vọng|hi vọng|mong là / 明天=mai|ngày mai / 是晴天=trời nắng|nắng|là ngày nắng|trời đẹp'],
  ],
  yibian: [
    ['我一边做饭一边听音乐。', 'Tôi vừa nấu cơm vừa nghe nhạc.', 'Tôi một bên nấu cơm một bên nghe âm nhạc.', '我=tôi|mình / 一边做饭=vừa nấu cơm|vừa nấu ăn / 一边听音乐=vừa nghe nhạc'],
    ['他们一边走一边聊天。', 'Họ vừa đi vừa trò chuyện.', 'Họ một bên đi một bên nói chuyện.', '他们=họ|bọn họ / 一边走=vừa đi|vừa đi bộ / 一边聊天=vừa trò chuyện|vừa nói chuyện|vừa tán gẫu'],
    ['别一边吃饭一边看手机。', 'Đừng vừa ăn cơm vừa xem điện thoại.', 'Đừng một bên ăn cơm một bên xem điện thoại.', '别=đừng / 一边吃饭=vừa ăn cơm|vừa ăn / 一边看手机=vừa xem điện thoại|vừa nhìn điện thoại|vừa dùng điện thoại'],
  ],
  shuo: [
    ['老师说明天考试。', 'Cô giáo nói ngày mai thi.', 'Giáo viên nói ngày mai thi.', '老师=giáo viên|cô giáo|thầy giáo|thầy|cô / 说=nói|bảo / 明天=ngày mai|mai / 考试=thi|kiểm tra|có bài thi'],
    ['他告诉我他不来了。', 'Anh ấy bảo tôi là anh ấy không đến nữa.', 'Anh ấy nói cho tôi anh ấy không đến rồi.', '他=anh ấy|cậu ấy / 告诉我=bảo tôi|nói với tôi|nói cho tôi|báo tôi / 他=anh ấy|cậu ấy / 不来了=không đến nữa|không đến|không tới nữa'],
    ['妈妈问我饿不饿。', 'Mẹ hỏi tôi có đói không.', 'Mẹ hỏi tôi đói không đói.', '妈妈=mẹ|má / 问我=hỏi tôi|hỏi mình / 饿不饿=có đói không|đói không|đói chưa'],
  ],
  'ba-particle': [
    ['我们一起去吧。', 'Chúng ta cùng đi nhé.', 'Chúng ta cùng nhau đi đi.', '我们=chúng ta|chúng mình|chúng tôi|mình / 一起=cùng|cùng nhau / 去=đi / 吧=nhé|nha|đi|thôi'],
    ['你是越南人吧？', 'Bạn là người Việt Nam phải không?', 'Bạn là người Việt Nam chứ?', '你=bạn|cậu|anh|chị / 是=là / 越南人=người việt nam|người việt / 吧=phải không|đúng không|chứ|nhỉ'],
    ['休息一下吧。', 'Nghỉ một lát đi.', 'Nghỉ ngơi một chút đi.', '休息=nghỉ|nghỉ ngơi / 一下=một lát|một chút|một tí|chút / 吧=đi|nhé|nha|thôi'],
  ],
  'cong-dao': [
    ['我从星期一到星期五都工作。', 'Tôi làm việc từ thứ hai đến thứ sáu.', 'Tôi từ thứ hai đến thứ sáu đều làm việc.', '我=tôi|mình / 从星期一=từ thứ hai / 到星期五=đến thứ sáu|tới thứ sáu / 都=đều|- / 工作=làm việc|làm|đi làm'],
    ['从这儿到机场要一个小时。', 'Từ đây đến sân bay mất một tiếng.', 'Từ đây đến sân bay cần một giờ.', '从这儿=từ đây|từ chỗ này / 到机场=đến sân bay|tới sân bay|ra sân bay / 要=mất|cần|tốn / 一个小时=một tiếng|một giờ|1 tiếng|1 giờ'],
    ['商店从九点开到十点。', 'Cửa hàng mở cửa từ chín giờ đến mười giờ.', 'Cửa hàng từ chín giờ mở đến mười giờ.', '商店=cửa hàng|tiệm|shop / 从九点=từ chín giờ|từ 9 giờ / 开=mở|mở cửa|bán / 到十点=đến mười giờ|đến 10 giờ|tới mười giờ'],
  ],
  li: [
    ['我家离公司很远。', 'Nhà tôi cách công ty rất xa.', 'Nhà tôi rời công ty rất xa.', '我家=nhà tôi|nhà mình / 离公司=cách công ty|xa công ty / 很远=rất xa|xa|khá xa'],
    ['医院离这儿不远。', 'Bệnh viện cách đây không xa.', 'Bệnh viện rời đây không xa.', '医院=bệnh viện / 离这儿=cách đây|cách chỗ này|từ đây / 不远=không xa|chẳng xa'],
    ['离春节还有一个月。', 'Còn một tháng nữa là đến Tết.', 'Cách Tết vẫn có một tháng.', '离春节=đến tết|tới tết|cách tết / 还有=còn|còn có / 一个月=một tháng|1 tháng'],
  ],
  'gen-yiqi': [
    ['我想跟你一起学习。', 'Tôi muốn học cùng bạn.', 'Tôi muốn với bạn cùng nhau học tập.', '我=tôi|mình / 想=muốn / 跟你=với bạn|cùng bạn|với cậu / 一起=cùng|cùng nhau|- / 学习=học|học tập'],
    ['他和朋友一起去旅游了。', 'Anh ấy đã đi du lịch cùng bạn bè.', 'Anh ấy và bạn bè cùng nhau đi du lịch rồi.', '他=anh ấy|cậu ấy / 和朋友=với bạn|cùng bạn|với bạn bè|cùng bạn bè|và bạn / 一起=cùng|cùng nhau|- / 去旅游了=đi du lịch|đã đi du lịch|đi chơi'],
    ['周末你跟谁一起吃饭？', 'Cuối tuần bạn ăn cơm với ai?', 'Cuối tuần bạn với ai cùng nhau ăn cơm?', '周末=cuối tuần / 你=bạn|cậu|anh|chị / 跟谁=với ai|cùng ai / 一起=cùng|cùng nhau|- / 吃饭=ăn cơm|ăn|đi ăn'],
  ],
  yijing: [
    ['电影已经开始了。', 'Phim đã bắt đầu rồi.', 'Phim đã bắt đầu rồi.', '电影=phim|bộ phim / 已经=đã / 开始=bắt đầu|chiếu / 了=rồi|-'],
    ['我已经到了。', 'Tôi đến rồi.', 'Tôi đã đến rồi.', '我=tôi|mình / 已经=đã|- / 到了=đến rồi|đến nơi|tới rồi|đến'],
    ['他还没起床呢。', 'Anh ấy vẫn chưa dậy.', 'Anh ấy vẫn chưa thức dậy đâu.', '他=anh ấy|cậu ấy|nó / 还没=vẫn chưa|chưa|còn chưa / 起床=dậy|thức dậy|ngủ dậy / 呢=đâu|-'],
  ],
  gei: [
    ['我给妈妈买了一个包。', 'Tôi đã mua cho mẹ một cái túi.', 'Tôi cho mẹ mua rồi một cái túi.', '我=tôi|mình / 给妈妈=cho mẹ|tặng mẹ / 买了=mua|đã mua / 一个包=một cái túi|một chiếc túi|một túi|cái túi'],
    ['你给我打电话吧。', 'Bạn gọi điện cho tôi nhé.', 'Bạn cho tôi đánh điện thoại đi.', '你=bạn|cậu|anh|chị / 给我=cho tôi|cho mình / 打电话=gọi điện|gọi điện thoại|gọi / 吧=nhé|nha|đi'],
    ['他给了我一本书。', 'Anh ấy đưa cho tôi một quyển sách.', 'Anh ấy cho rồi tôi một quyển sách.', '他=anh ấy|cậu ấy / 给了我=đưa cho tôi|cho tôi|đưa tôi|tặng tôi / 一本书=một quyển sách|một cuốn sách|quyển sách|cuốn sách'],
  ],
  yinggai: [
    ['你应该早点儿睡觉。', 'Bạn nên đi ngủ sớm một chút.', 'Bạn nên sớm một chút ngủ.', '你=bạn|cậu|anh|chị / 应该=nên / 早点儿=sớm|sớm một chút|sớm hơn / 睡觉=ngủ|đi ngủ'],
    ['我得去上课了。', 'Tôi phải đi học rồi.', 'Tôi phải đi lên lớp rồi.', '我=tôi|mình / 得=phải|cần / 去上课=đi học|lên lớp|vào lớp / 了=rồi|-'],
    ['你不用担心。', 'Bạn không cần lo.', 'Bạn không dùng lo lắng.', '你=bạn|cậu|anh|chị / 不用=không cần|không phải|đừng / 担心=lo|lo lắng'],
  ],
  yixia: [
    ['你看一下这个。', 'Bạn xem cái này một chút.', 'Bạn xem một cái cái này.', '你=bạn|cậu|anh|chị / 看一下=xem một chút|xem thử|xem qua|nhìn chút|xem chút / 这个=cái này|này'],
    ['我去过三次上海。', 'Tôi đã đến Thượng Hải ba lần.', 'Tôi đi qua ba lần Thượng Hải.', '我=tôi|mình / 去过=đã đến|đã đi|từng đến|từng đi / 三次=ba lần|3 lần / 上海=thượng hải'],
    ['请等我一下。', 'Đợi tôi một lát nhé.', 'Xin đợi tôi một cái.', '请=xin|làm ơn|vui lòng|- / 等我=đợi tôi|chờ tôi|đợi mình|chờ mình / 一下=một lát|một chút|một tí|chút'],
  ],
};

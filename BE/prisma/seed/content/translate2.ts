// Câu luyện dịch HSK 3-4 (soạn 27/10/2026, CHƯA QUA DUYỆT). Cùng định dạng với translate.ts.
import type { TransSeed } from './translate.js';

export const TRANSLATE_MORE: Record<string, TransSeed[]> = {
  // ───────────── HSK 3 ─────────────
  ruguo: [
    ['如果你累了，就休息一会儿。', 'Nếu bạn mệt thì nghỉ một lát đi.', 'Nếu bạn mệt rồi, thì nghỉ ngơi một lúc.', '如果=nếu|nếu như|giả sử / 你累了=bạn mệt|cậu mệt|bạn thấy mệt / 就=thì|- / 休息一会儿=nghỉ một lát|nghỉ một chút|nghỉ ngơi một lúc|nghỉ chút'],
    ['要是明天不下雨，我们就去公园。', 'Nếu mai không mưa thì chúng ta đi công viên.', 'Nếu ngày mai không xuống mưa, chúng ta thì đi công viên.', '要是=nếu|nếu như|giả sử / 明天=mai|ngày mai / 不下雨=không mưa|trời không mưa / 我们=chúng ta|chúng mình|chúng tôi / 就=thì|- / 去公园=đi công viên|ra công viên|đến công viên'],
    ['如果有问题，就问老师。', 'Nếu có vấn đề thì hỏi giáo viên.', 'Nếu có vấn đề, thì hỏi giáo viên.', '如果=nếu|nếu như / 有问题=có vấn đề|có câu hỏi|có gì thắc mắc|có gì không hiểu / 就=thì|- / 问老师=hỏi giáo viên|hỏi thầy|hỏi cô|hỏi thầy cô'],
  ],
  'de-relative': [
    ['我喜欢你送我的礼物。', 'Tôi thích món quà bạn tặng tôi.', 'Tôi thích bạn tặng tôi của món quà.', '我=tôi|mình / 喜欢=thích / 你送我=bạn tặng tôi|bạn tặng mình|bạn tặng / 的=- / 礼物=quà|món quà'],
    ['穿红衣服的人是我姐姐。', 'Người mặc áo đỏ là chị tôi.', 'Mặc áo đỏ của người là chị tôi.', '穿红衣服=mặc áo đỏ|mặc đồ đỏ|mặc quần áo đỏ / 的=- / 人=người / 是=là / 我姐姐=chị tôi|chị gái tôi|chị mình'],
    ['昨天来的客人是谁？', 'Vị khách đến hôm qua là ai?', 'Hôm qua đến của khách là ai?', '昨天来=đến hôm qua|tới hôm qua|hôm qua đến / 的=- / 客人=khách|vị khách|người khách / 是谁=là ai'],
  ],
  bei: [
    ['我的钱包被偷了。', 'Ví của tôi bị trộm rồi.', 'Của tôi ví bị lấy trộm rồi.', '我的钱包=ví của tôi|ví tôi|ví tiền của tôi|ví của mình / 被=bị / 偷了=trộm|lấy trộm|trộm mất|móc mất|mất cắp'],
    ['蛋糕被弟弟吃完了。', 'Bánh bị em trai ăn hết rồi.', 'Bánh bị em trai ăn xong rồi.', '蛋糕=bánh|bánh ngọt|bánh kem|bánh gato / 被=bị / 弟弟=em trai|em / 吃完了=ăn hết|ăn hết rồi|ăn xong'],
    ['他被老师批评了。', 'Cậu ấy bị giáo viên phê bình.', 'Cậu ấy bị giáo viên phê bình rồi.', '他=cậu ấy|anh ấy|nó / 被=bị / 老师=giáo viên|thầy giáo|cô giáo|thầy|cô / 批评了=phê bình|mắng|trách|khiển trách'],
  ],
  ba: [
    ['请把窗户打开。', 'Mở cửa sổ ra giúp tôi.', 'Xin đem cửa sổ mở ra.', '请=xin|làm ơn|vui lòng|giúp|- / 把窗户=cửa sổ / 打开=mở|mở ra'],
    ['我把钥匙忘在家里了。', 'Tôi để quên chìa khóa ở nhà rồi.', 'Tôi đem chìa khóa quên ở trong nhà rồi.', '我=tôi|mình / 把钥匙=chìa khóa / 忘在=quên ở|để quên ở|để quên|quên / 家里了=nhà|ở nhà|trong nhà'],
    ['你把作业交给老师吧。', 'Bạn nộp bài tập cho giáo viên đi.', 'Bạn đem bài tập nộp cho giáo viên đi.', '你=bạn|cậu|anh|chị|em / 把作业=bài tập|bài tập về nhà / 交给=nộp cho|đưa cho|gửi cho|nộp / 老师吧=giáo viên|thầy|cô|thầy giáo|cô giáo'],
  ],
  'yaoshi-jiuhao': [
    ['要是我有很多钱就好了。', 'Giá mà tôi có thật nhiều tiền.', 'Nếu tôi có rất nhiều tiền thì tốt rồi.', '要是=giá mà|ước gì|nếu / 我=tôi|mình / 有很多钱=có nhiều tiền|có thật nhiều tiền|có rất nhiều tiền|giàu / 就好了=thì tốt|thì tốt quá|thì hay biết mấy|-'],
    ['要是今天是周末就好了。', 'Giá mà hôm nay là cuối tuần.', 'Nếu hôm nay là cuối tuần thì tốt rồi.', '要是=giá mà|ước gì|nếu / 今天=hôm nay / 是周末=là cuối tuần|cuối tuần / 就好了=thì tốt|thì tốt quá|-'],
    ['如果我是你，我就不去了。', 'Nếu tôi là bạn thì tôi không đi nữa.', 'Nếu tôi là bạn, tôi thì không đi rồi.', '如果=nếu|nếu như|giả sử / 我是你=tôi là bạn|mình là cậu|tôi là cậu / 我=tôi|mình / 就=thì|- / 不去了=không đi|không đi nữa|sẽ không đi'],
  ],
  chule: [
    ['除了汉语，我还学日语。', 'Ngoài tiếng Trung, tôi còn học tiếng Nhật.', 'Trừ tiếng Hán, tôi còn học tiếng Nhật.', '除了汉语=ngoài tiếng trung|ngoài tiếng hán|trừ tiếng trung|ngoài tiếng hoa / 我=tôi|mình / 还=còn|cũng / 学日语=học tiếng nhật'],
    ['除了小王，大家都同意了。', 'Ngoài Tiểu Vương ra, mọi người đều đồng ý.', 'Trừ Tiểu Vương, mọi người đều đồng ý rồi.', '除了小王=ngoài tiểu vương|trừ tiểu vương|trừ vương|ngoài vương / 大家=mọi người|tất cả mọi người|ai / 都=đều|cũng / 同意了=đồng ý'],
    ['除了周末，他每天都上班。', 'Trừ cuối tuần ra, ngày nào anh ấy cũng đi làm.', 'Ngoài cuối tuần, anh ấy mỗi ngày đều đi làm.', '除了周末=trừ cuối tuần|ngoài cuối tuần / 他=anh ấy|cậu ấy / 每天=ngày nào|mỗi ngày|hằng ngày|hàng ngày / 都=đều|cũng / 上班=đi làm|làm việc'],
  ],
  yuelaiyue: [
    ['他的汉语越来越好了。', 'Tiếng Trung của anh ấy ngày càng giỏi.', 'Của anh ấy tiếng Hán càng đến càng tốt rồi.', '他的汉语=tiếng trung của anh ấy|tiếng hán của anh ấy|tiếng trung của cậu ấy|tiếng trung anh ấy / 越来越=ngày càng|càng ngày càng|càng lúc càng / 好了=giỏi|tốt|hay|khá'],
    ['天越来越黑了。', 'Trời càng lúc càng tối.', 'Trời càng đến càng đen rồi.', '天=trời|bầu trời / 越来越=càng lúc càng|ngày càng|càng ngày càng|mỗi lúc một / 黑了=tối|đen'],
    ['这个城市越来越漂亮。', 'Thành phố này ngày càng đẹp.', 'Này thành phố càng đến càng đẹp.', '这个城市=thành phố này / 越来越=ngày càng|càng ngày càng|càng lúc càng / 漂亮=đẹp|xinh đẹp'],
  ],
  'shi-de': [
    ['我是坐飞机来的。', 'Tôi đến bằng máy bay.', 'Tôi là ngồi máy bay đến đấy.', '我=tôi|mình / 是=- / 坐飞机=bằng máy bay|đi máy bay|máy bay / 来的=đến|tới'],
    ['你是什么时候到的？', 'Bạn đến lúc nào?', 'Bạn là lúc nào đến vậy?', '你=bạn|cậu|anh|chị / 是=- / 什么时候=lúc nào|khi nào|bao giờ|mấy giờ / 到的=đến|tới'],
    ['这本书是在北京买的。', 'Quyển sách này mua ở Bắc Kinh.', 'Này quyển sách là ở Bắc Kinh mua đấy.', '这本书=quyển sách này|cuốn sách này|sách này / 是=- / 在北京=ở bắc kinh|tại bắc kinh / 买的=mua|được mua'],
  ],
  zhe: [
    ['窗户开着。', 'Cửa sổ đang mở.', 'Cửa sổ mở đang.', '窗户=cửa sổ / 开着=đang mở|mở|mở sẵn|vẫn mở'],
    ['她笑着说：“谢谢你！”', 'Cô ấy cười nói: "Cảm ơn bạn!"', 'Cô ấy cười đang nói: "Cảm ơn bạn!"', '她=cô ấy|chị ấy|bạn ấy / 笑着说=cười nói|mỉm cười nói|vừa cười vừa nói / 谢谢你=cảm ơn bạn|cảm ơn cậu|cảm ơn|cám ơn'],
    ['墙上挂着一张地图。', 'Trên tường treo một tấm bản đồ.', 'Tường trên treo đang một tấm bản đồ.', '墙上=trên tường|trên vách / 挂着=treo|có treo|đang treo / 一张=một tấm|một tờ|một / 地图=bản đồ'],
  ],
  'huo-haishi': [
    ['你想吃米饭还是面条？', 'Bạn muốn ăn cơm hay mì?', 'Bạn muốn ăn cơm hay là mì sợi?', '你=bạn|cậu|anh|chị / 想吃=muốn ăn / 米饭=cơm / 还是=hay|hay là / 面条=mì|mì sợi|bún'],
    ['星期六或者星期天都可以。', 'Thứ bảy hoặc chủ nhật đều được.', 'Thứ bảy hoặc là chủ nhật đều có thể.', '星期六=thứ bảy|thứ 7 / 或者=hoặc|hoặc là|hay / 星期天=chủ nhật / 都=đều|cũng / 可以=được|có thể|ok'],
    ['你是学生还是老师？', 'Bạn là học sinh hay giáo viên?', 'Bạn là học sinh hay là giáo viên?', '你=bạn|cậu|anh|chị / 是学生=là học sinh|là sinh viên|học sinh / 还是=hay|hay là / 老师=giáo viên|thầy giáo|cô giáo'],
  ],
  'yi-jiu': [
    ['我一到家就给你打电话。', 'Tôi về đến nhà là gọi điện cho bạn ngay.', 'Tôi một đến nhà thì cho bạn gọi điện.', '我=tôi|mình / 一到家=về đến nhà|vừa về nhà|vừa đến nhà|đến nhà / 就=là|liền|thì|ngay|sẽ / 给你打电话=gọi cho bạn|gọi điện cho bạn|gọi điện thoại cho bạn|gọi cho cậu'],
    ['他一喝酒就脸红。', 'Anh ấy hễ uống rượu là đỏ mặt.', 'Anh ấy một uống rượu thì mặt đỏ.', '他=anh ấy|cậu ấy|ông ấy / 一喝酒=uống rượu|hễ uống rượu|cứ uống rượu|uống bia / 就=là|thì|liền / 脸红=đỏ mặt|mặt đỏ'],
    ['老师一说我就明白了。', 'Thầy vừa nói là tôi hiểu ngay.', 'Giáo viên một nói tôi thì hiểu rồi.', '老师=thầy|cô|giáo viên|thầy giáo|cô giáo / 一说=vừa nói|nói một cái|vừa giảng / 我=tôi|mình / 就=là|liền|thì|ngay / 明白了=hiểu|hiểu rồi|hiểu ngay'],
  ],
  budan: [
    ['这家饭馆不但便宜，而且很干净。', 'Quán này không những rẻ mà còn rất sạch.', 'Này nhà quán ăn không những rẻ, mà còn rất sạch sẽ.', '这家饭馆=quán này|nhà hàng này|quán ăn này / 不但=không những|không chỉ / 便宜=rẻ / 而且=mà còn|hơn nữa|lại còn / 很干净=rất sạch|sạch|sạch sẽ'],
    ['他不但会唱歌，而且会跳舞。', 'Anh ấy không chỉ biết hát mà còn biết nhảy.', 'Anh ấy không những biết hát, mà còn biết nhảy múa.', '他=anh ấy|cậu ấy / 不但=không những|không chỉ / 会唱歌=biết hát|hát được|hát hay / 而且=mà còn|hơn nữa|lại còn / 会跳舞=biết nhảy|biết múa|nhảy được|biết khiêu vũ'],
    ['今天不但冷，而且下雪了。', 'Hôm nay không chỉ lạnh mà còn có tuyết rơi.', 'Hôm nay không những lạnh, mà còn xuống tuyết rồi.', '今天=hôm nay / 不但=không những|không chỉ / 冷=lạnh|rét / 而且=mà còn|hơn nữa|lại còn / 下雪了=tuyết rơi|có tuyết|xuống tuyết'],
  ],
  shihou: [
    ['我小的时候很喜欢画画。', 'Hồi nhỏ tôi rất thích vẽ tranh.', 'Tôi nhỏ của lúc rất thích vẽ tranh.', '我小的时候=hồi nhỏ|lúc nhỏ|khi còn nhỏ|lúc tôi còn nhỏ|hồi bé|lúc bé / 很喜欢=rất thích|thích / 画画=vẽ|vẽ tranh'],
    ['吃饭以前要洗手。', 'Trước khi ăn cơm phải rửa tay.', 'Ăn cơm trước phải rửa tay.', '吃饭以前=trước khi ăn|trước khi ăn cơm|trước bữa ăn / 要=phải|cần|nên / 洗手=rửa tay'],
    ['毕业以后，你想做什么？', 'Sau khi tốt nghiệp, bạn muốn làm gì?', 'Tốt nghiệp sau, bạn muốn làm cái gì?', '毕业以后=sau khi tốt nghiệp|tốt nghiệp xong|ra trường / 你=bạn|cậu|em / 想做什么=muốn làm gì|định làm gì|muốn làm nghề gì'],
  ],
  jieguo: [
    ['我找到我的手机了。', 'Tôi tìm thấy điện thoại của tôi rồi.', 'Tôi tìm đến của tôi điện thoại rồi.', '我=tôi|mình / 找到=tìm thấy|tìm được|thấy / 我的手机了=điện thoại của tôi|điện thoại|điện thoại của mình'],
    ['你听懂了吗？', 'Bạn nghe hiểu chưa?', 'Bạn nghe hiểu rồi không?', '你=bạn|cậu|anh|chị|em / 听懂了=nghe hiểu|hiểu|nghe hiểu được / 吗=chưa|không|à'],
    ['晚饭做好了，快来吃吧。', 'Cơm tối nấu xong rồi, mau đến ăn đi.', 'Cơm tối làm tốt rồi, nhanh đến ăn đi.', '晚饭=cơm tối|bữa tối / 做好了=nấu xong|làm xong|xong rồi|chuẩn bị xong / 快来=mau đến|nhanh đến|mau lại|mau vào|mau ra / 吃吧=ăn đi|ăn thôi|ăn nhé'],
  ],
  youdian: [
    ['今天我有点儿不舒服。', 'Hôm nay tôi hơi khó chịu trong người.', 'Hôm nay tôi có một chút không thoải mái.', '今天=hôm nay / 我=tôi|mình / 有点儿=hơi|có hơi|có chút / 不舒服=khó chịu|mệt|không khỏe|không thoải mái|ốm'],
    ['请说慢一点儿。', 'Xin hãy nói chậm một chút.', 'Xin nói chậm một chút.', '请=xin|làm ơn|vui lòng|- / 说=nói / 慢一点儿=chậm một chút|chậm chút|chậm lại|chậm thôi'],
    ['这个汤有点儿咸。', 'Canh này hơi mặn.', 'Này canh có một chút mặn.', '这个汤=canh này|món canh này|súp này / 有点儿=hơi|có hơi|có chút / 咸=mặn'],
  ],
  rang: [
    ['老板让我明天早点儿来。', 'Sếp bảo tôi mai đến sớm một chút.', 'Ông chủ để tôi ngày mai sớm chút đến.', '老板=sếp|ông chủ|bà chủ|giám đốc / 让我=bảo tôi|bắt tôi|kêu tôi|yêu cầu tôi|để tôi / 明天=mai|ngày mai / 早点儿来=đến sớm|đến sớm một chút|tới sớm'],
    ['妈妈不让我玩游戏。', 'Mẹ không cho tôi chơi game.', 'Mẹ không để tôi chơi trò chơi.', '妈妈=mẹ|má / 不让我=không cho tôi|không để tôi|cấm tôi|không cho mình / 玩游戏=chơi game|chơi trò chơi|chơi điện tử'],
    ['请你帮我一下。', 'Bạn giúp tôi một chút nhé.', 'Mời bạn giúp tôi một cái.', '请你=nhờ bạn|xin bạn|làm ơn|bạn / 帮我=giúp tôi|giúp mình|giúp em / 一下=một chút|một tay|chút|với|nhé'],
  ],
  'jiu-cai': [
    ['他六点就起床了。', 'Mới sáu giờ anh ấy đã dậy rồi.', 'Anh ấy sáu giờ thì dậy rồi.', '他=anh ấy|cậu ấy / 六点=sáu giờ|6 giờ / 就=đã|mới|- / 起床了=dậy|thức dậy|dậy rồi|ngủ dậy'],
    ['我十二点才睡觉。', 'Mười hai giờ tôi mới đi ngủ.', 'Tôi mười hai giờ mới ngủ.', '我=tôi|mình / 十二点=mười hai giờ|12 giờ|nửa đêm / 才=mới / 睡觉=ngủ|đi ngủ'],
    ['他学了三个月才会说。', 'Anh ấy học ba tháng mới nói được.', 'Anh ấy học rồi ba tháng mới biết nói.', '他=anh ấy|cậu ấy / 学了=học|đã học / 三个月=ba tháng|3 tháng / 才=mới / 会说=nói được|biết nói'],
  ],
  tingshuo: [
    ['听说明天有大雨。', 'Nghe nói mai có mưa to.', 'Nghe nói ngày mai có mưa lớn.', '听说=nghe nói|nghe bảo|nghe đồn / 明天=mai|ngày mai / 有大雨=có mưa to|có mưa lớn|mưa to|mưa lớn'],
    ['我听说你找到工作了。', 'Tôi nghe nói bạn tìm được việc rồi.', 'Tôi nghe nói bạn tìm đến công việc rồi.', '我=tôi|mình / 听说=nghe nói|nghe bảo|nghe tin / 你=bạn|cậu|anh|chị|em / 找到工作了=tìm được việc|có việc làm|tìm được công việc|xin được việc|có việc'],
    ['听说那个电影很好看。', 'Nghe nói bộ phim đó rất hay.', 'Nghe nói cái phim đó rất đẹp mắt.', '听说=nghe nói|nghe bảo / 那个电影=bộ phim đó|phim đó|phim kia|bộ phim kia / 很好看=rất hay|hay|rất đáng xem'],
  ],
  'de-nominal': [
    ['这个是我的，那个是你的。', 'Cái này của tôi, cái kia của bạn.', 'Cái này là của tôi, cái kia là của bạn.', '这个=cái này|này / 是我的=của tôi|là của tôi|của mình / 那个=cái kia|cái đó|kia / 是你的=của bạn|là của bạn|của cậu'],
    ['开车的是我哥哥。', 'Người lái xe là anh trai tôi.', 'Lái xe của là anh trai tôi.', '开车的=người lái xe|người lái|tài xế / 是=là / 我哥哥=anh trai tôi|anh tôi|anh mình'],
    ['我要大的，不要小的。', 'Tôi lấy cái to, không lấy cái nhỏ.', 'Tôi muốn to của, không muốn nhỏ của.', '我=tôi|mình / 要大的=lấy cái to|muốn cái to|lấy cái lớn|muốn cái lớn|cái to|cái lớn / 不要小的=không lấy cái nhỏ|không muốn cái nhỏ|không cần cái nhỏ|cái nhỏ'],
  ],

  // ───────────── HSK 4 ─────────────
  zhiyao: [
    ['只要你努力，就一定能学好。', 'Chỉ cần bạn cố gắng là nhất định học tốt được.', 'Chỉ cần bạn nỗ lực, thì nhất định có thể học tốt.', '只要=chỉ cần|miễn là / 你=bạn|cậu|em / 努力=cố gắng|nỗ lực|chăm chỉ / 就=là|thì|- / 一定=nhất định|chắc chắn|sẽ / 能学好=học tốt|học giỏi|học được'],
    ['只要不下雨，我们就去爬山。', 'Miễn là không mưa thì chúng ta đi leo núi.', 'Chỉ cần không xuống mưa, chúng ta thì đi leo núi.', '只要=chỉ cần|miễn là / 不下雨=không mưa|trời không mưa / 我们=chúng ta|chúng mình|chúng tôi / 就=thì|là|- / 去爬山=đi leo núi|leo núi'],
  ],
  zhiyou: [
    ['只有多说，才能说得好。', 'Chỉ có nói nhiều mới nói giỏi được.', 'Chỉ có nhiều nói, mới có thể nói đến tốt.', '只有=chỉ có|chỉ khi / 多说=nói nhiều|luyện nói nhiều|nói thật nhiều / 才=mới / 能说得好=nói giỏi|nói tốt|nói hay|nói được tốt'],
    ['只有你能帮我。', 'Chỉ có bạn mới giúp được tôi.', 'Chỉ có bạn có thể giúp tôi.', '只有你=chỉ có bạn|chỉ bạn|chỉ có cậu / 能帮我=giúp được tôi|có thể giúp tôi|giúp tôi|giúp được mình'],
  ],
  jishi: [
    ['即使很忙，他也每天跑步。', 'Dù bận đến mấy, ngày nào anh ấy cũng chạy bộ.', 'Cho dù rất bận, anh ấy cũng mỗi ngày chạy bộ.', '即使=dù|cho dù|kể cả|mặc dù|dù cho / 很忙=bận|rất bận|bận đến mấy / 他=anh ấy|cậu ấy / 也=cũng|vẫn / 每天=mỗi ngày|ngày nào|hằng ngày|hàng ngày / 跑步=chạy bộ|chạy'],
    ['即使你不说，我也知道。', 'Cho dù bạn không nói thì tôi cũng biết.', 'Cho dù bạn không nói, tôi cũng biết.', '即使=dù|cho dù|kể cả|dù cho / 你不说=bạn không nói|cậu không nói / 我=tôi|mình / 也=cũng|vẫn / 知道=biết'],
  ],
  jiran: [
    ['既然你喜欢，就买吧。', 'Bạn đã thích thì mua đi.', 'Đã là bạn thích, thì mua đi.', '既然=đã|vì|đã vậy|khi mà / 你喜欢=bạn thích|cậu thích / 就=thì|- / 买吧=mua đi|mua thôi|mua nhé'],
    ['既然下雨了，我们就别出去了。', 'Trời đã mưa rồi thì mình đừng ra ngoài nữa.', 'Đã là xuống mưa rồi, chúng ta thì đừng đi ra ngoài rồi.', '既然=đã|vì|đã vậy / 下雨了=mưa|trời mưa|mưa rồi / 我们=chúng ta|mình|chúng mình / 就=thì|- / 别出去了=đừng ra ngoài|đừng đi ra ngoài|đừng đi chơi|ở nhà'],
  ],
  wulun: [
    ['无论遇到什么困难，我都不放弃。', 'Dù gặp khó khăn gì tôi cũng không bỏ cuộc.', 'Vô luận gặp phải cái gì khó khăn, tôi đều không từ bỏ.', '无论=dù|bất kể|cho dù|dù cho / 遇到什么困难=gặp khó khăn gì|gặp bất kỳ khó khăn nào|có khó khăn gì / 我=tôi|mình / 都=cũng|đều / 不放弃=không bỏ cuộc|không từ bỏ|không bỏ'],
    ['不管你去哪儿，我都跟着你。', 'Bạn đi đâu tôi cũng theo bạn.', 'Bất kể bạn đi đâu, tôi đều theo bạn.', '不管=dù|bất kể|cho dù|- / 你去哪儿=bạn đi đâu|cậu đi đâu|em đi đâu / 我=tôi|mình|anh / 都=cũng|đều / 跟着你=theo bạn|đi theo bạn|theo cậu|theo em|bên bạn'],
  ],
  lian: [
    ['他忙得连饭都没时间吃。', 'Anh ấy bận đến mức không có thời gian ăn cơm.', 'Anh ấy bận đến ngay cả cơm cũng không có thời gian ăn.', '他=anh ấy|cậu ấy / 忙得=bận đến mức|bận đến nỗi|bận tới mức|bận / 连饭=ngay cả cơm|đến cơm|cơm / 都没时间吃=không có thời gian ăn|cũng không có thời gian ăn|không kịp ăn|chẳng có thời gian ăn'],
    ['这个问题连老师也不知道。', 'Câu hỏi này đến giáo viên cũng không biết.', 'Này câu hỏi ngay cả giáo viên cũng không biết.', '这个问题=câu hỏi này|vấn đề này / 连老师=đến giáo viên|ngay cả giáo viên|cả giáo viên|ngay cả thầy|đến thầy|đến cô / 也=cũng / 不知道=không biết'],
  ],
  'keneng-buyu': [
    ['字太小了，我看不清楚。', 'Chữ nhỏ quá, tôi nhìn không rõ.', 'Chữ quá nhỏ rồi, tôi xem không rõ ràng.', '字=chữ / 太小了=nhỏ quá|quá nhỏ / 我=tôi|mình / 看不清楚=nhìn không rõ|xem không rõ|không nhìn rõ|không đọc rõ|đọc không rõ'],
    ['这么多作业，你今天做得完吗？', 'Nhiều bài tập thế này, hôm nay bạn làm xong được không?', 'Nhiều như này bài tập, bạn hôm nay làm đến xong không?', '这么多作业=nhiều bài tập thế này|nhiều bài tập như vậy|bài tập nhiều thế|nhiều bài tập thế / 你=bạn|cậu|em / 今天=hôm nay / 做得完吗=làm xong được không|làm có xong không|làm kịp không|làm hết được không'],
  ],
  duilaishuo: [
    ['对我来说，家人最重要。', 'Với tôi, gia đình là quan trọng nhất.', 'Đối với tôi mà nói, người nhà quan trọng nhất.', '对我来说=với tôi|đối với tôi|theo tôi|với mình / 家人=gia đình|người nhà|người thân / 最重要=quan trọng nhất|là quan trọng nhất'],
    ['这是一本关于中国文化的书。', 'Đây là một quyển sách về văn hóa Trung Quốc.', 'Đây là một quyển về Trung Quốc văn hóa của sách.', '这是=đây là / 一本=một quyển|một cuốn|một / 关于中国文化=về văn hóa trung quốc|nói về văn hóa trung quốc|liên quan đến văn hóa trung quốc / 的=- / 书=sách|quyển sách|cuốn sách'],
  ],
  yaobushi: [
    ['要不是你提醒我，我就忘了。', 'Nếu không nhờ bạn nhắc thì tôi quên mất rồi.', 'Nếu không phải bạn nhắc nhở tôi, tôi thì quên rồi.', '要不是=nếu không nhờ|nếu không phải|nếu không có|may mà|nếu không / 你提醒我=bạn nhắc tôi|bạn nhắc|bạn nhắc mình|cậu nhắc / 我=tôi|mình / 就=thì|là|đã|- / 忘了=quên|quên mất|quên rồi'],
    ['要不是堵车，我早就到了。', 'Nếu không kẹt xe thì tôi đã đến từ lâu rồi.', 'Nếu không phải tắc đường, tôi sớm thì đến rồi.', '要不是=nếu không phải|nếu không có|nếu không vì|nếu không / 堵车=kẹt xe|tắc đường|tắc xe|kẹt đường / 我=tôi|mình / 早就到了=đến từ lâu|đến lâu rồi|đã đến rồi|đến sớm rồi|đến nơi rồi'],
  ],
  yuqi: [
    ['与其在家睡觉，不如出去走走。', 'Thay vì ở nhà ngủ, chi bằng ra ngoài đi dạo.', 'Cùng với ở nhà ngủ, không bằng đi ra đi đi.', '与其=thay vì|với|so với / 在家睡觉=ở nhà ngủ|ngủ ở nhà|nằm nhà ngủ / 不如=chi bằng|không bằng|thà|tốt hơn là|nên / 出去走走=ra ngoài đi dạo|đi dạo|ra ngoài dạo|đi ra ngoài'],
    ['我宁可走路，也不坐他的车。', 'Tôi thà đi bộ chứ không đi xe của anh ta.', 'Tôi thà đi đường, cũng không ngồi của anh ấy xe.', '我=tôi|mình / 宁可=thà|thà rằng / 走路=đi bộ / 也不=chứ không|cũng không|còn hơn / 坐他的车=đi xe của anh ta|đi xe anh ấy|ngồi xe của anh ấy|đi xe của anh ấy|đi nhờ xe anh ấy'],
  ],
};

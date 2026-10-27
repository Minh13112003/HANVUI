// Cách nhớ chữ (chiết tự / câu chuyện) + mẫu cụm từ đi kèm + câu ví dụ cho 150 từ HSK 1 (soạn 27/10/2026, CHƯA QUA DUYỆT).
// Mỗi dòng: từ | cách nhớ | mẫu cụm từ :: câu ví dụ 1 = nghĩa ;; câu ví dụ 2 = nghĩa
// Phần tách chữ tự động (bộ phận, chỉ nghĩa/chỉ âm) lấy từ dữ liệu Make Me a Hanzi; ở đây là câu chuyện giúp nhớ.
export const WORD_EXTRA_HSK1 = `一|Một nét ngang: một que tính nằm ngang|一 + lượng từ + danh từ :: 一个人 = một người ;; 我有一本书。= Tôi có một quyển sách.
二|Hai nét ngang: hai que tính, nét dưới dài hơn|二 + 月/号 :: 二月 = tháng hai ;; 今天二号。= Hôm nay mùng hai.
三|Ba nét ngang: ba que tính xếp chồng|三 + lượng từ + danh từ :: 三个苹果 = ba quả táo ;; 我家有三口人。= Nhà tôi có ba người.
四|Một khung (囗) có hai chân bên trong: căn phòng bốn góc|四 + 点/个 :: 四点 = bốn giờ ;; 他四岁了。= Bé bốn tuổi rồi.
五|Hình cái ống chỉ có hai vạch trên dưới: năm ngón tay xòe ra|五 + 块/个 :: 五块钱 = năm đồng ;; 我五点下班。= Tôi tan làm lúc năm giờ.
六|Mái nhà (亠) với hai chân: căn nhà sáu cột|六 + 月/点 :: 六月 = tháng sáu ;; 他六点起床。= Anh ấy dậy lúc sáu giờ.
七|Giống số 7 lộn ngược có nét cắt ngang|七 + 天/点 :: 七天 = bảy ngày ;; 一个星期有七天。= Một tuần có bảy ngày.
八|Hai nét tách ra như hai bàn tay chia đôi: số tám (số phát tài)|八 + 点/个 :: 八点 = tám giờ ;; 我八点上课。= Tôi vào học lúc tám giờ.
九|Như cánh tay dài vươn ra: số chín, gần tới mười|九 + 月/点 :: 九月 = tháng chín ;; 现在九点。= Bây giờ chín giờ.
十|Dấu cộng: một ngang một dọc, đủ mười|十 + 块/个/点 :: 十块钱 = mười đồng ;; 十点我睡觉。= Mười giờ tôi đi ngủ.
零|Bộ 雨 (mưa) + 令: giọt mưa rơi rồi không còn gì, số không|零 + 下 :: 零下五度 = âm năm độ ;; 我的电话号码有三个零。= Số điện thoại của tôi có ba số không.
上|Một vạch dài làm mặt đất, nét dọc vươn lên trên|上 + 面/午/班 :: 桌子上 = trên bàn ;; 书在桌子上。= Sách ở trên bàn.
下|Mặt đất ở trên, nét dọc chúi xuống dưới|下 + 面/午/雨 :: 下午 = buổi chiều ;; 猫在桌子下面。= Con mèo ở dưới bàn.
上午|上 (trên) + 午 (giữa trưa): nửa trên của ngày, trước giữa trưa → buổi sáng|上午 + 时间 :: 上午九点 = chín giờ sáng ;; 我上午有课。= Buổi sáng tôi có tiết học.
下午|下 (dưới) + 午 (giữa trưa): nửa sau của ngày → buổi chiều|下午 + 时间 :: 下午三点 = ba giờ chiều ;; 下午我们去商店。= Chiều nay chúng ta đi cửa hàng.
中午|中 (giữa) + 午 (trưa): chính giữa ngày → buổi trưa|中午 + 吃饭/休息 :: 中午吃饭 = ăn trưa ;; 中午我在学校吃饭。= Buổi trưa tôi ăn cơm ở trường.
下雨|下 (rơi xuống) + 雨 (mưa: những hạt nước dưới mái trời)|下雨了 / 要下雨 :: 外面下雨了。= Bên ngoài mưa rồi. ;; 明天会下雨吗？= Mai có mưa không?
不|Một nét ngang chặn trên đầu: chặn lại, không|不 + động từ/tính từ :: 不喝 = không uống ;; 我不喜欢茶。= Tôi không thích trà.
不客气|不 (không) + 客气 (khách khí, khách sáo): đừng khách sáo → không có gì|谢谢！— 不客气。 :: “谢谢你！”“不客气。” = "Cảm ơn bạn!" "Không có gì." ;; 不客气，这是我应该做的。= Đừng khách sáo, đây là việc tôi nên làm.
东西|东 (đông) + 西 (tây): đồ từ đông sang tây, mọi thứ → đồ vật|买/吃 + 东西 :: 买东西 = mua đồ ;; 我去商店买东西。= Tôi đi cửa hàng mua đồ.
个|Người (人) đứng cạnh một cây cột: đếm từng cái, từng người|số + 个 + danh từ :: 一个人 = một người ;; 我有两个朋友。= Tôi có hai người bạn.
中国|中 (giữa: mũi tên xuyên qua tâm) + 国 (nước: vòng biên giới bao ngọc): nước ở giữa → Trung Quốc|中国 + 人/菜 :: 中国人 = người Trung Quốc ;; 我想去中国。= Tôi muốn đi Trung Quốc.
书|Hình cây bút đang viết: thứ được viết ra → sách|一本 + 书 / 看书 :: 看书 = đọc sách ;; 这是我的书。= Đây là sách của tôi.
买|Phía trên là cái túi, dưới là đầu người đeo đồ: mang đồ về → mua|买 + đồ vật :: 买东西 = mua đồ ;; 我想买一个苹果。= Tôi muốn mua một quả táo.
了|Một sợi dây buộc xong ở cuối: xong rồi|động từ + 了 :: 我吃了。= Tôi ăn rồi. ;; 他来了。= Anh ấy đến rồi.
些|此 (này) + 二 (hai): không chỉ một → một vài|一些 + danh từ :: 一些水果 = một ít hoa quả ;; 这些书是我的。= Những quyển sách này là của tôi.
人|Hình người đang bước, hai chân dang ra|danh từ + 人 :: 中国人 = người Trung Quốc ;; 那个人是谁？= Người kia là ai?
什么|什 (thập) + 么 (gì): cái gì|动词 + 什么 :: 你吃什么？= Bạn ăn gì? ;; 这是什么？= Đây là cái gì?
今天|今 (nay, bây giờ) + 天 (ngày, trời): ngày nay → hôm nay|今天 + thứ/ngày :: 今天星期一。= Hôm nay thứ hai. ;; 今天很热。= Hôm nay rất nóng.
他|亻 (người) + 也: người ấy (nam)|他 + 是/叫 :: 他是我哥哥。= Anh ấy là anh trai tôi. ;; 他叫什么名字？= Anh ấy tên là gì?
会|人 (người) đứng trên 云 (mây, nói): người có thể nói ra → biết, sẽ|会 + động từ :: 会说汉语 = biết nói tiếng Trung ;; 我会开车。= Tôi biết lái xe.
住|亻 (người) + 主 (chủ): người làm chủ một chỗ → ở, cư trú|住 + 在 + nơi chốn :: 住在北京 = sống ở Bắc Kinh ;; 你住在哪儿？= Bạn sống ở đâu?
你|亻 (người) + 尔 (ngươi): người đối diện → bạn|你 + 好/是 :: 你好 = xin chào ;; 你是学生吗？= Bạn là học sinh à?
做|亻 (người) + 故 (việc cũ): người bắt tay vào việc → làm|做 + 饭/作业 :: 做饭 = nấu cơm ;; 你在做什么？= Bạn đang làm gì?
儿子|儿 (đứa trẻ) + 子 (con): đứa con → con trai|我/他 + 的 + 儿子 :: 我的儿子 = con trai tôi ;; 他儿子三岁了。= Con trai anh ấy ba tuổi rồi.
先生|先 (trước) + 生 (sinh): người sinh ra trước → ông, ngài; cũng là "chồng"|họ + 先生 :: 王先生 = ông Vương ;; 李先生是医生。= Ông Lý là bác sĩ.
再见|再 (lại, lần nữa) + 见 (thấy): gặp lại → tạm biệt|明天见 / 再见 :: 老师，再见！= Chào cô ạ! ;; 我们明天再见。= Mai chúng ta gặp lại nhé.
写|冖 (mái che) + 与: ngồi dưới mái nhà viết chữ → viết|写 + 字/信 :: 写汉字 = viết chữ Hán ;; 你会写这个字吗？= Bạn biết viết chữ này không?
冷|冫 (băng) + 令: có băng đá → lạnh|很/太 + 冷 :: 天气很冷 = trời rất lạnh ;; 今天太冷了。= Hôm nay lạnh quá.
几|Hình cái bàn nhỏ: đếm mấy cái bàn → mấy (số ít, dưới 10)|几 + lượng từ + danh từ :: 几个人？= Mấy người? ;; 你几岁了？= Con mấy tuổi rồi?
出租车|出 (ra) + 租 (thuê) + 车 (xe): xe cho thuê → taxi|坐 + 出租车 :: 坐出租车 = đi taxi ;; 我们坐出租车去吧。= Chúng ta đi taxi nhé.
分钟|分 (phân chia) + 钟 (chuông, đồng hồ): một phần nhỏ của giờ → phút|数 + 分钟 :: 十分钟 = mười phút ;; 请等我五分钟。= Đợi tôi năm phút nhé.
前面|前 (trước) + 面 (mặt): phía mặt trước → phía trước|nơi + 前面 :: 学校前面 = phía trước trường ;; 前面有一个商店。= Phía trước có một cửa hàng.
北京|北 (bắc: hai người quay lưng) + 京 (kinh đô): kinh đô phía bắc → Bắc Kinh|在/去 + 北京 :: 去北京 = đi Bắc Kinh ;; 我住在北京。= Tôi sống ở Bắc Kinh.
医生|医 (y: mũi tên trong hộp thuốc) + 生 (người): người chữa bệnh → bác sĩ|是 + 医生 / 看医生 :: 看医生 = đi khám bác sĩ ;; 我爸爸是医生。= Bố tôi là bác sĩ.
医院|医 (y) + 院 (viện, tòa nhà có sân): nơi chữa bệnh → bệnh viện|去 + 医院 :: 去医院 = đi bệnh viện ;; 他在医院工作。= Anh ấy làm việc ở bệnh viện.
去|土 (đất) + 厶: người rời mảnh đất của mình → đi|去 + nơi chốn :: 去学校 = đi học (đến trường) ;; 你去哪儿？= Bạn đi đâu?
叫|口 (miệng) + 丩: há miệng gọi to → gọi, tên là|叫 + tên :: 我叫小明。= Tôi tên là Tiểu Minh. ;; 你叫什么名字？= Bạn tên là gì?
吃|口 (miệng) + 乞: miệng xin đồ ăn → ăn|吃 + 饭/东西 :: 吃饭 = ăn cơm ;; 你想吃什么？= Bạn muốn ăn gì?
同学|同 (cùng) + 学 (học): người cùng học → bạn học|我的 + 同学 :: 大学同学 = bạn đại học ;; 他是我的同学。= Cậu ấy là bạn học của tôi.
名字|名 (夕 tối + 口 miệng: tối không thấy mặt phải gọi tên) + 字 (chữ): chữ để gọi → tên|叫什么 + 名字 :: 你的名字 = tên của bạn ;; 你叫什么名字？= Bạn tên là gì?
后面|后 (sau) + 面 (mặt): phía sau|nơi + 后面 :: 房子后面 = phía sau nhà ;; 医院在学校后面。= Bệnh viện ở sau trường.
吗|口 (miệng) + 马 (âm mǎ): tiếng hỏi cuối câu|câu + 吗？ :: 你好吗？= Bạn khỏe không? ;; 你是老师吗？= Bạn là giáo viên à?
听|口 (miệng) + 斤: lời từ miệng người khác đến tai → nghe|听 + 音乐/老师 :: 听音乐 = nghe nhạc ;; 我喜欢听音乐。= Tôi thích nghe nhạc.
呢|口 (miệng) + 尼 (âm ní): tiếng hỏi "còn … thì sao?"|A 呢？ :: 我很好，你呢？= Mình khỏe, còn bạn? ;; 我的手机呢？= Điện thoại của tôi đâu rồi?
和|禾 (lúa) + 口 (miệng): có lúa ăn, mọi người hòa thuận → và, với|A 和 B :: 我和你 = tôi và bạn ;; 我和妈妈去商店。= Tôi và mẹ đi cửa hàng.
哪|口 (miệng) + 那 (kia): hỏi "cái nào, ở đâu"|哪 + lượng từ / 哪儿 :: 哪个？= Cái nào? ;; 你是哪国人？= Bạn là người nước nào?
商店|商 (buôn bán) + 店 (广 mái nhà + 占: căn nhà có quầy) → cửa hàng|去 + 商店 :: 去商店 = đi cửa hàng ;; 这个商店很大。= Cửa hàng này rất lớn.
喂|口 (miệng) + 畏: tiếng gọi khi nhấc máy → alô|喂，你好！ :: 喂，你是谁？= Alô, ai đấy? ;; 喂，你在哪儿？= Alô, bạn đang ở đâu?
喜欢|喜 (vui: trống và miệng cười) + 欢 (vui vẻ): thấy vui khi gặp → thích|喜欢 + danh từ/động từ :: 喜欢看书 = thích đọc sách ;; 我很喜欢你。= Tôi rất thích bạn.
喝|口 (miệng) + 曷: miệng hớp nước → uống|喝 + 水/茶 :: 喝茶 = uống trà ;; 你想喝什么？= Bạn muốn uống gì?
回|Một ô vuông trong ô vuông: quay vòng về chỗ cũ → về|回 + 家/来 :: 回家 = về nhà ;; 我五点回家。= Năm giờ tôi về nhà.
在|土 (đất) + nét móc: có chỗ đứng trên đất → ở; đang|在 + nơi chốn / 在 + động từ :: 在家 = ở nhà ;; 他在看书。= Anh ấy đang đọc sách.
坐|Hai người (人人) ngồi trên đất (土) → ngồi; đi (xe)|坐 + 车/飞机 :: 坐飞机 = đi máy bay ;; 请坐！= Mời ngồi!
块|土 (đất) + 夬: một tảng, một miếng; cũng là "đồng" (tiền)|số + 块 + 钱 :: 五块钱 = năm đồng ;; 一块蛋糕 = một miếng bánh.
多|Hai chữ 夕 (buổi tối) chồng lên nhau: nhiều đêm → nhiều|很多 + danh từ :: 很多人 = rất nhiều người ;; 他有很多书。= Anh ấy có rất nhiều sách.
多少|多 (nhiều) + 少 (ít): nhiều hay ít → bao nhiêu|多少 + 钱/人 :: 多少钱？= Bao nhiêu tiền? ;; 你们班有多少学生？= Lớp bạn có bao nhiêu học sinh?
大|Người dang rộng hai tay: to lớn|很 + 大 / 大 + danh từ :: 大学 = đại học ;; 这个苹果很大。= Quả táo này rất to.
天气|天 (trời) + 气 (khí, hơi): khí trời → thời tiết|天气 + 很好/冷 :: 天气很好 = thời tiết rất đẹp ;; 今天天气怎么样？= Thời tiết hôm nay thế nào?
太|大 (to) thêm một chấm: to hơn cả to → quá|太 + tính từ + 了 :: 太好了！= Tuyệt quá! ;; 这个太贵了。= Cái này đắt quá.
女儿|女 (phụ nữ) + 儿 (đứa trẻ): đứa con gái|我的 + 女儿 :: 他女儿 = con gái anh ấy ;; 我女儿很漂亮。= Con gái tôi rất xinh.
她|女 (phụ nữ) + 也: cô ấy|她 + 是/叫 :: 她是老师。= Cô ấy là giáo viên. ;; 她叫什么名字？= Cô ấy tên là gì?
好|女 (mẹ) bế 子 (con): mẹ con bên nhau thật tốt → tốt, hay|很 + 好 / 好 + động từ :: 你好 = xin chào ;; 这个电影很好看。= Bộ phim này rất hay.
妈妈|女 (phụ nữ) + 马 (âm mǎ): người phụ nữ gần gũi nhất → mẹ|我 + 妈妈 :: 我妈妈 = mẹ tôi ;; 妈妈在做饭。= Mẹ đang nấu cơm.
字|宀 (mái nhà) + 子 (con): trẻ con trong nhà học chữ → chữ|写 + 字 / 汉字 :: 写字 = viết chữ ;; 这个字怎么读？= Chữ này đọc thế nào?
学习|学 (học: đứa trẻ dưới mái nhà) + 习 (tập: chim tập bay) → học tập|学习 + 汉语 :: 学习汉语 = học tiếng Trung ;; 我每天学习两个小时。= Mỗi ngày tôi học hai tiếng.
学校|学 (học) + 校 (木 cây + 交: nơi có cây, mọi người gặp nhau) → trường học|去 + 学校 :: 去学校 = đến trường ;; 我们的学校很大。= Trường chúng tôi rất rộng.
学生|学 (học) + 生 (người): người đi học → học sinh (học sinh)|是 + 学生 :: 大学生 = sinh viên ;; 我是学生。= Tôi là học sinh.
家|宀 (mái nhà) + 豕 (con lợn): nhà có nuôi lợn là một gia đình → nhà|回 + 家 / 我家 :: 回家 = về nhà ;; 我家有四口人。= Nhà tôi có bốn người.
对不起|对 (đối diện) + 不起 (không đứng nổi): không dám nhìn thẳng → xin lỗi|对不起 + 我… :: 对不起，我来晚了。= Xin lỗi, tôi đến muộn. ;; “对不起！”“没关系。” = "Xin lỗi!" "Không sao."
小|Một nét dọc với hai chấm nhỏ hai bên: nhỏ bé|很 + 小 / 小 + danh từ :: 小猫 = mèo con ;; 我的房间很小。= Phòng tôi rất nhỏ.
小姐|小 (nhỏ) + 姐 (chị): cô gái trẻ → cô, tiểu thư|họ + 小姐 :: 王小姐 = cô Vương ;; 小姐，请问几点了？= Chị ơi, cho hỏi mấy giờ rồi?
少|小 (nhỏ) thêm một nét phẩy cắt đi: càng ít hơn → ít|很 + 少 :: 人很少 = người rất ít ;; 我很少喝咖啡。= Tôi rất ít uống cà phê.
岁|山 (núi) + 夕 (buổi tối): năm tháng chồng như núi → tuổi|数 + 岁 :: 二十岁 = hai mươi tuổi ;; 你今年多大？我十八岁。= Năm nay bạn bao nhiêu tuổi? Tôi mười tám tuổi.
工作|工 (thợ, việc) + 作 (亻 người + 乍: người bắt đầu làm) → công việc, làm việc|在 + nơi + 工作 :: 找工作 = tìm việc ;; 他在医院工作。= Anh ấy làm ở bệnh viện.
年|Hình người vác bó lúa: mỗi mùa gặt là một năm|数 + 年 / 今年 :: 今年 = năm nay ;; 我学了一年汉语。= Tôi học tiếng Trung một năm rồi.
开|Hai tay (廾) mở thanh then cửa (一) → mở; lái|开 + 门/车 :: 开门 = mở cửa ;; 他会开车。= Anh ấy biết lái xe.
很|彳 (bước chân) + 艮: đi rất xa → rất|很 + tính từ :: 很好 = rất tốt ;; 我很高兴。= Tôi rất vui.
怎么|怎 (乍 + 心 tim: lòng lo nghĩ) + 么: thế nào, sao|怎么 + động từ :: 怎么走？= Đi thế nào? ;; 这个字怎么写？= Chữ này viết thế nào?
怎么样|怎么 (thế nào) + 样 (dạng): ra sao|… + 怎么样？ :: 天气怎么样？= Thời tiết thế nào? ;; 我们一起去，怎么样？= Chúng ta cùng đi, được không?
想|相 (nhìn nhau) + 心 (tim): trong lòng nhớ đến → nghĩ, muốn, nhớ|想 + động từ / 想 + người :: 想去 = muốn đi ;; 我很想你。= Tôi rất nhớ bạn.
我|Bàn tay cầm cây giáo (戈): ta tự bảo vệ mình → tôi|我 + 是/有 :: 我是越南人。= Tôi là người Việt Nam. ;; 我有一个哥哥。= Tôi có một anh trai.
我们|我 (tôi) + 们 (亻 người + 门: số nhiều) → chúng tôi|我们 + 一起 :: 我们一起去 = chúng ta cùng đi ;; 我们是朋友。= Chúng tôi là bạn.
打电话|打 (扌 tay + 丁: gõ) + 电话 (điện thoại): bấm máy → gọi điện|给 + người + 打电话 :: 给妈妈打电话 = gọi điện cho mẹ ;; 我晚上给你打电话。= Tối tôi gọi cho bạn.
日|Hình mặt trời: một vòng tròn có chấm giữa → ngày|数 + 日 :: 十月一日 = ngày một tháng mười ;; 今天是我的生日。= Hôm nay là sinh nhật tôi.
时候|时 (日 mặt trời + 寸: đo bóng nắng) + 候 (chờ): thời điểm → lúc, khi|…的时候 :: 吃饭的时候 = lúc ăn cơm ;; 你什么时候来？= Khi nào bạn đến?
明天|明 (日 mặt trời + 月 mặt trăng: sáng) + 天 (ngày): ngày sáng mai → ngày mai|明天 + 见/去 :: 明天见 = mai gặp ;; 明天我不上班。= Mai tôi không đi làm.
星期|星 (sao) + 期 (kỳ hạn): chu kỳ theo các vì sao → tuần, thứ|星期 + 一…六/天 :: 星期一 = thứ hai ;; 今天星期几？= Hôm nay thứ mấy?
昨天|昨 (日 mặt trời + 乍: mặt trời vừa qua) + 天 (ngày) → hôm qua|昨天 + động từ :: 昨天晚上 = tối hôm qua ;; 昨天我没去学校。= Hôm qua tôi không đến trường.
是|日 (mặt trời) trên chữ 正 biến thể (ngay thẳng): đúng như ánh sáng → là, đúng|A 是 B :: 我是学生。= Tôi là học sinh. ;; 是的，我知道。= Vâng, tôi biết.
月|Hình vầng trăng khuyết → mặt trăng, tháng|数 + 月 :: 一月 = tháng một ;; 一个月 = một tháng.
有|Bàn tay (𠂇) cầm miếng thịt (月): trong tay có thứ → có|有 + danh từ :: 有时间 = có thời gian ;; 我有一个妹妹。= Tôi có một em gái.
朋友|朋 (hai chữ 月 đứng cạnh nhau: bằng vai) + 友 (hai bàn tay nắm lấy nhau) → bạn bè|好 + 朋友 :: 好朋友 = bạn thân ;; 他是我的朋友。= Anh ấy là bạn tôi.
本|木 (cây) thêm một vạch ở gốc: gốc rễ; lượng từ của sách|数 + 本 + 书 :: 一本书 = một quyển sách ;; 我买了两本书。= Tôi mua hai quyển sách.
来|Hình cây lúa mì: lúa mì từ nơi xa mang đến → đến|来 + nơi chốn :: 来中国 = đến Trung Quốc ;; 你什么时候来？= Khi nào bạn đến?
杯子|杯 (木 gỗ + 不: chén gỗ) + 子 → cái cốc|一个 + 杯子 / 一杯 + 水 :: 一杯茶 = một cốc trà ;; 这是我的杯子。= Đây là cốc của tôi.
桌子|桌 (bàn: tấm gỗ 木 nâng cao) + 子 → cái bàn|在 + 桌子上 :: 桌子上 = trên bàn ;; 书在桌子上。= Sách ở trên bàn.
椅子|椅 (木 gỗ + 奇) + 子 → cái ghế|坐在 + 椅子上 :: 一把椅子 = một cái ghế ;; 请坐在椅子上。= Mời ngồi lên ghế.
水|Hình dòng nước chảy ở giữa với các tia nước hai bên|喝 + 水 :: 一杯水 = một cốc nước ;; 我想喝水。= Tôi muốn uống nước.
水果|水 (nước) + 果 (quả: quả trên cây 木): quả mọng nước → hoa quả|吃 + 水果 :: 买水果 = mua hoa quả ;; 我喜欢吃水果。= Tôi thích ăn hoa quả.
汉语|汉 (氵 nước + 又: dòng sông Hán) + 语 (讠 lời + 吾: lời nói của ta) → tiếng Hán|说 + 汉语 :: 学汉语 = học tiếng Trung ;; 你会说汉语吗？= Bạn biết nói tiếng Trung không?
没|氵 (nước) + 殳: chìm mất trong nước → không có, chưa|没 + 有/động từ :: 没有钱 = không có tiền ;; 我昨天没去。= Hôm qua tôi không đi.
没关系|没 (không) + 关系 (quan hệ): chẳng có gì liên quan → không sao|没关系 :: “对不起。”“没关系。” = "Xin lỗi." "Không sao." ;; 没关系，我自己来。= Không sao, để tôi tự làm.
漂亮|漂 (氵 nước: nổi trên nước) + 亮 (sáng): sáng lấp lánh → đẹp|很 + 漂亮 :: 漂亮的衣服 = quần áo đẹp ;; 她很漂亮。= Cô ấy rất xinh.
火车站|火车 (xe lửa) + 站 (立 đứng + 占: chỗ đứng chờ) → ga tàu|去 + 火车站 :: 在火车站 = ở ga tàu ;; 火车站离这儿远吗？= Ga tàu cách đây xa không?
点|占 + 灬 (lửa): đốm lửa nhỏ → chấm, giờ, một chút|数 + 点 / 一点儿 :: 三点 = ba giờ ;; 现在几点？= Bây giờ mấy giờ?
热|执 + 灬 (lửa): cầm lửa trong tay → nóng|很 + 热 :: 天气很热 = trời rất nóng ;; 今天太热了。= Hôm nay nóng quá.
爱|爫 (bàn tay) + 冖 (che chở) + 友 (bạn): tay che chở người thân → yêu|爱 + người/việc :: 我爱你 = anh yêu em ;; 我爱我的家。= Tôi yêu gia đình tôi.
爸爸|父 (cha: tay cầm roi dạy con) + 巴 (âm bā) → bố|我 + 爸爸 :: 我爸爸 = bố tôi ;; 爸爸在工作。= Bố đang làm việc.
狗|犭 (con thú) + 句 (âm gǒu) → con chó|一只 + 狗 :: 小狗 = chó con ;; 我家有一只狗。= Nhà tôi có một con chó.
猫|犭 (con thú) + 苗 (âm miáo, giống tiếng meo) → con mèo|一只 + 猫 :: 小猫 = mèo con ;; 我喜欢猫。= Tôi thích mèo.
现在|现 (王 ngọc + 见 thấy: ngọc hiện ra) + 在 (ở): đang hiện ở đây → bây giờ|现在 + 几点 :: 现在几点？= Bây giờ mấy giờ? ;; 我现在很忙。= Bây giờ tôi rất bận.
电影|电 (điện: tia chớp) + 影 (bóng hình): hình bóng chạy bằng điện → phim|看 + 电影 :: 看电影 = xem phim ;; 这个电影很好看。= Bộ phim này rất hay.
电视|电 (điện) + 视 (礻 + 见: nhìn): thứ nhìn bằng điện → ti vi|看 + 电视 :: 看电视 = xem ti vi ;; 晚上我看电视。= Buổi tối tôi xem ti vi.
电脑|电 (điện) + 脑 (⺼ cơ thể + não): bộ não chạy điện → máy tính|用 + 电脑 :: 用电脑 = dùng máy tính ;; 我的电脑坏了。= Máy tính của tôi hỏng rồi.
的|白 (trắng) + 勺 (cái muôi): chữ nối "của"|A + 的 + B :: 我的书 = sách của tôi ;; 这是谁的？= Cái này của ai?
看|手 (bàn tay) đặt trên 目 (mắt): đưa tay che mắt nhìn xa → xem, nhìn|看 + 书/电视 :: 看书 = đọc sách ;; 你看，那是什么？= Bạn xem, kia là gì?
看见|看 (nhìn) + 见 (thấy): nhìn và thấy được|看见 + người/vật :: 我看见他了。= Tôi thấy anh ấy rồi. ;; 你看见我的手机了吗？= Bạn có thấy điện thoại của tôi không?
睡觉|睡 (目 mắt + 垂 rủ xuống: mắt sụp xuống) + 觉 (giấc) → ngủ|几点 + 睡觉 :: 去睡觉 = đi ngủ ;; 我十点睡觉。= Tôi ngủ lúc mười giờ.
米饭|米 (hạt gạo tỏa bốn phía) + 饭 (饣 ăn + 反): gạo nấu để ăn → cơm|吃 + 米饭 :: 一碗米饭 = một bát cơm ;; 中国人常吃米饭。= Người Trung Quốc thường ăn cơm.
老师|老 (già, kinh nghiệm) + 师 (thầy): người thầy có kinh nghiệm → giáo viên|汉语 + 老师 :: 汉语老师 = giáo viên tiếng Trung ;; 她是我们的老师。= Cô ấy là giáo viên của chúng tôi.
能|Hình con gấu khỏe mạnh: có sức làm được → có thể|能 + động từ :: 能来 = có thể đến ;; 你明天能来吗？= Mai bạn đến được không?
苹果|苹 (艹 cỏ cây + 平 âm píng) + 果 (quả) → quả táo|一个 + 苹果 :: 吃苹果 = ăn táo ;; 苹果多少钱一斤？= Táo bao nhiêu tiền một cân?
茶|艹 (cỏ lá) + 人 (người) + 木 (cây): người hái lá cây → trà|喝 + 茶 :: 一杯茶 = một cốc trà ;; 中国人喜欢喝茶。= Người Trung Quốc thích uống trà.
菜|艹 (cỏ, rau) + 采 (hái): rau hái về → rau, món ăn|做 + 菜 / 中国菜 :: 点菜 = gọi món ;; 这个菜很好吃。= Món này rất ngon.
衣服|衣 (áo) + 服 (mặc vào người) → quần áo|一件 + 衣服 :: 买衣服 = mua quần áo ;; 这件衣服很漂亮。= Bộ quần áo này rất đẹp.
认识|认 (讠 lời + 人 người) + 识 (讠 lời + 只): nói chuyện với người rồi biết → quen biết|认识 + người :: 认识你很高兴。= Rất vui được quen bạn. ;; 你认识他吗？= Bạn có quen anh ấy không?
说话|说 (讠 lời + 兑) + 话 (讠 lời + 舌 lưỡi): dùng lưỡi nói lời → nói chuyện|跟 + người + 说话 :: 别说话 = đừng nói chuyện ;; 他在跟老师说话。= Cậu ấy đang nói chuyện với thầy.
请|讠 (lời) + 青 (xanh, trẻ): lời lẽ tươi tắn lịch sự → mời, xin|请 + động từ :: 请坐 = mời ngồi ;; 请喝茶。= Mời uống trà.
读|讠 (lời) + 卖 (bán, âm dú): cất lời đọc to → đọc|读 + 书/课文 :: 读书 = đọc sách ;; 这个字怎么读？= Chữ này đọc thế nào?
谁|讠 (lời) + 隹 (con chim): tiếng hỏi như tiếng chim → ai|是 + 谁 :: 他是谁？= Anh ấy là ai? ;; 这是谁的书？= Đây là sách của ai?
谢谢|谢 (讠 lời + 射 bắn: gửi lời đi) → cảm ơn|谢谢 + 你/您 :: 谢谢你！= Cảm ơn bạn! ;; 谢谢您的帮助。= Cảm ơn sự giúp đỡ của ông.
这|辶 (đi) + 文: chỗ đang đứng → này, đây|这 + lượng từ + danh từ :: 这个 = cái này ;; 这是我的朋友。= Đây là bạn tôi.
那|Gần giống chữ 这 nhưng xa hơn → kia, đó|那 + lượng từ + danh từ :: 那个人 = người kia ;; 那是什么？= Kia là cái gì?
都|者 + 阝 (thành ấp): mọi người trong thành → đều|都 + động từ :: 我们都去 = chúng tôi đều đi ;; 他们都是学生。= Họ đều là học sinh.
里|田 (ruộng) + 土 (đất): bên trong làng xóm → trong|nơi + 里 :: 家里 = trong nhà ;; 杯子里有水。= Trong cốc có nước.
钱|钅 (kim loại) + 戋: miếng kim loại nhỏ → tiền|多少 + 钱 :: 没有钱 = không có tiền ;; 这个多少钱？= Cái này bao nhiêu tiền?
飞机|飞 (bay: cánh chim) + 机 (máy): cỗ máy bay → máy bay|坐 + 飞机 :: 坐飞机 = đi máy bay ;; 飞机几点到？= Máy bay mấy giờ đến?
饭馆|饭 (cơm) + 馆 (饣 ăn + 官: nhà lớn) → quán ăn|去 + 饭馆 :: 去饭馆吃饭 = đi quán ăn cơm ;; 这个饭馆很好吃。= Quán này nấu rất ngon.
高兴|高 (cao: hình tòa tháp) + 兴 (hưng phấn): tinh thần lên cao → vui|很 + 高兴 :: 认识你很高兴 = rất vui được quen bạn ;; 今天我很高兴。= Hôm nay tôi rất vui.`;

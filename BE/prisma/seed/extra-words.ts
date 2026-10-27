// Nghĩa tiếng Việt cho các từ/chữ xuất hiện trong lời thoại mà bảng từ chưa có (soạn 20/10/2026, bổ sung cho bài đọc 23/10/2026; CHƯA QUA DUYỆT).
// Định dạng gọn: "chữ|nghĩa|loại từ". Chữ đơn là mảnh của từ ghép thì ghi nghĩa của chữ đó.
const RAW = `点|chút, giờ, chấm|lượng từ
工作|công việc, làm việc|danh từ
儿|(hậu tố âm ér)|trợ từ
一个|một (cái, người)|cụm từ
一起|cùng nhau|phó từ
每|mỗi|đại từ
次|lần|lượng từ
真|thật, thật là|phó từ
别|đừng|phó từ
路|đường|danh từ
车|xe|danh từ
号|số, ngày (trong tháng)|danh từ
得|(trợ từ bổ ngữ)|trợ từ
先|trước, trước hết|phó từ
灯|đèn|danh từ
汉语|tiếng Hán|danh từ
看看|xem thử|động từ
楼|tòa nhà, tầng|danh từ
信|thư|danh từ
一点儿|một chút|cụm từ
往|hướng về, về phía|giới từ
们|(hậu tố số nhiều)|trợ từ
午|trưa|danh từ
十二|mười hai|số từ
马上|ngay lập tức|phó từ
只有|chỉ có|cụm từ
长|dài; lớn lên|tính từ
间|gian, phòng (lượng từ)|lượng từ
以后|sau này, sau đó|danh từ
早|sớm|tính từ
事|việc, chuyện|danh từ
这里|ở đây|đại từ
岁|tuổi|lượng từ
把|(giới từ "bả"); cầm|giới từ
太好了|tuyệt quá|cụm từ
用|dùng|động từ
行|được, ổn|tính từ
出|ra, đi ra|động từ
完|xong, hết|động từ
时|lúc, thời|danh từ
有点儿|hơi, một chút|phó từ
很久|rất lâu|cụm từ
这个|cái này|đại từ
中国|Trung Quốc|danh từ
孩子|đứa trẻ, con cái|danh từ
窗|cửa sổ|danh từ
学生|học sinh|danh từ
三十|ba mươi|số từ
边|bên, phía|danh từ
明|sáng, rõ|tính từ
中|giữa, trong|danh từ
不要|đừng, không cần|cụm từ
李|Lý (họ)|danh từ
前|trước|danh từ
桌子|cái bàn|danh từ
零|không (số 0)|số từ
红|đỏ|tính từ
第|thứ (số thứ tự)|tiền tố
月|tháng; mặt trăng|danh từ
晚|tối; muộn|tính từ
公司|công ty|danh từ
放|đặt, để; thả|động từ
停|dừng, đỗ|động từ
亮|sáng|tính từ
笑|cười|động từ
十分|rất, hết sức|phó từ
左|trái|danh từ
客|khách|danh từ
道|đường; nói|danh từ
怕|sợ|động từ
种|loại; trồng|lượng từ
忙|bận|tính từ
阮|Nguyễn (họ)|danh từ
右|phải|danh từ
王|Vương (họ)|danh từ
眼睛|mắt|danh từ
大雨|mưa lớn|danh từ
错|sai|tính từ
喜|thích, mừng|động từ
欢|vui|tính từ
起|dậy, lên|động từ
身体|cơ thể, sức khỏe|danh từ
概|đại khái (trong 大概)|danh từ
不过|nhưng, có điều|liên từ
半|một nửa|số từ
后|sau|danh từ
雨|mưa|danh từ
些|một vài, những|lượng từ
一位|một vị (người)|cụm từ
不太|không... lắm|cụm từ
点儿|chút (đuôi âm ér)|lượng từ
完了|xong rồi|cụm từ
最后|cuối cùng|danh từ
不用|không cần|cụm từ
起来|lên, dậy; bắt đầu|động từ
时候|lúc, khi|danh từ
还有|còn có|cụm từ
今年|năm nay|danh từ
真的|thật sự|cụm từ
为什么|vì sao|đại từ
学|học|động từ
书|sách|danh từ
慢慢|từ từ, chậm rãi|phó từ
几天|vài ngày|cụm từ
两天|hai ngày|cụm từ
坏|hỏng, xấu|tính từ
看起来|trông có vẻ|cụm từ
然后|sau đó|liên từ
打|đánh, gọi (điện)|động từ
话|lời nói, lời|danh từ
改|sửa, đổi|động từ
知|biết (trong 知道)|động từ
常常|thường xuyên|phó từ
打电话|gọi điện thoại|động từ
光|ánh sáng; chỉ|danh từ
付钱|trả tiền|động từ
么|(trong 什么, 怎么)|trợ từ
店|cửa hàng|danh từ
特|đặc biệt (trong 特别)|phó từ
意|ý (trong 意思)|danh từ
思|nghĩ (trong 意思)|động từ
下午|buổi chiều|danh từ
字|chữ|danh từ
比|so với; so sánh|giới từ
空|trống; rảnh|tính từ
只|chỉ; con (lượng từ)|phó từ
页|trang|lượng từ
门|cửa|danh từ
国|nước|danh từ
祝|chúc|động từ
这时|lúc này|cụm từ
原来|thì ra; ban đầu|phó từ
上面|phía trên|danh từ
客气|khách sáo|tính từ
忘|quên|động từ
白|trắng|tính từ
好看|đẹp, dễ nhìn|tính từ
哈哈|haha|thán từ
挂|treo; cúp (máy)|động từ
红灯|đèn đỏ|danh từ
笼|lồng (trong 笼子)|danh từ
街|phố|danh từ
特别|đặc biệt|phó từ
周|tuần|danh từ
学校|trường học|danh từ
第一|thứ nhất, đầu tiên|số từ
才能|mới có thể|cụm từ
回家|về nhà|động từ
医院|bệnh viện|danh từ
有人|có người|cụm từ
告诉|nói cho biết|động từ
口|miệng; nhân khẩu|lượng từ
弟弟|em trai|danh từ
越|càng; Việt (trong 越南)|phó từ
南|nam, phía nam|danh từ
认识|quen biết|động từ
是不是|có phải không|cụm từ
个人|cá nhân; một người|danh từ
鱼|cá|danh từ
吃饭|ăn cơm|động từ
怎么样|thế nào|đại từ
哦|ồ|thán từ
考|thi|động từ
课|bài học, tiết học|danh từ
不难|không khó|cụm từ
的话|nếu... thì|trợ từ
里面|bên trong|danh từ
墙|tường|danh từ
外|ngoài|danh từ
像|giống|động từ
列|hàng; đoàn (lượng từ)|lượng từ
地|đất; (trợ từ "địa")|danh từ
见|gặp, thấy|động từ
学习|học tập|động từ
有的|có (cái, người)|cụm từ
步|bước|danh từ
大家|mọi người|đại từ
不远|không xa|cụm từ
文|văn, chữ|danh từ
电|điện|danh từ
朋|bạn (trong 朋友)|danh từ
友|bạn (trong 朋友)|danh từ
牛奶|sữa bò|danh từ
有时候|có lúc, đôi khi|cụm từ
临|gần, sắp|động từ
进来|vào đây|động từ
样|kiểu, dạng|lượng từ
姓|họ; mang họ|động từ
以|dùng; để (trong 以后, 以前)|giới từ
密码|mật khẩu|danh từ
困|buồn ngủ; khốn khó|tính từ
为|vì; làm|giới từ
今晚|tối nay|danh từ
来到|đến nơi|động từ
中午|buổi trưa|danh từ
较|khá, tương đối (trong 比较)|phó từ
辆|chiếc (xe)|lượng từ
感|cảm thấy|động từ
谢|cảm ơn (trong 谢谢)|động từ
生|sinh, sống|động từ
网|mạng; lưới|danh từ
告|báo, nói (trong 告诉)|động từ
诉|kể, nói (trong 告诉)|động từ
服务|phục vụ|động từ
饭|cơm, bữa ăn|danh từ
同|cùng|形容词
应|nên, đáp|động từ
该|nên|động từ
互相|lẫn nhau|phó từ
公|công, chung|tính từ
司|(trong 公司)|danh từ
饭店|nhà hàng, khách sạn|danh từ
东|đông, phía đông|danh từ
西|tây, phía tây|danh từ
或者|hoặc là|liên từ
扫|quét|động từ
面|mặt; mì; bột|danh từ
如|như|động từ
果|quả; kết quả|danh từ
可|có thể; nhưng|động từ
被|bị, được|giới từ
十一点|mười một giờ|cụm từ
心里|trong lòng|danh từ
茶杯|cốc trà|danh từ
下面|phía dưới|danh từ
一封信|một lá thư|cụm từ
听到|nghe thấy|động từ
黑暗|bóng tối|danh từ
走出来|đi ra|động từ
拿起|cầm lên|động từ
蓝|xanh dương|tính từ
衣|áo|danh từ
那边|bên kia|danh từ
林|Lâm (họ); rừng|danh từ
门口|cửa ra vào|danh từ
家里|trong nhà|danh từ
唱|hát|động từ
黄|vàng|tính từ
碗|bát|danh từ
双|đôi|lượng từ
掉|rơi, rớt|động từ
地上|trên mặt đất|danh từ
正在|đang|phó từ
华|Hoa (Trung Hoa); hoa lệ|danh từ
题|đề, câu hỏi|danh từ
折|gấp; chiết khấu|động từ
只要|chỉ cần|liên từ
小声|nhỏ tiếng|cụm từ
跑|chạy|động từ
身边|bên cạnh mình|danh từ
到底|rốt cuộc|phó từ
却|nhưng lại|phó từ
班|lớp; ca làm|danh từ
不同|khác nhau|tính từ
老|già; cũ|tính từ
那些|những cái đó|đại từ
回答|trả lời|động từ
关上|đóng lại|động từ
听见|nghe thấy|động từ
看见|nhìn thấy|động từ
远处|nơi xa|danh từ
小路|đường nhỏ|danh từ
男人|đàn ông|danh từ
哪个|cái nào|đại từ
离|cách; rời|动词
出门|ra khỏi nhà|động từ
消息|tin tức|danh từ
雪|tuyết|danh từ
花|hoa; tiêu (tiền)|danh từ
海|biển|danh từ
不大|không lớn|cụm từ
电话|điện thoại|danh từ
号码|số (điện thoại...)|danh từ
再说|hãy nói lại; vả lại|động từ
伞|cái ô|danh từ
就是|chính là|động từ
英语|tiếng Anh|danh từ
面条|mì sợi|danh từ
请坐|mời ngồi|cụm từ
有一点儿|hơi, một chút|cụm từ
穿|mặc|động từ
一家人|cả nhà|danh từ
下周|tuần sau|danh từ
几个|vài cái, mấy cái|cụm từ
菜|món ăn, rau|danh từ
以前|trước đây|danh từ
样子|dáng vẻ|danh từ
要不|hay là|连词
下次|lần sau|danh từ
一样|giống nhau|tính từ
前面|phía trước|danh từ
后面|phía sau|danh từ
不知|không biết|động từ
感谢|cảm ơn|động từ
过年|đón Tết|động từ
就要|sắp, sắp sửa|phó từ
一会儿|một lát|danh từ
盼|mong mỏi|động từ
美|đẹp|tính từ
地方|nơi, chỗ|danh từ
动|động, cử động|động từ
年前|trước Tết; năm trước|danh từ
传来|vọng đến|động từ
轻|nhẹ|tính từ
风|gió|danh từ
进|vào|động từ
穿着|đang mặc|động từ
女人|phụ nữ|danh từ
下来|xuống|động từ
喂|alô|thán từ
哭|khóc|động từ
打开|mở ra|động từ
封|phong, lá (thư)|lượng từ
接|nhận, đón; nối|động từ
一眼|một cái nhìn|cụm từ
条|sợi, con, dải|lượng từ
心|tim, lòng|danh từ
跳|nhảy; đập|động từ
叹|thở dài|động từ
口气|hơi thở; giọng điệu|danh từ
人们|mọi người, người ta|danh từ
母亲|mẹ|danh từ
一下子|đột nhiên, trong chốc lát|phó từ
讲|kể, nói|động từ
夜|đêm|danh từ
同学|bạn học|danh từ
介绍|giới thiệu|动词
自己|bản thân|đại từ
抱|ôm|động từ
睡着|ngủ thiếp đi|động từ
指着|chỉ vào|động từ
它|nó (vật)|đại từ
半年|nửa năm|danh từ
好像|hình như, dường như|phó từ
点头|gật đầu|động từ
响起|vang lên|động từ
声|tiếng, âm thanh|danh từ
上车|lên xe|động từ
让|để cho, bảo|động từ
她们|các cô ấy, các bà ấy|đại từ
一面|một mặt; một bên|danh từ
手里|trong tay|danh từ
手|tay|danh từ
两个|hai cái, hai người|cụm từ
见面|gặp mặt|động từ
走过|đi qua|động từ
城市|thành phố|danh từ
生活|cuộc sống|danh từ
只是|chỉ là|phó từ
当|làm, đảm nhiệm|động từ
做到|làm được|động từ
晚点|muộn một chút|cụm từ
交|nộp; giao|động từ
假|nghỉ; giả|danh từ
出来|đi ra, ra|động từ
它们|chúng nó|đại từ
这样|như vậy|đại từ
在家|ở nhà|cụm từ
找到|tìm thấy|động từ
别的|cái khác|đại từ
一些|một vài|lượng từ
球|quả bóng, bóng|danh từ
床|giường|danh từ
飞机|máy bay|danh từ
夏天|mùa hè|danh từ
睡觉|đi ngủ|động từ
不错|không tồi, khá tốt|tính từ
好多|rất nhiều|cụm từ
苹果|táo|danh từ
希望|hy vọng|động từ
想法|suy nghĩ, ý tưởng|danh từ
亲爱|thân mến (trong 亲爱的)|tính từ
山|núi|danh từ
好好|chu đáo, cho tử tế|phó từ
赢|thắng|động từ
那里|ở đó|đại từ
包括|bao gồm|động từ
送到|đưa đến|động từ
拿到|lấy được|động từ
博物馆|bảo tàng|danh từ
走路|đi bộ|động từ
照|chiếu, chụp|động từ
按|bấm, ấn|động từ
旅游|du lịch|động từ
起床|ngủ dậy|động từ
天上|trên trời|danh từ
越来越|càng ngày càng|cụm từ
改变|thay đổi|động từ
猫|mèo|danh từ
上学|đi học|động từ
星期天|chủ nhật|danh từ
上去|đi lên|động từ
回来|trở về|động từ
说话|nói chuyện|động từ
上课|vào học, lên lớp|động từ
晴天|trời nắng|danh từ
方法|phương pháp|danh từ
并|hề, cũng (nhấn mạnh phủ định)|phó từ
毕业|tốt nghiệp|động từ
专业|chuyên ngành|danh từ
考虑|cân nhắc|động từ
父母|bố mẹ|danh từ
解释|giải thích|động từ
跑步|chạy bộ|động từ
玲|Linh (tên riêng)|danh từ
难怪|thảo nào|phó từ
这么|như thế này|đại từ
下课|tan học|động từ
挤|chen; dành ra|động từ
出发|xuất phát|động từ
避|tránh|động từ
动物园|sở thú|danh từ
儿子|con trai|danh từ
风景|phong cảnh|danh từ
刮风|có gió, gió thổi|động từ
长城|Vạn Lý Trường Thành|danh từ
脸色|sắc mặt|danh từ
住院|nằm viện|động từ
病|bệnh|danh từ
棒|giỏi, tuyệt|tính từ
竹子|tre, trúc|danh từ
妻子|vợ|danh từ
近|gần|tính từ
价格|giá cả|danh từ
照相|chụp ảnh|động từ
后天|ngày kia|danh từ
航班|chuyến bay|danh từ
黑色|màu đen|danh từ
稍|hơi, một chút|phó từ
自行车|xe đạp|danh từ
下个月|tháng sau|danh từ
山路|đường núi|danh từ
右边|bên phải|danh từ
不好意思|xin lỗi, ngại quá|cụm từ
相|nhau; hình ảnh (trong 照相)|danh từ
靠近|đến gần|động từ
红色|màu đỏ|danh từ
钮|nút (trong 按钮)|danh từ
开心|vui vẻ|tính từ
秋天|mùa thu|danh từ
游泳|bơi|động từ
冬天|mùa đông|danh từ
一切|tất cả|đại từ
只好|đành phải|phó từ
爱|yêu|động từ
过节|đón lễ|động từ
预报|dự báo|động từ
说明|giải thích, cho biết|động từ
变|đổi, trở nên|động từ
温度|nhiệt độ|danh từ
都会|đều sẽ|cụm từ
家人|người nhà|danh từ
多余|dư thừa|tính từ
好运|may mắn|danh từ
放假|nghỉ lễ, nghỉ học|động từ
幸福|hạnh phúc|tính từ
去年|năm ngoái|danh từ
昆|Côn (trong 昆明)|danh từ
汽车|ô tô, xe buýt|danh từ
头顶|đỉnh đầu|danh từ
不见|không thấy, biến mất|động từ
幸好|may mà|phó từ
后来|về sau|danh từ
不但|không những|liên từ
好久|rất lâu|cụm từ
有机|hữu cơ (mảnh của 有机会)|tính từ
顺利|thuận lợi|tính từ
脏|bẩn|tính từ
头|đầu|danh từ
这时候|lúc này|cụm từ
上午|buổi sáng|danh từ
做饭|nấu cơm|động từ
电视|ti vi|danh từ
妹妹|em gái|danh từ
大学生|sinh viên|danh từ
高|cao|tính từ
打篮球|chơi bóng rổ|cụm từ
狗|chó|danh từ
白色|màu trắng|danh từ
椅子|ghế|danh từ
大卫|David (tên người)|danh từ
越南语|tiếng Việt|danh từ
汉字|chữ Hán|danh từ
明年|năm sau|danh từ
打球|chơi bóng|cụm từ
开车|lái xe|động từ
鸡蛋|trứng gà|danh từ
壶|ấm, bình|lượng từ
美国|nước Mỹ|danh từ
懂|hiểu|động từ
节|tiết (học)|lượng từ
饭馆|quán ăn|danh từ
中文|tiếng Trung|danh từ
英文|tiếng Anh|danh từ
响|reo, kêu|động từ
王方|Vương Phương (tên người)|danh từ
有时|có lúc|phó từ
有时间|có thời gian, rảnh|cụm từ
湿|ướt|tính từ
觉|giấc ngủ|danh từ
早就|đã từ lâu, sớm đã|phó từ
第二|thứ hai|số từ
广州|Quảng Châu|danh từ
看到|nhìn thấy|động từ
最好|tốt nhất|tính từ
非|không phải (văn viết)|phó từ
好汉|hảo hán, người có chí khí|danh từ
句|câu|lượng từ
有意思|thú vị|tính từ
烤鸭|vịt quay|danh từ
书店|hiệu sách|danh từ
问路|hỏi đường|động từ
词|từ|danh từ
路上|trên đường|danh từ
回到|trở về, về đến|động từ
比如|ví dụ như|liên từ
黑|đen, tối|tính từ
伤|vết thương, bị thương|danh từ
上个月|tháng trước|cụm từ
运动|vận động, thể thao|danh từ
运动鞋|giày thể thao|danh từ
世界杯|World Cup (cúp bóng đá thế giới)|danh từ
河内|Hà Nội|danh từ
春卷|nem cuốn, chả giò|danh từ
刚|vừa mới|phó từ
厚|dày|tính từ
房子|nhà, căn nhà|danh từ
搬家|chuyển nhà|động từ
短信|tin nhắn|danh từ
但|nhưng|liên từ
商场|trung tâm thương mại|danh từ
进去|đi vào|động từ
合适|vừa vặn, phù hợp|tính từ
卖|bán|động từ
本来|vốn dĩ, ban đầu|phó từ
从来|từ trước đến nay|phó từ
外地|nơi khác, tỉnh khác|danh từ
西红柿|cà chua|danh từ
炒|xào|động từ
洗|rửa, giặt|động từ
切|cắt|động từ
成|thành|động từ
油|dầu ăn|danh từ
盐|muối|danh từ
咸|mặn|tính từ
加|thêm|động từ
味道|mùi vị|danh từ
不容易|không dễ|cụm từ
辛苦|vất vả|tính từ
不管|bất kể, dù|liên từ
扔|vứt|động từ
事情|sự việc, chuyện|danh từ
留|để lại, giữ lại|động từ
贴|dán|động từ
福|phúc|danh từ
故意|cố ý|phó từ
倒|ngược, lộn ngược|động từ
过来|qua đây, lại|động từ
意思|ý nghĩa|danh từ
除夕|đêm giao thừa|danh từ
余|dư, thừa|động từ
家庭|gia đình|danh từ
新年|năm mới|danh từ
到来|đến, tới|động từ
长辈|bậc trên, người lớn tuổi|danh từ
不一定|không nhất thiết|cụm từ
代表|đại diện, tượng trưng|động từ
祝福|lời chúc phúc|danh từ
穿上|mặc vào|động từ
亲戚|họ hàng|danh từ
拜年|chúc Tết|động từ
提前|trước, sớm hơn|động từ
查|tra, kiểm tra|động từ
资料|tài liệu|danh từ
四季|bốn mùa|danh từ
城|thành phố, thành|danh từ
春城|thành phố mùa xuân (tên gọi Côn Minh)|danh từ
头晕|chóng mặt|tính từ
当地|địa phương|danh từ
怎么办|làm sao bây giờ|cụm từ
绑|buộc|động từ
丝带|ruy băng|danh từ
旅行|chuyến đi, du lịch|danh từ
难忘|khó quên|tính từ
半夜|nửa đêm|danh từ
精神|tinh thần, sức sống|danh từ
内容|nội dung|danh từ
期末|cuối kỳ|danh từ
通过|thông qua, thi đỗ|động từ
谈话|cuộc nói chuyện|danh từ
谈|nói chuyện|động từ
下去|tiếp tục (như thế)|động từ
定|đặt ra, định|động từ
闹钟|đồng hồ báo thức|danh từ
继续|tiếp tục|động từ
坚持|kiên trì|động từ
学期|học kỳ|danh từ
进步|tiến bộ|động từ
熟悉|quen thuộc|tính từ
加班|tăng ca|động từ
交通|giao thông|danh từ
只能|chỉ có thể|cụm từ
租|thuê|động từ
夜景|cảnh đêm|danh từ
那么|như thế, nhiều thế|đại từ
想起|nhớ ra, nhớ đến|động từ
婚礼|đám cưới|danh từ
职员|nhân viên|danh từ
简历|sơ yếu lý lịch|danh từ
面试|phỏng vấn|động từ
信息|thông tin|danh từ
严肃|nghiêm nghị|tính từ
而是|mà là|liên từ
老实|thật thà|tính từ
诚实|thành thật|tính từ
接到|nhận được|động từ
录取|tuyển, nhận vào|động từ
充分|đầy đủ, kỹ càng|tính từ
离不开|không thể thiếu, không rời được|cụm từ
确实|quả thật|phó từ
带来|mang lại|động từ
就算|dù cho|liên từ
钱包|ví tiền|danh từ
整天|cả ngày|danh từ
不安|bất an|tính từ
聊|trò chuyện|động từ
关掉|tắt đi|động từ
轻松|thư thái, nhẹ nhõm|tính từ
本身|bản thân (nó)|đại từ
好坏|tốt xấu|danh từ
关键|mấu chốt|danh từ
使用|sử dụng|động từ
多年|nhiều năm|danh từ
工资|tiền lương|danh từ
那时候|thời đó, lúc đó|cụm từ
了不起|ghê gớm, phi thường|tính từ
工厂|nhà máy|danh từ
例外|ngoại lệ|danh từ
劝|khuyên|động từ
一辈子|cả đời|danh từ
舍不得|không nỡ|động từ
擦|lau|động từ
干干净净|sạch sẽ, sạch bóng|tính từ
修|sửa|động từ
摔倒|ngã|động từ
膝盖|đầu gối|danh từ
破|rách, trầy|tính từ
差点儿|suýt nữa|phó từ
扶|đỡ, vịn|động từ
转|quay, đi vòng|động từ
圈|vòng|lượng từ
年纪|tuổi tác|danh từ
骑车|đạp xe|động từ
交给|giao cho|động từ
保护|bảo vệ|động từ
政府|chính quyền|danh từ
购物袋|túi mua sắm|danh từ
塑料袋|túi ni lông|danh từ
刷牙|đánh răng|động từ
小区|khu dân cư|danh từ
垃圾|rác|danh từ
分成|chia thành|động từ
类|loại|lượng từ
大人|người lớn|danh từ
孙子|cháu nội (trai)|danh từ
不行|không được|tính từ
读|đọc|động từ
女儿|con gái|danh từ
日|ngày, mặt trời|danh từ
先生|ông, ngài, chồng|danh từ
小姐|cô, tiểu thư|danh từ
报纸|báo, tờ báo|danh từ
船|thuyền, tàu thủy|danh từ
公斤|ki-lô-gam, cân, kg|lượng từ
教室|phòng học, lớp học|danh từ
千|nghìn, ngàn|số từ
晴|nắng, trời quang|tính từ
生病|bị ốm, ốm, sinh bệnh|động từ
手表|đồng hồ đeo tay|danh từ
跳舞|nhảy, nhảy múa, khiêu vũ|động từ
西瓜|dưa hấu|danh từ
向|hướng về, về phía|giới từ
羊肉|thịt cừu, thịt dê|danh từ
阴|âm u, trời râm|tính từ
元|đồng, tệ (đơn vị tiền)|lượng từ
左边|bên trái|danh từ
晚饭|bữa tối, cơm tối|danh từ
选|chọn, lựa chọn|động từ
总|luôn, lúc nào cũng|phó từ`;

const FIX_POS: Record<string, string> = { 形容词: 'tính từ', 动词: 'động từ', 连词: 'liên từ' };

export const EXTRA_WORDS: [zh: string, vi: string, pos: string][] = RAW.split('\n').map((l) => {
  const [zh, vi, pos] = l.split('|');
  return [zh, vi, FIX_POS[pos] ?? pos];
});

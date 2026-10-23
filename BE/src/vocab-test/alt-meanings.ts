// Nghĩa tiếng Việt CHẤP NHẬN THÊM khi chấm kiểm tra từ vựng (ngoài nghĩa trong bảng từ), soạn 23/10/2026, CHƯA QUA DUYỆT.
// Mục đích: chấm cứng nhưng không đánh sai các cách nói phổ biến (ví dụ 他 "ông ấy", 不客气 "không có gì", 五 "5").
// Định dạng: "chữ|nghĩa 1, nghĩa 2". Người duyệt thêm/bớt trực tiếp ở đây, không cần đổi DB.
const RAW = `一|1, số một
二|2, số hai
三|3, số ba
四|4, số bốn
五|5, số năm
六|6, số sáu
七|7, số bảy
八|8, số tám
九|9, số chín
十|10, số mười
零|0, số không
百|100, một trăm
千|1000, một nghìn
万|10000, một vạn
两|2, hai
上|ở trên, phía trên, đi lên
下|ở dưới, phía dưới, đi xuống
上午|sáng
下午|chiều
中午|trưa
下雨|mưa, trời mưa
不客气|không có gì, không cần cảm ơn
东西|đồ, thứ, đồ đạc
个|cái
书|quyển sách, cuốn sách
些|một số, mấy
什么|gì
他|ông ấy, cậu ấy, anh ta
她|chị ấy, bà ấy, em ấy
它|nó
你|anh, chị, em, cậu
您|ông, bà, ngài
我|mình, tớ
我们|chúng mình
会|có thể, biết làm
住|sống
儿子|con trai
再见|chào tạm biệt, hẹn gặp lại
几|bao nhiêu
出租车|xe taxi, tắc xi
前面|đằng trước
后面|đằng sau
去|đi đến
叫|kêu, gọi là
同学|bạn cùng lớp
名字|tên gọi
和|với, cùng
哪|đâu
商店|tiệm, cửa tiệm
喂|a lô, alo
喜欢|ưa, mến
回|trở về, quay về
在|tại
坐|đi
块|đồng
大|lớn
太|lắm
好|hay, khỏe, ngon
妈妈|má
字|chữ viết
学习|học
学校|trường
学生|sinh viên
家|gia đình, nhà ở
小|bé
年|năm (thời gian)
开|lái, mở ra
很|lắm
怎么|như thế nào, làm sao
怎么样|như thế nào, ra sao
想|nhớ, suy nghĩ
打电话|gọi điện
时候|thời điểm
星期|thứ, tuần lễ
朋友|bạn
本|cuốn
来|tới
杯子|cốc, ly
桌子|bàn
椅子|cái ghế
水果|hoa quả
汉语|tiếng trung, tiếng trung quốc, hán ngữ
没|không có
没关系|không sao đâu, không có gì
漂亮|xinh, xinh đẹp
火车站|ga tàu hỏa, nhà ga, ga xe lửa
点|một chút
爱|thương
爸爸|ba, cha
现在|hiện tại, giờ
电影|bộ phim, điện ảnh
电视|tivi, truyền hình
电脑|máy vi tính, vi tính
看|đọc
看见|thấy, trông thấy
睡觉|ngủ
米饭|cơm trắng
老师|thầy giáo, cô giáo, thầy, cô
能|có thể
苹果|quả táo, trái táo
茶|nước trà, chè
菜|thức ăn
认识|biết, quen
说话|nói
请|xin mời, làm ơn
这|cái này
那|cái kia, cái đó, đó, kia
钱|tiền bạc
飞机|phi cơ
饭馆|quán cơm, nhà hàng
高兴|vui vẻ, vui mừng, mừng
医生|bác sỹ
衣服|áo
冷|rét
热|nóng nực
今天|ngày hôm nay
昨天|ngày hôm qua
谁|người nào
谢谢|cám ơn
都|tất cả
里|bên trong, ở trong
一起|cùng
丈夫|ông xã
妻子|bà xã
上班|đi làm việc
为|cho, để
事情|việc, chuyện
件|chiếc, cái
便宜|giá rẻ
公共汽车|xe bus, xe buýt công cộng
公斤|kilogam, kí, ký
再|lần nữa
出|đi ra
别|không được
到|tới
卖|bán hàng
可以|được
可能|có lẽ
右边|phía bên phải, phía phải
左边|phía bên trái, phía trái
号|ngày
告诉|bảo, nói với, kể
哥哥|anh
姐姐|chị
唱歌|ca hát
回答|câu trả lời
因为|vì
外|bên ngoài
大家|tất cả mọi người
女人|người phụ nữ, đàn bà
男人|người đàn ông, nam giới
好吃|ngon miệng
孩子|trẻ con, con
完|hoàn thành
小时|giờ đồng hồ, tiếng đồng hồ
就|liền, ngay
已经|đã rồi
希望|mong, mong muốn, hi vọng
帮助|giúp đỡ, giúp
张|tờ
忙|bận rộn
快|mau, nhanh chóng
快乐|vui, hạnh phúc
意思|nghĩa
慢|chậm chạp
房间|căn phòng
所以|vì vậy, nên
手机|điện thoại di động, di động
手表|đồng hồ
找|tìm kiếm
旁边|cạnh, bên
旅游|đi du lịch
早上|sáng, sáng sớm
晚上|tối, ban đêm
服务员|người phục vụ, bồi bàn
机场|phi trường
欢迎|chào đón
每|mọi
比|hơn
游泳|bơi lội
牛奶|sữa
玩|chơi đùa
白|màu trắng
真|thực sự, thật sự
眼睛|con mắt
知道|biết rõ
票|tấm vé
离|cách xa
笑|mỉm cười
第一|số một
累|mệt mỏi
红|màu đỏ
给|đưa cho, tặng
考试|bài thi
药|thuốc men
要|sẽ
觉得|thấy, nghĩ
让|để, khiến
课|tiết, bài
贵|mắc
走|đi
起床|thức dậy, dậy
路|con đường
身体|thân thể
运动|thể dục
还|vẫn còn
进|đi vào
远|xa xôi
送|đưa
错|sai lầm, lỗi
问题|câu hỏi
非常|rất, cực kỳ
题|bài, câu
颜色|màu
鸡蛋|trứng
黑|màu đen
生日|ngày sinh nhật
一会儿|lát nữa, một chút
一定|chắc chắn
一样|như nhau
一直|luôn, suốt
一般|thông thường
一边|vừa
上网|vào mạng, lướt mạng
中间|giữa
为了|vì, để mà
为什么|tại sao
主要|chính
举行|tiến hành
久|lâu dài
习惯|thói quen
了解|hiểu
以为|cho rằng, tưởng
以前|trước kia
以后|sau này
会议|hội nghị
伞|ô, dù
作业|bài tập
借|cho mượn
健康|sức khỏe
像|giống như
先|trước tiên
关|tắt, đóng cửa
关于|về
关系|mối quan hệ
兴趣|sở thích
其他|cái khác
其实|thực ra
最近|dạo này
冬|đông
几乎|gần như
分|điểm, phút
刚才|lúc nãy, ban nãy
别人|người ta
办法|cách, phương pháp
努力|chăm chỉ
包|ba lô
半|nửa, rưỡi
南|phía nam
东|phía đông
西|phía tây
厨房|bếp
双|cặp
发烧|bị sốt, phát sốt
叔叔|bác
变化|biến đổi
可爱|dễ thương
司机|lái xe
国家|đất nước, nước
地方|chỗ, nơi chốn
地铁|metro
坏|hư
城市|thành thị
复习|ôn bài, ôn
夏|hè
奶奶|bà
爷爷|ông
如果|nếu như
宾馆|nhà nghỉ
害怕|sợ
容易|dễ dàng
层|tầng lầu
带|đem, mang theo, dẫn
帮忙|giúp đỡ, giúp
帽子|nón
干净|sạch
年轻|trẻ
应该|cần phải
当然|tất nhiên, dĩ nhiên
忘记|quên mất
总是|lúc nào cũng, luôn
感冒|cảm, bị cảm, cảm cúm
愿意|muốn, sẵn lòng
或者|hoặc
打扫|dọn dẹp
打算|định, dự tính
拿|cầm lấy
换|thay đổi
搬|chuyển
故事|truyện
教|dạy học
数学|toán, toán học
新鲜|tươi mới
方便|tiện, tiện lợi
明白|hiểu rõ
春|xuân
秋|thu
普通话|tiếng phổ thông trung quốc, tiếng quan thoại
更|hơn nữa
有名|nổi danh
树|cái cây
比赛|thi đấu
比较|khá
水平|mức độ
河|con sông
注意|lưu ý
洗手间|toilet, phòng vệ sinh, wc
洗澡|tắm rửa
清楚|rõ
游戏|game
满意|vừa ý
照片|ảnh, tấm ảnh
照相机|máy chụp ảnh
照顾|trông nom
特别|đặc biệt là
生气|giận, nổi giận
用|sử dụng
画|tranh, bức tranh
疼|đau đớn
相信|tin
眼镜|kính
着急|sốt ruột, vội
矮|lùn
碗|chén
礼物|món quà
离开|rời đi, rời
空调|điều hòa, máy điều hòa
突然|bỗng nhiên, đột ngột
站|đứng, ga
筷子|đôi đũa
简单|dễ
糖|kẹo
练习|luyện
终于|rốt cuộc
经常|hay, thường
经理|giám đốc
结婚|cưới, lấy vợ, lấy chồng
结束|xong, hết
绿|xanh lục, màu xanh lá
胖|mập
脸|khuôn mặt
腿|chân
自己|tự mình, mình
舒服|thoải mái
节日|lễ, ngày hội
花|bông hoa, tiêu tiền
蛋糕|bánh kem, bánh gato
行李箱|vali, va li
街道|con phố, phố
裙子|đầm
认为|nghĩ rằng, cho là
认真|chăm chỉ
记得|nhớ là
跟|với, và
过去|đã qua
还是|hoặc, vẫn
迟到|muộn, đi muộn, trễ
选择|chọn
遇到|gặp
邻居|người hàng xóm
铅笔|cây bút chì
锻炼|tập luyện
阿姨|cô
附近|quanh đây
除了|ngoài
难|khó khăn
难过|buồn bã
需要|cần thiết
面条|mì
鞋|đôi giày
音乐|nhạc
饿|đói bụng
饱|no bụng
马上|lập tức, ngay
骑|đạp
黄|màu vàng
蓝|màu xanh dương, xanh da trời`;

export const ALT_MEANINGS: Record<string, string[]> = Object.fromEntries(
  RAW.split('\n').map((l) => {
    const [zh, alt] = l.split('|');
    return [zh, alt.split(',').map((x) => x.trim()).filter(Boolean)];
  }),
);

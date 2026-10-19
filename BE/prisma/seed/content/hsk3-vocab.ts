// Từ vựng HSK 2.0 cấp 3 chưa có trong từ điển, chia theo chủ đề (soạn 20/10/2026, CHƯA QUA DUYỆT).
// Định dạng gọn "chữ|nghĩa|loại từ". Pinyin sinh bằng pinyin-pro khi nạp; nhãn cấp do `pnpm db:hsk` gán.
export interface VocabGroup {
  id: string;
  name: string;
  glyph: string;
  words: string;
}

export const HSK3_VOCAB: VocabGroup[] = [
  {
    id: 'hsk3-hoc-tap', name: 'HSK 3 · Học tập', glyph: '学',
    words: `成绩|thành tích, điểm số|danh từ
复习|ôn tập|động từ
黑板|bảng đen|danh từ
铅笔|bút chì|danh từ
字典|từ điển|danh từ
句子|câu|danh từ
词语|từ ngữ|danh từ
数学|môn toán|danh từ
年级|lớp, khối lớp|danh từ
校长|hiệu trưởng|danh từ
图书馆|thư viện|danh từ
水平|trình độ|danh từ
提高|nâng cao|động từ
努力|cố gắng|động từ
认真|nghiêm túc, chăm chú|tính từ
聪明|thông minh|tính từ
了解|hiểu rõ, tìm hiểu|động từ
记得|nhớ|động từ
忘记|quên|động từ
教|dạy|động từ
选择|lựa chọn|động từ
解决|giải quyết|động từ
办法|cách, biện pháp|danh từ
完成|hoàn thành|động từ
要求|yêu cầu|động từ
历史|lịch sử|danh từ
文化|văn hóa|danh từ
体育|thể dục, thể thao|danh từ
普通话|tiếng phổ thông|danh từ
机会|cơ hội|danh từ
参加|tham gia|động từ
故事|câu chuyện|danh từ`,
  },
  {
    id: 'hsk3-suc-khoe', name: 'HSK 3 · Cơ thể và cảm xúc', glyph: '体',
    words: `鼻子|mũi|danh từ
耳朵|tai|danh từ
脸|mặt|danh từ
腿|chân (cẳng chân)|danh từ
脚|bàn chân|danh từ
头发|tóc|danh từ
眼镜|kính mắt|danh từ
健康|khỏe mạnh|tính từ
疼|đau|tính từ
锻炼|rèn luyện, tập thể dục|động từ
胖|béo|tính từ
瘦|gầy|tính từ
饿|đói|tính từ
饱|no|tính từ
渴|khát|tính từ
爬山|leo núi|động từ
洗澡|tắm|động từ
洗手间|nhà vệ sinh|danh từ
照顾|chăm sóc|động từ
担心|lo lắng|động từ
放心|yên tâm|động từ
生气|tức giận|động từ
难过|buồn, khó chịu|tính từ
害怕|sợ hãi|động từ
满意|hài lòng|tính từ
可爱|đáng yêu|tính từ
热情|nhiệt tình|tính từ
矮|thấp (người)|tính từ`,
  },
  {
    id: 'hsk3-an-uong', name: 'HSK 3 · Ăn uống và nhà bếp', glyph: '食',
    words: `果汁|nước ép trái cây|danh từ
啤酒|bia|danh từ
葡萄|nho|danh từ
香蕉|chuối|danh từ
糖|đường, kẹo|danh từ
盘子|cái đĩa|danh từ
新鲜|tươi|tính từ
厨房|nhà bếp|danh từ
冰箱|tủ lạnh|danh từ
干净|sạch sẽ|tính từ
打扫|quét dọn|động từ
刷|chải, cọ|động từ`,
  },
  {
    id: 'hsk3-do-dung', name: 'HSK 3 · Quần áo và đồ dùng', glyph: '衣',
    words: `衬衫|áo sơ mi|danh từ
裤子|quần|danh từ
裙子|váy|danh từ
帽子|mũ|danh từ
鞋|giày|danh từ
包|túi, cặp|danh từ
行李箱|va-li|danh từ
照相机|máy ảnh|danh từ
电子|điện tử|danh từ
电梯|thang máy|danh từ
搬|dọn, chuyển|động từ
换|đổi, thay|động từ
借|mượn, cho mượn|động từ
关|đóng, tắt|động từ`,
  },
  {
    id: 'hsk3-thien-nhien', name: 'HSK 3 · Thiên nhiên và mùa', glyph: '自',
    words: `春|mùa xuân|danh từ
夏|mùa hè|danh từ
秋|mùa thu|danh từ
冬|mùa đông|danh từ
季节|mùa, thời tiết theo mùa|danh từ
云|mây|danh từ
月亮|mặt trăng|danh từ
河|sông|danh từ
树|cây|danh từ
草|cỏ|danh từ
鸟|chim|danh từ
马|ngựa|danh từ
熊猫|gấu trúc|danh từ
动物|động vật|danh từ
花园|vườn hoa|danh từ
刮|thổi (gió), cạo|động từ
环境|môi trường|danh từ
世界|thế giới|danh từ
国家|quốc gia|danh từ
绿|xanh lá|tính từ`,
  },
  {
    id: 'hsk3-di-lai', name: 'HSK 3 · Đi lại, giải trí', glyph: '行',
    words: `宾馆|khách sạn|danh từ
司机|tài xế|danh từ
骑|cưỡi, đi (xe đạp)|động từ
经过|đi qua, trải qua|động từ
街道|đường phố|danh từ
层|tầng|lượng từ
中间|ở giữa|danh từ
举行|tổ chức|động từ
节目|chương trình|danh từ
节日|ngày lễ|danh từ
游戏|trò chơi|danh từ
音乐|âm nhạc|danh từ
表演|biểu diễn|động từ
新闻|tin tức|danh từ
上网|lên mạng|động từ
结婚|kết hôn|động từ
客人|khách|danh từ
相同|giống nhau|tính từ`,
  },
  {
    id: 'hsk3-con-nguoi', name: 'HSK 3 · Con người và quan hệ', glyph: '人',
    words: `阿姨|dì, cô|danh từ
叔叔|chú|danh từ
别人|người khác|đại từ
关系|quan hệ|danh từ
关心|quan tâm|động từ
同意|đồng ý|động từ
相信|tin tưởng|động từ
认为|cho rằng|động từ
以为|tưởng rằng|động từ
表示|biểu thị, bày tỏ|động từ
决定|quyết định|động từ
根据|căn cứ|giới từ
关于|về, liên quan đến|giới từ
遇到|gặp phải|động từ
发现|phát hiện|động từ
奇怪|kỳ lạ|tính từ
有名|nổi tiếng|tính từ
打算|dự định|động từ
兴趣|hứng thú, sở thích|danh từ`,
  },
  {
    id: 'hsk3-ngu-phap', name: 'HSK 3 · Từ nối và phó từ', glyph: '语',
    words: `跟|cùng, với|giới từ
为了|để, vì|giới từ
虽然|tuy rằng|liên từ
而且|hơn nữa|liên từ
除了|ngoài ra|giới từ
其实|thật ra|phó từ
其他|khác|đại từ
主要|chủ yếu|tính từ
总是|luôn luôn|phó từ
经常|thường xuyên|phó từ
最近|gần đây|danh từ
几乎|hầu như|phó từ
极|rất, cực kỳ|phó từ
更|càng, hơn|phó từ
比较|tương đối, so sánh|phó từ
必须|phải|phó từ
应该|nên|động từ
敢|dám|động từ
久|lâu|tính từ
多么|biết bao|phó từ
容易|dễ|tính từ
简单|đơn giản|tính từ
差|kém, thiếu|tính từ
低|thấp|tính từ
短|ngắn|tính từ
变化|thay đổi|động từ
出现|xuất hiện|động từ
结束|kết thúc|động từ
过去|quá khứ, đi qua|danh từ
影响|ảnh hưởng|động từ
作用|tác dụng|danh từ
使|khiến, làm cho|động từ
一边|vừa... vừa...|phó từ`,
  },
  {
    id: 'hsk3-don-vi', name: 'HSK 3 · Lượng từ và số', glyph: '数',
    words: `刻|một khắc (15 phút)|lượng từ
万|mười nghìn, vạn|số từ
米|mét|lượng từ
角|hào (tiền)|lượng từ
分|phút; xu; điểm|lượng từ
段|đoạn|lượng từ`,
  },
];

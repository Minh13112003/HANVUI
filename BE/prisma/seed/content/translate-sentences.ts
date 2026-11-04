// Câu của mục Luyện dịch (soạn 03/11/2026, CHƯA QUA DUYỆT). Chấm không dùng AI: cụm ý + thứ tự soạn sẵn.
// tk: [chữ Hán, nghĩa từng từ, các cách dịch được nhận]. "?" đầu chuỗi = từ không bắt buộc; chỉ "?" = từ không dịch ra (như 得).
// nat: câu tự nhiên, "chữ=vị trí trong tk" (vị trí là đầu mũi tên). Từ không có trong nat thì không có mũi tên.
// orders: các thứ tự được nhận thêm (thứ tự của nat đã tự có). Từ tùy chọn được bỏ qua khi so thứ tự.
import type { SentenceKey } from '../../../src/content/translate.grade.js';

interface Row {
  level: number;
  title: string;
  note: string;
  zh: string;
  tk: [zh: string, vi: string, accept: string][];
  nat: string;
  end?: string;
  orders?: string[];
  filler?: string[];
  alt?: string[];
}

const ROWS: Row[] = [
  // ───────────── HSK 1 ─────────────
  { level: 1, title: 'Chiều mai', note: '明天下午 đi từ lớn đến nhỏ, tiếng Việt nói ngược lại là "chiều mai".', zh: '我明天下午去医院看朋友。',
    tk: [['我', 'tôi', 'tôi|mình'], ['明天', 'ngày mai', 'mai|ngày mai'], ['下午', 'buổi chiều', 'chiều|buổi chiều'], ['去', 'đi', 'đi|đến|tới'], ['医院', 'bệnh viện', 'bệnh viện'], ['看', 'thăm', 'thăm|gặp'], ['朋友', 'bạn', 'bạn|người bạn|bạn bè']],
    nat: 'Chiều=2 | mai=1 | tôi=0 | đi=3 | bệnh viện=4 | thăm=5 | bạn=6', orders: ['0 2 1 3 4 5 6', '0 3 4 5 6 2 1'], alt: ['明天下午我去医院看朋友'] },
  { level: 1, title: 'Sách của bố', note: 'Tiếng Trung nói người sở hữu trước, tiếng Việt nói đồ vật trước.', zh: '这是我爸爸的书。',
    tk: [['这', 'đây', 'đây|cái này'], ['是', 'là', 'là'], ['我', 'tôi', 'tôi|mình'], ['爸爸', 'bố', 'bố|ba|cha'], ['的', 'của', '?của'], ['书', 'sách', 'sách|quyển sách|cuốn sách']],
    nat: 'Đây=0 | là=1 | sách=5 | của=4 | bố=3 | tôi=2' },
  { level: 1, title: 'Con gái của bạn', note: '你的女儿 đảo thành "con gái của bạn". Từ 吗 ở cuối giữ nguyên vị trí.', zh: '你的女儿在学校吗？',
    tk: [['你', 'bạn', 'bạn|anh|chị|cậu'], ['的', 'của', '?của'], ['女儿', 'con gái', 'con gái'], ['在', 'ở', 'ở|đang ở'], ['学校', 'trường', 'trường|trường học'], ['吗', 'à', 'à|không|phải không|hả']],
    nat: 'Con gái=2 | của=1 | bạn=0 | ở=3 | trường=4 | à=5', end: '?', filler: ['có'] },
  { level: 1, title: 'Mua táo', note: 'Nơi chốn 在商店 đứng trước động từ. Tiếng Việt thường để ra cuối câu.', zh: '她在商店买了三个苹果。',
    tk: [['她', 'cô ấy', 'cô ấy|chị ấy|bà ấy'], ['在', 'ở', 'ở|tại'], ['商店', 'cửa hàng', 'cửa hàng|tiệm'], ['买了', 'đã mua', 'đã mua|mua'], ['三个', 'ba quả', 'ba quả|ba trái'], ['苹果', 'táo', 'táo']],
    nat: 'Cô ấy=0 | đã mua=3 | ba quả=4 | táo=5 | ở=1 | cửa hàng=2', orders: ['0 1 2 3 4 5', '1 2 0 3 4 5'] },
  { level: 1, title: 'Bố đi Bắc Kinh', note: '我爸爸 đảo thành "bố tôi". Từ chỉ thời gian đặt đầu câu cho tự nhiên.', zh: '我爸爸今天坐飞机去北京。',
    tk: [['我', 'tôi', 'tôi|mình'], ['爸爸', 'bố', 'bố|ba|cha'], ['今天', 'hôm nay', 'hôm nay'], ['坐', 'đi', 'đi'], ['飞机', 'máy bay', 'máy bay'], ['去', 'đến', 'đến|tới|đi'], ['北京', 'Bắc Kinh', 'bắc kinh']],
    nat: 'Hôm nay=2 | bố=1 | tôi=0 | đi=3 | máy bay=4 | đến=5 | Bắc Kinh=6', orders: ['1 0 2 3 4 5 6', '1 0 3 4 5 6 2'], alt: ['今天我爸爸坐飞机去北京'] },
  { level: 1, title: 'Quyển sách này', note: 'Từ 这 đứng trước danh từ, còn "này" trong tiếng Việt đứng sau.', zh: '我很喜欢这本书。',
    tk: [['我', 'tôi', 'tôi|mình'], ['很', 'rất', '?rất|khá'], ['喜欢', 'thích', 'thích'], ['这', 'này', 'này'], ['本', 'quyển', 'quyển|cuốn'], ['书', 'sách', 'sách']],
    nat: 'Tôi=0 | rất=1 | thích=2 | quyển=4 | sách=5 | này=3' },
  { level: 1, title: 'Thời tiết hôm qua', note: '昨天的天气 đảo thành "thời tiết hôm qua", 不太好 thành "không tốt lắm". Từ 的 không cần dịch.', zh: '昨天的天气不太好。',
    tk: [['昨天', 'hôm qua', 'hôm qua'], ['的', '(trợ từ)', '?của'], ['天气', 'thời tiết', 'thời tiết'], ['不', 'không', 'không|chẳng'], ['太', 'lắm', 'lắm|quá'], ['好', 'tốt', 'tốt|đẹp']],
    nat: 'Thời tiết=2 | hôm qua=0 | không=3 | tốt=5 | lắm=4', filler: ['được'] },
  { level: 1, title: 'Người bạn tôi quen', note: 'Cả cụm 我认识的 đứng trước 朋友. Tiếng Việt nói "người bạn" trước rồi mới tới "mà tôi quen".', zh: '他是我认识的中国朋友。',
    tk: [['他', 'anh ấy', 'anh ấy|anh ta|cậu ấy|ông ấy'], ['是', 'là', 'là'], ['我', 'tôi', 'tôi|mình'], ['认识', 'quen', 'quen|quen biết|biết'], ['的', 'mà', '?mà'], ['中国', 'Trung Quốc', 'trung quốc'], ['朋友', 'người bạn', 'người bạn|bạn']],
    nat: 'Anh ấy=0 | là=1 | người bạn=6 | Trung Quốc=5 | mà=4 | tôi=2 | quen=3' },

  // ───────────── HSK 2 ─────────────
  { level: 2, title: 'Câu so sánh', note: '比我 đứng trước 高, còn tiếng Việt nói "cao" trước rồi mới tới "hơn tôi".', zh: '哥哥比我高。',
    tk: [['哥哥', 'anh trai', 'anh trai|anh|anh trai tôi|anh tôi|anh trai của tôi|anh trai mình|anh mình'], ['比我', 'hơn tôi', 'hơn tôi|hơn mình|so với tôi|hơn so với tôi'], ['高', 'cao', 'cao']],
    nat: 'Anh trai=0 | cao=2 | hơn tôi=1', alt: ['我哥哥比我高'] },
  { level: 2, title: 'Quần áo mẹ mua', note: '衣服 nằm cuối câu nhưng tiếng Việt nói ngay sau "là". Trong tiếng Trung, cả cụm bổ nghĩa đứng trước danh từ.', zh: '这是妈妈昨天给我买的新衣服。',
    tk: [['这', 'đây', 'đây|cái này'], ['是', 'là', 'là'], ['妈妈', 'mẹ', 'mẹ|mẹ tôi|mẹ mình'], ['昨天', 'hôm qua', 'hôm qua'], ['给我', 'cho tôi', 'cho tôi|cho mình'], ['买', 'mua', 'mua'], ['的', 'mà', '?mà'], ['新', 'mới', 'mới'], ['衣服', 'quần áo', 'bộ quần áo|quần áo|bộ đồ']],
    nat: 'Đây=0 | là=1 | bộ quần áo=8 | mới=7 | mà=6 | hôm qua=3 | mẹ=2 | mua=5 | cho tôi=4', orders: ['0 1 8 7 6 2 3 5 4', '0 1 8 7 6 2 5 4 3'], filler: ['đã'] },
  { level: 2, title: 'Đi làm mỗi sáng', note: '七点 đứng trước động từ. Tiếng Việt có thể để giờ ở cuối câu, nên mũi tên chạy từ giữa xuống cuối.', zh: '他每天早上七点都坐公共汽车去公司。',
    tk: [['他', 'anh ấy', 'anh ấy|anh ta|cậu ấy|ông ấy'], ['每天早上', 'mỗi sáng', 'mỗi sáng|mỗi buổi sáng|hằng sáng'], ['七点', 'bảy giờ', 'lúc bảy giờ|bảy giờ|lúc 7 giờ|7 giờ'], ['都', 'đều', '?đều|cũng'], ['坐', 'đi', 'đi|ngồi'], ['公共汽车', 'xe buýt', 'xe buýt'], ['去', 'đến', 'đến|tới'], ['公司', 'công ty', 'công ty']],
    nat: 'Mỗi sáng=1 | anh ấy=0 | đều=3 | đi=4 | xe buýt=5 | đến=6 | công ty=7 | lúc bảy giờ=2', orders: ['1 2 0 3 4 5 6 7', '0 1 2 3 4 5 6 7', '0 3 4 5 6 7 2 1'], filler: ['thì', 'vào'], alt: ['每天早上七点他都坐公共汽车去公司'] },
  { level: 2, title: 'Vì trời mưa', note: 'Vế 因为… 所以… giữ gần nguyên thứ tự. Chỉ có "hôm nay" thường được đưa lên trước chủ ngữ.', zh: '因为下雨了，所以我们今天不去公园。',
    tk: [['因为', 'vì', 'vì|bởi vì|do'], ['下雨了', 'trời mưa', 'trời mưa|mưa'], ['所以', 'nên', 'nên|cho nên|vì vậy|vì thế'], ['我们', 'chúng tôi', 'chúng tôi|chúng ta|bọn tôi|chúng mình|bọn mình'], ['今天', 'hôm nay', 'hôm nay'], ['不', 'không', 'không'], ['去', 'đi', 'đi|đến|tới'], ['公园', 'công viên', 'công viên']],
    nat: 'Vì=0 | trời mưa=1 | nên=2 | hôm nay=4 | chúng tôi=3 | không=5 | đi=6 | công viên=7', orders: ['0 1 2 3 4 5 6 7'], alt: ['因为下雨了，所以今天我们不去公园'] },
  { level: 2, title: 'Học hai năm rồi', note: 'Thời lượng 两年 đứng trước 汉语, tiếng Việt nói "tiếng Trung" trước rồi mới tới "hai năm".', zh: '我已经学了两年汉语了。',
    tk: [['我', 'tôi', 'tôi|mình'], ['已经', 'đã', '?đã'], ['学了', 'học', 'học'], ['两年', 'hai năm', 'hai năm|2 năm'], ['汉语', 'tiếng Trung', 'tiếng trung|tiếng hoa|tiếng hán'], ['了', 'rồi', '?rồi']],
    nat: 'Tôi=0 | đã=1 | học=2 | tiếng Trung=4 | hai năm=3 | rồi=5', filler: ['được'] },
  { level: 2, title: 'Nói rất giỏi', note: '汉语 đứng trước 说, tiếng Việt nói "nói tiếng Trung". Từ 得 chỉ nối động từ với lời đánh giá, không dịch ra.', zh: '他汉语说得非常好。',
    tk: [['他', 'anh ấy', 'anh ấy|anh ta|cậu ấy|ông ấy'], ['汉语', 'tiếng Trung', 'tiếng trung|tiếng hoa|tiếng hán'], ['说', 'nói', 'nói'], ['得', '(trợ từ)', '?'], ['非常', 'rất', 'rất|cực kỳ|vô cùng|hết sức'], ['好', 'giỏi', 'giỏi|tốt|hay']],
    nat: 'Anh ấy=0 | nói=2 | tiếng Trung=1 | rất=4 | giỏi=5' },
  { level: 2, title: 'Áo hơi đắt', note: 'Từ 这 đứng đầu cụm, còn "này" đứng sau "chiếc áo". Phần còn lại giữ nguyên thứ tự.', zh: '虽然这件衣服有点贵，但是很漂亮。',
    tk: [['虽然', 'tuy', 'tuy|tuy rằng|mặc dù|dù'], ['这', 'này', 'này'], ['件', 'chiếc', '?chiếc|cái|bộ'], ['衣服', 'áo', 'áo|quần áo|đồ'], ['有点', 'hơi', 'hơi|có hơi|hơi bị'], ['贵', 'đắt', 'đắt|mắc'], ['但是', 'nhưng', 'nhưng|nhưng mà'], ['很', 'rất', '?rất|khá'], ['漂亮', 'đẹp', 'đẹp|xinh']],
    nat: 'Tuy=0 | chiếc=2 | áo=3 | này=1 | hơi=4 | đắt=5 | nhưng=6 | rất=7 | đẹp=8' },
  { level: 2, title: 'Tám giờ sáng mai', note: '明天早上八点 đi từ lớn đến nhỏ, tiếng Việt đảo hẳn thành "tám giờ sáng mai".', zh: '老师让我们明天早上八点到学校。',
    tk: [['老师', 'cô giáo', 'cô giáo|thầy giáo|giáo viên|thầy|cô'], ['让', 'bảo', 'bảo|yêu cầu|kêu'], ['我们', 'chúng tôi', 'chúng tôi|bọn tôi|chúng em|chúng mình|bọn mình'], ['明天', 'mai', 'mai|ngày mai'], ['早上', 'sáng', 'sáng|buổi sáng'], ['八点', 'tám giờ', 'tám giờ|8 giờ|lúc tám giờ|lúc 8 giờ'], ['到', 'đến', 'đến|tới|có mặt ở'], ['学校', 'trường', 'trường|trường học']],
    nat: 'Cô giáo=0 | bảo=1 | chúng tôi=2 | tám giờ=5 | sáng=4 | mai=3 | đến=6 | trường=7', orders: ['0 1 2 4 3 5 6 7', '0 1 2 6 7 5 4 3', '0 1 2 6 7 4 3 5'], filler: ['phải'] },

  // ───────────── HSK 3 ─────────────
  { level: 3, title: 'Đọc sách ở thư viện', note: '在… đứng trước động từ, tiếng Việt để ra sau. 学校的图书馆 cũng đảo thành "thư viện của trường".', zh: '我昨天在学校的图书馆看了两本书。',
    tk: [['我', 'tôi', 'tôi|mình'], ['昨天', 'hôm qua', 'hôm qua'], ['在', 'ở', 'ở|tại'], ['学校', 'trường', 'trường|trường học'], ['的', 'của', '?của'], ['图书馆', 'thư viện', 'thư viện'], ['看了', 'đã đọc', 'đã đọc|đọc'], ['两本', 'hai quyển', 'hai quyển|hai cuốn'], ['书', 'sách', 'sách']],
    nat: 'Hôm qua=1 | tôi=0 | đã đọc=6 | hai quyển=7 | sách=8 | ở=2 | thư viện=5 | của=4 | trường=3', orders: ['0 1 6 7 8 2 5 3', '0 6 7 8 2 5 3 1', '1 0 2 5 3 6 7 8'], alt: ['昨天我在学校的图书馆看了两本书'] },
  { level: 3, title: 'Nếu mai không mưa', note: 'Từ 就 đứng sau chủ ngữ 我们, còn "thì" trong tiếng Việt đứng trước chủ ngữ.', zh: '如果明天不下雨，我们就去爬山。',
    tk: [['如果', 'nếu', 'nếu|nếu như'], ['明天', 'ngày mai', 'ngày mai|mai'], ['不', 'không', 'không'], ['下雨', 'mưa', 'mưa|trời mưa'], ['我们', 'chúng ta', 'chúng ta|chúng tôi|chúng mình|bọn mình'], ['就', 'thì', '?thì'], ['去', 'đi', 'đi'], ['爬山', 'leo núi', 'leo núi']],
    nat: 'Nếu=0 | ngày mai=1 | không=2 | mưa=3 | thì=5 | chúng ta=4 | đi=6 | leo núi=7', filler: ['sẽ'] },
  { level: 3, title: 'Chiếc xe đạp', note: 'Danh từ 自行车 đứng cuối câu, nhưng tiếng Việt đưa lên ngay sau "là" rồi mới nói phần bổ nghĩa.', zh: '这是我上个月在北京买的自行车。',
    tk: [['这', 'đây', 'đây|cái này'], ['是', 'là', 'là'], ['我', 'tôi', 'tôi|mình'], ['上个月', 'tháng trước', 'tháng trước|tháng rồi'], ['在', 'ở', 'ở|tại'], ['北京', 'Bắc Kinh', 'bắc kinh'], ['买', 'mua', 'mua'], ['的', 'mà', '?mà'], ['自行车', 'chiếc xe đạp', 'chiếc xe đạp|xe đạp']],
    nat: 'Đây=0 | là=1 | chiếc xe đạp=8 | mà=7 | tháng trước=3 | tôi=2 | mua=6 | ở=4 | Bắc Kinh=5', orders: ['0 1 8 7 2 6 4 5 3', '0 1 8 7 2 3 6 4 5'], filler: ['đã'] },
  { level: 3, title: 'Bị lấy mất', note: '我的手机 đảo thành "điện thoại của tôi". Phần 被 giữ nguyên thứ tự như tiếng Việt.', zh: '我的手机被弟弟拿走了。',
    tk: [['我的', 'của tôi', 'của tôi|của mình|tôi|mình'], ['手机', 'điện thoại', 'điện thoại'], ['被', 'bị', 'bị|đã bị'], ['弟弟', 'em trai', 'em trai|em'], ['拿走', 'lấy mất', 'lấy mất|lấy đi|cầm đi|mang đi|lấy'], ['了', 'rồi', '?rồi']],
    nat: 'Điện thoại=1 | của tôi=0 | bị=2 | em trai=3 | lấy mất=4 | rồi=5' },
  { level: 3, title: 'Ngoài tiếng Trung', note: 'Câu này gần như dịch thẳng được: thứ tự hai tiếng giống nhau, nên mũi tên không cắt nhau.', zh: '除了汉语以外，我还会说英语。',
    tk: [['除了', 'ngoài', 'ngoài|ngoài ra'], ['汉语', 'tiếng Trung', 'tiếng trung|tiếng hoa|tiếng hán'], ['以外', 'ra', '?ra'], ['我', 'tôi', 'tôi|mình'], ['还', 'còn', 'còn|cũng'], ['会', 'biết', 'biết|có thể'], ['说', 'nói', 'nói'], ['英语', 'tiếng Anh', 'tiếng anh']],
    nat: 'Ngoài=0 | tiếng Trung=1 | ra=2 | tôi=3 | còn=4 | biết=5 | nói=6 | tiếng Anh=7', orders: ['3 4 5 6 7 0 1 2'] },
  { level: 3, title: 'Ngày càng nhiều', note: 'Cả cụm 学汉语的 đứng trước 人. Tiếng Việt nói "người" trước rồi mới tới "học tiếng Trung".', zh: '学汉语的人越来越多了。',
    tk: [['学', 'học', 'học'], ['汉语', 'tiếng Trung', 'tiếng trung|tiếng hoa|tiếng hán'], ['的', '(trợ từ)', '?'], ['人', 'người', 'người|những người|số người'], ['越来越', 'ngày càng', 'ngày càng|càng ngày càng'], ['多', 'nhiều', 'nhiều|đông'], ['了', '(trợ từ)', '?']],
    nat: 'Người=3 | học=0 | tiếng Trung=1 | ngày càng=4 | nhiều=5', filler: ['rồi', 'hơn'] },
  { level: 3, title: 'Câu chữ 把', note: 'Từ 把 đưa 作业 lên trước động từ và không dịch ra. Tiếng Việt nói "để bài tập". 桌子上 đảo thành "trên bàn".', zh: '我把作业放在桌子上了。',
    tk: [['我', 'tôi', 'tôi|mình'], ['把', '(đưa tân ngữ lên)', '?'], ['作业', 'bài tập', 'bài tập'], ['放', 'để', 'để|đặt'], ['在', 'ở', '?ở'], ['桌子', 'bàn', 'bàn|cái bàn'], ['上', 'trên', 'trên|lên'], ['了', 'rồi', '?rồi']],
    nat: 'Tôi=0 | để=3 | bài tập=2 | ở=4 | trên=6 | bàn=5 | rồi=7', filler: ['đã'] },
  { level: 3, title: 'Giá như', note: 'Thời gian 昨天 thường đứng trước "tôi", 妈妈的话 đảo thành "lời mẹ". Từ 的 không cần dịch.', zh: '要是我昨天听妈妈的话就好了。',
    tk: [['要是', 'giá như', 'giá như|giá mà|nếu'], ['我', 'tôi', 'tôi|mình'], ['昨天', 'hôm qua', 'hôm qua'], ['听', 'nghe', 'nghe'], ['妈妈', 'mẹ', 'mẹ|mẹ tôi|mẹ mình'], ['的', '(trợ từ)', '?của'], ['话', 'lời', 'lời'], ['就', 'thì', '?thì'], ['好了', 'tốt biết mấy', 'tốt biết mấy|hay biết mấy|tốt quá|tốt rồi|tốt']],
    nat: 'Giá như=0 | hôm qua=2 | tôi=1 | nghe=3 | lời=6 | mẹ=4 | thì=7 | tốt biết mấy=8', orders: ['0 1 2 3 6 4 7 8'] },
];

export interface SentenceSeed extends SentenceKey {
  level: number;
  title: string;
  note: string;
  zh: string;
  vi: string;
  tokens: { zh: string; vi: string }[];
  natural: { vi: string; at: number }[];
  alt: string[];
  sort: number;
}

export const SENTENCES: SentenceSeed[] = ROWS.map((r, sort) => {
  const natural = r.nat.split(' | ').map((p) => {
    const eq = p.lastIndexOf('=');
    return { vi: p.slice(0, eq), at: Number(p.slice(eq + 1)) };
  });
  const accept = r.tk.map(([, , a]) => (a.startsWith('?') ? a.slice(1) : a).split('|').filter(Boolean));
  const optional = r.tk.flatMap(([, , a], i) => (a.startsWith('?') ? [i] : []));
  const nums = (s: string) => s.split(' ').map(Number);
  return {
    level: r.level,
    title: r.title,
    note: r.note,
    zh: r.zh,
    vi: natural.map((n) => n.vi).join(' ') + (r.end ?? '.'),
    tokens: r.tk.map(([zh, vi]) => ({ zh, vi })),
    natural,
    accept,
    optional,
    filler: r.filler ?? [],
    orders: [natural.map((n) => n.at), ...(r.orders ?? []).map(nums)],
    alt: r.alt ?? [],
    sort,
  };
});

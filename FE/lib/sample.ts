// Bài đọc mẫu, lấy từ bản demo (bản thật: AI sinh, người biết tiếng Trung duyệt). Chỉ dùng để hình dung kỹ năng Đọc.

export interface ReadSent { t: (string[])[]; vi: string }
export interface ReadText { id: string; title: [string, string]; src: string; lvl: string; topics: string[]; sents: ReadSent[]; q?: ReadQuestion[] }
export interface ReadQuestion { q: [string, string]; o: [string, string][]; a: number }

export const READS: ReadText[] = [
 {
  "id": "day",
  "title": [
   "我的一天",
   "Một ngày của Tiểu Minh"
  ],
  "src": "Bài mẫu theo HSK",
  "lvl": "HSK 2",
  "topics": [
   "Sinh hoạt"
  ],
  "sents": [
   {
    "t": [
     [
      "我",
      "wǒ",
      "tôi"
     ],
     [
      "每天",
      "měitiān",
      "mỗi ngày"
     ],
     [
      "早上",
      "zǎoshang",
      "buổi sáng"
     ],
     [
      "七点",
      "qī diǎn",
      "7 giờ"
     ],
     [
      "起床",
      "qǐchuáng",
      "thức dậy"
     ],
     [
      "。"
     ]
    ],
    "vi": "Mỗi ngày tôi thức dậy lúc 7 giờ sáng."
   },
   {
    "t": [
     [
      "我",
      "wǒ",
      "tôi"
     ],
     [
      "喝",
      "hē",
      "uống"
     ],
     [
      "茶",
      "chá",
      "trà"
     ],
     [
      "，"
     ],
     [
      "吃",
      "chī",
      "ăn"
     ],
     [
      "面包",
      "miànbāo",
      "bánh mì"
     ],
     [
      "。"
     ]
    ],
    "vi": "Tôi uống trà, ăn bánh mì."
   },
   {
    "t": [
     [
      "然后",
      "ránhòu",
      "sau đó"
     ],
     [
      "我",
      "wǒ",
      "tôi"
     ],
     [
      "坐",
      "zuò",
      "ngồi, đi (xe)"
     ],
     [
      "地铁",
      "dìtiě",
      "tàu điện ngầm"
     ],
     [
      "去",
      "qù",
      "đi"
     ],
     [
      "公司",
      "gōngsī",
      "công ty"
     ],
     [
      "。"
     ]
    ],
    "vi": "Sau đó tôi đi tàu điện ngầm đến công ty."
   }
  ],
  "q": [
   {
    "q": [
     "小明早上喝什么？",
     "Buổi sáng Tiểu Minh uống gì?"
    ],
    "o": [
     [
      "茶",
      "Trà"
     ],
     [
      "咖啡",
      "Cà phê"
     ],
     [
      "水",
      "Nước"
     ]
    ],
    "a": 0
   },
   {
    "q": [
     "他怎么去公司？",
     "Anh ấy đến công ty bằng gì?"
    ],
    "o": [
     [
      "坐地铁",
      "Đi tàu điện ngầm"
     ],
     [
      "打车",
      "Bắt taxi"
     ],
     [
      "走路",
      "Đi bộ"
     ]
    ],
    "a": 0
   }
  ]
 },
 {
  "id": "news",
  "title": [
   "地铁一号线今天坏了",
   "Tàu điện tuyến 1 hôm nay bị hỏng"
  ],
  "src": "Tin ngắn, biên tập lại từ báo",
  "lvl": "HSK 3",
  "topics": [
   "Đi lại",
   "Tin tức"
  ],
  "sents": [
   {
    "t": [
     [
      "今天",
      "jīntiān",
      "hôm nay"
     ],
     [
      "地铁",
      "dìtiě",
      "tàu điện ngầm"
     ],
     [
      "一号线",
      "yī hào xiàn",
      "tuyến số 1"
     ],
     [
      "坏",
      "huài",
      "hỏng"
     ],
     [
      "了",
      "le",
      "(đã)"
     ],
     [
      "。"
     ]
    ],
    "vi": "Hôm nay tuyến tàu điện ngầm số 1 bị hỏng."
   },
   {
    "t": [
     [
      "很多",
      "hěn duō",
      "rất nhiều"
     ],
     [
      "人",
      "rén",
      "người"
     ],
     [
      "上班",
      "shàngbān",
      "đi làm"
     ],
     [
      "晚",
      "wǎn",
      "muộn"
     ],
     [
      "到",
      "dào",
      "đến"
     ],
     [
      "了",
      "le",
      "(đã)"
     ],
     [
      "。"
     ]
    ],
    "vi": "Rất nhiều người đi làm bị đến muộn."
   },
   {
    "t": [
     [
      "公司",
      "gōngsī",
      "công ty"
     ],
     [
      "说",
      "shuō",
      "nói"
     ],
     [
      "："
     ],
     [
      "“"
     ],
     [
      "不要紧",
      "bú yàojǐn",
      "không sao"
     ],
     [
      "。"
     ],
     [
      "”"
     ]
    ],
    "vi": "Công ty nói: \"Không sao\"."
   }
  ],
  "q": [
   {
    "q": [
     "今天什么坏了？",
     "Hôm nay cái gì bị hỏng?"
    ],
    "o": [
     [
      "地铁",
      "Tàu điện ngầm"
     ],
     [
      "电脑",
      "Máy tính"
     ],
     [
      "手机",
      "Điện thoại"
     ]
    ],
    "a": 0
   }
  ]
 }
];

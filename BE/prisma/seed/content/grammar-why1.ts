// Giải thích đáp án cho bài luyện ngữ pháp HSK 1 (soạn 20/11/2026, CHƯA QUA DUYỆT: người biết tiếng Trung cần kiểm lại).
// Mỗi điểm ngữ pháp là một mảng theo ĐÚNG thứ tự bài luyện trong grammar.ts, bài "Tìm câu SAI" (tự dựng từ bài chọn câu) nằm cuối.
// Mỗi phần tử: [vì sao đáp án đúng, [vì sao từng lựa chọn sai theo thứ tự lựa chọn sai trong đề]].
// Bài sắp xếp và bài "Tìm câu SAI" không có phần lựa chọn sai.

export type Why = [ok: string, no?: string[]];

export const WHY1: Record<string, Why[]> = {
  'ma-ne': [
    ['Trật tự cơ bản của tiếng Trung là Chủ ngữ + Động từ + Tân ngữ: 你 (bạn) + 喝 (uống) + 茶 (trà). Muốn hỏi có/không chỉ cần thêm 吗 vào CUỐI câu, không đảo trật tự như tiếng Anh. Vì vậy 吗 đứng cuối: 你喝茶吗？'],
    [
      'Đây là câu hỏi có/không ("có phải giáo viên không?"), nên thêm 吗 vào cuối câu trần thuật 你是老师.',
      [
        '呢 dùng để hỏi lại kiểu "còn … thì sao?" khi đã có ngữ cảnh (我很好，你呢？). Nó không biến một câu trần thuật thành câu hỏi có/không.',
        '吧 diễn tả đề nghị hoặc phỏng đoán ("…nhé", "…nhỉ"). 你是老师吧 nghĩa là "bạn là giáo viên nhỉ?" (người nói đã đoán là đúng), khác với hỏi thẳng "có phải không".',
      ],
    ],
    [
      'Câu này là "Mình khỏe, còn bạn?": hỏi lại người kia theo chủ đề vừa nói. Cấu trúc hỏi lại là "A 呢？" nên điền 呢.',
      [
        '吗 phải đi sau một câu trần thuật đầy đủ (có chủ ngữ và vị ngữ). Ở đây chỉ có 你, nên 你吗？ không thành câu.',
        '了 báo hoàn thành hoặc thay đổi trạng thái, không tạo ra câu hỏi.',
      ],
    ],
    [
      '你是学生吗？ là câu hỏi có/không chuẩn: câu trần thuật 你是学生 + 吗 ở cuối.',
      [
        'Sai vì 呢 không dùng để hỏi "có phải … không". Muốn hỏi có/không phải dùng 吗.',
        'Sai vì 不 phải đứng ngay trước động từ 是 thành 不是. Không chen 不 vào giữa 是 và 学生. Với 吗 ở cuối câu thì cũng không cần thêm 不.',
      ],
    ],
    ['Câu sai là 你是学生呢: 呢 chỉ dùng để hỏi lại (你呢？), không biến câu trần thuật thành câu hỏi có/không. Phải dùng 你是学生吗. Ba câu còn lại đều đúng.'],
  ],

  shi: [
    ['Công thức A 是 B: 他 (A) + 是 (là) + B. Ở đây B là cụm danh từ 我的朋友 (bạn của tôi), trong đó 我的 (của tôi) đứng trước danh từ 朋友. Thứ tự: 他 → 是 → 我的 → 朋友.'],
    [
      'Phủ định của 是 là 不是 ("không phải là"): 我不是中国人.',
      [
        '没 chỉ phủ định 有 hoặc hành động đã xảy ra. Nó không bao giờ đứng trước 是, nên không có cách nói 没是.',
        'Chỉ có 不 thì thiếu động từ 是: 我不中国人 không thành câu. Phải là 不是.',
      ],
    ],
    [
      'Tính từ làm vị ngữ trực tiếp, thường có 很 đứng trước: 她很漂亮. Không cần 是.',
      [
        '是 chỉ nối hai danh từ (A là B). Trước tính từ không dùng 是, nên 她是漂亮 là lỗi hay gặp của người nói theo thói quen "là" tiếng Việt.',
        '是 phải đứng giữa chủ ngữ và vị ngữ, không thể đặt ở cuối câu. Hơn nữa trước tính từ vẫn không dùng 是.',
      ],
    ],
    [
      '"Đây là điện thoại của tôi": nối 这 với danh từ 我的手机 bằng 是 (A 是 B).',
      [
        '有 nghĩa là "có". 这有我的手机 thành "ở đây có điện thoại của tôi", khác nghĩa với câu cần nói.',
        '在 chỉ vị trí ("ở") và cần nơi chốn đi sau. 这在我的手机 không thành câu có nghĩa.',
      ],
    ],
    ['Câu sai là 她是漂亮: 是 chỉ nối danh từ với danh từ. Tính từ đứng trực tiếp sau chủ ngữ (她很漂亮). Ba câu còn lại đều đúng.'],
  ],

  you: [
    ['Phủ định của 有 là 没有: 我 (chủ ngữ) + 没有 (không có) + 时间 (thời gian). Công thức A 没有 B.'],
    [
      'Khi nói số người trong gia đình, người Trung dùng 有: 我家有四口人 ("nhà tôi có bốn người").',
      [
        '是 dùng khi A chính là B (A = B), không dùng để đếm số thành viên. Ở trình độ này hãy chọn 有 cho kiểu "có bao nhiêu người".',
        '在 chỉ vị trí ("ở"). 我家在四口人 không có nghĩa.',
      ],
    ],
    [
      'Phủ định của 有 là 没有: 他没有汉语书.',
      [
        'Không bao giờ nói 不有. Động từ 有 chỉ được phủ định bằng 没 hoặc 没有.',
        'Chỉ có 不 thì thiếu động từ 有: 他不汉语书 không thành câu.',
      ],
    ],
    [
      'Trật tự đúng: 我 (chủ ngữ) + 没有 (không có) + 钱 (tiền).',
      [
        'Sai vì 有 không đi với 不. Phải dùng 没 hoặc 没有.',
        'Sai trật tự: 有 phải đứng TRƯỚC tân ngữ 钱 (有钱 / 没有钱), không đặt ở cuối câu.',
      ],
    ],
    ['Câu sai là 我不有钱: 有 chỉ phủ định bằng 没(有), không bao giờ dùng 不有. Ba câu còn lại đều đúng.'],
  ],

  'bu-mei': [
    [
      '昨天 (hôm qua) nói về việc đã qua. Hành động không xảy ra trong quá khứ dùng 没: 没去 = đã không đi.',
      [
        '不 phủ định thói quen, ý muốn hoặc việc ở hiện tại/tương lai (我不去 = tôi không đi / tôi không muốn đi). Với việc đã qua và không xảy ra, dùng 没.',
        '别 nghĩa là "đừng" (ngăn cấm), không phải phủ định thông thường.',
      ],
    ],
    [
      '是 chỉ phủ định bằng 不: 他不是学生.',
      [
        '没 phủ định 有 hoặc hành động đã xảy ra. Không có 没是.',
        '别 nghĩa là "đừng", không dùng để phủ định 是.',
      ],
    ],
    [
      'Việc không xảy ra trong quá khứ: 没 + động từ. Không thêm 了 phía sau: 昨天我没去上班.',
      [
        'Sai vì đã có 没(有) phủ định hành động thì không dùng 了 nữa (没…了 mâu thuẫn).',
        'Sai vì 不…了 nghĩa là "không … nữa" (đổi ý), không phải "hôm qua đã không đi". Chuyện quá khứ dùng 没.',
      ],
    ],
    ['不 đứng ngay trước động từ cần phủ định: 我 + 不 + 喝 + 咖啡. "Tôi không uống cà phê" nói về thói quen/ý muốn nên dùng 不.'],
    ['Câu sai là 昨天我没有去上班了: đã có 没有 phủ định thì không thêm 了 ở cuối câu. Ba câu còn lại đều đúng.'],
  ],

  'de-possess': [
    ['Sở hữu: Người + 的 + vật. 老师的 (của thầy giáo) đứng trước 书. Cả câu: 这是 + 老师的 + 书. Thứ tự này ngược với tiếng Việt ("sách của thầy").'],
    [
      '我的书 = sách của tôi. 的 đặt giữa người sở hữu và vật sở hữu.',
      [
        '得 đứng sau động từ để nối với bổ ngữ (跑得快), không chỉ sở hữu.',
        '地 nối trạng ngữ với động từ (慢慢地走), không chỉ sở hữu.',
      ],
    ],
    [
      'Thứ tự: Người sở hữu + 的 + Danh từ → 我的书. Tiếng Trung đặt người sở hữu TRƯỚC, ngược với tiếng Việt ("sách của tôi").',
      [
        'Sai vì đặt theo thứ tự tiếng Việt. "Sách của tôi" phải là 我的书.',
        'Sai vì 的 phải nằm giữa 我 và 书, không đứng ở cuối cụm.',
      ],
    ],
    [
      '我的朋友 = bạn của tôi: 的 đứng giữa người sở hữu (我) và danh từ (朋友), nên câu là 他是我的朋友.',
      [
        '了 báo hoàn thành hoặc thay đổi, không nối hai danh từ.',
        '过 báo "đã từng", đi sau động từ, không chỉ sở hữu.',
      ],
    ],
    ['Câu sai là 这是书我的: đặt theo thứ tự tiếng Việt. Tiếng Trung đặt người sở hữu trước: 我的书. Ba câu còn lại đều đúng.'],
  ],

  modal: [
    ['Động từ năng nguyện đứng TRƯỚC động từ chính: 我 + 会 + 说 + 汉语. 会 ở đây là "biết" (kỹ năng học được).'],
    [
      '"Tôi muốn uống một cốc nước" diễn tả mong muốn → 想 + động từ.',
      [
        '会 là "biết (làm)" hoặc "sẽ". 我会喝一杯水 nghĩa là "tôi sẽ uống một cốc nước", không phải "muốn".',
        '是 là "là", không đứng trước động từ để nói mong muốn.',
      ],
    ],
    [
      'Xin phép "ngồi được không?" dùng 可以 (được phép): 这里可以坐吗？',
      [
        '想 là "muốn". 这里想坐吗 hỏi "ở đây bạn có muốn ngồi không", không phải xin phép.',
        '会 là "biết" hoặc "sẽ", không dùng để xin phép.',
      ],
    ],
    [
      '可以 (động từ năng nguyện) đứng trước động từ chính 帮: 你 + 可以 + 帮 + 我 + 吗.',
      [
        'Sai vì 可以 phải đứng TRƯỚC 帮, không đứng sau động từ.',
        'Sai vì 吗 luôn ở cuối câu. Ở đây 吗 bị chen vào trước 我.',
      ],
    ],
    ['Câu sai là 你帮可以我吗: động từ năng nguyện 可以 phải đứng trước động từ chính 帮 (你可以帮我吗). Ba câu còn lại đều đúng.'],
  ],

  liangci: [
    [
      'Sách dùng lượng từ riêng 本: 三本书 (ba quyển sách).',
      [
        '个 là lượng từ chung, dùng được cho nhiều vật, nhưng sách có lượng từ riêng là 本. Ở HSK nên dùng đúng lượng từ.',
        '杯 là "cốc/ly", dùng cho đồ uống.',
      ],
    ],
    [
      'Trà đựng trong cốc nên dùng 杯: 一杯茶.',
      [
        '本 dùng cho sách, vở.',
        '件 dùng cho quần áo, sự việc.',
      ],
    ],
    [
      'Trước lượng từ, số 2 đọc là 两: 两个人 (hai người).',
      [
        '二 dùng khi đếm số, đọc số hoặc số thứ tự (二月, 第二). Trước lượng từ phải dùng 两.',
        '俩 (liǎ) đã mang nghĩa "hai người" nên không thêm 个 sau nó. 俩个人 là sai.',
      ],
    ],
    ['Cấu trúc: Số + lượng từ + danh từ → 两个哥哥. Cả câu: 他 + 有 + 两个 + 哥哥. Số 2 trước lượng từ dùng 两.'],
  ],

  'wh-words': [
    ['Từ để hỏi đứng đúng vị trí của câu trả lời. Câu trả lời là 我吃米饭 (tân ngữ đứng sau 吃), nên câu hỏi là 你吃什么. Tiếng Trung không đưa từ để hỏi lên đầu câu như tiếng Anh (What do you eat?).'],
    [
      'Hỏi "ai" dùng 谁: 他是谁？',
      [
        '哪儿 hỏi nơi chốn ("ở đâu").',
        '几 hỏi số lượng nhỏ (dưới 10), không hỏi người.',
      ],
    ],
    [
      '"Bạn ở đâu?" hỏi nơi chốn → 哪儿: 你在哪儿？',
      [
        '什么 hỏi "cái gì", không hỏi nơi chốn.',
        '谁 hỏi "ai", không hỏi nơi chốn.',
      ],
    ],
    [
      'Câu có từ để hỏi (多少) đã là câu hỏi, không thêm 吗. Trật tự: 这本书 (chủ đề) + 多少钱.',
      [
        'Sai vì từ để hỏi như 多少, 什么, 谁… không dùng chung với 吗.',
        'Sai trật tự: chủ đề 这本书 phải đứng trước 多少钱.',
      ],
    ],
    ['Câu sai là 这本书多少钱吗: câu đã có từ để hỏi 多少 thì không thêm 吗. Ba câu còn lại đều đúng.'],
  ],

  'zai-place': [
    ['Nơi chốn đứng TRƯỚC động từ: 在北京 (ở Bắc Kinh) + 工作 (làm việc). Khác tiếng Việt, nơi chốn không đặt cuối câu.'],
    [
      '"Làm gì ở đâu": 在 + nơi chốn + động từ → 在学校学习.',
      [
        '是 nối A với B, không chỉ nơi diễn ra hành động.',
        '有 là "có". 他有学校学习 không mang nghĩa "học ở trường".',
      ],
    ],
    [
      'Nơi chốn đứng trước động từ: 在家 + 做饭 → 我妈妈在家做饭.',
      [
        'Sai trật tự: 在家 phải đứng trước 做饭 (khác tiếng Việt "nấu cơm ở nhà").',
        '我妈妈家在做饭 nghĩa là "nhà của mẹ tôi đang nấu cơm", 在 bị hiểu là "đang", mất ý nơi chốn.',
      ],
    ],
    [
      '"Bạn ở đâu?": 在 (ở) + 哪儿 (đâu) → 你在哪儿？',
      [
        '有 là "có", không hỏi vị trí của người.',
        '你是哪儿 không thành câu hoàn chỉnh. Muốn hỏi quê quán phải nói 你是哪儿人？',
      ],
    ],
    ['Câu sai là 我妈妈做饭在家: nơi chốn phải đứng trước động từ (我妈妈在家做饭). Ba câu còn lại đều đúng.'],
  ],

  'time-order': [
    ['Từ chỉ thời gian đứng TRƯỚC động từ: 我 + 明天 + 去 + 学校. Có thể đưa thời gian lên đầu câu: 明天我去学校. Cả hai cách đều đúng.'],
    ['Giờ giấc đứng trước động từ: 他 + 八点 + 起床 ("dậy lúc 8 giờ"). Cũng có thể nói 八点他起床.'],
    [
      'Thời gian 今天 đứng trước phủ định và động từ: 我 + 今天 + 不 + 上班.',
      [
        'Sai vì thời gian không đứng ở cuối câu (khác tiếng Việt "đi làm hôm nay").',
        'Sai vì 不 phải đứng ngay trước động từ 上班, còn thời gian 今天 phải đứng trước 不.',
      ],
    ],
    [
      'Giờ trong tiếng Trung: số + 点 → 七点 (7 giờ). Đứng trước động từ: 我七点吃早饭.',
      [
        'Chỉ giờ dùng 点, không dùng lượng từ 个 (七个 là "bảy cái").',
        '点七 sai trật tự: số phải đứng trước 点.',
      ],
    ],
    ['Câu sai là 我不上班今天: thời gian phải đứng trước động từ (我今天不上班), không đặt ở cuối câu. Ba câu còn lại đều đúng.'],
  ],

  'hen-adj': [
    ['Tính từ làm vị ngữ trực tiếp, thường có 很 đứng trước: 今天 + 很 + 热. Không dùng 是.'],
    [
      '太…了 là cấu trúc "quá…": 太贵了 (đắt quá).',
      [
        '太贵的 không phải cách nói "đắt quá". 的 không đi với 太 trong cấu trúc này.',
        '吗 tạo câu hỏi, còn câu này là lời cảm thán.',
      ],
    ],
    [
      'Chủ ngữ + 很 + tính từ → 我很忙.',
      [
        'Sai vì không dùng 是 trước tính từ.',
        'Sai vì 很 phải đứng TRƯỚC tính từ, không đứng sau.',
      ],
    ],
    [
      '非常 nghĩa là "vô cùng", đứng trước tính từ: 她非常漂亮.',
      [
        '不是 phủ định 是, không đứng trước tính từ để nhấn mạnh.',
        '没有 phủ định 有. 她没有漂亮 sai ngữ pháp.',
      ],
    ],
    ['Câu sai là 我是很忙: không dùng 是 trước tính từ (我很忙). Ba câu còn lại đều đúng.'],
  ],

  'ye-dou': [
    ['也 (cũng) đứng TRƯỚC động từ: 我 + 也 + 是 + 学生.'],
    ['都 (đều) đứng trước động từ, sau chủ ngữ số nhiều: 我们 + 都 + 喜欢 + 茶.'],
    [
      '"Cũng không đi": 也 + 不 + động từ. 也 đứng trước 不.',
      [
        '很 đứng trước tính từ, không đứng trước 不去.',
        '是 nghĩa là "là", không có nghĩa "cũng".',
      ],
    ],
    [
      '都 phải đứng TRƯỚC động từ 是: 他们 + 都 + 是 + 老师.',
      [
        'Sai vì 都 phải đứng trước động từ 是, không đứng sau.',
        'Sai vì 都 không đặt ở cuối câu.',
      ],
    ],
    ['Câu sai là 他们是都老师: 都 phải đứng trước động từ (他们都是老师). Ba câu còn lại đều đúng.'],
  ],
};

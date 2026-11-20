// Giải thích đáp án cho bài luyện ngữ pháp HSK 2 (soạn 20/11/2026, CHƯA QUA DUYỆT: người biết tiếng Trung cần kiểm lại).
// Cùng quy ước với grammar-why1.ts: mảng theo ĐÚNG thứ tự bài luyện trong grammar.ts / grammar2.ts, bài "Tìm câu SAI" nằm cuối.
import type { Why } from './grammar-why1.js';

export const WHY2: Record<string, Why[]> = {
  le: [
    ['Hoàn thành: động từ + 了 + số lượng + tân ngữ → 买 + 了 + 一本 + 书. Khi có số lượng, 了 đứng ngay sau động từ.'],
    [
      'Việc đã xảy ra xong: 吃了早饭. 了 đứng sau động từ.',
      [
        '过 nói "đã từng" (kinh nghiệm). 吃过早饭 nghĩa là "đã từng ăn sáng", không phải vừa ăn xong bữa sáng nay.',
        '着 chỉ trạng thái đang tiếp diễn, không báo hoàn thành.',
      ],
    ],
    [
      'Phủ định quá khứ: 没 + động từ, không có 了 → 昨天我没去.',
      [
        'Sai vì có 没 thì bỏ 了 (没…了 mâu thuẫn).',
        'Sai vì 不去 nói về ý muốn hoặc tương lai, không phải việc hôm qua đã không xảy ra.',
      ],
    ],
    [
      '了 ở cuối câu báo thay đổi trạng thái: 天气冷了 ("trời lạnh rồi", trước đó chưa lạnh).',
      [
        '过 đi sau động từ để báo đã từng, không báo trạng thái mới.',
        '冷的 thành cụm "cái lạnh", không thành câu báo thay đổi.',
      ],
    ],
    ['Câu sai là 昨天我没去了: đã có 没 phủ định thì không dùng 了. Ba câu còn lại đều đúng.'],
  ],

  guo: [
    ['Kinh nghiệm: động từ + 过 + tân ngữ → 去 + 过 + 中国 ("đã từng đến Trung Quốc").'],
    [
      'Hỏi "đã từng … chưa" dùng 过: 你吃过饺子吗？',
      [
        '吃了饺子吗 hỏi "đã ăn sủi cảo (xong) chưa", không hỏi về kinh nghiệm từng ăn.',
        '着 chỉ đang tiếp diễn, không hỏi kinh nghiệm.',
      ],
    ],
    [
      'Chưa từng: 没(有) + động từ + 过 → 我没去过中国.',
      [
        'Sai vì phủ định của 过 là 没(有), không dùng 不.',
        'Sai vì "chưa từng" phải giữ 过, không thay bằng 了 sau 没.',
      ],
    ],
    [
      '"Đã học qua tiếng Hán" nói về kinh nghiệm → 学过汉语.',
      [
        '学了汉语 nhấn việc đã học xong (hoàn thành), không nói "đã từng trải qua".',
        '着 chỉ đang tiếp diễn.',
      ],
    ],
    ['Câu sai là 我不去过中国: 过 phải đi với 没(有) chứ không đi với 不. Ba câu còn lại đều đúng.'],
  ],

  zai: [
    ['正在 đứng trước động từ để báo đang diễn ra: 他 + 正在 + 看 + 电视.'],
    [
      'Hành động đang diễn ra: 正在 + động từ → 妈妈正在做饭.',
      [
        '过 đứng SAU động từ và báo "đã từng", không đứng trước động từ.',
        '了 đứng sau động từ để báo hoàn thành. 妈妈了做饭 sai vị trí.',
      ],
    ],
    [
      '正在 đứng trước động từ để báo đang diễn ra: 她正在打电话.',
      [
        'Sai vì 过 nghĩa là "đã từng" và phải đứng ngay sau động từ (打过电话).',
        'Sai vì 在 (đang) không đi cùng 了 (hoàn thành): hai ý mâu thuẫn.',
      ],
    ],
    [
      '在 + động từ cũng báo đang làm: 我在吃饭.',
      [
        '过 báo đã từng, đứng sau động từ.',
        '了 báo hoàn thành, đứng sau động từ.',
      ],
    ],
    ['Câu sai là 她打电话过: 过 phải đứng ngay sau động từ (打过电话) và mang nghĩa "đã từng", không báo đang diễn ra. Ba câu còn lại đều đúng.'],
  ],

  bi: [
    ['A 比 B + tính từ: 他 + 比 + 我 + 高. Đối tượng được so sánh đứng trước 比.'],
    [
      'So sánh hơn: A 比 B + tính từ → 今天比昨天冷.',
      [
        '和 là "và/cùng", không so sánh hơn kém.',
        '给 là "cho", không dùng để so sánh.',
      ],
    ],
    [
      'A 比 B + tính từ, KHÔNG có 很: 这个比那个便宜.',
      [
        'Sai vì trong câu có 比 không dùng 很 trước tính từ. Muốn nhấn mức độ thêm 多了 hoặc 一点儿.',
        'Sai trật tự: 比 phải nằm giữa A và B (这个比那个).',
      ],
    ],
    [
      'Phủ định so sánh: A 没有 B + tính từ → 我没有哥哥高.',
      [
        '很 không dùng trong cấu trúc 没有 để so sánh.',
        '比 và 没有 không dùng cùng nhau: phủ định của "A 比 B …" là "A 没有 B …".',
      ],
    ],
    ['Câu sai là 这个比那个很便宜: trong câu 比 không dùng 很 trước tính từ. Ba câu còn lại đều đúng.'],
  ],

  'de-complement': [
    ['Động từ + 得 + bổ ngữ miêu tả mức độ: 他跑得很快. 得 đứng ngay sau động từ 跑.'],
    [
      'Sau động từ 唱 dùng 得 nối với bổ ngữ: 唱得很好听.',
      [
        '的 nối định ngữ với danh từ (我的书).',
        '地 nối trạng ngữ với động từ (高兴地唱) và đứng trước động từ.',
      ],
    ],
    [
      'Có tân ngữ thì: tân ngữ + động từ + 得 + bổ ngữ → 她汉语说得很好 (hoặc 她说汉语说得很好).',
      [
        'Sai vì tân ngữ 汉语 không được chen giữa 说得 và bổ ngữ 很好.',
        'Sai vì 得 phải đứng ngay sau động từ 说, không đứng cuối.',
      ],
    ],
    [
      '写得真漂亮: bổ ngữ trạng thái đứng sau 得 để đánh giá cách viết.',
      [
        '的 nối định ngữ với danh từ, không đứng sau động từ để đánh giá.',
        '地 nối trạng ngữ với động từ, đứng trước động từ.',
      ],
    ],
    ['Câu sai là 她说得汉语很好: tân ngữ 汉语 không đứng giữa 说得 và bổ ngữ. Phải nói 她汉语说得很好. Ba câu còn lại đều đúng.'],
  ],

  yinwei: [
    ['因为 (vì) nêu nguyên nhân, 所以 (nên) nêu kết quả: 因为下雨，所以我没去.'],
    [
      '虽然 … 但是 … nghĩa là "tuy … nhưng …": 虽然很累，但是我很高兴.',
      [
        '因为 nêu nguyên nhân và đi với 所以, không đi với 但是.',
        '如果 nêu điều kiện ("nếu"), đi với 就.',
      ],
    ],
    [
      '虽然 đi cặp với 但是/可是: 虽然很贵，但是我还是买了.',
      [
        'Sai vì 因为 phải đi cặp với 所以, còn 但是 là cặp của 虽然.',
        'Sai vì 虽然 đi với 但是, không đi với 所以.',
      ],
    ],
    [
      'Quan hệ nhân quả → 所以: 因为我生病了，所以我没去上班.',
      [
        '但是 chỉ sự đối lập. Ở đây ốm là nguyên nhân nên cần 所以.',
        '如果 là "nếu", không nêu kết quả của sự việc đã xảy ra.',
      ],
    ],
    ['Câu sai là 因为很贵，但是我还是买了: 因为 phải đi với 所以, còn 但是 đi với 虽然. Ba câu còn lại đều đúng.'],
  ],

  xiwang: [
    ['希望 + mệnh đề: 我 + 希望 + 明天 + 不 + 下雨. 不 đứng ngay trước động từ 下雨.'],
    [
      '"Mong bạn …": 希望 + người khác + hành động → 我希望你快点儿好起来.',
      [
        '愿意 là "bằng lòng" làm việc của chính mình, không dùng để mong điều tốt cho người khác.',
        '喜欢 là "thích", không phải "mong".',
      ],
    ],
    [
      '希望 + mệnh đề, không thêm 了: 我希望明天天气好.',
      [
        'Sai vì 希望 nói về điều chưa xảy ra nên không dùng 了 (hoàn thành).',
        'Sai vì chủ ngữ 我 phải đứng trước 希望, và "tính từ + danh từ" (好天气) bị đặt sai thứ tự trong câu này.',
      ],
    ],
    [
      '"Anh ấy mong được làm bác sĩ" → 他希望当医生.',
      [
        '已经 báo việc đã xảy ra rồi, không diễn tả mong ước.',
        '正在 báo đang diễn ra.',
      ],
    ],
    ['Câu sai là 我希望了明天天气好: 希望 không đi với 了 vì chỉ mong ước chưa xảy ra. Ba câu còn lại đều đúng.'],
  ],

  yibian: [
    ['一边…一边… diễn tả hai hành động đồng thời: 我 + 一边 + 吃饭 + 一边 + 看 + 电视. Mỗi 一边 đứng ngay trước một động từ.'],
    [
      '一边走路一边听音乐: hai hành động của cùng một người diễn ra đồng thời.',
      [
        '一起 là "cùng nhau" (nhiều người), không nối hai hành động của một người.',
        '一样 là "giống nhau".',
      ],
    ],
    [
      'Cặp phải là 一边…一边…: 她一边唱歌一边跳舞.',
      [
        'Sai vì phải dùng đủ cặp 一边…一边…, không thay vế sau bằng 一起.',
        'Sai vì 一边 phải đứng ngay TRƯỚC mỗi động từ (一边唱歌一边跳舞), không đứng sau.',
      ],
    ],
    [
      '妈妈一边做饭一边唱歌: chọn 一边 để ghép cặp với 一边 phía sau.',
      [
        '一起 là "cùng nhau", không ghép cặp với 一边.',
        '一样 là "giống nhau", không dùng cho hai hành động đồng thời.',
      ],
    ],
    ['Câu sai là 她一边唱歌一起跳舞: vế sau phải là 一边, không phải 一起. Ba câu còn lại đều đúng.'],
  ],

  shuo: [
    ['Tường thuật trực tiếp nội dung: 说 + (chủ ngữ) + nội dung. 他 + 说 + 他 + 明天 + 来. Không cần dấu ngoặc kép hay đổi thì như tiếng Anh.'],
    [
      '告诉 + người + nội dung: 妈妈告诉我早点儿回家.',
      [
        '问 là "hỏi", dùng khi có câu hỏi, không phải "bảo cho biết".',
        '看 là "xem/nhìn", không dùng để truyền đạt lời nói.',
      ],
    ],
    [
      '问 + người + câu hỏi (去不去): 老师问我去不去.',
      [
        '告诉 truyền đạt thông tin, không dùng khi hỏi một câu hỏi.',
        '说 không đi trực tiếp với tân ngữ chỉ người theo kiểu này (nói cho ai phải là 对我说 hoặc 告诉我).',
      ],
    ],
    [
      '说 + mệnh đề: 他说他明天来.',
      [
        'Sai vì 明天 (ngày mai) là tương lai nên không dùng 了 (hoàn thành).',
        'Sai trật tự: chủ ngữ phải đứng trước 来 (他明天来). 来他 sai.',
      ],
    ],
    ['Câu sai là 他说他明天来了: 明天 là tương lai nên không dùng 了. Ba câu còn lại đều đúng.'],
  ],

  'ba-particle': [
    ['吧 đặt cuối câu để đề nghị: 我们 + 走 + 吧 ("chúng ta đi thôi").'],
    [
      'Phỏng đoán "chắc là … nhỉ" dùng 吧: 你是老师吧？',
      [
        '吗 hỏi thẳng có/không, không mang ý đã đoán sẵn.',
        '呢 dùng để hỏi lại, không phải phỏng đoán.',
      ],
    ],
    [
      '吧 ở cuối câu để đề nghị: 你喝茶吧 ("bạn uống trà nhé").',
      [
        'Sai vì 吧 và 吗 không dùng chung; chỉ chọn một trợ từ cuối câu.',
        'Sai vì 吧 luôn đứng cuối câu, không đứng giữa.',
      ],
    ],
    [
      'Đề nghị "chúng ta … thôi" → 吧: 我们吃饭吧.',
      [
        '了 báo hoàn thành hoặc thay đổi, không đề nghị.',
        '呢 dùng để hỏi lại hoặc nhấn trạng thái.',
      ],
    ],
    ['Câu sai là 你喝茶吧吗: 吧 và 吗 không dùng cùng một câu. Ba câu còn lại đều đúng.'],
  ],

  'cong-dao': [
    ['从 + A + 到 + B: 从 + 我家 + 到 + 学校 + 很近. Cụm "从…到…" làm chủ đề, vị ngữ 很近 đứng sau.'],
    [
      '从 chỉ điểm bắt đầu: 从八点到五点 ("từ 8 giờ đến 5 giờ").',
      [
        '在 chỉ nơi chốn hoặc "đang", không chỉ điểm bắt đầu của khoảng thời gian.',
        '给 là "cho", không chỉ điểm bắt đầu.',
      ],
    ],
    [
      '从 A 到 B: 他从星期一到星期五上班.',
      [
        'Sai trật tự: phải 从 (từ) đứng trước điểm bắt đầu, 到 (đến) đứng trước điểm kết thúc: 从星期一到星期五.',
        'Sai vì thiếu 到 đặt ngay trước điểm kết thúc (星期五); 到 không thể đặt sau cả hai mốc.',
      ],
    ],
    [
      'Điểm kết thúc đi sau 到: 从家到公司.',
      [
        '从 chỉ điểm bắt đầu, đã dùng ở đầu cụm.',
        '在 chỉ vị trí, không chỉ điểm đến trong cấu trúc 从…到….',
      ],
    ],
    ['Câu sai là 他到星期一从星期五上班: 从 (từ) phải đi trước 到 (đến), mốc đầu trước mốc cuối. Ba câu còn lại đều đúng.'],
  ],

  li: [
    ['A 离 B + tính từ: 我家 + 离 + 学校 + 很近. 离 đứng giữa hai địa điểm để nói khoảng cách.'],
    [
      '离 nói khoảng cách giữa hai điểm: 银行离这儿不远.',
      [
        '从 chỉ điểm xuất phát (从…到…), không nói khoảng cách giữa hai điểm.',
        '到 là "đến", không nói khoảng cách.',
      ],
    ],
    [
      '离 dùng cả cho khoảng cách thời gian: 离考试还有三天 ("còn ba ngày nữa thì thi").',
      [
        'Sai vì 从 chỉ điểm bắt đầu, không dùng để tính khoảng cách tới một mốc.',
        'Sai trật tự: 还有三天 phải đứng sau 离考试.',
      ],
    ],
    [
      '"Công ty cách nhà khá xa": 公司离我家很远.',
      [
        '在 chỉ vị trí ("ở"), không nói khoảng cách.',
        '给 là "cho", không nói khoảng cách.',
      ],
    ],
    ['Câu sai là 从考试还有三天: 从 không dùng để tính khoảng cách tới mốc, phải dùng 离 (离考试还有三天). Ba câu còn lại đều đúng.'],
  ],

  'gen-yiqi': [
    ['跟/和 + người + 一起 + động từ: 我 + 跟朋友 + 一起 + 吃饭. Cụm "跟朋友" đứng trước 一起 và động từ.'],
    [
      '和 nghĩa là "cùng với": 他和妈妈一起去商店.',
      [
        '给 là "cho", không có nghĩa "cùng với".',
        '离 chỉ khoảng cách, không chỉ đối tượng đi cùng.',
      ],
    ],
    [
      'Cụm "跟我一起" đứng trước động từ: 你想跟我一起去吗？',
      [
        'Sai vì "跟我一起" phải đứng trước động từ 去, không đứng sau.',
        'Sai vì 跟 phải đi ngay trước người (跟我), không chen 想 vào giữa 跟 và 我.',
      ],
    ],
    [
      '跟朋友一起学汉语: 一起 đi trước động từ để nói làm cùng nhau.',
      [
        '一下 là "một chút", không nói làm cùng nhau.',
        '一样 là "giống nhau".',
      ],
    ],
    ['Câu sai là 你想去跟我一起吗: "跟我一起" phải đứng trước động từ 去 (你想跟我一起去吗). Ba câu còn lại đều đúng.'],
  ],

  yijing: [
    ['已经 + động từ + 了 → 已经吃饭了: "đã … rồi". 已经 đứng trước động từ, 了 ở cuối câu.'],
    [
      'Việc đã xảy ra rồi → 已经: 他已经走了.',
      [
        '还没 nghĩa là "vẫn chưa", trái nghĩa với câu "đã đi rồi".',
        '正在 là "đang", không diễn tả việc đã xong.',
      ],
    ],
    [
      'Vẫn chưa: 还没(有) + động từ, không có 了 → 我还没吃饭.',
      [
        'Sai vì 还没 đã phủ định hành động thì không dùng 了.',
        'Sai vì 还不…了 nghĩa là "không … nữa", không phải "vẫn chưa".',
      ],
    ],
    [
      'Vẫn chưa đến → 还没: 他还没来.',
      [
        '已经 là "đã", trái nghĩa với "vẫn chưa".',
        '不是 phủ định 是, không dùng để nói "chưa làm".',
      ],
    ],
    ['Câu sai là 我还没吃饭了: 还没 không đi với 了. Ba câu còn lại đều đúng.'],
  ],

  gei: [
    ['给 + người + động từ: 我 + 给你 + 打电话 ("tôi gọi điện cho bạn"). Cụm 给你 đứng trước động từ.'],
    [
      '给 là "cho, đưa cho": 妈妈给我一本书.',
      [
        '跟 là "cùng với", không có nghĩa "đưa cho".',
        '离 chỉ khoảng cách, không chỉ việc đưa.',
      ],
    ],
    [
      'Làm giúp ai: 给 + người + động từ → 他给朋友做饭.',
      [
        'Sai trật tự và thừa 在: "给朋友" phải đứng trước động từ 做饭.',
        'Sai vì 给 phải đi ngay trước người (给朋友), không chen động từ 做饭 vào giữa.',
      ],
    ],
    [
      '"Gọi điện cho tôi": 给我打电话.',
      [
        '从 chỉ điểm xuất phát.',
        '到 là "đến", không chỉ đối tượng được gọi.',
      ],
    ],
    ['Câu sai là 他做饭给朋友在: 给 + người phải đứng trước động từ, và 在 bị thừa. Ba câu còn lại đều đúng.'],
  ],

  yinggai: [
    ['应该 (nên) đứng trước động từ: 你 + 应该 + 多 + 喝水. 多 đứng trước động từ để nói "nhiều".'],
    [
      '得 (đọc děi) nghĩa là "phải": 我得走了.',
      [
        '地 (đọc de) nối trạng ngữ với động từ, không có nghĩa "phải".',
        '的 chỉ sở hữu.',
      ],
    ],
    [
      '不用 nghĩa là "không cần": 你不用来.',
      [
        '不得 không phải cách nói "không cần" thông thường.',
        '不会 nghĩa là "sẽ không" hoặc "không biết", khác với "không cần".',
      ],
    ],
    [
      '别 nghĩa là "đừng", dùng để ngăn cấm: 别在这儿说话.',
      [
        '不 là phủ định thông thường, không dùng để ngăn cấm. 不在这儿说话 chỉ là "(tôi) không nói chuyện ở đây".',
        'Sai trật tự: nơi chốn 在这儿 phải đứng trước động từ 说话.',
      ],
    ],
    ['Câu sai là 不在这儿说话: muốn nói "đừng …" phải dùng 别 (别在这儿说话); 不 chỉ phủ định thông thường. Ba câu còn lại đều đúng.'],
  ],

  yixia: [
    ['一下 đứng sau động từ để nói "một chút": 请 + 等 + 一下. Dùng để làm câu nhẹ nhàng, lịch sự.'],
    [
      '一下 làm động từ nhẹ đi: 你看一下这个 ("bạn xem một chút cái này").',
      [
        '一次 là "một lần" (đếm số lần), không có nghĩa "một chút".',
        '一点 là "một ít" (số lượng), dùng với danh từ hoặc tính từ, không đi sau động từ để làm nhẹ.',
      ],
    ],
    [
      'Số lần đứng sau động từ: 去过两次北京 hoặc 去过北京两次. Thêm 吗 làm câu thành câu hỏi, không khẳng định.',
      [
        'Sai vì câu cần khẳng định "tôi đã đến Bắc Kinh hai lần" mà thêm 吗 thành câu hỏi.',
        'Không tự nhiên: số lần phải đứng sau động từ (去过两次北京), không đặt trước 去过.',
      ],
    ],
    [
      '次 là lượng từ cho số lần: 看了三次.',
      [
        '下 là "một chút", không đếm số lần cụ thể ba.',
        '个 là lượng từ chung cho vật, không đếm số lần xem.',
      ],
    ],
    ['Câu sai là 我去过北京两次吗: thêm 吗 biến câu khẳng định thành câu hỏi, không còn đúng với nghĩa "Tôi đã đến Bắc Kinh hai lần". Ba câu còn lại đều đúng.'],
  ],
};

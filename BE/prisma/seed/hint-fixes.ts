// Sửa văn phong gợi ý đã seed (rà ngày 20/10/2026). Nguyên tắc: mỗi gợi ý phải ĐỨNG MỘT MÌNH được, vì thứ tự 12 ô
// được xáo riêng cho từng người nên không được nhắc "vẫn là…", "cũng là…", "lúc nãy…" (gợi ý của ô khác); gợi ý chung
// không nói điều hiển nhiên ("hành động, không phải đồ vật") và không lộ đáp án.
// Áp dụng theo từ khóa (chữ Hán). Chạy lại được; seed.ts và seed-chapters.ts gọi cuối cùng, hoặc `pnpm db:fix-hints`.
import type { PrismaClient } from '../../src/generated/prisma/client.js';

type T = { zh: string; vi: string };
interface Fix {
  general?: T;
  /** Gợi ý 2, áp dụng cho mọi nhóm cấp. */
  hint2?: T;
}

const t = (zh: string, vi: string): T => ({ zh, vi });

export const HINT_FIXES: Record<string, Fix> = {
  请客: {
    general: t('这是一个动作，发生在人和人之间。', 'Đây là một hành động giữa người với người.'),
    hint2: t('两个同事在公司聊喝的东西；对话的最后，其中一个人提出要做一件事。', 'Hai đồng nghiệp ở công ty nói về đồ uống; cuối cuộc trò chuyện, một người đề nghị làm một việc.'),
  },
  迟到: { general: t('这是一个和时间有关的动作。', 'Đây là một hành động liên quan đến giờ giấc.') },
  对不起: { hint2: t('在一家公司，两个人在上班时碰面；先开口的人觉得有点儿过意不去。', 'Ở một công ty, hai người gặp nhau lúc đi làm; người mở lời trước cảm thấy áy náy.') },
  没关系: {
    general: t('这是一句让别人放心的话。', 'Đây là một câu nói giúp người khác yên tâm.'),
    hint2: t('在一家公司，一个人听了另一个人的话，就回答了一句，让对方放心。', 'Ở một công ty, một người nghe người kia nói rồi đáp lại một câu để người kia yên tâm.'),
  },
  不客气: {
    general: t('这是一句有礼貌地回答别人的话。', 'Đây là một câu nói lịch sự để đáp lại người khác.'),
    hint2: t('有人刚刚得到帮助，帮忙的人在对话的最后回答了一句。', 'Có người vừa được giúp đỡ; người giúp đáp lại một câu ở cuối cuộc trò chuyện.'),
  },
  护照: { hint2: t('在一家旅馆的前台，办手续的最后，工作人员向客人要一样东西。', 'Ở quầy lễ tân một khách sạn, cuối thủ tục nhận phòng, nhân viên đề nghị khách đưa một thứ.') },
  银行: { general: t('这是一个地方，和钱有关。', 'Đây là một nơi chốn, liên quan đến tiền.') },
  房间: { general: t('这是楼里的一个地方，人们在那里休息。', 'Đây là một chỗ trong tòa nhà, người ta nghỉ ngơi ở đó.') },
  便宜: { hint2: t('在一家商店里，客人觉得价钱不太合适，想少付一点儿。', 'Ở một cửa hàng, khách thấy giá chưa vừa ý, muốn trả ít hơn.') },
  下雪: { general: t('这是一种天气现象，常常出现在冷的季节。', 'Đây là một hiện tượng thời tiết, thường xuất hiện vào mùa lạnh.') },
  作业: { general: t('这是学生要按时完成的一件事。', 'Đây là một việc học sinh phải hoàn thành đúng hạn.') },
  哥哥: { general: t('这是一位亲人，和你是同一辈的。', 'Đây là một người thân, cùng thế hệ với bạn.') },
  足球: { general: t('这是一项很多人喜欢的运动。', 'Đây là một môn thể thao được nhiều người yêu thích.') },
};

export async function applyHintFixes(prisma: PrismaClient) {
  let n = 0;
  for (const [zh, fix] of Object.entries(HINT_FIXES)) {
    const slots = await prisma.keySlot.findMany({ where: { word: { zh } }, select: { id: true, hint2: true } });
    for (const s of slots) {
      const data: { hintGeneral?: T; hint2?: Record<string, T> } = {};
      if (fix.general) data.hintGeneral = fix.general;
      if (fix.hint2) {
        const by = s.hint2 as unknown as Record<string, T>;
        data.hint2 = Object.fromEntries(Object.keys(by).map((g) => [g, fix.hint2!]));
      }
      await prisma.keySlot.update({ where: { id: s.id }, data });
      n++;
    }
  }
  return n;
}

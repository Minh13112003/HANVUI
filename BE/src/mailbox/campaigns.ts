// Thư theo dịp gửi tự động cho tài khoản MỚI (người gửi: quản trị). Mỗi dịp có khoảng ngày (giờ Việt Nam, gồm cả hai đầu);
// tài khoản tạo trong khoảng đó nhận thư một lần. Thêm/bớt dịp ở đây, không cần đổi DB.
import type { MailReward } from './mail.service.js';

export interface WelcomeCampaign {
  from: string; // YYYY-MM-DD
  until: string; // YYYY-MM-DD
  subject: string;
  body: (name: string) => string;
  reward?: MailReward;
}

export const WELCOME_CAMPAIGNS: WelcomeCampaign[] = [
  {
    from: '2026-10-18',
    until: '2026-10-31',
    subject: 'Thư chúc mừng 20/10 + Cảm ơn bạn đã trải nghiệm HanVui',
    body: (name) =>
      [
        `Chào ${name},`,
        'Cảm ơn bạn đã tạo tài khoản và dùng thử HanVui, ứng dụng học tiếng Trung "vừa học vừa chơi". HanVui đang trong giai đoạn thử nghiệm, và việc bạn dành thời gian trải nghiệm từng tính năng đã giúp đội ngũ rất nhiều để làm app tốt hơn mỗi ngày.',
        `Nhân ngày 20/10, HanVui chúc ${name} một ngày thật vui, nhận được thật nhiều lời yêu thương và những bất ngờ dễ thương. Chúc bạn sớm có người yêu nhé, còn nếu đã có rồi thì chúc hai bạn ngày càng hạnh phúc!`,
        'Kèm theo thư là một món quà nhỏ để bạn khám phá sự kiện truyện. Học vui mỗi ngày nhé, 加油！',
        'Đội ngũ HanVui',
      ].join('\n\n'),
    reward: { tokens: 20 },
  },
];

/** Ngày theo giờ Việt Nam (UTC+7) dạng YYYY-MM-DD. */
export const vnDate = (d: Date) => new Date(d.getTime() + 7 * 3600_000).toISOString().slice(0, 10);

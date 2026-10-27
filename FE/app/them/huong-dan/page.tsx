'use client';
// Hướng dẫn: cách dùng HanVui trong 5 bước, bật/tắt chỉ dẫn trên màn hình, câu hỏi thường gặp (rule.md mục 6).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { useUi } from '@/lib/ui';

const STEPS = [
  {
    t: 'Chọn chuẩn và cấp HSK',
    d: 'Vào Tài khoản → chọn HSK 2.0 (6 cấp) hoặc HSK 3.0 (9 cấp) và cấp hiện tại. Mỗi bài đều ghi nhãn cả hai chuẩn, ví dụ "2.0 cấp 1 | 3.0 cấp 2" nghĩa là cấp 1 của HSK 2.0 và cấp 2 của HSK 3.0.',
  },
  {
    t: 'Từ vựng: xem cách viết và cách đọc',
    d: 'Học → Từ vựng → chạm một từ: nghe thường hoặc chậm, xem từng nét (chấm đỏ là chỗ đặt bút, mũi tên chỉ hướng), rồi tập viết bằng ngón tay.',
  },
  {
    t: 'Hội thoại: nghe trước, trả lời, rồi mới xem lời thoại',
    d: 'Lời thoại luôn khóa tới khi bạn trả lời xong. Bật "Chế độ lưu từ" để chạm chọn từ; chạm thêm từ khác trong cùng câu thì lưu cả cụm.',
  },
  {
    t: 'Nhiệm vụ hằng ngày',
    d: 'Đăng nhập +1 lượt, nghe và trả lời hết câu hỏi của 2 bài khác nhau +2, online 30 phút +1. Lượt dùng để mở gợi ý trong sự kiện.',
  },
  {
    t: 'Sự kiện: bảng 12 ô và nút "Nhập từ khóa"',
    d: 'Mở gợi ý 1 của một ô rồi đi học bài; nghĩ ra từ khóa thì bấm "Nhập từ khóa" ở cuối bài hội thoại. Đúng 3 ô thì mở 1 hồi truyện.',
  },
];

const FAQ = [
  ['Vì sao tìm kiếm không tìm được câu thoại?', 'Để không ai dò được từ khóa sự kiện bằng ô tìm kiếm. Tìm kiếm chỉ nhìn tên bài, chủ đề và bối cảnh.'],
  ['Vì sao app không cho biết bài này có từ khóa?', 'Nếu báo thì sự kiện mất hết phần suy luận. App không bao giờ gợi ý bài vừa học có từ khóa hay không.'],
  ['Mua lượt gợi ý được không?', 'Không bán lượt. Lượt chỉ đến từ nhiệm vụ, thưởng, gói theo kịp và đền bù.'],
  ['VIP có lợi thế trong sự kiện không?', 'Không. VIP chỉ mở khóa tính năng học, không tác động gì tới sự kiện.'],
  ['Chưa nghe được âm thanh?', 'Kiểm tra âm lượng và kết nối mạng. Bài nào chưa có file âm thanh thì app đọc bằng giọng của trình duyệt.'],
];

export default function GuidePage() {
  const { toast } = useUi();
  const [tips, setTips] = useState(true);

  useEffect(() => {
    setTips(localStorage.getItem('hv.tips') !== 'off');
  }, []);

  const toggle = () => {
    const next = !tips;
    setTips(next);
    localStorage.setItem('hv.tips', next ? 'on' : 'off');
    toast(next ? 'Đã bật chỉ dẫn trên màn hình' : 'Đã tắt chỉ dẫn trên màn hình');
  };

  return (
    <Shell title="Hướng dẫn">
      <div className="stack guidetext">
        <h1>Cách dùng HanVui trong 5 bước</h1>
        <Link className="card row" href="/lo-trinh" style={{ gap: 12, borderLeft: '4px solid var(--accent)' }}>
          <span className="grow">
            <b>Mới bắt đầu tiếng Trung?</b>
            <small className="muted" style={{ display: 'block' }}>
              Mở Lộ trình cho người mới: học pinyin, thanh điệu, nét chữ rồi đi từng bước tới HSK 2.
            </small>
          </span>
          <span className="chev">›</span>
        </Link>

        <div className="rail">
          {STEPS.map((s, i) => (
            <div className="rn on" key={s.t}>
              <span className="dot2">{i + 1}</span>
              <div className="rbody">
                <b>{s.t}</b>
                <p className="muted">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card stack">
          <button className={'savebtn' + (tips ? ' on' : '')} onClick={toggle}>
            <span className="dotsw" />
            <span className="grow">
              <b>Chỉ dẫn trên màn hình</b>
              <small>{tips ? 'Đang bật: lần đầu mở mỗi màn sẽ có lời giải thích ngắn.' : 'Đang tắt.'}</small>
            </span>
          </button>
          <button
            className="btn sm"
            onClick={() => {
              Object.keys(localStorage)
                .filter((k) => k.startsWith('hv.seen.'))
                .forEach((k) => localStorage.removeItem(k));
              localStorage.setItem('hv.tips', 'on');
              setTips(true);
              toast('Sẽ hiện lại hướng dẫn từ đầu');
            }}
          >
            Xem lại hướng dẫn từ đầu
          </button>
        </div>

        <div className="card stack">
          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map(([q, a]) => (
            <details className="card" key={q}>
              <summary>{q}</summary>
              <p className="muted" style={{ marginTop: 8 }}>
                {a}
              </p>
            </details>
          ))}
        </div>

        <div className="card stack">
          <h2>Luồng học đề xuất mỗi ngày</h2>
          <div className="flow">
            <span>Đăng nhập</span>
            <b>→</b>
            <span>làm nhiệm vụ</span>
            <b>→</b>
            <span>học một bài hội thoại</span>
            <b>→</b>
            <span>thêm từ</span>
            <b>→</b>
            <span>kiểm tra</span>
            <b>→</b>
            <span>xem bảng ô từ khóa</span>
          </div>
        </div>

        <Link className="btn" href="/them" style={{ textAlign: 'center' }}>
          Về Tài khoản
        </Link>
      </div>
    </Shell>
  );
}

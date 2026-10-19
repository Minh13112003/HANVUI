'use client';
// Luật chơi cho người chơi — theo tom-tat-luat-choi.md (phần "Ghi chú cho người làm" KHÔNG hiện ở đây).
import Link from 'next/link';
import Shell from '@/components/Shell';

export default function RulesPage() {
  return (
    <Shell title="Luật chơi">
      <div className="stack">
        <h1>Ga cũ trong đêm mưa: luật chơi</h1>

        <section className="card stack">
          <h2>Cách chơi</h2>
          <ol className="rules">
            <li>
              Mỗi tuần có <b>1 chương</b>: 12 ô từ khóa, 4 hồi truyện. Ô mở dần: ngày 1 có 6 ô, ngày 2 thêm 3 ô, ngày 3
              thêm 3 ô.
            </li>
            <li>
              <b>Chạm một ô</b> để xem gợi ý. Mỗi gợi ý tốn <b>1 lượt</b>. Phải mở <b>gợi ý 1</b> thì mới đoán được ô
              đó.
            </li>
            <li>
              <b>Học một bài hội thoại</b>, rồi bấm nút <b>Nhập từ khóa</b> ở cuối bài.
            </li>
            <li>
              <b>Đúng đủ 3 ô</b> thì mở <b>1 hồi truyện</b>.
            </li>
            <li>
              <b>Sai 3 lần</b>: bị trừ điểm; từ lần sai thứ 10 thì mỗi 3 lần sai phải chờ 15 phút.
            </li>
            <li>Mỗi người có thứ tự từ khóa khác nhau. Từ khóa chỉ hiện khi bạn tự đoán đúng.</li>
          </ol>
        </section>

        <section className="card stack">
          <h2>Màu của ô</h2>
          <div className="legend">
            <span>
              <i className="lg" /> chưa mở gợi ý
            </span>
            <span>
              <i className="lg c1" /> đã mở gợi ý 1
            </span>
            <span>
              <i className="lg c2" /> đã mở gợi ý 2
            </span>
            <span>
              <i className="lg c3" /> đã mở gợi ý 3
            </span>
            <span>
              <i className="lg ok" /> đã trả lời đúng
            </span>
            <span>
              <i className="lg lk" /> chưa tới ngày mở
            </span>
          </div>
        </section>

        <section className="card stack">
          <h2>Lượt gợi ý</h2>
          <ul className="rules">
            <li>
              <b>Mỗi ngày</b>: đăng nhập +1, nghe và trả lời hết câu hỏi của 2 bài khác nhau +2, online 30 phút +1 (tổng
              4 lượt).
            </li>
            <li>
              <b>Mỗi tuần</b>: 3 nhiệm vụ tuần (đăng nhập, online, nghe bài), mỗi nhiệm vụ 3 mốc +2, +3, +2.
            </li>
            <li>
              <b>Nghỉ vài ngày vẫn được bù</b>: mỗi ngày vắng +2 lượt, tối đa 12 lượt mỗi lần vắng. Lượt cộng khi bạn
              quay lại.
            </li>
            <li>
              <b>Ngày 26, 27, 28</b>: đăng nhập mỗi ngày +3. <b>Ngày 29-31</b> (nếu có): thêm +3 mỗi ngày nếu bạn chưa
              giải hết.
            </li>
            <li>
              <b>Vào muộn</b> (ngày đăng nhập đầu tiên trong tháng là ngày 8-28): nhận gói theo kịp một lần — ngày 8-14
              được 12 lượt, ngày 15-21 được 24 lượt, ngày 22-28 được 12 lượt.
            </li>
            <li>
              Hết sự kiện, lượt hết hạn. <b>Không bán lượt.</b>
            </li>
          </ul>
        </section>

        <section className="card stack">
          <h2>Điểm và huy chương</h2>
          <ul className="rules">
            <li>
              <b>Điểm mỗi ô</b>: đoán đúng khi mới mở gợi ý 1: 230 · mở 2 gợi ý: 200 · mở 3 gợi ý: 150. Tìm trong tuần
              của chương: +30.
            </li>
            <li>
              <b>Đoán sai</b> mỗi 3 lần: trừ 20, rồi 30, rồi 40 điểm (được đoán tiếp ngay). Sai quá 9 lần: khóa 15 phút
              mỗi 3 lần.
            </li>
            <li>
              <b>4 huy chương</b> ở 10%, 30%, 60%, 90% số từ khóa: Đồng, Bạc, Vàng, Ngọc.
            </li>
            <li>
              Mốc Ngọc tặng <b>thẻ VIP 3 ngày</b> vào túi đồ. Bấm mở thì bắt đầu đếm 3 ngày; không mở sau khoảng 90 ngày
              thì thẻ hết hạn.
            </li>
            <li>Bảng xếp hạng: điểm cao hơn xếp trên, bằng điểm thì huy chương cao hơn, vẫn bằng thì ai xong sớm hơn.</li>
          </ul>
        </section>

        <section className="card stack">
          <h2>Công bằng</h2>
          <p>
            <b>VIP không giúp gì trong sự kiện.</b> Ai cũng chơi như nhau. Sự kiện để vui và khích lệ người chăm chỉ,
            không thu lợi.
          </p>
        </section>

        <Link className="btn" href="/su-kien" style={{ textAlign: 'center' }}>
          Về Sự kiện
        </Link>
      </div>
    </Shell>
  );
}

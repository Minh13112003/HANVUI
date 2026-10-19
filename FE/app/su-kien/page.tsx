'use client';
// Sự kiện truyện: bảng 12 ô mỗi chương, gợi ý, hồi truyện, huy chương (rule.md mục 5).
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { CountUp, Medal } from '@/components/Bits';
import CellSheet from '@/components/CellSheet';
import Shell from '@/components/Shell';
import Tips from '@/components/Tips';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';
import type { EventState } from '@/lib/types';

export default function EventPage() {
  const { user } = useAuth();
  const { openSheet, toast } = useUi();
  const [ev, setEv] = useState<EventState | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);

  const load = useCallback(async () => {
    const s = await api<EventState>('/event');
    setEv(s);
    setChapter((c) => c ?? s.chapters?.find((x) => x.current)?.idx ?? s.chapters?.[0]?.idx ?? 1);
  }, []);

  useEffect(() => {
    if (!user) return;
    load().catch(() => {});
  }, [user, load]);

  const join = async () => {
    await api('/event/opt-out', { method: 'POST', body: { out: false } });
    toast('Đã tham gia lại sự kiện');
    load();
  };

  if (!ev) return <Shell title="Sự kiện"><p className="muted">Đang tải…</p></Shell>;

  if (!ev.active) {
    return (
      <Shell title="Sự kiện">
        <div className="card empty center">
          <h1>Chưa có sự kiện tháng {ev.month}</h1>
          <p className="muted">Mỗi tháng dương lịch là một sự kiện mới. Hãy quay lại vào ngày 1.</p>
        </div>
      </Shell>
    );
  }

  const ch = ev.chapters?.find((c) => c.idx === chapter);
  const th = ev.medal?.thresholds ?? [5, 15, 29, 44];

  return (
    <Shell title="Sự kiện">
      <div className="stack">
        <section className="surf" data-g="violet">
          <span className="wm" aria-hidden="true">
            谜
          </span>
          <div className="row between">
            <span className="eyebrow">Tháng {ev.story?.month} · ngày {ev.day}/{ev.daysInMonth}</span>
            <span className="hpill">{ev.tokens} lượt</span>
          </div>
          <div className="evt">
            {ev.story?.title} <small className="hsub">{ev.story?.titleZh}</small>
          </div>
          <div className="row between">
            <div>
              <div className="hnum">
                <CountUp value={ev.points ?? 0} />
              </div>
              <span className="hsub">điểm sự kiện</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="hnum2">
                {ev.solved}
                <span>/{ev.totalKeys}</span>
              </div>
              <span className="hsub">từ khóa đã giải</span>
            </div>
          </div>
          <div className="hbar">
            <i style={{ width: ((ev.solved ?? 0) / (ev.totalKeys ?? 48)) * 100 + '%' }} />
          </div>
          <div className="medals">
            {[1, 2, 3, 4].map((lv) => (
              <Medal key={lv} level={lv} got={(ev.medal?.level ?? 0) >= lv} need={th[lv - 1]} />
            ))}
          </div>
          {ev.reserveDay ? <div className="alert on-dark">Ngày dự trữ: vẫn nhận lượt nếu bạn chưa giải hết.</div> : null}
          {(ev.pendingPenalty ?? 0) > 0 ? (
            <div className="alert on-dark">Đang chờ trừ {ev.pendingPenalty} điểm vào ô trả lời đúng kế tiếp.</div>
          ) : null}
        </section>

        {ev.optedOut ? (
          <div className="card stack">
            <b>Bạn đang tắt sự kiện</b>
            <p className="muted">Nhiệm vụ ngày và tuần không cộng lượt. Bật lại thì tính từ lúc bật.</p>
            <button className="btn primary" onClick={join}>
              Tham gia lại
            </button>
          </div>
        ) : null}

        <div className="seg" role="tablist" aria-label="Chương">
          {ev.chapters?.map((c) => (
            <button key={c.idx} className={c.idx === chapter ? 'on' : ''} role="tab" aria-selected={c.idx === chapter} onClick={() => setChapter(c.idx)}>
              Chương {c.idx}
              {c.current ? <span className="dot" /> : null}
            </button>
          ))}
        </div>

        {ch ? (
          <>
            <section className="card stack">
              <div className="row between">
                <h2>12 ô từ khóa</h2>
                <span className="pill">{ch.solved}/12 đã giải</span>
              </div>

              <div className="sched">
                {[1, 2, 3].map((d) => {
                  const day = (ch.idx - 1) * 7 + d;
                  const n = d === 1 ? 6 : 3;
                  return (
                    <div key={d} className={'sd' + (ev.day! >= day ? ' on' : '') + (ev.day === day ? ' now' : '')}>
                      <b>Ngày {day}</b>
                      <span>+{n} ô</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid12">
                {ch.cells.map((c) => {
                  const cls =
                    c.status === 'solved'
                      ? ' ok'
                      : c.status === 'locked'
                        ? ' lock'
                        : c.hintsOpened === 1
                          ? ' c1'
                          : c.hintsOpened === 2
                            ? ' c2'
                            : c.hintsOpened === 3
                              ? ' c3'
                              : '';
                  return (
                    <button
                      key={c.slotId}
                      className={'cell' + cls}
                      onClick={() => openSheet(<CellSheet cell={c} tokens={ev.tokens ?? 0} onChange={load} />)}
                    >
                      <span className="cn">Ô {c.pos + 1}</span>
                      {c.status === 'locked' ? (
                        <>
                          <svg className="lockic" viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="5" y="11" width="14" height="9" rx="2" />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                          </svg>
                          <span className="ct">ngày {c.unlockDay}</span>
                        </>
                      ) : c.status === 'solved' ? (
                        <>
                          <span className="ck han">{c.word?.zh}</span>
                          <span className="ct">✓ {c.points} điểm</span>
                        </>
                      ) : (
                        <>
                          <span className="cs">{c.hintsOpened ? '•'.repeat(c.hintsOpened) : '?'}</span>
                          <span className="ct">{c.hintsOpened ?? 0}/3 gợi ý</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="legend">
                <span>
                  <i className="lg" /> chưa mở gợi ý
                </span>
                <span>
                  <i className="lg c1" /> gợi ý 1
                </span>
                <span>
                  <i className="lg c2" /> gợi ý 2
                </span>
                <span>
                  <i className="lg c3" /> gợi ý 3
                </span>
                <span>
                  <i className="lg ok" /> đã giải
                </span>
                <span>
                  <i className="lg lk" /> chưa tới ngày
                </span>
              </div>
            </section>

            <section className="card stack">
              <h2>Truyện — chương {ch.idx}</h2>
              <div className="rail">
                {ch.hoi.map((h) => (
                  <div className={'rn' + (h.opened ? ' on' : '')} key={h.idx}>
                    <span className="dot2">{h.idx}</span>
                    <div className={'rbody' + (h.opened ? '' : ' dim')}>
                      {h.opened && h.lessonId ? (
                        <Link href={'/hoc/nghe/' + h.lessonId} className="row between">
                          <span>
                            <b>{h.title}</b>
                            <small className="muted" style={{ display: 'block' }}>
                              {h.titleZh} · đọc như một bài học
                            </small>
                          </span>
                          <span className="chev">›</span>
                        </Link>
                      ) : (
                        <>
                          <b>Hồi {h.idx}</b>
                          <small className="muted" style={{ display: 'block' }}>
                            Giải đủ {h.idx * 3} ô của chương để mở
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        <section className="card stack">
          <h2>Cách lấy thêm lượt</h2>
          <div className="mrow">
            <span className="grow">Nhiệm vụ ngày (đăng nhập, 2 bài nghe, online 30 phút)</span>
            <span className="pill">+4</span>
          </div>
          <div className="mrow">
            <span className="grow">Nhiệm vụ tuần (3 nhiệm vụ × 3 mốc)</span>
            <span className="pill">tối đa +21</span>
          </div>
          <div className="mrow">
            <span className="grow">Nghỉ vài ngày được bù khi quay lại</span>
            <span className="pill">+2/ngày</span>
          </div>
          <p className="muted" style={{ fontSize: 12 }}>
            Không bán lượt. Lượt tặng hết hạn khi sự kiện kết thúc.
          </p>
          <Link className="btn sm" href="/hoc/nghe">
            Học một bài để lấy lượt
          </Link>
        </section>

        <div className="menu">
          <Link className="mrow2" href="/su-kien/xep-hang">
            <span className="grow">Bảng xếp hạng</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/su-kien/luat">
            <span className="grow">Luật chơi sự kiện</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/them/tui-do">
            <span className="grow">Túi đồ</span>
            <span className="chev">›</span>
          </Link>
        </div>
        <Tips
          screen="event"
          tips={[
            { sel: '.medals', title: 'Bốn huy chương', text: 'Đồng, Bạc, Vàng, Ngọc theo số từ khóa đã giải. Mốc Ngọc tặng thẻ VIP 3 ngày.' },
            { sel: '.grid12', title: 'Bảng 12 ô', text: 'Chạm một ô để xem và mở gợi ý. Mỗi gợi ý tốn 1 lượt; phải mở gợi ý 1 mới đoán được ô đó.' },
            { title: 'Đoán ở đâu?', text: 'Học một bài hội thoại rồi bấm nút "Nhập từ khóa" nổi ở góc dưới của bài.' },
          ]}
        />
      </div>
    </Shell>
  );
}

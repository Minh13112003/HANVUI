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
  const daysLeft = ev.daysInMonth && ev.day ? Math.max(ev.daysInMonth - ev.day, 0) : null;

  return (
    <Shell title="Sự kiện">
      <div className="stack ev">
        <section className="surf evhero">
          <span className="wm" aria-hidden="true">
            谜
          </span>
          <div className="row between">
            <span className="tagc">Truyện trinh thám</span>
            {!ev.extended && daysLeft !== null ? <span className="tagc dim">Còn {daysLeft} ngày</span> : null}
          </div>
          <div className="evt">
            {ev.story?.title} <small className="hsub">{ev.story?.titleZh}</small>
          </div>
          <div className="evstats">
            <span>
              <b>
                <CountUp value={ev.points ?? 0} />
              </b>
              <small>điểm</small>
            </span>
            <span>
              <b>
                {ev.solved}
                <i>/{ev.totalKeys}</i>
              </b>
              <small>từ khóa</small>
            </span>
            <span>
              <b>{ev.tokens}</b>
              <small>💡 lượt</small>
            </span>
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
          <div className="evlinks">
            <Link className="btn" href="/su-kien/xep-hang">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
              Xếp hạng
            </Link>
            <Link className="btn" href="/them/tui-do">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="6" width="16" height="14" rx="2" />
                <path d="M4 10h16M10 14h4" />
              </svg>
              Túi đồ
            </Link>
          </div>
        </section>

        {ev.optedOut ? (
          <div className="card stack">
            <b>Bạn đang tắt sự kiện</b>
            <button className="btn primary" onClick={join}>
              Tham gia lại
            </button>
          </div>
        ) : null}

        <div className="seg pillseg" role="tablist" aria-label="Chương">
          {ev.chapters?.map((c) => (
            <button key={c.idx} className={c.idx === chapter ? 'on' : ''} role="tab" aria-selected={c.idx === chapter} onClick={() => setChapter(c.idx)}>
              Chương {c.idx}
              {c.current ? <span className="dot" /> : null}
            </button>
          ))}
        </div>

        {ch ? (
          <>
            <div className="sec-h">
              <h2>12 từ khóa</h2>
              <span className="pill">
                {ch.solved} / 12
              </span>
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
                        <span className="ct">Ngày {c.unlockDay}</span>
                      </>
                    ) : c.status === 'solved' ? (
                      <>
                        <span className="ck han">{c.word?.zh}</span>
                        <span className="ct">✓ {c.points}</span>
                      </>
                    ) : (
                      <>
                        <span className="cs">{c.hintsOpened ? '•'.repeat(c.hintsOpened) : '?'}</span>
                        <span className="ct">{c.hintsOpened ?? 0}/3</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="sec-h">
              <h2>4 hồi truyện</h2>
              <span className="pill">Chương {ch.idx}</span>
            </div>
            <div className="hoilist">
              {ch.hoi.map((h) =>
                h.opened && h.lessonId ? (
                  <Link key={h.idx} href={'/hoc/nghe/' + h.lessonId} className="hoi on">
                    <span className="hoi-n">{h.idx}</span>
                    <span className="grow">
                      <b>{h.title}</b>
                      <small className="han">{h.titleZh}</small>
                    </span>
                    <span className="hoi-go">Đọc ›</span>
                  </Link>
                ) : (
                  <div key={h.idx} className="hoi lock">
                    <span className="hoi-n">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <span className="grow">
                      <b>Hồi {h.idx}</b>
                      <small>Giải {h.idx * 3} ô để mở</small>
                    </span>
                  </div>
                ),
              )}
            </div>
          </>
        ) : null}

        <Link className="btn primary evcta" href="/hoc/nghe">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          Học bài để giải mã
        </Link>
        <Link className="lnk center" href="/su-kien/luat">
          Luật chơi
        </Link>
        <Tips
          screen="event"
          tips={[
            { sel: '.medals', title: 'Bốn huy chương', text: 'Đồng, Bạc, Vàng, Ngọc theo số từ khóa đã giải.' },
            { sel: '.grid12', title: 'Bảng 12 ô', text: 'Chạm một ô để xem và mở gợi ý. Mỗi gợi ý tốn 1 lượt; phải mở gợi ý 1 mới đoán được ô đó.' },
            { title: 'Đoán ở đâu?', text: 'Học một bài hội thoại rồi bấm nút "Nhập từ khóa" nổi ở góc dưới của bài.' },
          ]}
        />
      </div>
    </Shell>
  );
}

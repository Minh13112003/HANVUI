'use client';
// Trang chủ: chào theo giờ, chuỗi ngày, số liệu nổi bật, nhiệm vụ hôm nay, bốn kỹ năng,
// thẻ sự kiện và nhiệm vụ tuần (rule.md mục 3.6).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CountUp, Flame, Medal, Ring } from '@/components/Bits';
import Shell from '@/components/Shell';
import Tips from '@/components/Tips';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { greeting, levelName, minutes, standardName } from '@/lib/text';
import type { EventState, LessonCard, Notebook } from '@/lib/types';

interface Today {
  login: boolean;
  lessonsToday: number;
  lessonsNeeded: number;
  onlineSec: number;
  onlineNeeded: number;
  claimed: { login: boolean; lessons: boolean; online: boolean };
  done: number;
}

const SKILLS = [
  { href: '/hoc/nghe', cls: 'k-listen', zh: '听', name: 'Nghe', note: 'hội thoại có tiếng' },
  { href: '/hoc/noi', cls: 'k-speak', zh: '说', name: 'Nói', note: 'đọc theo mẫu' },
  { href: '/hoc/doc', cls: 'k-read', zh: '读', name: 'Đọc', note: 'bài đọc ngắn' },
  { href: '/hoc/viet', cls: 'k-write', zh: '写', name: 'Viết', note: 'tập viết từng nét' },
] as const;

export default function HomePage() {
  const { user } = useAuth();
  const [ev, setEv] = useState<EventState | null>(null);
  const [today, setToday] = useState<Today | null>(null);
  const [nb, setNb] = useState<Notebook | null>(null);
  const [lessons, setLessons] = useState<LessonCard[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api<EventState>('/event').then(setEv).catch(() => {});
    api<Today>('/event/today').then(setToday).catch(() => {});
    api<Notebook>('/notebook?view=day').then(setNb).catch(() => {});
    api<LessonCard[]>('/lessons').then(setLessons).catch(() => {});
  }, [user]);

  const doneLessons = lessons?.filter((l) => l.status === 'done').length ?? 0;
  const pctListen = lessons?.length ? Math.round((doneLessons / lessons.length) * 100) : 0;
  const chapter = ev?.chapters?.find((c) => c.current) ?? ev?.chapters?.[(ev?.chapters?.length ?? 1) - 1];
  const medal = ev?.medal?.level ?? 0;
  const th = ev?.medal?.thresholds ?? [5, 15, 29, 44];

  return (
    <Shell>
      <div className="stack">
        <section className="surf" data-g="night">
          <span className="wm" aria-hidden="true">
            学
          </span>
          <div className="row between">
            <span className="eyebrow">{greeting()}</span>
            {ev?.week?.login ? <Flame days={ev.week.login} /> : <span className="hpill">Bắt đầu chuỗi hôm nay</span>}
          </div>
          <div>
            <div className="hnum2" style={{ fontSize: 24 }}>
              {user?.displayName}
            </div>
            <span className="hsub">
              {user ? standardName(user.hskStandard === 'HSK3' ? 'HSK3' : 'HSK2') + ' · ' + levelName(user.hskStandard === 'HSK3' ? 'HSK3' : 'HSK2', user.hskLevel) : ''} · đã học {doneLessons}/
              {lessons?.length ?? 0} bài
            </span>
          </div>
          <div className="row between">
            <Link className="btn primary" href="/hoc/nghe">
              Học tiếp →
            </Link>
            <span className="hsub">Tuần {ev?.week?.index ?? 1}</span>
          </div>
        </section>

        {user && (user.hskStandard === 'HSK3' ? user.hskLevel <= 1 : user.hskLevel <= 2) ? (
          <Link href="/lo-trinh" className="card row" style={{ gap: 12, borderLeft: '4px solid var(--accent)' }}>
            <span className="han" style={{ fontSize: 30, lineHeight: 1 }} aria-hidden="true">
              路
            </span>
            <span className="grow">
              <b>Mới học tiếng Trung? Đi theo lộ trình</b>
              <small className="muted" style={{ display: 'block' }}>
                Pinyin, thanh điệu, nét chữ → HSK 1 → HSK 2. Mỗi bước chỉ rõ bấm gì.
              </small>
            </span>
            <span className="chev">›</span>
          </Link>
        ) : null}

        <section className="stats">
          <div className="stat">
            <span className="ic han" aria-hidden="true">
              签
            </span>
            <b>
              <CountUp value={ev?.tokens ?? 0} />
            </b>
            <small>lượt gợi ý</small>
          </div>
          <div className="stat" data-g="violet">
            <span className="ic han" aria-hidden="true">
              分
            </span>
            <b>
              <CountUp value={ev?.points ?? 0} />
            </b>
            <small>điểm sự kiện</small>
          </div>
          <Link className="stat" data-g="rose" href="/so-tay">
            <span className="ic han" aria-hidden="true">
              词
            </span>
            <b>
              <CountUp value={nb?.total ?? 0} />
            </b>
            <small>từ đã lưu</small>
          </Link>
        </section>

        <section className="card today">
          <div className="row between">
            <h2>Nhiệm vụ hôm nay</h2>
            <span className={'pill' + (today?.done === 3 ? ' ok' : '')}>{today ? today.done + '/3' : '…'}</span>
          </div>
          <div className="row">
            <Ring done={today?.done ?? 0} total={3} />
            <div className="grow mini">
              <div className="mrow">
                <span className={'mck' + (today?.claimed.login ? ' on' : '')}>✓</span>
                <span className="grow">Đăng nhập</span>
                <span className="pill">+1</span>
              </div>
              <div className="mrow">
                <span className={'mck' + (today?.claimed.lessons ? ' on' : '')}>✓</span>
                <span className="grow">
                  Nghe và trả lời 2 bài
                  {today ? ' (' + Math.min(today.lessonsToday, today.lessonsNeeded) + '/' + today.lessonsNeeded + ')' : ''}
                </span>
                <span className="pill">+2</span>
              </div>
              <div className="mrow">
                <span className={'mck' + (today?.claimed.online ? ' on' : '')}>✓</span>
                <span className="grow">Online 30 phút{today ? ' (' + minutes(today.onlineSec) + ')' : ''}</span>
                <span className="pill">+1</span>
              </div>
            </div>
          </div>
          {today && today.done < 3 ? (
            <Link className="btn primary" href="/hoc/nghe" style={{ marginTop: 10, textAlign: 'center' }}>
              Làm nhiệm vụ · thêm {4 - (today.claimed.login ? 1 : 0) - (today.claimed.lessons ? 2 : 0) - (today.claimed.online ? 1 : 0)} lượt
            </Link>
          ) : null}
        </section>

        <div className="shead">
          <span className="eyebrow2">BỐN KỸ NĂNG</span>
        </div>
        <section className="skills">
          {SKILLS.map((s) => (
            <Link key={s.href} href={s.href} className={'skill ' + s.cls}>
              <span className="stile han" aria-hidden="true">
                {s.zh}
              </span>
              <b>{s.name}</b>
              <small>{s.note}</small>
              <span className="sbar">
                <i style={{ width: (s.name === 'Nghe' ? pctListen : 0) + '%' }} />
              </span>
            </Link>
          ))}
        </section>

        {ev?.active ? (
          <Link href="/su-kien" className="surf" data-g="violet" style={{ textAlign: 'left' }}>
            <span className="wm" aria-hidden="true">
              谜
            </span>
            <div className="row between">
              <span className="eyebrow">Sự kiện tháng {ev.story?.month}</span>
              <span className="hpill">
                {ev.solved}/{ev.totalKeys} từ khóa
              </span>
            </div>
            <div className="evt" style={{ fontSize: 21, fontWeight: 800 }}>
              {ev.story?.title}
            </div>
            <div className="dots" aria-hidden="true">
              {(chapter?.cells ?? []).map((c) => (
                <span
                  key={c.pos}
                  className={
                    'dt' +
                    (c.status === 'solved'
                      ? ' ok'
                      : c.status === 'locked'
                        ? ' lk'
                        : c.hintsOpened === 1
                          ? ' c1'
                          : c.hintsOpened === 2
                            ? ' c2'
                            : c.hintsOpened === 3
                              ? ' c3'
                              : '')
                  }
                />
              ))}
            </div>
            <div className="medals">
              {[1, 2, 3, 4].map((lv) => (
                <Medal key={lv} level={lv} got={medal >= lv} need={th[lv - 1]} />
              ))}
            </div>
            <span className="hsub">Chương tuần này · ngày {ev.day} · chạm để mở bảng 12 ô</span>
          </Link>
        ) : (
          <div className="card empty center">
            <h2>Chưa có sự kiện tháng này</h2>
            <p className="muted">Mỗi tháng dương lịch là một sự kiện mới. Hãy quay lại vào ngày 1.</p>
          </div>
        )}

        {ev?.week ? (
          <section className="card stack">
            <div className="row between">
              <h2>Nhiệm vụ tuần {ev.week.index}</h2>
              <span className="pill">tối đa +21 lượt</span>
            </div>
            {ev.week.marks.map((t) => {
              const value = t.key === 'login' ? ev.week!.login : t.key === 'online' ? ev.week!.online : ev.week!.lessons;
              const max = t.marks[2];
              const label = t.key === 'login' ? 'Đăng nhập (ngày)' : t.key === 'online' ? 'Online (giờ)' : 'Học bài nghe (bài)';
              const show = t.key === 'online' ? Math.round((value / 3600) * 10) / 10 : value;
              const showMax = t.key === 'online' ? max / 3600 : max;
              return (
                <div className="trk" key={t.key}>
                  <div className="row between">
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    <span className="muted num">
                      {show}/{showMax}
                    </span>
                  </div>
                  <div className="tbar">
                    <i style={{ width: Math.min(100, (value / max) * 100) + '%' }} />
                    {t.marks.map((m, mi) => (
                      <u key={mi} className={value >= m ? 'on' : ''} style={{ left: (m / max) * 100 + '%' }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        ) : null}

        <Link href="/so-tay" className="card row between">
          <span>
            <b>Sổ tay từ vựng</b>
            <small className="muted" style={{ display: 'block' }}>
              Hôm nay lưu {nb?.today ?? 0} từ · tổng {nb?.total ?? 0}
            </small>
          </span>
          <span className="chev">›</span>
        </Link>

        <Tips
          screen="home"
          tips={[
            { sel: '.surf', title: 'Trang chủ', text: 'Lời chào, chuỗi ngày đăng nhập và tiến độ tuần của bạn nằm ở đây.' },
            { sel: '.stats', title: 'Ba số quan trọng', text: 'Lượt gợi ý để mở gợi ý sự kiện, điểm sự kiện để xếp hạng, và số từ bạn đã lưu.' },
            { sel: '.today', title: 'Nhiệm vụ hôm nay', text: 'Làm đủ 3 việc này là có 4 lượt gợi ý mỗi ngày.' },
            { sel: '.skills', title: 'Bốn kỹ năng', text: 'Nghe, Nói, Đọc, Viết. Phần Từ vựng nằm trong tab Học.' },
          ]}
        />
      </div>
    </Shell>
  );
}

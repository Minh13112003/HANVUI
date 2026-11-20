'use client';
// Trang chủ: chào theo giờ, chuỗi ngày, số liệu nổi bật, nhiệm vụ hôm nay, bốn kỹ năng,
// thẻ sự kiện và nhiệm vụ tuần (rule.md mục 3.6).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CountUp, Medal, Ring } from '@/components/Bits';
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
  { href: '/hoc', cls: 'k-vocab', zh: '词', py: 'cí', name: 'Từ vựng' },
  { href: '/hoc/nghe', cls: 'k-listen', zh: '听', py: 'tīng', name: 'Nghe' },
  { href: '/hoc/noi', cls: 'k-speak', zh: '说', py: 'shuō', name: 'Nói' },
  { href: '/hoc/doc', cls: 'k-read', zh: '读', py: 'dú', name: 'Đọc' },
  { href: '/hoc/viet', cls: 'k-write', zh: '写', py: 'xiě', name: 'Viết' },
  { href: '/hoc/dich', cls: 'k-trans', zh: '译', py: 'yì', name: 'Dịch' },
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

  const std = user?.hskStandard === 'HSK3' ? 'HSK3' : 'HSK2';
  const left = today ? 4 - (today.claimed.login ? 1 : 0) - (today.claimed.lessons ? 2 : 0) - (today.claimed.online ? 1 : 0) : 0;

  return (
    <Shell>
      <div className="stack">
        <section className="greet">
          <h1>
            {greeting()}, {user?.displayName}
          </h1>
          <div className="gchips">
            <span className="gchip lv">{user ? standardName(std) + ' | ' + levelName(std, user.hskLevel) : ''}</span>
          </div>
        </section>

        <section className="surf goal" data-g="night">
          <span className="wm" aria-hidden="true">
            学
          </span>
          <div className="goal-in">
            <div className="goal-tx">
              <span className="eyebrow">Mục tiêu hôm nay</span>
              <div className="hnum2" style={{ fontSize: 22 }}>
                {today && today.done >= 3 ? 'Hoàn thành' : today ? 'Nghe & trả lời ' + today.lessonsNeeded + ' bài' : 'Bắt đầu thôi'}
              </div>
              {today && today.done < 3 && left > 0 ? <span className="hsub">+{left} 💡 đang chờ</span> : null}
              <Link className="btn primary" href="/hoc/nghe">
                Học tiếp →
              </Link>
            </div>
            <Ring done={today?.done ?? 0} total={3} label={(today?.done ?? 0) + '/3'} />
          </div>
        </section>

        <section className="stats">
          <div className="stat">
            <span className="ic han" aria-hidden="true">
              连
            </span>
            <b>
              <CountUp value={ev?.week?.login ?? 0} />
            </b>
            <small>Chuỗi học</small>
          </div>
          <div className="stat">
            <span className="ic han" aria-hidden="true">
              灯
            </span>
            <b>
              <CountUp value={ev?.tokens ?? 0} />
            </b>
            <small>Gợi ý sẵn</small>
          </div>
          <div className="stat">
            <span className="ic han" aria-hidden="true">
              时
            </span>
            <b>
              <CountUp value={Math.floor((today?.onlineSec ?? 0) / 60)} />
              <i>p</i>
            </b>
            <small>Hôm nay</small>
          </div>
        </section>

        {user && (user.hskStandard === 'HSK3' ? user.hskLevel <= 1 : user.hskLevel <= 2) ? (
          <Link href="/lo-trinh" className="card row" style={{ gap: 12 }}>
            <span className="han" style={{ fontSize: 28, lineHeight: 1, color: 'var(--accent)' }} aria-hidden="true">
              路
            </span>
            <b className="grow">Lộ trình cho người mới</b>
            <span className="chev">›</span>
          </Link>
        ) : null}

        <section className="card today">
          <div className="row between">
            <h2>Nhiệm vụ hôm nay</h2>
            <span className={'pill' + (today?.done === 3 ? ' ok' : '')}>{today ? today.done + '/3' : '…'}</span>
          </div>
          <div className="mini">
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
        </section>

        <div className="shead">
          <span className="eyebrow2">KỸ NĂNG</span>
        </div>
        <section className="skills">
          {SKILLS.map((s) => (
            <Link key={s.href} href={s.href} className={'skill ' + s.cls}>
              <span className="stile han" aria-hidden="true">
                {s.zh}
              </span>
              <span className="py" aria-hidden="true">
                {s.py}
              </span>
              <b>{s.name}</b>
              <span className="wmh" aria-hidden="true">
                {s.zh}
              </span>
              {s.name === 'Nghe' && lessons?.length ? (
                <>
                  <span className="sprog">
                    {doneLessons}/{lessons.length} bài
                  </span>
                  <span className="sbar">
                    <i style={{ width: pctListen + '%' }} />
                  </span>
                </>
              ) : null}
              {s.name === 'Từ vựng' && nb ? <span className="sprog">{nb.total} từ đã lưu</span> : null}
            </Link>
          ))}
        </section>

        {ev?.active ? (
          <Link href="/su-kien" className="surf" data-g="violet" style={{ textAlign: 'left' }}>
            <span className="wm" aria-hidden="true">
              谜
            </span>
            <div className="row between">
              <span className="eyebrow">Sự kiện</span>
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
          </Link>
        ) : (
          <div className="card empty center">
            <h2>Chưa có sự kiện</h2>
          </div>
        )}

        {ev?.week ? (
          <section className="card stack">
            <div className="row between">
              <h2>Nhiệm vụ tuần {ev.week.index}</h2>
              <span className="pill">+21 💡</span>
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

        <Tips
          screen="home"
          tips={[
            { sel: '.surf', title: 'Trang chủ', text: 'Lời chào, chuỗi ngày đăng nhập và tiến độ tuần của bạn nằm ở đây.' },
            { sel: '.stats', title: 'Số liệu', text: 'Số từ đã lưu, bài đã nghe và số phút học hôm nay.' },
            { sel: '.today', title: 'Nhiệm vụ hôm nay', text: 'Làm đủ 3 việc này là có 4 lượt gợi ý mỗi ngày.' },
            { sel: '.skills', title: 'Kỹ năng', text: 'Từ vựng, Nghe, Nói, Đọc, Viết và Dịch.' },
          ]}
        />
      </div>
    </Shell>
  );
}

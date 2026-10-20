'use client';
// Hộp thư (rule.md mục 3.6, tab Tài khoản): thư của quản trị và thư tự động của hệ thống, có quà hoặc không.
// Mỗi thư ghi rõ người gửi, tiêu đề, nội dung và quà; nhận quà một lần, thư còn quà chưa nhận thì không xóa được.
import { useCallback, useEffect, useState } from 'react';
import RewardDialog, { type RewardInfo } from '@/components/RewardDialog';
import Shell from '@/components/Shell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';
import type { MailItem, MailList, MailSender } from '@/lib/types';

const SENDER: Record<MailSender, { name: string; zh: string }> = {
  ADMIN: { name: 'Quản trị viên HanVui', zh: '管' },
  SYSTEM: { name: 'Hệ thống HanVui', zh: '系' },
};

type View = 'all' | 'unread' | 'gift';

const when = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Mô tả quà của một thư, ví dụ "20 lượt gợi ý · VIP 3 ngày". */
const giftText = (r: MailItem['reward']) =>
  [r?.tokens ? `${r.tokens} lượt gợi ý` : '', r?.item === 'VIP_3D' ? 'VIP 3 ngày' : ''].filter(Boolean).join(' · ');

export default function MailboxPage() {
  const { user } = useAuth();
  const { toast } = useUi();
  const [view, setView] = useState<View>('all');
  const [sender, setSender] = useState<'' | MailSender>('');
  const [list, setList] = useState<MailList | null>(null);
  const [open, setOpen] = useState<MailItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [reward, setReward] = useState<RewardInfo | null>(null);

  const load = useCallback(() => {
    const p = new URLSearchParams();
    if (view === 'unread') p.set('unread', 'true');
    if (view === 'gift') p.set('reward', 'true');
    if (sender) p.set('sender', sender);
    api<MailList>('/mailbox?' + p.toString())
      .then(setList)
      .catch(() => toast('Không tải được hộp thư'));
  }, [view, sender, toast]);
  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const openMail = async (id: number) => {
    try {
      setOpen(await api<MailItem>('/mailbox/' + id));
      window.scrollTo({ top: 0 });
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không mở được thư');
    }
  };

  const claim = async (m: MailItem) => {
    setBusy(true);
    try {
      const r = await api<{ reward: { tokens: number; item: string | null } }>('/mailbox/' + m.id + '/claim', { method: 'POST' });
      setReward({ source: 'Thư: ' + m.subject, tokens: r.reward.tokens, vip: r.reward.item ? 1 : 0 });
      setOpen(await api<MailItem>('/mailbox/' + m.id));
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không nhận được quà');
    } finally {
      setBusy(false);
    }
  };

  const claimAll = async () => {
    setBusy(true);
    try {
      const r = await api<{ mails: number; tokens: number; items: number }>('/mailbox/claim-all', { method: 'POST' });
      if (r.mails) setReward({ source: `Nhận quà của ${r.mails} thư`, tokens: r.tokens, vip: r.items });
      else toast('Không còn quà nào để nhận');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không nhận được quà');
    } finally {
      setBusy(false);
    }
  };

  const readAll = async () => {
    await api('/mailbox/read-all', { method: 'POST' }).catch(() => {});
    load();
  };

  const remove = async (m: MailItem) => {
    try {
      await api('/mailbox/' + m.id, { method: 'DELETE' });
      toast('Đã xóa thư');
      setOpen(null);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không xóa được thư');
    }
  };

  // ── Xem một thư ──
  if (open) {
    const s = SENDER[open.sender];
    return (
      <Shell title="Hộp thư">
        <div className="stack">
          <button className="btn sm" style={{ justifySelf: 'start' }} onClick={() => setOpen(null)}>
            ‹ Hộp thư
          </button>
          <article className="card stack">
            <div className="row" style={{ gap: 12 }}>
              <span className="mail-av han" data-s={open.sender} aria-hidden="true">
                {s.zh}
              </span>
              <div className="grow">
                <div className="mail-from">Từ: {s.name}</div>
                <small className="muted">{when(open.createdAt)}</small>
              </div>
            </div>
            <h1 style={{ fontSize: 21 }}>{open.subject}</h1>
            <div className="mail-body">{open.body}</div>

            {open.hasReward ? (
              <div className="mail-reward">
                <span className="rwd-ico" style={{ width: 52, height: 52, borderRadius: 16 }} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
                    <path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-1.5-3-5-4-5-1.5S10 9 12 9zM12 9c1.5-3 5-4 5-1.5S14 9 12 9z" />
                  </svg>
                </span>
                <div className="grow">
                  <b>Quà kèm thư</b>
                  <div className="muted" style={{ fontSize: 14 }}>
                    {giftText(open.reward)}
                  </div>
                  {open.expiresAt && !open.claimed ? (
                    <small className="muted">Hạn nhận: {when(open.expiresAt)}</small>
                  ) : null}
                </div>
                {open.claimable ? (
                  <button className="btn primary" disabled={busy} onClick={() => claim(open)}>
                    Nhận quà
                  </button>
                ) : (
                  <span className="mail-gift done">{open.claimed ? 'Đã nhận' : 'Hết hạn'}</span>
                )}
              </div>
            ) : null}
          </article>
          <button className="btn" disabled={open.claimable} onClick={() => remove(open)}>
            {open.claimable ? 'Nhận quà trước khi xóa thư' : 'Xóa thư'}
          </button>
        </div>
        <RewardDialog info={reward} onClose={() => setReward(null)} />
      </Shell>
    );
  }

  // ── Danh sách ──
  const counts = list?.counts;
  return (
    <Shell title="Hộp thư">
      <div className="stack">
        <div className="row between">
          <h1>Hộp thư</h1>
          {counts?.unread ? <span className="badge-n">{counts.unread} chưa đọc</span> : null}
        </div>

        <div className="seg" role="tablist" aria-label="Lọc thư">
          {(
            [
              ['all', 'Tất cả'],
              ['unread', `Chưa đọc${counts?.unread ? ` (${counts.unread})` : ''}`],
              ['gift', `Có quà${counts?.unclaimed ? ` (${counts.unclaimed})` : ''}`],
            ] as [View, string][]
          ).map(([v, label]) => (
            <button key={v} role="tab" aria-selected={view === v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
              {label}
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="Người gửi">
          <button className={'chip' + (!sender ? ' on' : '')} onClick={() => setSender('')}>
            Mọi người gửi
          </button>
          <button className={'chip' + (sender === 'ADMIN' ? ' on' : '')} onClick={() => setSender('ADMIN')}>
            Quản trị viên
          </button>
          <button className={'chip' + (sender === 'SYSTEM' ? ' on' : '')} onClick={() => setSender('SYSTEM')}>
            Hệ thống
          </button>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn sm grow" disabled={busy || !counts?.unread} onClick={readAll}>
            Đánh dấu đã đọc hết
          </button>
          <button className="btn sm primary grow" disabled={busy || !counts?.unclaimed} onClick={claimAll}>
            Nhận tất cả quà
          </button>
        </div>

        {!list ? <p className="muted">Đang tải…</p> : null}
        {list && !list.items.length ? <p className="muted">Không có thư nào ở mục này.</p> : null}
        {list?.items.map((m) => (
          <button key={m.id} className={'mail-row' + (m.read ? '' : ' unread')} onClick={() => openMail(m.id)}>
            <span className="mail-av han" data-s={m.sender} aria-hidden="true">
              {SENDER[m.sender].zh}
            </span>
            <span className="grow" style={{ display: 'grid', gap: 2 }}>
              <span className="row between" style={{ gap: 8 }}>
                <span className="mail-from">{SENDER[m.sender].name}</span>
                <small className="muted">{new Date(m.createdAt).toLocaleDateString('vi-VN')}</small>
              </span>
              <b className="subj" style={{ fontSize: 15 }}>
                {m.read ? '' : '● '}
                {m.subject}
              </b>
              <small className="muted">{m.preview}</small>
              {m.hasReward ? (
                <span>
                  <span className={'mail-gift' + (m.claimable ? '' : ' done')}>
                    {m.claimable ? 'Quà: ' + giftText(m.reward) : m.claimed ? 'Đã nhận quà' : 'Quà hết hạn'}
                  </span>
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
      <RewardDialog info={reward} onClose={() => setReward(null)} />
    </Shell>
  );
}

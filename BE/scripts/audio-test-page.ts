// Tạo trang nghe thử: FE/public/audio-test.html, liệt kê mọi câu đã có file trên R2 kèm trình phát.
// Chỉ dùng khi dựng và thử (không cần đăng nhập, không gọi API). Xóa được bất cứ lúc nào.
//   pnpm audio:page   →   mở http://localhost:3000/audio-test.html
import '../src/config/dotenv.js';
import { writeFile } from 'node:fs/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const BASE = (process.env.S3_PUBLIC_URL ?? '').replace(/\/$/, '');
if (!BASE) throw new Error('Thiếu S3_PUBLIC_URL');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const lessons = await prisma.lesson.findMany({
  where: { published: true },
  include: { roles: true, lines: { orderBy: { idx: 'asc' } } },
  orderBy: [{ level: 'asc' }, { id: 'asc' }],
});

const rows = lessons
  .map((l) => {
    const lines = l.lines
      .filter((x) => x.audioKey)
      .map((x) => {
        const role = l.roles.find((r) => r.who === x.who);
        const voice = (x.audioKey ?? '').split('-').slice(2, -1).join('-') || '';
        return `<tr>
      <td class="n">${x.idx + 1}</td>
      <td class="zh">${esc(x.zh)}<small>${esc(x.pinyin)}</small><em>${esc(x.vi)}</em></td>
      <td class="w"><b>${esc(role?.label ?? x.who)}</b><small>${role?.gender === 'f' ? 'nữ' : 'nam'}, giọng ${role?.pitchRange === 1 ? 'trầm' : role?.pitchRange === 3 ? 'cao' : 'vừa'}</small><small>${esc(voice)}</small></td>
      <td><audio controls preload="none" src="${BASE}/${x.audioKey}"></audio></td>
    </tr>`;
      })
      .join('\n');
    return `<section>
  <h2>${esc(l.id)} — ${esc(l.title)} <span class="tag">${l.kind === 'STORY' ? 'truyện' : 'HSK ' + l.level}</span> <span class="tag">2.0·${l.hsk2 ?? '—'} | 3.0·${l.hsk3 ?? '—'}</span></h2>
  <table>${lines}</table>
</section>`;
  })
  .join('\n');

const total = lessons.reduce((s, l) => s + l.lines.filter((x) => x.audioKey).length, 0);

const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HanVui — nghe thử file âm thanh trên R2</title>
<style>
 :root{color-scheme:light dark}
 body{font:15px/1.5 system-ui,sans-serif;margin:0;padding:16px;max-width:900px;margin-inline:auto}
 h1{font-size:20px} h2{font-size:16px;margin:22px 0 8px}
 .tag{font-size:11px;font-weight:600;background:#0e74661a;color:#0e7466;border-radius:6px;padding:2px 7px;vertical-align:middle}
 table{width:100%;border-collapse:collapse}
 td{border-top:1px solid #8883;padding:8px 6px;vertical-align:top}
 td.n{width:28px;color:#888;font-weight:700}
 td.zh{font-size:19px} td.zh small{display:block;font-size:12px;color:#0e7466} td.zh em{display:block;font-size:13px;color:#888;font-style:normal}
 td.w{width:150px;font-size:12px} td.w small{display:block;color:#888}
 audio{width:100%;max-width:260px}
 .note{background:#8881;border-radius:10px;padding:12px;font-size:13px}
</style></head><body>
<h1>HanVui — nghe thử ${total} file âm thanh trên Cloudflare R2</h1>
<p class="note">Trang này chỉ để kiểm tra khi dựng: phát trực tiếp từ <code>${BASE}</code>, không qua app và không cần đăng nhập.
Nếu nghe được ở đây thì file và tên miền công khai đều ổn. Giọng do AI tạo (edge-tts, giai đoạn thử).</p>
${rows}
</body></html>
`;

const out = new URL('../../FE/public/audio-test.html', import.meta.url);
await writeFile(out, html, 'utf8');
console.log(`Đã tạo FE/public/audio-test.html với ${total} câu của ${lessons.length} bài.`);
console.log('Mở: http://localhost:3000/audio-test.html');
await prisma.$disconnect();

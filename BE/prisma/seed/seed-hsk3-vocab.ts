// Nạp từ vựng HSK 2.0 cấp 3 theo chủ đề (content/hsk3-vocab.ts). Chỉ thêm từ chưa có; từ đã có mà chưa thuộc chủ đề nào thì gắn vào chủ đề.
// Chạy: pnpm db:seed:hsk3-vocab   — sau đó: pnpm db:hsk (nhãn cấp) và pnpm audio:words (âm thanh từ mới).
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { pinyin } from 'pinyin-pro';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { HSK3_VOCAB } from './content/hsk3-vocab.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

try {
  const lv: Record<string, [number, number]> = JSON.parse(readFileSync(new URL('./hsk/hsk-levels.json', import.meta.url), 'utf8'));
  const have = new Map((await prisma.word.findMany({ select: { id: true, zh: true, topicId: true } })).map((w) => [w.zh, w]));
  const seen = new Set<string>();
  const base = await prisma.topic.count({ where: { kind: 'VOCAB' } });
  let created = 0;
  let attached = 0;

  for (const [gi, g] of HSK3_VOCAB.entries()) {
    await prisma.topic.upsert({
      where: { id: g.id },
      create: { id: g.id, kind: 'VOCAB', name: g.name, glyph: g.glyph, sort: base + gi },
      update: { name: g.name, glyph: g.glyph },
    });
    for (const line of g.words.split('\n')) {
      const [zh, vi, pos] = line.split('|');
      if (seen.has(zh)) throw new Error(`Từ bị trùng trong file: ${zh}`);
      seen.add(zh);
      const row = have.get(zh);
      if (!row) {
        await prisma.word.create({
          data: { zh, vi, pos, phrase: false, topicId: g.id, pinyin: (pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[]).join('') },
        });
        created++;
      } else if (!row.topicId) {
        await prisma.word.update({ where: { id: row.id }, data: { topicId: g.id } });
        attached++;
      }
    }
  }

  // Đối chiếu với danh sách HSK 2.0 cấp 3: từ nào của cấp 3 vẫn chưa có trong DB?
  const now = new Set((await prisma.word.findMany({ select: { zh: true } })).map((w) => w.zh));
  const all3 = Object.entries(lv).filter(([, v]) => v[0] === 3).map(([k]) => k);
  const left = all3.filter((w) => !now.has(w));
  const notHsk3 = [...seen].filter((z) => lv[z]?.[0] !== 3);
  console.log(`Chủ đề: ${HSK3_VOCAB.length} · thêm ${created} từ mới, gắn chủ đề cho ${attached} từ đã có.`);
  console.log(`Cấp 3 trong danh sách: ${all3.length}, còn thiếu trong DB: ${left.length}${left.length ? ' → ' + left.join(' ') : ''}`);
  if (notHsk3.length) console.log(`Từ trong file không thuộc cấp 3 theo danh sách cộng đồng (${notHsk3.length}): ${notHsk3.join(' ')}`);
} finally {
  await prisma.$disconnect();
}

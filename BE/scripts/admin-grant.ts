// Cấp quyền quản trị cho một tài khoản đã đăng ký: pnpm admin:grant email@cua-ban.com
// Thu hồi: pnpm admin:grant email@cua-ban.com --revoke. Người được cấp cần đăng xuất rồi đăng nhập lại.
import '../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith('--'))?.trim().toLowerCase();
if (!email) throw new Error('Thiếu email. Ví dụ: pnpm admin:grant email@cua-ban.com');
const role = args.includes('--revoke') ? 'USER' : 'ADMIN';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const r = await prisma.user.updateMany({ where: { email }, data: { role } });
  if (!r.count) throw new Error(`Không có tài khoản ${email}. Hãy đăng ký trong app trước.`);
  console.log(`✓ ${email} giờ có vai trò ${role}. Đăng xuất rồi đăng nhập lại để có hiệu lực.`);
} finally {
  await prisma.$disconnect();
}

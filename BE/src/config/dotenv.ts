// Nạp biến môi trường một lần, trước mọi thứ khác: ưu tiên BE/.env, rồi .env ở thư mục dự án
// (để BE và FE dùng chung một file). Giá trị đã có trong môi trường thì không bị ghi đè.
import { config } from 'dotenv';

config({ path: ['.env', '../.env'], quiet: true });

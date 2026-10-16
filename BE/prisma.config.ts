import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma 7: địa chỉ database khai báo ở đây (không còn directUrl trong schema). Một DATABASE_URL cho tất cả.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});

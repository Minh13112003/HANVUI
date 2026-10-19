import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Database ở xa (Supabase) nên mỗi lượt gọi mất vài trăm ms; 5s mặc định không đủ.
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});

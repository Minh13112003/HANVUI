// Đọc và kiểm tra biến môi trường một lần lúc khởi động; thiếu là dừng ngay, không chạy mơ hồ.
export interface Env {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  jwtAccessSecret: string;
  jwtAccessTtl: string;
  refreshTtlDays: number;
  corsOrigins: string[];
}

export function loadEnv(raw: Record<string, string | undefined> = process.env): Env {
  const need = (key: string): string => {
    const v = raw[key]?.trim();
    if (!v) throw new Error(`Thiếu biến môi trường ${key} (xem .env.example)`);
    return v;
  };

  const jwtAccessSecret = need('JWT_ACCESS_SECRET');
  if (jwtAccessSecret.length < 32) {
    throw new Error('JWT_ACCESS_SECRET phải dài ít nhất 32 ký tự');
  }

  return {
    nodeEnv: raw.NODE_ENV ?? 'development',
    port: Number(raw.PORT ?? 3001),
    databaseUrl: need('DATABASE_URL'),
    jwtAccessSecret,
    jwtAccessTtl: raw.JWT_ACCESS_TTL ?? '15m',
    refreshTtlDays: Number(raw.REFRESH_TTL_DAYS ?? 30),
    corsOrigins: (raw.CORS_ORIGINS ?? 'http://localhost:3000')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

import type { NextConfig } from 'next';

// Giao diện gọi API của BE qua NEXT_PUBLIC_API_BASE; âm thanh lấy từ NEXT_PUBLIC_AUDIO_BASE (Cloudflare R2).
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

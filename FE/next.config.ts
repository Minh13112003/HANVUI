import type { NextConfig } from 'next';

// FE gọi API qua đường cùng nguồn /api/v1, Next chuyển tiếp sang BE (BE_ORIGIN, mặc định localhost:3001).
// Nhờ vậy mở app qua tunnel (Cloudflare) hay qua mạng LAN chỉ cần MỘT địa chỉ, không vướng CORS.
// Âm thanh lấy thẳng từ NEXT_PUBLIC_AUDIO_BASE (Cloudflare R2).
const BE_ORIGIN = (process.env.BE_ORIGIN || 'http://localhost:3001').replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Cho phép mở dev server qua Cloudflare Quick Tunnel (https://xxx.trycloudflare.com).
  allowedDevOrigins: ['*.trycloudflare.com'],
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: BE_ORIGIN + '/api/v1/:path*' }];
  },
};

export default nextConfig;

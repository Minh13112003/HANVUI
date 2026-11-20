import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { UiProvider } from '@/lib/ui';
import SwRegister from './sw-register';
import './globals.css';
import './theme.css';
import './theme-v2.css';
import './theme-bt.css';

// Chữ Hán dùng phông có sẵn của máy (Noto Serif SC / PingFang / Microsoft YaHei) như bản demo:
// phông CJK rất nặng, tải về sẽ làm app chậm trên điện thoại.
const ui = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HanVui — Học tiếng Trung mỗi ngày',
  description: 'Học tiếng Trung cho người Việt: từ vựng, hội thoại, viết chữ từng nét và sự kiện truyện.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'HanVui', statusBarStyle: 'default' },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EEF8FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1A2B' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={ui.variable}>
      <head>
        {/* Đặt giao diện sáng/tối trước khi vẽ để không bị nháy màu. Chỉ còn một chủ đề màu (Biển & Trời). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement,t=localStorage.getItem('hv.theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t)}catch(e){}",
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <UiProvider>{children}</UiProvider>
        </AuthProvider>
        <SwRegister />
      </body>
    </html>
  );
}

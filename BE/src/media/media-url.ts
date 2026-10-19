// Ghép URL ảnh từ khóa lưu trong DB. Ảnh nằm ở Cloudflare R2 (cùng bucket với âm thanh, tiền tố "img/").
// DB chỉ lưu khóa gốc (ví dụ "img/avatars/<id>-ab12"); mỗi cỡ ảnh là một file "<khóa>-<cỡ>.webp".
// Đổi tên miền (R2 → VPS) chỉ cần đổi S3_PUBLIC_URL, không sửa dữ liệu.

export type Preset = 'avatar' | 'chat' | 'cover' | 'thumb';

/** Cỡ ảnh sinh sẵn khi tải lên. `cover` = cắt vừa khung, `inside` = giữ tỉ lệ, không vượt cỡ. */
export const PRESETS: Record<Preset, { width: number; height?: number; fit: 'cover' | 'inside' }> = {
  /** Ảnh vuông 256px cho avatar người dùng. */
  avatar: { width: 256, height: 256, fit: 'cover' },
  /** Ảnh nhân vật nhỏ trong khung chat. */
  chat: { width: 96, height: 96, fit: 'cover' },
  /** Ảnh bối cảnh khổ rộng cho màn bài học. */
  cover: { width: 1080, fit: 'inside' },
  /** Ảnh bối cảnh thu nhỏ cho danh sách bài. */
  thumb: { width: 320, height: 180, fit: 'cover' },
};

export const IMAGE_PREFIX = 'img';

export const variantKey = (key: string, preset: Preset) => `${key}-${preset}.webp`;

export function mediaUrl(
  key: string | null | undefined,
  preset: Preset,
  publicUrl = process.env.S3_PUBLIC_URL,
): string | null {
  const base = publicUrl?.trim().replace(/\/$/, '');
  if (!key || !base) return null;
  return `${base}/${variantKey(key, preset)}`;
}

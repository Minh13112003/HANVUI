import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import type { MediaKind } from '../generated/prisma/enums.js';
import { PRESETS, type Preset } from './media-url.js';

/** Mỗi loại ảnh sinh những cỡ nào. */
export const VARIANTS_BY_KIND: Record<MediaKind, Preset[]> = {
  AVATAR: ['avatar', 'chat'],
  ROLE_AVATAR: ['avatar', 'chat'],
  LESSON_COVER: ['cover', 'thumb'],
};

export const ALL_PRESETS = Object.keys(PRESETS) as Preset[];

export interface Variant {
  preset: Preset;
  data: Buffer;
  width: number;
  height: number;
}

const WEBP_QUALITY = 80;
// Chặn "bom ảnh" (file nhỏ nhưng giải nén ra hàng trăm triệu điểm ảnh).
const MAX_INPUT_PIXELS = 40_000_000;

/**
 * Thu nhỏ ảnh đã qua kiểm tra loại file thành các cỡ định sẵn, định dạng WebP.
 * Tự xoay theo EXIF, bỏ metadata (vị trí GPS...), chỉ lấy khung đầu của ảnh động, không phóng to ảnh nhỏ.
 */
export async function makeVariants(input: Buffer, presets: Preset[]): Promise<Variant[]> {
  try {
    return await Promise.all(
      presets.map(async (preset) => {
        const { width, height, fit } = PRESETS[preset];
        const { data, info } = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' })
          .rotate()
          .resize({ width, height, fit, position: fit === 'cover' ? 'attention' : undefined, withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer({ resolveWithObject: true });
        return { preset, data, width: info.width, height: info.height };
      }),
    );
  } catch {
    throw new BadRequestException('Ảnh bị hỏng hoặc quá lớn');
  }
}

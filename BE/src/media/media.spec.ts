import { BadGatewayException, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import { makeVariants } from './image-processor.js';
import { sniffImage } from './image.js';
import { mediaUrl, variantKey } from './media-url.js';
import { MediaService } from './media.service.js';

const png = (w: number, h: number) => sharp({ create: { width: w, height: h, channels: 3, background: '#c0392b' } }).png().toBuffer();
const JPEG_HEAD = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]);
const PNG_HEAD = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const WEBP_HEAD = Buffer.concat([Buffer.from('RIFF'), Buffer.from([1, 2, 3, 4]), Buffer.from('WEBPVP8 ')]);

describe('nhận diện ảnh theo nội dung', () => {
  it('nhận JPEG, PNG, WebP', () => {
    expect(sniffImage(JPEG_HEAD)).toBe('jpeg');
    expect(sniffImage(PNG_HEAD)).toBe('png');
    expect(sniffImage(WEBP_HEAD)).toBe('webp');
  });

  it('từ chối file khác dù đặt đuôi hay Content-Type là ảnh', () => {
    expect(sniffImage(Buffer.from('<svg onload=alert(1)></svg>'))).toBeNull();
    expect(sniffImage(Buffer.from('GIF89a......'))).toBeNull();
    expect(sniffImage(Buffer.from('<?php echo 1; ?>'))).toBeNull();
    expect(sniffImage(Buffer.alloc(0))).toBeNull();
  });
});

describe('URL ảnh', () => {
  it('ghép từ khóa và S3_PUBLIC_URL, null khi thiếu ảnh hoặc chưa cấu hình', () => {
    expect(mediaUrl('img/avatars/a-1', 'avatar', 'https://cdn.example.com/')).toBe('https://cdn.example.com/img/avatars/a-1-avatar.webp');
    expect(mediaUrl(null, 'avatar', 'https://cdn.example.com')).toBeNull();
    expect(mediaUrl('x', 'cover', '')).toBeNull();
  });
});

describe('thu nhỏ ảnh', () => {
  it('avatar: ra WebP vuông 256 và 96 từ ảnh lớn', async () => {
    const v = await makeVariants(await png(1000, 600), ['avatar', 'chat']);
    expect(v.map((x) => [x.preset, x.width, x.height])).toEqual([['avatar', 256, 256], ['chat', 96, 96]]);
    for (const x of v) expect((await sharp(x.data).metadata()).format).toBe('webp');
  });

  it('bối cảnh: cover giữ tỉ lệ tối đa 1080 rộng, thumb 320x180', async () => {
    const v = await makeVariants(await png(3000, 1500), ['cover', 'thumb']);
    expect(v[0]).toMatchObject({ preset: 'cover', width: 1080, height: 540 });
    expect(v[1]).toMatchObject({ preset: 'thumb', width: 320, height: 180 });
  });

  it('không phóng to ảnh nhỏ', async () => {
    const [cover] = await makeVariants(await png(400, 300), ['cover']);
    expect([cover.width, cover.height]).toEqual([400, 300]);
  });

  it('ảnh nhỏ hơn gốc nhiều (nén)', async () => {
    const big = await sharp({ create: { width: 2000, height: 2000, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 40 } } }).jpeg({ quality: 95 }).toBuffer();
    const [a] = await makeVariants(big, ['avatar']);
    expect(a.data.length).toBeLessThan(big.length / 10);
  });

  it('ảnh hỏng (đúng chữ ký nhưng nội dung rác) bị từ chối', async () => {
    await expect(makeVariants(Buffer.concat([JPEG_HEAD, Buffer.from('rác rác rác')]), ['avatar'])).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('MediaService', () => {
  function setup(opts: { failPut?: boolean } = {}) {
    const state = {
      avatarId: 'img/avatars/u1-old' as string | null,
      assets: [] as { publicId: string; bytes: number; format: string }[],
      stored: new Map<string, Buffer>(),
      deleted: [] as string[],
    };
    const prisma = {
      user: {
        findUniqueOrThrow: async () => ({ avatarId: state.avatarId }),
        update: async ({ data }: { data: { avatarId: string | null } }) => void (state.avatarId = data.avatarId),
      },
      mediaAsset: {
        create: async ({ data }: { data: { publicId: string; bytes: number; format: string } }) => void state.assets.push(data),
        deleteMany: async ({ where }: { where: { publicId: string } }) => void (state.assets = state.assets.filter((a) => a.publicId !== where.publicId)),
      },
    };
    const storage = {
      put: async (key: string, body: Buffer) => {
        if (opts.failPut) throw new BadGatewayException('lỗi');
        state.stored.set(key, body);
      },
      deleteMany: async (keys: string[]) => void state.deleted.push(...keys),
    };
    return { state, svc: new MediaService(prisma as never, storage as never) };
  }

  it('đổi avatar: lưu 2 cỡ, ghi sổ, xóa mọi cỡ của ảnh cũ', async () => {
    const { state, svc } = setup();
    process.env.S3_PUBLIC_URL = 'https://cdn.example.com';
    const r = await svc.setAvatar('u1', { buffer: await png(500, 500) });
    expect(state.avatarId).toMatch(/^img\/avatars\/u1-[0-9a-f]{8}$/);
    expect([...state.stored.keys()].sort()).toEqual([variantKey(state.avatarId!, 'avatar'), variantKey(state.avatarId!, 'chat')].sort());
    expect(r.avatarUrl).toBe(`https://cdn.example.com/${state.avatarId}-avatar.webp`);
    expect(state.assets).toHaveLength(1);
    expect(state.assets[0].format).toBe('webp');
    expect(state.deleted).toContain('img/avatars/u1-old-avatar.webp');
  });

  it('từ chối thiếu file hoặc file không phải ảnh, không ghi gì', async () => {
    const { state, svc } = setup();
    await expect(svc.setAvatar('u1', undefined)).rejects.toBeInstanceOf(BadRequestException);
    await expect(svc.setAvatar('u1', { buffer: Buffer.from('<svg/>') })).rejects.toBeInstanceOf(BadRequestException);
    expect(state.stored.size).toBe(0);
    expect(state.assets).toHaveLength(0);
    expect(state.avatarId).toBe('img/avatars/u1-old');
  });

  it('ghi R2 lỗi: dọn lại, không đổi avatar, không ghi sổ', async () => {
    const { state, svc } = setup({ failPut: true });
    await expect(svc.setAvatar('u1', { buffer: await png(100, 100) })).rejects.toBeInstanceOf(BadGatewayException);
    expect(state.avatarId).toBe('img/avatars/u1-old');
    expect(state.assets).toHaveLength(0);
    expect(state.deleted.length).toBeGreaterThan(0);
  });

  it('xóa avatar', async () => {
    const { state, svc } = setup();
    await svc.removeAvatar('u1');
    expect(state.avatarId).toBeNull();
    expect(state.deleted).toContain('img/avatars/u1-old-avatar.webp');
  });
});

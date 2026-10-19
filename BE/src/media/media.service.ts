import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import type { MediaKind } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ALL_PRESETS, makeVariants, VARIANTS_BY_KIND } from './image-processor.js';
import { sniffImage } from './image.js';
import { IMAGE_PREFIX, mediaUrl, variantKey } from './media-url.js';
import { ObjectStorage } from './object-storage.service.js';

type Upload = { buffer: Buffer } | undefined;

const rand = () => randomBytes(4).toString('hex');

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ObjectStorage,
  ) {}

  // ───────────── Avatar người dùng ─────────────

  async setAvatar(userId: string, file: Upload) {
    const prev = (await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { avatarId: true } })).avatarId;
    const key = await this.store(file, 'AVATAR', `avatars/${userId}-${rand()}`, userId);
    try {
      await this.prisma.user.update({ where: { id: userId }, data: { avatarId: key } });
    } catch (e) {
      await this.discard(key);
      throw e;
    }
    if (prev) await this.discard(prev);
    return { avatarUrl: mediaUrl(key, 'avatar') };
  }

  async removeAvatar(userId: string) {
    const prev = (await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { avatarId: true } })).avatarId;
    await this.prisma.user.update({ where: { id: userId }, data: { avatarId: null } });
    if (prev) await this.discard(prev);
  }

  // ───────────── Ảnh hội thoại (quản trị) ─────────────

  /** Ảnh bối cảnh của một hội thoại. */
  async setLessonCover(adminId: string, lessonId: string, file: Upload) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, select: { coverId: true } });
    if (!lesson) throw new NotFoundException('Không có bài này');
    const key = await this.store(file, 'LESSON_COVER', `lessons/${lessonId}-${rand()}`, adminId);
    try {
      await this.prisma.lesson.update({ where: { id: lessonId }, data: { coverId: key } });
    } catch (e) {
      await this.discard(key);
      throw e;
    }
    if (lesson.coverId) await this.discard(lesson.coverId);
    return { coverUrl: mediaUrl(key, 'cover'), thumbUrl: mediaUrl(key, 'thumb') };
  }

  /** Ảnh nhân vật (vai) hiện cạnh lời thoại trong khung chat. */
  async setRoleAvatar(adminId: string, lessonId: string, who: string, file: Upload) {
    const role = await this.prisma.lessonRole.findUnique({ where: { lessonId_who: { lessonId, who } }, select: { avatarId: true } });
    if (!role) throw new NotFoundException('Không có vai này trong bài');
    const key = await this.store(file, 'ROLE_AVATAR', `roles/${lessonId}-${who}-${rand()}`, adminId);
    try {
      await this.prisma.lessonRole.update({ where: { lessonId_who: { lessonId, who } }, data: { avatarId: key } });
    } catch (e) {
      await this.discard(key);
      throw e;
    }
    if (role.avatarId) await this.discard(role.avatarId);
    return { avatarUrl: mediaUrl(key, 'chat') };
  }

  // ───────────── Dùng chung ─────────────

  /** Kiểm tra loại file, thu nhỏ thành các cỡ, ghi lên R2, ghi sổ. Trả khóa gốc của ảnh. */
  private async store(file: Upload, kind: MediaKind, path: string, ownerId: string): Promise<string> {
    if (!file?.buffer?.length) throw new BadRequestException('Chưa chọn ảnh (gửi trường "file")');
    if (!sniffImage(file.buffer)) throw new BadRequestException('Chỉ nhận ảnh JPEG, PNG hoặc WebP');
    const variants = await makeVariants(file.buffer, VARIANTS_BY_KIND[kind]);

    const key = `${IMAGE_PREFIX}/${path}`;
    try {
      await Promise.all(variants.map((v) => this.storage.put(variantKey(key, v.preset), v.data, 'image/webp')));
    } catch (e) {
      await this.discard(key); // gỡ những cỡ đã lỡ ghi
      throw e;
    }
    const biggest = variants.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a));
    await this.prisma.mediaAsset.create({
      data: {
        publicId: key,
        kind,
        ownerId,
        bytes: variants.reduce((n, v) => n + v.data.length, 0),
        width: biggest.width,
        height: biggest.height,
        format: 'webp',
      },
    });
    return key;
  }

  /** Xóa mọi cỡ của một ảnh và dòng ghi sổ. */
  private async discard(key: string) {
    await this.storage.deleteMany(ALL_PRESETS.map((p) => variantKey(key, p)));
    await this.prisma.mediaAsset.deleteMany({ where: { publicId: key } });
  }
}

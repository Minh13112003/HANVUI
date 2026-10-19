import { Controller, Delete, HttpCode, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, Roles, type AuthUser } from '../auth/auth.decorators.js';
import { MAX_AVATAR_BYTES, MAX_COVER_BYTES } from './image.js';
import { MediaService } from './media.service.js';

// Tải ảnh tốn tài nguyên: giới hạn riêng 10 lần mỗi phút.
@Throttle({ default: { limit: 10, ttl: 60_000 } })
@Controller()
export class MediaController {
  constructor(private readonly media: MediaService) {}

  /** Đổi ảnh đại diện của chính mình. Gửi multipart/form-data, trường "file" (JPEG/PNG/WebP, tối đa 2MB). */
  @HttpCode(200)
  @Post('users/me/avatar')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_AVATAR_BYTES, files: 1 } }))
  setAvatar(@CurrentUser() u: AuthUser, @UploadedFile() file?: Express.Multer.File) {
    return this.media.setAvatar(u.id, file);
  }

  @HttpCode(204)
  @Delete('users/me/avatar')
  async removeAvatar(@CurrentUser() u: AuthUser) {
    await this.media.removeAvatar(u.id);
  }

  /** [ADMIN] Ảnh bối cảnh của hội thoại (tối đa 5MB). */
  @Roles('ADMIN')
  @HttpCode(200)
  @Post('admin/lessons/:id/cover')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_COVER_BYTES, files: 1 } }))
  setCover(@CurrentUser() u: AuthUser, @Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.media.setLessonCover(u.id, id, file);
  }

  /** [ADMIN] Ảnh nhân vật (vai A, B, N...) hiện trong khung chat (tối đa 2MB). */
  @Roles('ADMIN')
  @HttpCode(200)
  @Post('admin/lessons/:id/roles/:who/avatar')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_AVATAR_BYTES, files: 1 } }))
  setRoleAvatar(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Param('who') who: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.media.setRoleAvatar(u.id, id, who, file);
  }
}

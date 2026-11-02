import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../auth/auth.decorators.js';
import { AdminLessonsService } from './admin-lessons.service.js';
import { FlagDto } from './admin-lessons.dto.js';

/** Thân yêu cầu thêm/sửa bài do parseDraft kiểm tra (gom hết lỗi một lần), không qua ValidationPipe. */
@Roles('ADMIN')
@Controller('admin/lessons')
export class AdminLessonsController {
  constructor(private readonly lessons: AdminLessonsService) {}

  @Get()
  list() {
    return this.lessons.list();
  }

  @HttpCode(200)
  @Post('preview')
  preview(@Body() body: Record<string, unknown>) {
    return this.lessons.preview(body);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.lessons.create(body);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.lessons.detail(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.lessons.update(id, body);
  }

  @Patch(':id/published')
  published(@Param('id') id: string, @Body() dto: FlagDto) {
    return this.lessons.setPublished(id, dto.value);
  }

  @Patch(':id/reviewed')
  reviewed(@Param('id') id: string, @Body() dto: FlagDto) {
    return this.lessons.setReviewed(id, dto.value);
  }

  /** Tạo âm thanh cho một câu còn thiếu; trình duyệt gọi lặp lại (mỗi câu cách nhau khoảng 3 giây). */
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  @HttpCode(200)
  @Post(':id/audio')
  audio(@Param('id') id: string) {
    return this.lessons.audioNext(id);
  }
}

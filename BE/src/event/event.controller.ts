import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsBoolean, IsString, Length, MaxLength } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { EventService } from './event.service.js';

class GuessDto {
  @IsString() @MaxLength(60) lessonId!: string;
  @IsString() @Length(1, 40) answer!: string;
}

class OptDto {
  @IsBoolean() out!: boolean;
}

@Controller('event')
export class EventController {
  constructor(private readonly event: EventService) {}

  /** Gọi mỗi lần mở app (một lần mỗi ngày có hiệu lực): ghi đăng nhập, cộng lượt. */
  @HttpCode(200)
  @Post('checkin')
  checkin(@CurrentUser() u: AuthUser) {
    return this.event.checkin(u.id);
  }

  /** Gọi định kỳ khi người dùng đang thao tác, để tính thời gian online. */
  @HttpCode(200)
  @Post('ping')
  ping(@CurrentUser() u: AuthUser) {
    return this.event.ping(u.id);
  }

  @Get()
  state(@CurrentUser() u: AuthUser) {
    return this.event.state(u.id);
  }

  /** Tiến độ nhiệm vụ ngày (thẻ "Nhiệm vụ hôm nay"). */
  @Get('today')
  today(@CurrentUser() u: AuthUser) {
    return this.event.today(u.id);
  }

  @HttpCode(200)
  @Post('slots/:slotId/hint')
  hint(@CurrentUser() u: AuthUser, @Param('slotId', ParseIntPipe) slotId: number) {
    return this.event.openHint(u.id, slotId);
  }

  // Chống dò: thêm giới hạn tần suất ngoài luật phạt đoán sai.
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @HttpCode(200)
  @Post('guess')
  guess(@CurrentUser() u: AuthUser, @Body() dto: GuessDto) {
    return this.event.guess(u.id, dto.lessonId, dto.answer);
  }

  @HttpCode(200)
  @Post('opt-out')
  optOut(@CurrentUser() u: AuthUser, @Body() dto: OptDto) {
    return this.event.setOptOut(u.id, dto.out);
  }

  @Get('leaderboard')
  leaderboard(@CurrentUser() u: AuthUser) {
    return this.event.leaderboard(u.id);
  }

  @Get('inventory')
  inventory(@CurrentUser() u: AuthUser) {
    return this.event.inventory(u.id);
  }

  @HttpCode(200)
  @Post('inventory/:id/open')
  openItem(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.event.openItem(u.id, id);
  }
}

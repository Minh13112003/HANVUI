import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CurrentUser, Roles, type AuthUser } from '../auth/auth.decorators.js';
import { ListMailQuery, SendMailDto } from './mail.dto.js';
import { MailService } from './mail.service.js';

/** Hộp thư (tab Tài khoản). */
@Controller('mailbox')
export class MailController {
  constructor(private readonly mail: MailService) {}

  /** ?sender=ADMIN|SYSTEM &reward=true|false &unread=true &page=1 */
  @Get()
  list(@CurrentUser() u: AuthUser, @Query() q: ListMailQuery) {
    return this.mail.list(u.id, q);
  }

  /** Chấm đỏ: số thư chưa đọc, số thư còn quà chưa nhận. */
  @Get('counts')
  counts(@CurrentUser() u: AuthUser) {
    return this.mail.counts(u.id);
  }

  @HttpCode(200)
  @Post('read-all')
  readAll(@CurrentUser() u: AuthUser) {
    return this.mail.readAll(u.id);
  }

  @HttpCode(200)
  @Post('claim-all')
  claimAll(@CurrentUser() u: AuthUser) {
    return this.mail.claimAll(u.id);
  }

  @Get(':id')
  read(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.mail.read(u.id, id);
  }

  @HttpCode(200)
  @Post(':id/claim')
  claim(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.mail.claim(u.id, id);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    await this.mail.remove(u.id, id);
  }
}

/** Quản trị gửi thư. */
@Roles('ADMIN')
@Controller('admin/mails')
export class AdminMailController {
  constructor(private readonly mail: MailService) {}

  @Post()
  send(@CurrentUser() u: AuthUser, @Body() dto: SendMailDto) {
    return this.mail.adminSend(u.id, dto);
  }

  @Get()
  list() {
    return this.mail.adminList();
  }
}

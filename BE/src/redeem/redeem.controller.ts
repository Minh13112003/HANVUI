import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsString, Length } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { RedeemService } from './redeem.service.js';

class RedeemDto {
  @IsString() @Length(1, 40) code!: string;
}

@Controller('redeem')
export class RedeemController {
  constructor(private readonly redeem: RedeemService) {}

  /** Nhập mã quà (chống dò mã: 10 lần/phút). */
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post()
  use(@CurrentUser() u: AuthUser, @Body() dto: RedeemDto) {
    return this.redeem.redeem(u.id, dto.code);
  }
}

import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ArrayMaxSize, IsArray, IsInt, IsOptional } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { CoreTopicsService } from './core-topics.service.js';

class SaveCoreDto {
  @IsOptional() @IsArray() @ArrayMaxSize(200) @IsInt({ each: true }) wordIds?: number[];
}

@Controller('core-topics')
export class CoreTopicsController {
  constructor(private readonly core: CoreTopicsService) {}

  @Get()
  list(@CurrentUser() u: AuthUser) {
    return this.core.list(u.id);
  }

  @Get(':id')
  detail(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.core.detail(u.id, id);
  }

  @Get(':id/speak')
  speak(@Param('id') id: string) {
    return this.core.speak(id);
  }

  @HttpCode(200)
  @Post(':id/save')
  save(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body() dto: SaveCoreDto) {
    return this.core.save(u.id, id, dto.wordIds);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { GrammarService } from './grammar.service.js';

@Controller('grammar')
export class GrammarController {
  constructor(private readonly grammar: GrammarService) {}

  @Get()
  list(@CurrentUser() u: AuthUser) {
    return this.grammar.list(u.id);
  }

  @Get(':slug')
  detail(@CurrentUser() u: AuthUser, @Param('slug') slug: string) {
    return this.grammar.detail(u.id, slug);
  }
}

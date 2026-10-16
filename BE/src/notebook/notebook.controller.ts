import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { ListNotebookQuery, SaveWordDto } from './notebook.dto.js';
import { NotebookService } from './notebook.service.js';

@Controller('notebook')
export class NotebookController {
  constructor(private readonly notebook: NotebookService) {}

  @Get()
  list(@CurrentUser() u: AuthUser, @Query() q: ListNotebookQuery) {
    return this.notebook.list(u.id, q.view ?? 'day', q.q);
  }

  @Post()
  save(@CurrentUser() u: AuthUser, @Body() dto: SaveWordDto) {
    return this.notebook.save(u.id, dto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    await this.notebook.remove(u.id, id);
  }
}

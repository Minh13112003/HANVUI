import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service.js';
import { EventController } from './event.controller.js';
import { EventService } from './event.service.js';
import { MissionService } from './mission.service.js';

@Module({
  controllers: [EventController],
  providers: [EventService, MissionService, ArchiveService],
  exports: [EventService, MissionService],
})
export class EventModule {}

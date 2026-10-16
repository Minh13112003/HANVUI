import { Module } from '@nestjs/common';
import { EventController } from './event.controller.js';
import { EventService } from './event.service.js';
import { MissionService } from './mission.service.js';

@Module({
  controllers: [EventController],
  providers: [EventService, MissionService],
  exports: [EventService],
})
export class EventModule {}

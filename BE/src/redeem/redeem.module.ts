import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module.js';
import { RedeemController } from './redeem.controller.js';
import { RedeemService } from './redeem.service.js';

@Module({ imports: [EventModule], controllers: [RedeemController], providers: [RedeemService] })
export class RedeemModule {}

import { Module } from '@nestjs/common';
import { VocabTestController } from './vocab-test.controller.js';
import { VocabTestService } from './vocab-test.service.js';

@Module({ controllers: [VocabTestController], providers: [VocabTestService] })
export class VocabTestModule {}

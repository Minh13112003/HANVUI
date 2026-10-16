import { Global, Module } from '@nestjs/common';
import { Clock } from './time.js';

@Global()
@Module({ providers: [Clock], exports: [Clock] })
export class CommonModule {}

import { Module } from '@nestjs/common';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { ObjectStorage } from './object-storage.service.js';

@Module({ controllers: [MediaController], providers: [ObjectStorage, MediaService], exports: [ObjectStorage] })
export class MediaModule {}

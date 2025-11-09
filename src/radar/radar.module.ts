import { Module } from '@nestjs/common';
import { RadarController } from './radar.controller';
import { RadarService } from './radar.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [RadarController],
  providers: [RadarService, ConfigService],
})
export class RadarModule {}

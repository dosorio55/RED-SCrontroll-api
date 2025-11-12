import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RadarModule } from './radar/radar.module';

@Module({
  imports: [ConfigModule.forRoot(), RadarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

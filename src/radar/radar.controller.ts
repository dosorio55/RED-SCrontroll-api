import { Body, Controller, Get, Post } from '@nestjs/common';
import { RadarService } from './radar.service';

@Controller('radar')
export class RadarController {
  constructor(private readonly radarService: RadarService) {}

  @Get()
  get(): string {
    return this.radarService.get();
  }

  @Post()
  post(@Body() body: any): string {
    return this.radarService.post(body);
  }
}

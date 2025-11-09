import { Body, Controller, Get, Post } from '@nestjs/common';
import { RadarService } from './radar.service';
import { ScanRequestDto } from './dto/scan-request.dto';
import Candidate from './types/candidate.type';

@Controller('radar')
export class RadarController {
  constructor(private readonly radarService: RadarService) {}

  @Get()
  get(): string {
    return this.radarService.get();
  }

  @Post()
  post(@Body() body: ScanRequestDto): Candidate[] {
    return this.radarService.post(body);
  }
}

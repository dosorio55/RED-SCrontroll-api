import { Body, Injectable } from '@nestjs/common';

@Injectable()
export class RadarService {
  get(): string {
    return 'The radar is set and ready to LAUNCH!';
  }

  post(scanRequest: any): string {
    return 'The radar is set and ready to LAUNCH!';
  }
}

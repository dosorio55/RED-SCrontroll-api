import { Injectable } from '@nestjs/common';
import { ScanRequestDto } from './dto/scan-request.dto';
import { CandidateFactory } from './services/candidate.factory';
import { ProtocolEngineService } from './services/protocol-engine.service';
import type RadarResponse from './types/radar-response.type';

@Injectable()
export class RadarService {
  constructor(
    private readonly factory: CandidateFactory,
    private readonly engine: ProtocolEngineService,
  ) {}

  get(): string {
    return 'The radar is set and ready to LAUNCH!';
  }

  post(scanRequest: ScanRequestDto): RadarResponse {
    const candidates = this.factory.fromScanRequest(scanRequest);
    const result = this.engine.run(scanRequest.protocols, candidates);

    return result && result.length > 0
      ? {
          x: result[0].coordinates[0],
          y: result[0].coordinates[1],
        }
      : {};
  }
}

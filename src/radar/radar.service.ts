import { Injectable } from '@nestjs/common';
import { ScanRequestDto } from './dto/scan-request.dto';
import Candidate from './types/candidate.type';
import { CandidateFactory } from './services/candidate.factory';
import { ProtocolEngineService } from './services/protocol-engine.service';

@Injectable()
export class RadarService {
  constructor(
    private readonly factory: CandidateFactory,
    private readonly engine: ProtocolEngineService,
  ) {}

  get(): string {
    return 'The radar is set and ready to LAUNCH!';
  }

  post(scanRequest: ScanRequestDto): Candidate[] {
    const candidates = this.factory.fromScanRequest(scanRequest);
    const result = this.engine.run(scanRequest.protocols, candidates);

    return result;
  }
}

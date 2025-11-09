import { Protocol } from '../types/protocol.enum';

export class ScanRequestDto {
  protocols: Protocol[];
  scan: {
    coordinates: {
      x: number;
      y: number;
    };
    allies?: number;
    enemies?: {
      type: string;
      number: number;
    };
  }[];
}

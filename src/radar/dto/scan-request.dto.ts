export class ScanRequestDto {
  protocols: string[];
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

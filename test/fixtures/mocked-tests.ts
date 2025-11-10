import * as fs from 'fs';
import * as path from 'path';
import type RadarResponse from '../../src/radar/types/radar-response.type';
import { ScanRequestDto } from '../../src/radar/dto/scan-request.dto';

export interface MockedCase {
  request: ScanRequestDto;
  expected: RadarResponse;
}

export function loadMockedCases(): MockedCase[] {
  const jsonPath = path.join(__dirname, '..', 'mocked.tests.json');

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Mocked test cases file not found: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');

  try {
    return JSON.parse(raw) as MockedCase[];
  } catch (error) {
    throw new Error(
      `Failed to parse mocked test cases: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

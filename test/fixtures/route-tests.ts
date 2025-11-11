import * as fs from 'fs';
import * as path from 'path';
import RouteRequestDto from '../../src/route/dto/route-request.dto';

export interface RouteTestCase {
  request: RouteRequestDto;
  expectedResponse: number[][];
}

export function loadRouteTestCases(): RouteTestCase[] {
  const jsonPath = path.join(__dirname, '..', 'route-test-cases.json');

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Route test cases file not found: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');

  try {
    return JSON.parse(raw) as RouteTestCase[];
  } catch (error) {
    throw new Error(
      `Failed to parse route test cases: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

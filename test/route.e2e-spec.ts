import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { loadRouteTestCases } from './fixtures/route-tests';

describe('RouteController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/route (POST) processes all test scenarios correctly', async () => {
    const cases = loadRouteTestCases();

    expect(cases.length).toBeGreaterThan(0);

    for (let i = 0; i < cases.length; i++) {
      const testCase = cases[i];

      await request(app.getHttpServer())
        .post('/route')
        .send(testCase.request)
        .expect(200)
        .expect(testCase.expectedResponse);
    }
  });

  it('/route (POST) returns empty array when no radar data provided', () => {
    const emptyRequest = { position: [0, 0], radar: [] };
    const expectedResponse = [];

    return request(app.getHttpServer())
      .post('/route')
      .send(emptyRequest)
      .expect(200)
      .expect(expectedResponse);
  });
});

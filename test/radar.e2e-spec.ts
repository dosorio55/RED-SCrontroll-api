import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { loadMockedCases } from './fixtures/mocked-tests';

describe('RadarController (e2e)', () => {
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

  it('/radar (GET)', () => {
    return request(app.getHttpServer())
      .get('/radar')
      .expect(200)
      .expect('The radar is set and ready to LAUNCH!');
  });

  it('/radar (POST) processes all mocked test scenarios correctly', async () => {
    const cases = loadMockedCases();

    expect(cases.length).toBeGreaterThan(0);

    for (let i = 0; i < cases.length; i++) {
      const mockedCase = cases[i];

      await request(app.getHttpServer())
        .post('/radar')
        .send(mockedCase.request)
        .expect(200)
        .expect(mockedCase.expected);
    }
  });

  it('/radar (POST) returns empty object when no scan data provided', () => {
    const emptyRequest = { protocols: [], scan: [] };
    const expectedResponse = {};

    return request(app.getHttpServer())
      .post('/radar')
      .send(emptyRequest)
      .expect(200)
      .expect(expectedResponse);
  });
});

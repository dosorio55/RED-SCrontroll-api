import { Module } from '@nestjs/common';
import { RadarController } from './radar.controller';
import { RadarService } from './radar.service';
import { ConfigService } from '@nestjs/config';
import { DistanceService } from './services/distance.service';
import { CandidateFactory } from './services/candidate.factory';
import { ProtocolOrderResolver } from './services/protocol-order.resolver';
import { ProtocolEngineService } from './services/protocol-engine.service';
import { ProtocolFilterService } from './services/protocol-filter.service';

import { ClosestEnemiesStrategy } from './strategies/closest-enemies.strategy';
import { FurthestEnemiesStrategy } from './strategies/furthest-enemies.strategy';
import { PROTOCOL_STRATEGY_MAP } from './strategies/strategy.tokens';
import { Protocol } from './types/protocol.enum';

@Module({
  controllers: [RadarController],
  providers: [
    RadarService,
    ConfigService,
    DistanceService,
    CandidateFactory,
    ProtocolOrderResolver,
    ProtocolEngineService,
    ProtocolFilterService,
    ClosestEnemiesStrategy,
    FurthestEnemiesStrategy,
    {
      provide: PROTOCOL_STRATEGY_MAP,
      useFactory: (
        closestEnemies: ClosestEnemiesStrategy,
        furthestEnemies: FurthestEnemiesStrategy,
      ) => ({
        [Protocol.ClosestEnemies]: closestEnemies,
        [Protocol.FurthestEnemies]: furthestEnemies,
      }),
      inject: [ClosestEnemiesStrategy, FurthestEnemiesStrategy],
    },
  ],
})
export class RadarModule {}

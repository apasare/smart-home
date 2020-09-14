import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { databaseConfig } from './database.config';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useClass: TypeOrmConfigService,
    }),
  ],
  exports: [ConfigModule.forFeature(databaseConfig)],
})
export class DatabaseModule {}

import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';

import { databaseConfig } from './database.config';

enum DatabaseTypeEnum {
  postgres = 'postgres',
  mysql = 'mysql',
  mariadb = 'mariadb',
  mongodb = 'mongodb',
  mssql = 'mssql',
  sap = 'sap',
  oracle = 'oracle',
  sqlite = 'sqlite',
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.dbConfig.type as DatabaseTypeEnum,
      host: this.dbConfig.host,
      port: +this.dbConfig.port,
      username: this.dbConfig.username,
      password: this.dbConfig.password,
      database: this.dbConfig.database,
      synchronize: this.dbConfig.synchronize,
      logging: false,
      autoLoadEntities: true,
      // dropSchema: this.dbConfig.dropSchema,
      // migrationsRun: this.dbConfig.migrationsRun,
      // migrations: this.dbConfig.migrations,
      // subscribers: this.dbConfig.subscribers,
      // entities: this.dbConfig.entities,
    };
  }
}

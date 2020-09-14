import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: process.env.TYPEORM_TYPE,
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || false,
  dropSchema: process.env.TYPEORM_DROP_SCHEMA === 'true' || false,
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true' || false,
  migrations: process.env.TYPEORM_MIGRATIONS
    ? process.env.TYPEORM_MIGRATIONS.split('|')
    : [],
  subscribers: process.env.TYPEORM_SUBSCRIBERS
    ? process.env.TYPEORM_SUBSCRIBERS.split('|')
    : [],
  entities: process.env.TYPEORM_ENTITIES
    ? process.env.TYPEORM_ENTITIES.split('|')
    : [],
}));

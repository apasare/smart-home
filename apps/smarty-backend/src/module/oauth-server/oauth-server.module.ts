import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger';
import { OAuthController } from './controller';

@Module({
  imports: [LoggerModule],
  controllers: [OAuthController],
})
export class OAuthServerModule {}

import { Module } from '@nestjs/common';
import { OAuthController } from './controller';

@Module({
  controllers: [OAuthController],
})
export class OAuthServerModule {}

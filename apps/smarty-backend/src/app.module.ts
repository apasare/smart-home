import { Module } from '@nestjs/common';

import { AppConfigModule } from './module/app-config';
import { HelloModule } from './module/hello';
import { OAuthServerModule } from './module/oauth-server';
import { GActionModule } from './module/gaction';
import { DaikinModule } from './module/daikin/daikin.module';

@Module({
  imports: [
    AppConfigModule,
    HelloModule,
    OAuthServerModule,
    GActionModule,
    DaikinModule,
  ],
})
export class AppModule {}

import { FactoryProvider } from '@nestjs/common';
import * as OAuth2Server from 'oauth2-server';
import { OAuth2ModelService } from './service';

export const OAUTH2_SERVER_TOKEN = 'OAUTH2_SERVER_TOKEN';

export const oauth2ServerProvider: FactoryProvider = {
  provide: OAUTH2_SERVER_TOKEN,
  useFactory: (model: OAuth2ModelService) => {
    return new OAuth2Server({
      model,
    });
  },
  inject: [OAuth2ModelService],
};

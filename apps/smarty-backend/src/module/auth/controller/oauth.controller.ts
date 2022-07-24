import {
  Controller,
  Get,
  Query,
  Res,
  Post,
  Body,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import * as OAuth2Server from 'oauth2-server';

import { LoggerService } from '../../logger';
import { AuthorizationRequestDTO } from '../dto';
import { OAUTH2_SERVER_TOKEN } from '../providers';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly logger: LoggerService,
    @Inject(OAUTH2_SERVER_TOKEN)
    private readonly oauth2Server: OAuth2Server,
  ) {
    this.logger.setContext(OAuthController.name);
  }

  @Get('auth')
  getAuth(
    @Query() query: AuthorizationRequestDTO,
    @Res() response: Response,
  ): void {
    this.logger.debug(query);
    // this.oauth2Server.authenticate()
    return response.redirect(
      `${query.redirect_uri}?code=fakecode&state=${query.state}`,
    );
  }

  @Post('token')
  postToken(@Body() body: unknown): unknown {
    this.logger.debug(body);
    return {
      token_type: 'Bearer',
      access_token: 'FAKE_ACCESS_TOKEN',
      refresh_token: 'FAKE_REFRESH_TOKEN',
      expires_in: 3600 * 24 * 7 * 365,
    };
  }
}

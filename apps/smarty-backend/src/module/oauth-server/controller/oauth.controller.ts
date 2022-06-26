import { Controller, Get, Query, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';

import { LoggerService } from '../../logger';
import { AuthorizationRequestDTO } from '../dto';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(OAuthController.name);
  }

  @Get('auth')
  getAuth(
    @Query() query: AuthorizationRequestDTO,
    @Res() response: Response,
  ): void {
    this.logger.debug(query);
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

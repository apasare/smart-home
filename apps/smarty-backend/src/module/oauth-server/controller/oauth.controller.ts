import { Controller, Get, Query, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';

interface AuthorizationRequestDTO {
  readonly response_type: string;
  readonly client_id: string;
  readonly redirect_uri: string;
  readonly state: string;
  readonly user_locale: string;
}

@Controller('oauth')
export class OAuthController {
  @Get('auth')
  getAuth(
    @Query() query: AuthorizationRequestDTO,
    @Res() response: Response,
  ): void {
    return response.redirect(
      `${query.redirect_uri}?code=fakecode&state=${query.state}`,
    );
  }

  @Post('token')
  postToken(@Body() body: unknown): unknown {
    return {
      token_type: 'Bearer',
      access_token: 'FAKE_ACCESS_TOKEN',
      refresh_token: 'FAKE_REFRESH_TOKEN',
      expires_in: 3600*24*7*365,
    };
  }
}

import { Injectable } from '@nestjs/common';
import {
  AuthorizationCode,
  AuthorizationCodeModel,
  Callback,
  Client,
  Falsey,
  RefreshToken,
  RefreshTokenModel,
  Token,
  User,
} from 'oauth2-server';
import { UserService } from './user.service';

@Injectable()
export class OAuth2ModelService
  implements AuthorizationCodeModel, RefreshTokenModel
{
  constructor(protected readonly userService: UserService) {}

  getRefreshToken(
    refreshToken: string,
    callback?: Callback<RefreshToken>,
  ): Promise<Falsey | RefreshToken> {
    throw new Error('Method not implemented.');
  }

  revokeToken(
    token: Token | RefreshToken,
    callback?: Callback<boolean>,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getClient(
    clientId: string,
    clientSecret: string,
    callback?: Callback<Client | Falsey>,
  ): Promise<Client | Falsey> {
    throw new Error('Method not implemented.');
  }

  saveToken(
    token: Token,
    client: Client,
    user: User,
    callback?: Callback<Token>,
  ): Promise<Falsey | Token> {
    throw new Error('Method not implemented.');
  }

  getAccessToken(
    accessToken: string,
    callback?: Callback<Token>,
  ): Promise<Falsey | Token> {
    throw new Error('Method not implemented.');
  }

  verifyScope(
    token: Token,
    scope: string | string[],
    callback?: Callback<boolean>,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  generateRefreshToken?(
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  generateAuthorizationCode?(
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getAuthorizationCode(
    authorizationCode: string,
    callback?: Callback<AuthorizationCode>,
  ): Promise<Falsey | AuthorizationCode> {
    throw new Error('Method not implemented.');
  }

  saveAuthorizationCode(
    code: Pick<
      AuthorizationCode,
      'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope'
    >,
    client: Client,
    user: User,
    callback?: Callback<AuthorizationCode>,
  ): Promise<Falsey | AuthorizationCode> {
    throw new Error('Method not implemented.');
  }

  revokeAuthorizationCode(
    code: AuthorizationCode,
    callback?: Callback<boolean>,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  validateScope?(
    user: User,
    client: Client,
    scope: string | string[],
    callback?: Callback<string | false | 0>,
  ): Promise<string | false | 0 | string[]> {
    throw new Error('Method not implemented.');
  }

  generateAccessToken?(
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

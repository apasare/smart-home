import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '../logger';
import { OAuthController } from './controller';
import { AuthController } from './controller/auth.controller';
import { OauthClient, User } from './entity';
import { oauth2ServerProvider } from './providers';
import {
  AuthService,
  JwtOptionsService,
  OAuth2ModelService,
  UserService,
} from './service';
import { JwtStrategy, LocalStrategy } from './strategy';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { authConfig } from './auth.config';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([User, OauthClient]),
    PassportModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      useClass: JwtOptionsService,
    }),
  ],
  providers: [
    oauth2ServerProvider,
    OAuth2ModelService,
    UserService,
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [UserService],
  controllers: [AuthController, OAuthController],
})
export class AuthModule {}

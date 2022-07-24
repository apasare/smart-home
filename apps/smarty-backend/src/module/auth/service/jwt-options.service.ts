import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { authConfig } from '../auth.config';

export class JwtOptionsService implements JwtOptionsFactory {
  constructor(
    @Inject(authConfig.KEY)
    protected readonly config: ConfigType<typeof authConfig>,
  ) {}

  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: this.config.jwtSecret,
      signOptions: { expiresIn: this.config.jwtExpiresIn },
    };
  }
}

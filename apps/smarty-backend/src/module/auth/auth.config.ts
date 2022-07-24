import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  passwordHmacKey: process.env.AUTH_PASSWORD_HMAC_KEY,
  jwtSecret: process.env.AUTH_JWT_SECRET,
  jwtExpiresIn: process.env.AUTH_JWT_EXPIRES_IN || '60s',
}));

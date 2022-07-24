import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayloadDTO } from '../dto';
import { User } from '../entity';

@Injectable()
export class AuthService {
  constructor(protected jwtService: JwtService) {}

  async login(user: User) {
    const payload: JwtPayloadDTO = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import { createHmac } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';

import { User } from '../entity';
import { authConfig } from '../auth.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
    @Inject(authConfig.KEY)
    protected readonly config: ConfigType<typeof authConfig>,
  ) {}

  protected hash(text: string): string {
    const hmac = createHmac('sha256', this.config.passwordHmacKey);
    hmac.update(text);
    return hmac.digest('hex');
  }

  async findById(id: string) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOneBy({
      username,
    });
  }

  async findByUsernameAndPassword(username: string, password: string) {
    return this.userRepository.findOneBy({
      username,
      password: this.hash(password),
    });
  }

  async register(username: string, password: string) {
    const user = new User();
    user.username = username;
    user.password = this.hash(password);

    return this.userRepository.save(user);
  }
}

import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guard';
import { UserService } from '../../auth/service';
import { HelloService } from '../service/hello.service';

@Controller()
export class HelloController {
  constructor(
    private readonly appService: HelloService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getHello(): Promise<unknown> {
    // await this.userService.register('alex', 'alex');
    return { message: this.appService.getHello() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

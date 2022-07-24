import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guard';
import { HelloService } from '../service/hello.service';

@Controller()
export class HelloController {
  constructor(private readonly appService: HelloService) {}

  @Get()
  async getHello(): Promise<unknown> {
    return { message: this.appService.getHello() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

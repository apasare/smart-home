import { Controller, Get } from '@nestjs/common';
import { HelloService } from '../service/hello.service';

@Controller()
export class HelloController {
  constructor(private readonly appService: HelloService) {}

  @Get()
  getHello(): unknown {
    return { message: this.appService.getHello() };
  }
}

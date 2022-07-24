import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { HelloController } from './controller';
import { HelloService } from './service';

@Module({
  imports: [AuthModule],
  controllers: [HelloController],
  providers: [HelloService]
})
export class HelloModule {}

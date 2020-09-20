import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceController } from './controller';
import { Device } from './entity';
import { QueryIntentHandler, SyncIntentHandler } from './gaction';
import { ExecuteIntentHandler } from './gaction/execute-intent-handler';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [QueryIntentHandler, SyncIntentHandler, ExecuteIntentHandler],
  controllers: [DeviceController],
})
export class HomeModule {}

import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceController } from './controller';
import { Device } from './entity';
import { QueryIntentHandler, SyncIntentHandler } from './gaction';
import { ExecuteIntentHandler } from './gaction/execute-intent-handler';
import { ExplorerService, DeviceAdaptersRegister } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [
    ExplorerService,
    DeviceAdaptersRegister,
    QueryIntentHandler,
    SyncIntentHandler,
    ExecuteIntentHandler,
  ],
  controllers: [DeviceController],
})
export class HomeModule implements OnApplicationBootstrap {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly deviceAdapterRegister: DeviceAdaptersRegister,
  ) {}

  onApplicationBootstrap(): void {
    const { deviceAdapters } = this.explorerService.explore();
    this.deviceAdapterRegister.register(deviceAdapters);
  }
}

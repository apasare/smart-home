import { Type } from '@nestjs/common';

import { DeviceAdapterInterface } from './device-adapter.interface';

export interface HomeOptions {
  readonly deviceAdapters: Type<DeviceAdapterInterface>[];
}

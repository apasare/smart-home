import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { DEVICE_ADAPTER_METADATA } from '../constants';
import { Device } from '../entity';
import { DeviceAdapterInterface } from '../interface';

@Injectable()
export class DeviceAdaptersRegister {
  protected deviceAdapters: Map<
    string,
    Type<DeviceAdapterInterface>
  > = new Map();

  public constructor(private readonly moduleRef: ModuleRef) {}

  public registerAdapter(adapterRef: Type<DeviceAdapterInterface>): this {
    const adapterKey = Reflect.getMetadata(DEVICE_ADAPTER_METADATA, adapterRef);
    if (!adapterKey) {
      return this;
    }
    if (this.deviceAdapters.has(adapterKey)) {
      throw new Error(`Adapter key "${adapterKey}" already used.`);
    }
    this.deviceAdapters.set(adapterKey, adapterRef);

    return this;
  }

  public register(deviceAdapters: Type<DeviceAdapterInterface>[]): this {
    for (const deviceAdapter of deviceAdapters) {
      this.registerAdapter(deviceAdapter);
    }
    return this;
  }

  public async getAdapter<T>(device: Device): Promise<DeviceAdapterInterface> {
    const adapterRef = this.deviceAdapters.get(device.adapter);
    const adapter = await this.moduleRef.resolve(adapterRef, undefined, {
      strict: false,
    });
    adapter.setDevice(device);
    return adapter;
  }
}

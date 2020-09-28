import { Scope } from '@nestjs/common';
import { SCOPE_OPTIONS_METADATA } from '@nestjs/common/constants';
import { DEVICE_ADAPTER_METADATA } from './constants';

export const DeviceAdapter = (key: string): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: object): void => {
    Reflect.defineMetadata(DEVICE_ADAPTER_METADATA, key, target);
    Reflect.defineMetadata(
      SCOPE_OPTIONS_METADATA,
      { scope: Scope.TRANSIENT },
      target,
    );
  };
};

import {
  ExecuteIntentResponseCommand,
  IntentCommandExecution,
  IntentPayloadDevice,
  QueryIntentResponseDevice,
  SyncIntentResponseDevice,
} from '../../gaction';
import { Device } from '../entity';

export interface DeviceAdapterInterface {
  setDevice(device: Device): this;
  onSync(): Promise<SyncIntentResponseDevice>;

  onQuery(
    payloadDevice: IntentPayloadDevice,
  ): Promise<
    QueryIntentResponseDevice & Record<string, string | boolean | number>
  >;

  onExecute(
    execution: IntentCommandExecution,
  ): Promise<ExecuteIntentResponseCommand>;
}

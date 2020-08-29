export const INTENT_SYNC = 'action.devices.SYNC';
export const INTENT_QUERY = 'action.devices.QUERY';
export const INTENT_EXECUTE = 'action.devices.EXECUTE';
export const INTENT_DISCONNECT = 'action.devices.DISCONNEC';

export class IntentPayloadDevice {
  readonly id: string;
  readonly customData: Record<string, string | number | boolean>;
}

export class IntentPayloadDevices {
  readonly devices: IntentPayloadDevice[];
}

export class IntentCommandExecution {
  readonly command: string;
  readonly params: Record<string, string | number | boolean>;
}

export class IntentPayloadCommands {
  readonly devices: IntentPayloadDevices;
  readonly execution: IntentCommandExecution[];
}

export class SyncIntent {
  readonly intent: typeof INTENT_SYNC;
}

export class QueryIntent {
  readonly intent: typeof INTENT_QUERY;
  readonly payload: IntentPayloadDevices;
}

export class ExecuteIntent {
  readonly intent: typeof INTENT_EXECUTE;
  readonly payload: IntentPayloadCommands[];
}

export class IntentRequestDTO<T = SyncIntent | QueryIntent> {
  readonly requestId: string;
  readonly inputs: T[];
}

export class SyncIntentDeviceName {
  readonly defaultNames?: string[];
  readonly name: string;
  readonly nicknames?: string[];
}

export class SyncIntentDeviceInfo {
  readonly manufacturer?: string;
  readonly model?: string;
  readonly hwVersion?: string;
  readonly swVersion?: string;
}

export class SyncIntentOtherDeviceId {
  readonly agentId?: string;
  readonly deviceId?: string;
}

export class SyncIntentResponseDevice {
  readonly id: string;
  // @TODO: make it an enum
  readonly type: string;
  // @TODO: make it an enum[]
  readonly traits: string[];
  readonly name: SyncIntentDeviceName;
  readonly willReportState: boolean;
  readonly roomHint?: string;
  readonly deviceInfo?: SyncIntentDeviceInfo;
  // @TODO: better typing
  readonly attributes?: Record<string, unknown>;
  // @TODO: better typing
  readonly customData?: Record<string, unknown>;
  readonly otherDeviceIds?: SyncIntentOtherDeviceId;
}

export enum DeviceStatus {
  SUCCESS = 'SUCCESS',
  OFFLINE = 'OFFLINE',
  EXCEPTIONS = 'EXCEPTIONS',
  ERROR = 'ERROR',
}

export class QueryIntentResponseDevice {
  readonly status: DeviceStatus;
  readonly online: boolean;
  readonly errorCode?: string;
  readonly debugString?: string;
}

export class QueryIntentResponseDevices<T = Record<string, unknown>> {
  [id: string]: QueryIntentResponseDevice & T;
}

class IntentResponsePayload {
  readonly errorCode?: string;
  readonly debugString?: string;
}

export class SyncIntentResponsePayload extends IntentResponsePayload {
  readonly agentUserId: string;
  readonly devices: SyncIntentResponseDevice[];
}

export class QueryIntentResponsePayload<
  T = Record<string, unknown>
> extends IntentResponsePayload {
  readonly devices: QueryIntentResponseDevices<T>;
}

export class IntentResponseDTO<
  T = SyncIntentResponsePayload | QueryIntentResponsePayload
> {
  readonly requestId: string;
  readonly payload: T;
}

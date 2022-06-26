// intents
export const INTENT_SYNC = 'action.devices.SYNC';
export const INTENT_QUERY = 'action.devices.QUERY';
export const INTENT_EXECUTE = 'action.devices.EXECUTE';
export const INTENT_DISCONNECT = 'action.devices.DISCONNECT';

// commands
export const COMMAND_ONOFF = 'action.devices.commands.OnOff';
export const THERMOSTAT_SET_MODE = 'action.devices.commands.ThermostatSetMode';

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

export class IntentPayloadCommand extends IntentPayloadDevices {
  readonly execution: IntentCommandExecution[];
}

export class IntentPayloadCommands {
  commands: IntentPayloadCommand[];
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
  readonly payload: IntentPayloadCommands;
}

export class IntentRequestDTO<T = SyncIntent | QueryIntent | ExecuteIntent> {
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

export class QueryIntentResponseDevices<
  T = Record<string, string | number | boolean>,
> {
  [id: string]: QueryIntentResponseDevice & T;
}

export class ExecuteIntentStates {
  online: boolean;
  [id: string]: string | number | boolean;
}

export class ExecuteIntentResponseCommand {
  readonly ids: string[];
  readonly status: DeviceStatus;
  readonly errorCode?: string;
  readonly debugString?: string;
  readonly states?: ExecuteIntentStates;
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
  T = Record<string, unknown>,
> extends IntentResponsePayload {
  devices: QueryIntentResponseDevices<T>;
}

export class ExecuteIntentResponsePayload extends IntentResponsePayload {
  readonly commands: ExecuteIntentResponseCommand[];
}

export class IntentResponseDTO<
  T =
    | SyncIntentResponsePayload
    | QueryIntentResponsePayload
    | ExecuteIntentResponsePayload,
> {
  readonly requestId: string;
  readonly payload: T;
}

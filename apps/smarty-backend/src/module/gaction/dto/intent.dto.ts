import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

// intents
export enum Intent {
  SYNC = 'action.devices.SYNC',
  QUERY = 'action.devices.QUERY',
  EXECUTE = 'action.devices.EXECUTE',
  DISCONNECT = 'action.devices.DISCONNECT',
}

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

export interface IntentDTO {
  readonly intent: Intent;
}

export class SyncIntentDTO implements IntentDTO {
  @ApiProperty({ type: Intent.SYNC, default: Intent.SYNC })
  readonly intent: typeof Intent.SYNC;
}

export function isSyncIntentDTO(intent: IntentDTO): intent is SyncIntentDTO {
  return intent.intent === Intent.SYNC;
}

export class QueryIntentDTO implements IntentDTO {
  @ApiProperty({ type: Intent.QUERY, default: Intent.QUERY })
  readonly intent: typeof Intent.QUERY;
  readonly payload: IntentPayloadDevices;
}

export function isQueryIntentDTO(intent: IntentDTO): intent is QueryIntentDTO {
  return intent.intent === Intent.QUERY;
}

export class ExecuteIntentDTO implements IntentDTO {
  @ApiProperty({ type: Intent.EXECUTE, default: Intent.EXECUTE })
  readonly intent: typeof Intent.EXECUTE;
  readonly payload: IntentPayloadCommands;
}

export function isExecuteIntentDTO(
  intent: IntentDTO,
): intent is ExecuteIntentDTO {
  return intent.intent === Intent.EXECUTE;
}

@ApiExtraModels(SyncIntentDTO, QueryIntentDTO, ExecuteIntentDTO)
export class IntentRequestDTO<T extends IntentDTO = IntentDTO> {
  readonly requestId: string;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SyncIntentDTO) },
        { $ref: getSchemaPath(QueryIntentDTO) },
        { $ref: getSchemaPath(ExecuteIntentDTO) },
      ],
    },
  })
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

export class QueryIntentResponseDevices {
  [id: string]: QueryIntentResponseDevice &
    Record<string, string | number | boolean>;
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

export class QueryIntentResponsePayload extends IntentResponsePayload {
  devices: QueryIntentResponseDevices;
}

export class ExecuteIntentResponsePayload extends IntentResponsePayload {
  readonly commands: ExecuteIntentResponseCommand[];
}

@ApiExtraModels(
  SyncIntentResponsePayload,
  QueryIntentResponsePayload,
  ExecuteIntentResponsePayload,
)
export class IntentResponseDTO<
  T extends IntentResponsePayload = IntentResponsePayload,
> {
  readonly requestId: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SyncIntentResponsePayload) },
      { $ref: getSchemaPath(QueryIntentResponsePayload) },
      { $ref: getSchemaPath(ExecuteIntentResponsePayload) },
    ],
  })
  readonly payload: T;
}

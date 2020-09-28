import { Client as DaikinClient, RET } from '@godvsdeity/daikin-controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IntentHandlerInterface } from '../../gaction/interface';
import {
  INTENT_EXECUTE,
  IntentRequestDTO,
  IntentResponseDTO,
  IntentHandler,
  ExecuteIntentResponsePayload,
  ExecuteIntent,
  ExecuteIntentResponseCommand,
  DeviceStatus,
} from '../../gaction';
import { Device } from '../entity';
import { DeviceAdaptersRegister } from '../service';

@IntentHandler()
export class ExecuteIntentHandler implements IntentHandlerInterface {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly deviceAdaptersRegister: DeviceAdaptersRegister,
  ) {}

  public canHandle(intentRequest: IntentRequestDTO): boolean {
    return (
      intentRequest.inputs[0] &&
      intentRequest.inputs[0].intent === INTENT_EXECUTE
    );
  }

  public async handle(
    intentRequest: IntentRequestDTO<ExecuteIntent>,
  ): Promise<IntentResponseDTO<ExecuteIntentResponsePayload>> {
    const commandsResult: ExecuteIntentResponseCommand[] = [];
    for (const command of intentRequest.inputs[0].payload.commands) {
      for (const execution of command.execution) {
        for (const device of command.devices) {
          try {
            const homeDevice = await this.deviceRepository.findOneOrFail(
              device.id,
            );
            const deviceAdapter = await this.deviceAdaptersRegister.getAdapter(
              homeDevice,
            );
            commandsResult.push(await deviceAdapter.onExecute(execution));
          } catch (error) {
            commandsResult.push({
              ids: [device.id],
              status: DeviceStatus.ERROR,
              errorCode: 'commandInsertFailed',
            });
          }
        }
      }
    }

    return {
      requestId: intentRequest.requestId,
      payload: {
        commands: commandsResult,
      },
    };
  }
}

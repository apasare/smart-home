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
  IntentPayloadDevice,
  DeviceStatus,
} from '../../gaction';
import { Device } from '../entity';

@IntentHandler()
export class ExecuteIntentHandler implements IntentHandlerInterface {
  private commands: Map<
    string,
    (
      commandParams: Record<string, string | number | boolean>,
      devices: IntentPayloadDevice[],
    ) => Promise<ExecuteIntentResponseCommand[]>
  > = new Map();

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {
    this.commands.set(
      'action.devices.commands.OnOff',
      async (
        commandParams: Record<string, string | number | boolean>,
        devices: IntentPayloadDevice[],
      ): Promise<ExecuteIntentResponseCommand[]> => {
        const commandsResult: ExecuteIntentResponseCommand[] = [];
        for (const device of devices) {
          try {
            const homeDevice = await this.deviceRepository.findOneOrFail(
              device.id,
            );
            const daikinClient = new DaikinClient(homeDevice.address);
            const controlInfo = await daikinClient.getControlInfo();

            const setControlInfoParams = new URLSearchParams([
              ...controlInfo.getData().entries(),
            ]);
            setControlInfoParams.set('pow', commandParams.on ? '1' : '0');
            const response = await daikinClient.setControlInfo(
              setControlInfoParams,
            );
            if (response.get('ret') !== RET.OK) {
              throw new Error();
            }

            commandsResult.push({
              ids: [device.id],
              status: DeviceStatus.SUCCESS,
              states: {
                online: true,
                on: commandParams.on,
              },
            });
          } catch (error) {
            console.log(error);
            commandsResult.push({
              ids: [device.id],
              status: DeviceStatus.OFFLINE,
              states: {
                online: false,
              },
            });
          }
        }

        return commandsResult;
      },
    );
  }

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
        const commandHandler = this.commands.get(execution.command);
        if (!commandHandler) {
          commandsResult.push({
            ids: command.devices.map(device => device.id),
            status: DeviceStatus.ERROR,
            errorCode: 'commandInsertFailed',
          });
          continue;
        }

        commandsResult.push(
          ...(await commandHandler(execution.params, command.devices)),
        );
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

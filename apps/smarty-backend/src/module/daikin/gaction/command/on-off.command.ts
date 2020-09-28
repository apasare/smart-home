import { Client as DaikinClient, RET } from '@godvsdeity/daikin-controller';
import { Injectable, Logger } from '@nestjs/common';

import {
  COMMAND_ONOFF,
  DeviceStatus,
  ExecuteIntentResponseCommand,
  GActionCommandInterface,
} from '../../../gaction';
import { Device } from '../../../home';

@Injectable()
export class OnOffCommand implements GActionCommandInterface {
  // TODO: refactor this, make it injectable
  private readonly logger: Logger = new Logger(OnOffCommand.name);

  public getName(): string {
    return COMMAND_ONOFF;
  }

  public async execute(
    homeDevice: Device,
    commandParams: Record<string, string | number | boolean>,
  ): Promise<ExecuteIntentResponseCommand> {
    try {
      const daikinClient = new DaikinClient(homeDevice.address);
      const controlInfo = await daikinClient.getControlInfo();

      const setControlInfoParams = new URLSearchParams([
        ...controlInfo.getData().entries(),
      ]);
      setControlInfoParams.set('pow', commandParams.on ? '1' : '0');
      const response = await daikinClient.setControlInfo(setControlInfoParams);
      if (response.get('ret') !== RET.OK) {
        throw new Error(`The request failed: "${response.get('ret')}".`);
      }

      return {
        ids: [homeDevice.id],
        status: DeviceStatus.SUCCESS,
        states: {
          online: true,
          on: commandParams.on,
        },
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      return {
        ids: [homeDevice.id],
        status: DeviceStatus.OFFLINE,
        states: {
          online: false,
        },
      };
    }
  }
}

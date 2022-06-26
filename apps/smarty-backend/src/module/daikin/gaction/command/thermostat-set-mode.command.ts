import { Injectable } from '@nestjs/common';

import {
  Client as DaikinClient,
  MODE,
  POWER,
  RET,
} from '@apasare/daikin-controller';

import {
  DeviceStatus,
  ExecuteIntentResponseCommand,
  GActionCommandInterface,
  ThermostatMode,
  THERMOSTAT_SET_MODE,
} from '../../../gaction';
import { Device } from '../../../home';
import { LoggerService } from '../../../logger';

@Injectable()
export class ThermostatSetModeCommand implements GActionCommandInterface {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(ThermostatSetModeCommand.name);
  }

  public getName(): string {
    return THERMOSTAT_SET_MODE;
  }

  protected getThermostatMode(gactionThermostatMode: string): string {
    switch (gactionThermostatMode) {
      case ThermostatMode.ON:
        return POWER.ON;
      case ThermostatMode.OFF:
        return POWER.OFF;
      case ThermostatMode.COOL:
        return MODE.COOL;
      case ThermostatMode.HEAT:
        return MODE.HEAT;
      case ThermostatMode.DRY:
        return MODE.DRY;
      case ThermostatMode.FAN_ONLY:
        return MODE.FAN;
      case ThermostatMode.AUTO:
        return MODE.AUTO;
      default:
        throw new Error(
          `Unsupported thermostat mode "${gactionThermostatMode}"`,
        );
    }
  }

  public async execute(
    homeDevice: Device,
    commandParams: Record<string, string>,
  ): Promise<ExecuteIntentResponseCommand> {
    try {
      const daikinClient = new DaikinClient(homeDevice.address);
      const controlInfo = await daikinClient.getControlInfo();

      const setControlInfoParams = new URLSearchParams([
        ...controlInfo.getData().entries(),
      ]);
      if (
        commandParams.thermostatMode === ThermostatMode.OFF ||
        commandParams.thermostatMode === ThermostatMode.ON
      ) {
        setControlInfoParams.set(
          'pow',
          this.getThermostatMode(commandParams.thermostatMode),
        );
      } else {
        setControlInfoParams.set('pow', POWER.ON);
        setControlInfoParams.set(
          'mode',
          this.getThermostatMode(commandParams.thermostatMode),
        );
      }

      const response = await daikinClient.setControlInfo(setControlInfoParams);
      if (response.get('ret') !== RET.OK) {
        throw new Error(`The request failed: "${response.get('ret')}".`);
      }

      const latestControlInfo = await daikinClient.getControlInfo();
      return {
        ids: [homeDevice.id],
        status: DeviceStatus.SUCCESS,
        states: {
          online: true,
          on: latestControlInfo.get('pow') === POWER.ON,
          thermostatMode: commandParams.thermostatMode,
        },
      };
    } catch (error) {
      this.logger.error(error);

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

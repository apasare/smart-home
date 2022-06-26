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
import { getDeviceThermostatMode } from '../../utils';

interface CommandParams {
  thermostatMode: ThermostatMode;
}

@Injectable()
export class ThermostatSetModeCommand implements GActionCommandInterface {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(ThermostatSetModeCommand.name);
  }

  public getName(): string {
    return THERMOSTAT_SET_MODE;
  }

  public async execute(
    homeDevice: Device,
    commandParams: CommandParams,
  ): Promise<ExecuteIntentResponseCommand> {
    try {
      const daikinClient = new DaikinClient(homeDevice.address);
      const controlInfo = await daikinClient.getControlInfo();

      const setControlInfoParams = new URLSearchParams([
        ...controlInfo.getData().entries(),
      ]);

      setControlInfoParams.set(
        'pow',
        commandParams.thermostatMode === ThermostatMode.OFF
          ? POWER.OFF
          : POWER.ON,
      );
      if (
        ![ThermostatMode.OFF, ThermostatMode.ON].includes(
          commandParams.thermostatMode,
        )
      ) {
        setControlInfoParams.set(
          'mode',
          getDeviceThermostatMode(commandParams.thermostatMode),
        );
      }

      const response = await daikinClient.setControlInfo(setControlInfoParams);
      if (response.get('ret') !== RET.OK) {
        throw new Error(`The request failed: "${response.get('ret')}".`);
      }

      const latestControlInfo = await daikinClient.getControlInfo();
      const sensorInfo = await daikinClient.getSensorInfo();
      return {
        ids: [homeDevice.id],
        status: DeviceStatus.SUCCESS,
        states: {
          online: true,
          on: latestControlInfo.get('pow') === POWER.ON,
          thermostatMode: commandParams.thermostatMode,
          activeThermostatMode: commandParams.thermostatMode,
          thermostatTemperatureSetpoint: parseFloat(controlInfo.get('stemp')),
          thermostatTemperatureAmbient: parseFloat(sensorInfo.get('htemp')),
          thermostatHumidityAmbient: parseFloat(sensorInfo.get('hhum')),
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

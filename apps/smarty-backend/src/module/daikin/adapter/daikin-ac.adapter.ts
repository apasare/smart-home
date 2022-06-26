import { Inject } from '@nestjs/common';

import {
  Client as DaikinClient,
  BasicInfo,
  FAN_SPEED,
  POWER,
  Response,
  IResponse,
  ControlInfo,
  MODE,
} from '@apasare/daikin-controller';

import {
  DeviceStatus,
  ExecuteIntentResponseCommand,
  IntentCommandExecution,
  IntentPayloadDevice,
  QueryIntentResponseDevice,
  SyncIntentResponseDevice,
  ThermostatMode,
} from '../../gaction';
import { Device, DeviceAdapter, DeviceAdapterInterface } from '../../home';
import { DAIKIN_GACTION_COMMANDS_TOKEN, GActionCommands } from '../providers';

@DeviceAdapter('daikin-ac')
export class DaikinACAdapter implements DeviceAdapterInterface {
  private device: Device;

  constructor(
    @Inject(DAIKIN_GACTION_COMMANDS_TOKEN)
    private readonly commands: GActionCommands,
  ) {}

  setDevice(device: Device): this {
    this.device = device;
    return this;
  }

  async onSync(): Promise<SyncIntentResponseDevice> {
    const basicInfo = new Response<BasicInfo>();
    basicInfo.setData(<[string, string][]>this.device.additionalData);

    return {
      id: this.device.id,
      type: 'action.devices.types.AC_UNIT',
      traits: [
        'action.devices.traits.OnOff',
        'action.devices.traits.FanSpeed',
        'action.devices.traits.TemperatureSetting',
      ],
      name: {
        name: this.device.name,
      },
      deviceInfo: {
        manufacturer: 'Daikin',
        swVersion: basicInfo.get('ver'),
      },
      roomHint: decodeURIComponent(basicInfo.get('grp_name')),
      willReportState: false,
      attributes: {
        availableFanSpeeds: {
          speeds: [
            {
              speed_name: FAN_SPEED.AUTO,
              speed_values: [
                {
                  speed_synonym: ['auto'],
                  lang: 'en',
                },
              ],
            },
            {
              speed_name: FAN_SPEED.QUIET,
              speed_values: [
                {
                  speed_synonym: ['quiet', 'night mode', 'quiet mode'],
                  lang: 'en',
                },
              ],
            },
            {
              speed_name: FAN_SPEED.LEVEL_1,
              speed_values: [
                {
                  speed_synonym: ['low', 'speed 1'],
                  lang: 'en',
                },
              ],
            },
            {
              speed_name: FAN_SPEED.LEVEL_2,
              speed_values: [
                {
                  speed_synonym: ['speed 2'],
                  lang: 'en',
                },
              ],
            },
            {
              speed_name: FAN_SPEED.LEVEL_3,
              speed_values: [
                {
                  speed_synonym: ['mid', 'speed 3'],
                  lang: 'en',
                },
              ],
            },
            {
              speed_name: FAN_SPEED.LEVEL_4,
              speed_values: [
                {
                  speed_synonym: ['speed 4'],
                  lang: 'en',
                },
              ],
            },
            {
              speed_name: FAN_SPEED.LEVEL_5,
              speed_values: [
                {
                  speed_synonym: ['high', 'speed 5'],
                  lang: 'en',
                },
              ],
            },
          ],
          ordered: true,
        },
        thermostatTemperatureUnit: 'C',
        availableThermostatModes: [
          // ThermostatMode.OFF,
          // ThermostatMode.ON,
          ThermostatMode.AUTO,
          ThermostatMode.COOL,
          ThermostatMode.HEAT,
          ThermostatMode.FAN_ONLY,
          ThermostatMode.DRY,
        ],
        thermostatTemperatureRange: {
          minThresholdCelsius: 18,
          maxThresholdCelsius: 30,
        },
      },
      customData: {},
    };
  }

  protected getThermostatMode(controlInfo: IResponse<ControlInfo>): string {
    switch (controlInfo.get('mode')) {
      case MODE.AUTO:
        return ThermostatMode.AUTO;
      case MODE.COOL:
        return ThermostatMode.COOL;
      case MODE.HEAT:
        return ThermostatMode.HEAT;
      case MODE.DRY:
        return ThermostatMode.DRY;
      case MODE.FAN:
        return ThermostatMode.FAN_ONLY;
      default:
        return ThermostatMode.NONE;
    }
  }

  protected getActiveThermostatMode(
    controlInfo: IResponse<ControlInfo>,
  ): string {
    if (controlInfo.get('pow') === POWER.OFF) {
      return ThermostatMode.OFF;
    }

    return this.getThermostatMode(controlInfo);
  }

  async onQuery(
    payloadDevice: IntentPayloadDevice,
  ): Promise<
    QueryIntentResponseDevice & Record<string, string | number | boolean>
  > {
    const daikinClient = new DaikinClient(this.device.address);
    const controlInfo = await daikinClient.getControlInfo();
    const sensorInfo = await daikinClient.getSensorInfo();

    return {
      status: DeviceStatus.SUCCESS,
      online: true,
      // OnOff
      on: controlInfo.get('pow') === POWER.ON,
      // FanSpeed
      currentFanSpeedSetting: controlInfo.get('f_rate'),
      // TemperatureSetting
      thermostatMode: this.getActiveThermostatMode(controlInfo),
      thermostatTemperatureSetpoint: parseFloat(controlInfo.get('stemp')),
      thermostatTemperatureAmbient: parseFloat(sensorInfo.get('htemp')),
      thermostatHumidityAmbient: parseFloat(sensorInfo.get('hhum')),
    };
  }

  async onExecute(
    execution: IntentCommandExecution,
  ): Promise<ExecuteIntentResponseCommand> {
    const commandHandler = this.commands.get(execution.command);
    if (!commandHandler) {
      throw new Error(`Missing command handler for ${execution.command}.`);
    }
    return await commandHandler.execute(this.device, execution.params);
  }
}

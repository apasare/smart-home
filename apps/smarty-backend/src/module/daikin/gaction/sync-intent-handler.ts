import { discover, FAN_SPEED } from '@godvsdeity/daikin-controller';
import { IntentHandlerInterface } from '../../gaction/interface';
import {
  INTENT_SYNC,
  IntentRequestDTO,
  SyncIntent,
  IntentResponseDTO,
  SyncIntentResponsePayload,
  IntentHandler,
} from '../../gaction';

@IntentHandler()
export class SyncIntentHandler implements IntentHandlerInterface {
  public canHandle(intentRequest: IntentRequestDTO): boolean {
    return (
      intentRequest.inputs[0] && intentRequest.inputs[0].intent === INTENT_SYNC
    );
  }

  public async handle(
    intentRequest: IntentRequestDTO<SyncIntent>,
  ): Promise<IntentResponseDTO<SyncIntentResponsePayload>> {
    const devices = await discover();

    return {
      requestId: intentRequest.requestId,
      payload: {
        agentUserId: 'FAKE_USER_ID',
        devices: devices.map(device => ({
          id: `DAIKIN-AC-${device.basic_info.get('mac')}`,
          type: 'action.devices.types.AC_UNIT',
          traits: [
            'action.devices.traits.OnOff',
            'action.devices.traits.FanSpeed',
            'action.devices.traits.TemperatureSetting',
          ],
          name: {
            name: decodeURIComponent(device.basic_info.get('name')),
          },
          deviceInfo: {
            manufacturer: 'Daikin',
            swVersion: device.basic_info.get('ver'),
          },
          roomHint: decodeURIComponent(device.basic_info.get('grp_name')),
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
            availableThermostatModes:
              'cool,heat,heatcool,fan-only,purifier,eco,dry',
            thermostatTemperatureRange: {
              minThresholdCelsius: 18,
              maxThresholdCelsius: 30,
            },
          },
          customData: {
            address: device.address,
            mac: device.basic_info.get('mac'),
          },
        })),
      },
    };
  }
}

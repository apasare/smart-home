import { BasicInfo, FAN_SPEED, Response } from '@godvsdeity/daikin-controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IntentHandlerInterface } from '../../gaction/interface';
import {
  INTENT_SYNC,
  IntentRequestDTO,
  SyncIntent,
  IntentResponseDTO,
  SyncIntentResponsePayload,
  IntentHandler,
} from '../../gaction';
import { Device } from '../entity';

@IntentHandler()
export class SyncIntentHandler implements IntentHandlerInterface {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  public canHandle(intentRequest: IntentRequestDTO): boolean {
    return (
      intentRequest.inputs[0] && intentRequest.inputs[0].intent === INTENT_SYNC
    );
  }

  public async handle(
    intentRequest: IntentRequestDTO<SyncIntent>,
  ): Promise<IntentResponseDTO<SyncIntentResponsePayload>> {
    const homeDevices = await this.deviceRepository.find();

    return {
      requestId: intentRequest.requestId,
      payload: {
        agentUserId: 'FAKE_USER_ID',
        // @TODO implement homeDevice.controller
        devices: homeDevices.map(device => {
          const basicInfo = new Response<BasicInfo>();
          basicInfo.setData(<[string, string][]>device.additionalData);
          return {
            id: device.id,
            type: 'action.devices.types.AC_UNIT',
            traits: [
              'action.devices.traits.OnOff',
              'action.devices.traits.FanSpeed',
              'action.devices.traits.TemperatureSetting',
            ],
            name: {
              name: device.name,
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
              availableThermostatModes:
                'cool,heat,heatcool,fan-only,purifier,eco,dry',
              thermostatTemperatureRange: {
                minThresholdCelsius: 18,
                maxThresholdCelsius: 30,
              },
            },
            customData: {},
          };
        }),
      },
    };
  }
}

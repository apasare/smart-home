import { Client as DaikinClient, POWER } from '@godvsdeity/daikin-controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IntentHandlerInterface } from '../../gaction/interface';
import {
  INTENT_QUERY,
  IntentRequestDTO,
  IntentResponseDTO,
  QueryIntentResponsePayload,
  QueryIntent,
  QueryIntentResponseDevices,
  DeviceStatus,
  IntentHandler,
} from '../../gaction';
import { Device } from '../entity';

@IntentHandler()
export class QueryIntentHandler implements IntentHandlerInterface {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  public canHandle(intentRequest: IntentRequestDTO): boolean {
    return (
      intentRequest.inputs[0] && intentRequest.inputs[0].intent === INTENT_QUERY
    );
  }

  public async handle(
    intentRequest: IntentRequestDTO<QueryIntent>,
  ): Promise<IntentResponseDTO<QueryIntentResponsePayload>> {
    const devices: QueryIntentResponseDevices = {};
    for (const device of intentRequest.inputs[0].payload.devices) {
      try {
        const homeDevice = await this.deviceRepository.findOneOrFail(device.id);

        // @TODO implement homeDevice.controller
        const daikinClient = new DaikinClient(homeDevice.address);
        const controlInfo = await daikinClient.getControlInfo();
        const sensorInfo = await daikinClient.getSensorInfo();

        const payloadDevice = {
          status: DeviceStatus.SUCCESS,
          online: true,
          on: controlInfo.get('pow') === POWER.ON,
          currentFanSpeedSetting: controlInfo.get('f_rate'),
          // @TODO change based on controlInfo.get('mode')
          thermostatMode: 'cool',
          thermostatTemperatureSetpoint: controlInfo.get('stemp'),
          thermostatTemperatureAmbient: sensorInfo.get('htemp'),
          thermostatHumidityAmbient: sensorInfo.get('hhum'),
        };

        devices[device.id] = payloadDevice;
      } catch (error) {
        devices[device.id] = {
          status: DeviceStatus.OFFLINE,
          online: false,
        };
      }
    }

    return {
      requestId: intentRequest.requestId,
      payload: {
        devices,
      },
    };
  }
}

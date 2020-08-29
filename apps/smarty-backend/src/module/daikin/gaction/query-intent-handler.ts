import { Client as DaikinClient, POWER } from '@godvsdeity/daikin-controller';
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

@IntentHandler()
export class QueryIntentHandler implements IntentHandlerInterface {
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
      if (!device.customData.address) {
        return;
      }

      const daikinClient = new DaikinClient(<string>device.customData.address);
      const controlInfo = await daikinClient.getControlInfo();
      const sensorInfo = await daikinClient.getSensorInfo();

      const payloadDevice = {
        status: DeviceStatus.SUCCESS,
        online: true,
        on: controlInfo.get('pow') === POWER.ON,
        currentFanSpeedSetting: controlInfo.get('f_rate'),
        // @TODO change based on data.get('mode')
        thermostatMode: 'heat',
        thermostatTemperatureSetpoint: controlInfo.get('stemp'),
        thermostatTemperatureAmbient: sensorInfo.get('htemp'),
        thermostatHumidityAmbient: sensorInfo.get('hhum'),
      };

      devices[device.id] = payloadDevice;
    }

    return {
      requestId: intentRequest.requestId,
      payload: {
        devices,
      },
    };
  }
}

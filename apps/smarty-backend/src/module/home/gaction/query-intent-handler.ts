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
import { DeviceAdaptersRegister } from '../service';

@IntentHandler()
export class QueryIntentHandler implements IntentHandlerInterface {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly deviceAdaptersRegister: DeviceAdaptersRegister,
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
        const homeDevice = await this.deviceRepository.findOneByOrFail({
          id: device.id,
        });
        const deviceAdapter = await this.deviceAdaptersRegister.getAdapter(
          homeDevice,
        );

        devices[device.id] = await deviceAdapter.onQuery(device);
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

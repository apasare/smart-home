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
import { DeviceAdaptersRegister } from '../service';

@IntentHandler()
export class SyncIntentHandler implements IntentHandlerInterface {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly deviceAdaptersRegister: DeviceAdaptersRegister,
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
        devices: await Promise.all(
          homeDevices.map(async device => {
            const deviceAdapter = await this.deviceAdaptersRegister.getAdapter(
              device,
            );
            return await deviceAdapter.onSync();
          }),
        ),
      },
    };
  }
}

import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { IntentRequestDTO, IntentResponseDTO } from '../dto';
import { IntentHandlerInterface } from '../interface';

@Injectable()
export class ActionManagerService {
  protected intentHandlers: IntentHandlerInterface[] = [];

  public constructor(private readonly moduleRef: ModuleRef) {}

  public addHandlers(
    intentHandlers: IntentHandlerInterface[],
  ): ActionManagerService {
    this.intentHandlers.push(...intentHandlers);
    return this;
  }

  public register(
    intentHandlers: Type<IntentHandlerInterface>[],
  ): ActionManagerService {
    return this.addHandlers(
      intentHandlers.map(intentHandler =>
        this.moduleRef.get(intentHandler, { strict: false }),
      ),
    );
  }

  public async execute(
    intentRequest: IntentRequestDTO,
  ): Promise<IntentResponseDTO> {
    for (const intentHandler of this.intentHandlers) {
      if (!intentHandler.canHandle(intentRequest)) {
        continue;
      }

      return await intentHandler.handle(intentRequest);
    }
  }
}

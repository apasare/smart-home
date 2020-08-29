import { Type } from '@nestjs/common';

import { IntentHandlerInterface } from './intent-handler.interface';

export interface GActionOptions {
  readonly intentHandlers: Type<IntentHandlerInterface>[];
}

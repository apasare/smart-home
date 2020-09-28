import { Controller, Post, Body, Logger } from '@nestjs/common';

import { IntentRequestDTO, IntentResponseDTO } from '../dto';
import { ActionManagerService } from '../service';

@Controller('gaction')
export class GActionController {
  // TODO: refactor this, make it injectable
  private readonly logger = new Logger(GActionController.name);

  public constructor(private actionManager: ActionManagerService) {}

  @Post('intent')
  public async postIntent(
    @Body() intentRequest: IntentRequestDTO,
  ): Promise<IntentResponseDTO> {
    this.logger.debug(JSON.stringify(intentRequest.inputs[0]));
    const response = await this.actionManager.execute(intentRequest);
    this.logger.debug(JSON.stringify(response));

    return response;
  }
}

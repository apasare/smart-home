import { Controller, Post, Body } from '@nestjs/common';

import { LoggerService } from '../../logger';
import { IntentRequestDTO, IntentResponseDTO } from '../dto';
import { ActionManagerService } from '../service';

@Controller('gaction')
export class GActionController {
  public constructor(
    private actionManager: ActionManagerService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(GActionController.name)
  }

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

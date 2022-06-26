import { Controller, Post, Body } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { LoggerService } from '../../logger';
import { IntentRequestDTO, IntentResponseDTO } from '../dto';
import { ActionManagerService } from '../service';

@Controller('gaction')
export class GActionController {
  public constructor(
    private readonly actionManager: ActionManagerService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(GActionController.name);
  }

  @Post('intent')
  @ApiOkResponse({
    type: IntentResponseDTO,
  })
  public async postIntent(
    @Body() intentRequest: IntentRequestDTO,
  ): Promise<IntentResponseDTO> {
    this.logger.debug(JSON.stringify(intentRequest.inputs[0]));
    const response = await this.actionManager.execute(intentRequest);
    this.logger.debug(JSON.stringify(response));

    return response;
  }
}

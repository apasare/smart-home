import { Controller, Post, Body } from '@nestjs/common';

import { IntentRequestDTO, IntentResponseDTO } from '../dto';
import { ActionManagerService } from '../service';

@Controller('gaction')
export class GActionController {
  public constructor(private actionManager: ActionManagerService) {}

  @Post('intent')
  public async postIntent(
    @Body() intentRequest: IntentRequestDTO,
  ): Promise<IntentResponseDTO> {
    console.dir(intentRequest.inputs[0], { depth: null });
    const response = await this.actionManager.execute(intentRequest);
    console.dir(response, { depth: null });

    return response;
  }
}

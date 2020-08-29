import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { GActionController } from './controller';
import { ActionManagerService, ExplorerService } from './service';

@Module({
  imports: [CqrsModule],
  controllers: [GActionController],
  providers: [ActionManagerService, ExplorerService],
})
export class GActionModule implements OnApplicationBootstrap {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly actionManagerService: ActionManagerService,
  ) {}

  onApplicationBootstrap(): void {
    const { intentHandlers } = this.explorerService.explore();
    this.actionManagerService.register(intentHandlers);
  }
}

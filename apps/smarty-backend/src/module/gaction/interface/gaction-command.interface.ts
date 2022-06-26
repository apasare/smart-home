import { Device } from '../../home';
import { ExecuteIntentResponseCommand } from '../dto';

export interface GActionCommandInterface {
  getName(): string;

  execute(
    homeDevice: Device,
    commandParams: unknown,
  ): Promise<ExecuteIntentResponseCommand>;
}

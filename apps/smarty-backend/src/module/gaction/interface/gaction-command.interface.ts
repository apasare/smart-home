import { Device } from '../../home';
import { ExecuteIntentResponseCommand } from '../dto';

export interface GActionCommandInterface {
  getName(): string;

  execute(
    homeDevice: Device,
    commandParams: Record<string, string | number | boolean>,
  ): Promise<ExecuteIntentResponseCommand>;
}

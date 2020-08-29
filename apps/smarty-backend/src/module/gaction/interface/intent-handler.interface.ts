import { IntentRequestDTO, IntentResponseDTO } from '../dto';

export interface IntentHandlerInterface {
  canHandle(intentRequest: IntentRequestDTO): boolean;
  handle(intentRequest: IntentRequestDTO): Promise<IntentResponseDTO>;
}

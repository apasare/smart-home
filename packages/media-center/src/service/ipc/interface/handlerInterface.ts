import { ActionDTO } from "./actionDto";

export interface HandlerInterface {
  canHandle(action: ActionDTO): boolean;
  canBubble(): boolean;
  handle(action: ActionDTO): boolean | Promise<boolean>;
}

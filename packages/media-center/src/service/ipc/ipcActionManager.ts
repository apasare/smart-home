import util from "util";

import { ActionDTO, HandlerInterface } from "./interface";

export class IPCActionManager {
  constructor(protected handlers: HandlerInterface[] = []) {}

  public pushHandler(handler: HandlerInterface | HandlerInterface[]): this {
    if (Array.isArray(handler)) {
      this.handlers.push(...handler);
    } else {
      this.handlers.push(handler);
    }

    return this;
  }

  public removeHandler(handler: HandlerInterface): this {
    this.handlers = this.handlers.filter((h) => h !== handler);
    return this;
  }

  public async handle(action: ActionDTO): Promise<void> {
    for (const handler of this.handlers) {
      if (!handler.canHandle(action)) {
        continue;
      }

      const maybePromise = handler.handle(action);
      if (util.types.isPromise(maybePromise)) {
        await maybePromise;
      }

      if (!handler.canBubble()) {
        break;
      }
    }
  }
}

import { ChildProcess } from "child_process";
import { HandlerInterface, ActionDTO } from "../interface";

export class ForwardToHandler implements HandlerInterface {
  constructor(
    protected processes: Map<string, ChildProcess>,
    protected bubble: boolean = false
  ) {}

  canHandle(action: ActionDTO): boolean {
    return action.forward.length > 0;
  }

  canBubble(): boolean {
    return this.bubble;
  }

  handle(action: ActionDTO): boolean {
    for (const process of action.forward) {
      const childProcess = this.processes.get(process);
      if (childProcess === undefined) {
        continue;
      }
      childProcess.send(action);
    }

    return true;
  }
}

import { HandlerInterface, ActionDTO } from "../interface";

export class NewDirectoryHandler implements HandlerInterface {
  constructor(
    protected streamTorrentsRepository: any[],
    protected bubble = false
  ) {}

  canHandle(action: ActionDTO): boolean {
    return action.type === "new-directory";
  }

  canBubble(): boolean {
    return this.bubble;
  }

  handle(action: ActionDTO): boolean {
    if (
      !this.streamTorrentsRepository.find(
        (directory) => directory.infoHash === action.payload.infoHash
      )
    ) {
      this.streamTorrentsRepository.push(action.payload);
    }
    return true;
  }
}

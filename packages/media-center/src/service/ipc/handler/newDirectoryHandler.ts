import { HandlerInterface, ActionDTO } from "../interface";
import {
  StreamTorrentsRepository,
  StreamTorrentData,
} from "../../../repository";
import { generateInfoHashId } from "../../../helper";

export class NewDirectoryHandler implements HandlerInterface {
  constructor(
    protected streamTorrentsRepository: StreamTorrentsRepository,
    protected bubble = false
  ) {}

  canHandle(action: ActionDTO): boolean {
    return action.type === "new-directory";
  }

  canBubble(): boolean {
    return this.bubble;
  }

  handle(action: ActionDTO<StreamTorrentData>): boolean {
    const key = generateInfoHashId(action.payload.infoHash);
    if (!this.streamTorrentsRepository.has(key)) {
      this.streamTorrentsRepository.set(key, action.payload);
    }

    return true;
  }
}

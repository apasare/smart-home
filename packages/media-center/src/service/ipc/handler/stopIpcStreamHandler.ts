import {
  HandlerInterface,
  StopIpcStreamAction,
  STOP_IPC_STREAM_ACTION,
} from "../interface";
import { openStreamsRepository } from "../../../repository";

export class StopIpcStreamHandler implements HandlerInterface {
  constructor(protected bubble: boolean = false) {}

  canHandle(action: StopIpcStreamAction): boolean {
    return action.type === STOP_IPC_STREAM_ACTION;
  }

  canBubble(): boolean {
    return this.bubble;
  }

  handle(action: StopIpcStreamAction): boolean {
    const fileReadStream = openStreamsRepository.get(action.payload.streamId);
    if (fileReadStream === undefined) {
      return false;
    }

    // @TODO: use a logger
    console.log(`stop stream ${action.payload.streamId}`);
    fileReadStream.destroy();
    openStreamsRepository.delete(action.payload.streamId);

    return true;
  }
}

import {
  HandlerInterface,
  IPC_STREAM_CHUNK_ACTION,
  IpcStreamChunkAction,
} from "../interface";
import { IPCReadStream } from "../ipcReadStream";
import fs from "fs";

export class IpcStreamChunkHandler implements HandlerInterface {
  constructor(
    protected readStream: IPCReadStream,
    protected filePath: string,
    protected bubble: boolean = false
  ) {}

  canHandle(action: IpcStreamChunkAction): boolean {
    return (
      action.type === IPC_STREAM_CHUNK_ACTION &&
      action.payload.streamId === this.readStream.getStreamId()
    );
  }

  canBubble(): boolean {
    return this.bubble;
  }

  handle(action: IpcStreamChunkAction): boolean {
    if (action.payload.chunkSize) {
      const file = fs.openSync(this.filePath, "r");
      const fileDataBuffer = Buffer.alloc(action.payload.chunkSize);
      fs.readSync(
        file,
        fileDataBuffer,
        0,
        action.payload.chunkSize,
        action.payload.chunkStart
      );
      fs.closeSync(file);
      this.readStream.push(fileDataBuffer);
    } else {
      this.readStream.push(null);
    }

    return true;
  }
}

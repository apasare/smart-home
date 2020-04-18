import {
  HandlerInterface,
  IPC_STREAM_CHUNK_ACTION,
  IpcStreamChunkAction,
  IpcStreamChunkPayload,
} from "../interface";
import { IPCReadStream } from "../ipcReadStream";
import fs from "fs";

export class IpcStreamChunkHandler implements HandlerInterface {
  protected maxRetries = 5;
  protected nextChunkIndex = 0;
  protected pendingPayloads: IpcStreamChunkPayload[] = [];

  constructor(
    protected readStream: IPCReadStream,
    protected filePath: string,
    protected bubble: boolean = false
  ) {}

  protected readFileData(
    chunkStart: number,
    chunkSize: number,
    retry: number = 0
  ): void {
    if (this.nextChunkIndex === 0 && !fs.existsSync(this.filePath)) {
      if (retry >= this.maxRetries) {
        throw new Error(`File "${this.filePath}" does not exist.`);
      }

      setTimeout(
        this.readFileData.bind(this),
        1000,
        chunkStart,
        chunkSize,
        ++retry
      );
      return;
    }

    const file = fs.openSync(this.filePath, "r");
    const fileDataBuffer = Buffer.alloc(chunkSize);
    fs.readSync(file, fileDataBuffer, 0, chunkSize, chunkStart);
    fs.closeSync(file);
    // console.log("readFileData", chunkSize, chunkStart);

    this.readStream.push(fileDataBuffer);
    ++this.nextChunkIndex;
  }

  protected drainPendingPayloads(): void {
    if (!this.pendingPayloads.length) {
      return;
    }

    while (true) {
      console.log(this.nextChunkIndex, this.pendingPayloads);
      const nextChunk = this.pendingPayloads.find(
        (payload) => payload.chunkIndex === this.nextChunkIndex
      );
      if (!nextChunk) {
        break;
      }

      this.readFileData(nextChunk.chunkStart, nextChunk.chunkSize);
      this.pendingPayloads = this.pendingPayloads.filter(
        (payload) => payload.chunkIndex !== nextChunk.chunkIndex
      );
    }
  }

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
    const { chunkIndex, chunkStart, chunkSize } = action.payload;
    if (chunkSize) {
      if (this.nextChunkIndex === chunkIndex) {
        this.readFileData(chunkStart, chunkSize);
        this.drainPendingPayloads();
      } else {
        this.pendingPayloads.push(action.payload);
      }
    } else {
      this.readStream.push(null);
    }

    return true;
  }
}

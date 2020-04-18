import { Readable, ReadableOptions } from "stream";
import { v4 as uuidv4 } from "uuid";

import { IpcStreamChunkHandler } from "./handler";
import { StartIpcStreamAction, StopIpcStreamAction } from "./interface";
import { dispatchIPCAction } from "./dispatchIpcAction";
import { IPCActionManager } from "./ipcActionManager";

export class IPCReadStream extends Readable {
  protected reading = false;
  protected streamId: string = uuidv4();
  protected ipcStreamChunkHandler: IpcStreamChunkHandler;

  constructor(
    protected ipcManager: IPCActionManager,
    protected torrentInfoHash: string,
    protected fileId: number,
    protected filePath: string,
    protected start?: number,
    protected end?: number,
    opts?: ReadableOptions
  ) {
    super(opts);

    this.ipcStreamChunkHandler = new IpcStreamChunkHandler(this, filePath);
    this.ipcManager.pushHandler(this.ipcStreamChunkHandler);
  }

  protected _startIpcStream(): void {
    dispatchIPCAction<StartIpcStreamAction>({
      type: "start-ipc-stream",
      payload: {
        streamId: this.streamId,
        torrentInfoHash: this.torrentInfoHash,
        fileId: this.fileId,
        start: this.start,
        end: this.end,
      },
      forward: ["torrent"],
    });
  }

  protected _stopIpcStream(): void {
    dispatchIPCAction<StopIpcStreamAction>({
      type: "stop-ipc-stream",
      payload: {
        streamId: this.streamId,
      },
      forward: ["torrent"],
    });
  }

  _read(): void {
    if (!this.reading) {
      this.reading = true;
      this._startIpcStream();
    }
    return;
  }

  _destroy(): void {
    this._stopIpcStream();
    this.ipcManager.removeHandler(this.ipcStreamChunkHandler);
  }

  getStreamId(): string {
    return this.streamId;
  }
}

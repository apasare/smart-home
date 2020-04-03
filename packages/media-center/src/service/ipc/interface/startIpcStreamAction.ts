import { ActionDTO } from "./actionDto";

export const START_IPC_STREAM_ACTION = "start-ipc-stream";

export interface StartIpcStreamPayload {
  streamId: string;
  torrentInfoHash: string;
  fileId: number;
  start?: number;
  end?: number;
}

export interface StartIpcStreamAction extends ActionDTO<StartIpcStreamPayload> {
  type: typeof START_IPC_STREAM_ACTION;
}

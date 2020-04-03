import { ActionDTO } from "./actionDto";

export const IPC_STREAM_CHUNK_ACTION = "ipc-stream-chunk";

export interface BufferData {
  type: "Buffer";
  data: Uint8Array;
}
export interface IpcStreamChunkPayload {
  streamId: string;
  chunkStart: number;
  chunkSize: number;
}

export interface IpcStreamChunkAction extends ActionDTO<IpcStreamChunkPayload> {
  type: typeof IPC_STREAM_CHUNK_ACTION;
}

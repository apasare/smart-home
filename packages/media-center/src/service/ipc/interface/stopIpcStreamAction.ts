import { ActionDTO } from "./actionDto";

export const STOP_IPC_STREAM_ACTION = "stop-ipc-stream";

export interface StopIpcStreamPayload {
  streamId: string;
}

export interface StopIpcStreamAction extends ActionDTO<StopIpcStreamPayload> {
  type: typeof STOP_IPC_STREAM_ACTION;
}

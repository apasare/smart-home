import { ActionDTO } from "./interface";

export function dispatchIPCAction<T extends ActionDTO = ActionDTO>(
  action: T
): void {
  if (!process.send) {
    throw new Error("IPC not initialised");
  }
  process.send(action);
}

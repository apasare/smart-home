import { spawn, ChildProcess } from "child_process";
import { IPCActionManager, ForwardToHandler, ActionDTO } from "../service";

const MAX_PROCESS_SPAWN_RETRY = 5;
const processes: Map<string, ChildProcess> = new Map();

function killAllChildProcesses(): void {
  processes.forEach((process) => {
    process.kill("SIGHUP");
  });
}

function spawnProcess(
  name: string,
  command: string[],
  retry: number = 0
): ChildProcess {
  const cmd = command.shift();
  if (!cmd) {
    throw new Error(`No command`);
  }
  const childProcess = spawn(cmd, command, {
    cwd: __dirname,
    stdio: ["inherit", "inherit", "inherit", "ipc"],
  });
  processes.set(name, childProcess);

  childProcess.on("close", (code) => {
    if (code === null || code === 0) {
      return;
    }

    if (retry++ >= MAX_PROCESS_SPAWN_RETRY) {
      return killAllChildProcesses();
    }

    console.log(`retries spawning ${name}: ${retry}`);
    command.unshift(cmd);
    spawnProcess(name, command, retry);
  });

  return childProcess;
}

function bootstrap(): void {
  const streamProcess = spawnProcess("stream", ["node", "streamApi.js"]);
  const torrentProcess = spawnProcess("torrent", ["node", "torrent.js"]);
  // const apiProcess = spawnProcess("api", ["node", "api.js"]);

  const ipcActionManager = new IPCActionManager([
    new ForwardToHandler(processes),
  ]);
  const ipcActionManagerCallback = async (
    message: ActionDTO
  ): Promise<void> => {
    await ipcActionManager.handle(message);
  };

  // apiProcess.on("message", ipcActionManagerCallback);
  torrentProcess.on("message", ipcActionManagerCallback);
  streamProcess.on("message", ipcActionManagerCallback);
}
bootstrap();

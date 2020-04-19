import {
  TorrentDownloadHandler,
  ActionDTO,
  StartIpcStreamHandler,
  StopIpcStreamHandler,
} from "../service";
import { torrentIpcManager, torrentContainer } from "../singleton";

torrentIpcManager.pushHandler([
  new TorrentDownloadHandler(torrentContainer),
  new StartIpcStreamHandler(torrentContainer),
  new StopIpcStreamHandler(),
]);

process.on(
  "message",
  async (message: ActionDTO): Promise<void> => {
    await torrentIpcManager.handle(message);
  }
);

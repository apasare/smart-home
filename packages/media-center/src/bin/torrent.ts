import "../patch/webtorrent";
import WebTorrent from "webtorrent";

import {
  TorrentDownloadHandler,
  ActionDTO,
  TorrentContainer,
  StartIpcStreamHandler,
  StopIpcStreamHandler,
} from "../service";
import { torrentIpcManager } from "../singleton";

const torrentClient = new WebTorrent({
  maxConns: Number(process.env.TORRENT_MAX_CONNS) || 30,
});
const torrentContainer = new TorrentContainer(torrentClient);
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

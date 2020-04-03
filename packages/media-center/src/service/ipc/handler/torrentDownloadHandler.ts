import WebTorrent from "webtorrent";
import ParseTorrent from "parse-torrent";
import MagnetUri from "magnet-uri";

import {
  HandlerInterface,
  ActionDTO,
  TorrentDownloadAction,
  TORRENT_DOWNLOAD_ACTION,
} from "../interface";
import { TorrentContainer } from "../../torrent";

export class TorrentDownloadHandler implements HandlerInterface {
  constructor(
    protected torrentContainer: TorrentContainer,
    protected bubble: boolean = false
  ) {}

  protected addTorrent(magnetUri: MagnetUri.Instance): WebTorrent.Torrent {
    return this.torrentContainer.addTorrent(magnetUri);
  }

  canHandle(action: ActionDTO): boolean {
    return action.type === TORRENT_DOWNLOAD_ACTION;
  }

  canBubble(): boolean {
    return this.bubble;
  }

  handle(action: TorrentDownloadAction): boolean {
    const magnetUri = ParseTorrent(action.payload.torrentUrl);
    if (!magnetUri.infoHash) {
      throw new Error("Invalid torrent url");
    }

    // const torrent =
    this.torrentContainer.getTorrent(magnetUri.infoHash) ||
      this.addTorrent(magnetUri);

    return true;
  }
}

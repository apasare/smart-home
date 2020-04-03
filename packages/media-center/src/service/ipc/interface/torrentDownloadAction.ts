import { ActionDTO } from "./actionDto";

export const TORRENT_DOWNLOAD_ACTION = "torrent-download";

export interface TorrentDownloadPayload {
  torrentUrl: string;
}

export interface TorrentDownloadAction
  extends ActionDTO<TorrentDownloadPayload> {
  type: typeof TORRENT_DOWNLOAD_ACTION;
}

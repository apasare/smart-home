import WebTorrent from "webtorrent";
import os from "os";
import fs from "fs";
import path from "path";
import ParseTorrent from "parse-torrent";
import MagnetUri from "magnet-uri";
import { dispatchIPCAction } from "../ipc";
import { streamTorrentsRepository } from "../../repository";
import { generateInfoHashId } from "../../helper";

const defaultTorrentsDownloadDir = process.env.MEDIA_CENTER_DATA_DIR
  ? path.join(process.env.MEDIA_CENTER_DATA_DIR, "torrents")
  : path.join(os.tmpdir(), "media-center-data", "torrents");

export class TorrentContainer {
  constructor(
    protected torrentClient: WebTorrent.Instance,
    protected torrentsDownloadDir: string = defaultTorrentsDownloadDir,
    protected torrentsUrlCacheDir: string = "cache"
  ) {
    this.torrentClient.on("torrent", (torrent) => {
      if (process.env.SPLIT !== undefined) {
        // @TODO implement IpcNewDirectoryAction
        dispatchIPCAction({
          type: "new-directory",
          payload: {
            infoHash: torrent.infoHash,
            name: torrent.name,
            path: torrent.path,
            files: torrent.files.map((file, index) => ({
              id: index,
              path: file.path,
              name: file.name,
              size: file.length,
            })),
          },
          forward: ["stream"],
        });
      } else {
        streamTorrentsRepository.set(generateInfoHashId(torrent.infoHash), {
          infoHash: torrent.infoHash,
          name: torrent.name,
          path: torrent.path,
          files: torrent.files.map((file, index) => ({
            id: index,
            path: file.path,
            name: file.name,
            size: file.length,
          })),
        });
      }
    });

    const torrentsCacheFolder = path.join(
      torrentsDownloadDir,
      torrentsUrlCacheDir
    );
    if (!fs.existsSync(torrentsCacheFolder)) {
      fs.mkdirSync(torrentsCacheFolder, { recursive: true });
    }

    const magnetUriPaths = fs.readdirSync(torrentsCacheFolder, {
      encoding: "utf8",
    });
    magnetUriPaths.forEach((magnetUriPath) => {
      const magnetUriData = fs.readFileSync(
        path.join(torrentsCacheFolder, magnetUriPath),
        { encoding: "utf8" }
      );
      this.addTorrent(ParseTorrent(magnetUriData));
    });
  }

  public addTorrent(magnetUri: MagnetUri.Instance): WebTorrent.Torrent {
    if (!magnetUri.infoHash) {
      throw new Error("Invalid torrent url");
    }

    const data = ParseTorrent.toMagnetURI(magnetUri);
    fs.writeFileSync(
      path.join(
        this.torrentsDownloadDir,
        this.torrentsUrlCacheDir,
        magnetUri.infoHash
      ),
      data,
      { encoding: "utf8" }
    );

    const torrent = this.torrentClient.add(data, {
      path: path.join(this.torrentsDownloadDir, magnetUri.infoHash),
    });
    torrent.once("ready", () => {
      torrent.deselect(0, torrent.pieces.length - 1, 0);
    });

    return torrent;
  }

  getTorrents(): WebTorrent.Torrent[] {
    return this.torrentClient.torrents;
  }

  getTorrent(torrentId: string): WebTorrent.Torrent | void {
    return this.torrentClient.get(torrentId);
  }

  getTorrentClient(): WebTorrent.Instance {
    return this.torrentClient;
  }
}

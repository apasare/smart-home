import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import http from "http";
import socketio from "socket.io";
import ParseTorrent from "parse-torrent";
import mime from "mime";

import { registerControllers } from "../service";
import { Torrents, DownloadTorrentFile } from "../controller/stream";
import { Movies, Animes, Shows } from "../controller/api";
import { generateInfoHashId } from "../helper";

process.env.ALL_IN_ONE = "true";
import { torrentContainer } from "../singleton/torrentContainer";
import WebTorrent from "webtorrent";

type GetFileResponse = number | WebTorrent.TorrentFile | null;
function getFile(torrent: WebTorrent.Torrent, fileId?: number): any[] {
  if (fileId !== undefined) {
    return [fileId, torrent.files[fileId]];
  }

  let responseFile: WebTorrent.TorrentFile | null = null;
  let responseFileId: number | null = null;
  torrent.files.forEach((file, index) => {
    if (responseFile === null || responseFile.length < file.length) {
      responseFile = file;
      responseFileId = index;
    }
  });

  return [responseFileId, responseFile];
}

function sendVideoData(
  socket: socketio.Socket,
  playerId: string,
  torrent: WebTorrent.Torrent
): void {
  const key = generateInfoHashId(torrent.infoHash);
  const response = getFile(torrent);
  if (response[0] === null) {
    // TODO: emit error
    return;
  }
  const fileId = response[0] as number;
  const file = response[1] as WebTorrent.TorrentFile;
  socket.emit("loaded", {
    playerId,
    streamUri: `stream/${key}/${fileId}`,
    fileName: file.name,
    fileType: mime.getType(file.name) || "application/octet-stream",
  });
}

function bootstrapSocketio(server: http.Server): void {
  const io = socketio(server);
  const playerNsp = io.of("/player");

  playerNsp.on("connection", (socket) => {
    const statsUpdaters: Map<string, NodeJS.Timeout> = new Map();
    const startStatsUpdates = (
      playerId: string,
      torrent: WebTorrent.Torrent
    ): void => {
      const response = getFile(torrent);
      const file = response[1] as WebTorrent.TorrentFile | null;
      const statsUpdater = setInterval(
        (playerId, torrent) => {
          socket.emit("stats", {
            playerId,
            uploadSpeed: torrent.uploadSpeed,
            uploaded: torrent.uploaded,
            downloadSpeed: torrent.downloadSpeed,
            downloaded: (file && file.downloaded) || torrent.downloaded,
            progress: (file && file.progress) || torrent.progress,
            size: (file && file.length) || torrent.length,
          });
        },
        1000,
        playerId,
        torrent
      );
      statsUpdaters.set(playerId, statsUpdater);
    };

    socket.on("load", (data) => {
      const { playerId, torrentUrl } = data;
      const magnetUri = ParseTorrent(torrentUrl);
      if (!magnetUri.infoHash) {
        // TODO: emit error
        return;
      }

      const torrent = torrentContainer.getTorrent(magnetUri.infoHash);
      if (!torrent || !torrent.files.length) {
        const torrent = torrentContainer.addTorrent(magnetUri);
        torrent.once("ready", () => {
          sendVideoData(socket, playerId, torrent);
          startStatsUpdates(playerId, torrent);
        });
        return;
      }

      sendVideoData(socket, playerId, torrent);
      startStatsUpdates(playerId, torrent);
    });

    socket.on("stop", (playerId) => {
      const statsUpdater = statsUpdaters.get(playerId);
      if (statsUpdater) {
        clearInterval(statsUpdater);
        statsUpdaters.delete(playerId);
      }
    });

    socket.on("disconnect", () => {
      statsUpdaters.forEach(clearInterval);
      statsUpdaters.clear();
    });
  });
}

function bootstrap(): void {
  const app = new Koa();
  const server = http.createServer(app.callback());
  bootstrapSocketio(server);

  const router = new Router();

  registerControllers(router, [
    Torrents,
    DownloadTorrentFile,
    Movies,
    Animes,
    Shows,
  ]);

  app
    .use(
      cors({
        maxAge: 600,
      })
    )
    .use(router.routes())
    .use(router.allowedMethods());

  const port = process.env.STREAM_API_SERVER_PORT || 4000;
  server.listen(port, () => {
    console.log(`Streaming API is listening on ${port}`);
  });
}
bootstrap();

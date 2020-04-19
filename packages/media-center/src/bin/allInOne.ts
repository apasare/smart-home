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

function sendVideoData(
  socket: socketio.Socket,
  playerId: string,
  torrent: WebTorrent.Torrent
): void {
  const key = generateInfoHashId(torrent.infoHash);
  const file = torrent.files
    .map((file, index) => ({
      name: file.name,
      size: file.length,
      id: index,
    }))
    .reduce((previous, current) =>
      previous && previous.size < current.size ? current : previous
    );
  socket.emit("loaded", {
    playerId,
    streamUri: `stream/${key}/${file.id}`,
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
      const statsUpdater = setInterval(
        (playerId, torrent) => {
          socket.emit("stats", {
            playerId,
            uploadSpeed: torrent.uploadSpeed,
            uploaded: torrent.uploaded,
            downloadSpeed: torrent.downloadSpeed,
            downloaded: torrent.downloaded,
            progress: torrent.progress,
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

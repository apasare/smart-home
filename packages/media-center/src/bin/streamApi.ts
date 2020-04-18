import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import http from "http";
import socketio from "socket.io";
import ParseTorrent from "parse-torrent";

import {
  ActionDTO,
  NewDirectoryHandler,
  registerControllers,
  dispatchIPCAction,
  TorrentDownloadAction,
  TORRENT_DOWNLOAD_ACTION,
} from "../service";
import { streamTorrentsRepository } from "../repository";
import { streamIpcManager } from "../singleton";
import { Torrents, DownloadTorrentFile } from "../controller/stream";
import { Movies, Animes, Shows } from "../controller/api";
import { generateInfoHashId } from "../helper";

// initialize ipc communication
streamIpcManager.pushHandler(new NewDirectoryHandler(streamTorrentsRepository));
process.on(
  "message",
  async (message: ActionDTO): Promise<void> => {
    await streamIpcManager.handle(message);
  }
);

function bootstrap(): void {
  const app = new Koa();
  const server = http.createServer(app.callback());
  const io = socketio(server);

  const playerNsp = io.of("/player");
  playerNsp.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("load", (data) => {
      const { playerId, torrentUrl } = data;
      const magnetUri = ParseTorrent(torrentUrl);
      if (!magnetUri.infoHash) {
        return;
      }
      const key = generateInfoHashId(magnetUri.infoHash);
      const streamTorrent = streamTorrentsRepository.get(key);
      if (!streamTorrent) {
        dispatchIPCAction<TorrentDownloadAction>({
          type: TORRENT_DOWNLOAD_ACTION,
          payload: {
            torrentUrl,
          },
          forward: ["torrent"],
        });
      }

      const sendVideoData = (): void => {
        const streamTorrent = streamTorrentsRepository.get(key);
        if (!streamTorrent || !streamTorrent.files.length) {
          setTimeout(sendVideoData, 1000);
          return;
        }

        const file = streamTorrent.files.reduce((previous, current) =>
          previous && previous.size < current.size ? current : previous
        );
        socket.emit("loaded", {
          playerId,
          streamUri: `stream/${key}/${file.id}`,
        });
      };
      setTimeout(sendVideoData, 1000);
    });
    // socket.on("stop", (data) => {
    //   console.log(data);
    // });
    // socket.on("disconnect", (...args) => {
    //   console.log(args);
    // });
  });

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

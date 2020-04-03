import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";

import {
  ActionDTO,
  NewDirectoryHandler,
  registerControllers,
} from "../service";
import { streamTorrentsRepository } from "../repository";
import { streamIpcManager } from "../singleton";
import { Torrents, DownloadTorrentFile } from "../controller/stream";

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
  const router = new Router();

  registerControllers(router, [Torrents, DownloadTorrentFile]);

  app
    .use(
      cors({
        maxAge: 600,
      })
    )
    .use(router.routes())
    .use(router.allowedMethods());

  const port = process.env.STREAM_SERVER_PORT || 4040;
  app.listen(port);
  console.log(`Streaming server is listening on ${port}`);
}
bootstrap();

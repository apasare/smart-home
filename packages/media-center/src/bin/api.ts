import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";

import { ActionDTO, registerControllers } from "../service";
import { apiIpcManager } from "../singleton";
import { Movies, Animes, Shows } from "../controller/api";

// initialize ipc communication
process.on(
  "message",
  async (message: ActionDTO): Promise<void> => {
    await apiIpcManager.handle(message);
  }
);

function bootstrap(): void {
  const app = new Koa();
  const router = new Router();

  registerControllers(router, [Movies, Animes, Shows]);

  app
    .use(
      cors({
        maxAge: 600,
      })
    )
    .use(router.routes())
    .use(router.allowedMethods());

  const port = process.env.API_SERVER_PORT || 4000;
  app.listen(port);
  console.log(`API server is listening on ${port}`);
}
bootstrap();

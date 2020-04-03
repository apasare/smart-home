import Koa from "koa";

import {
  Controller,
  Get,
  ButterApiClient,
  ButterMovieDTO,
} from "../../service";
import { ButterController } from "./butterController";

@Controller()
export class Movies extends ButterController {
  constructor(protected butterClient: ButterApiClient = new ButterApiClient()) {
    super(
      butterClient.getMovies.bind(butterClient),
      butterClient.getMovie.bind(butterClient)
    );
  }

  @Get("/movies")
  async movies(ctx: Koa.BaseContext): Promise<ButterMovieDTO[]> {
    return await this.getCollection(ctx.query);
  }

  @Get("/movies/:id")
  async movie(ctx: Koa.ParameterizedContext): Promise<ButterMovieDTO | void> {
    return await this.getItem(ctx.params.id);
  }
}

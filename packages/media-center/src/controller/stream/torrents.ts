import Koa from "koa";
import escapeHTML from "escape-html";

import { getPageHTML } from "../../helper";
import { streamTorrentsRepository } from "../../repository";
import { Controller, Get } from "../../service";

@Controller()
export class Torrents {
  @Get("/")
  listTorrents(): string {
    const title = "Torrents";
    const listHtml = streamTorrentsRepository
      .map(
        (torrent) =>
          `<li><a href="${escapeHTML(
            torrent.infoHash.substr(0, 4)
          )}">${escapeHTML(torrent.name)}</a></li>`
      )
      .join();
    return getPageHTML(title, `<h1>${title}</h1><ol>${listHtml}</ol>`);
  }

  @Get("/:infoHash")
  listTorrentFiles(ctx: Koa.ParameterizedContext): void {
    const torrent = streamTorrentsRepository.find((torrent) =>
      torrent.infoHash.startsWith(ctx.params.infoHash)
    );
    if (!torrent) {
      // 404 - koa default response
      return;
    }

    const title = `${torrent.name} files`;
    const listHtml = torrent.files
      .map(
        (file) =>
          `<li><a download="${escapeHTML(file.name)}" href="${escapeHTML(
            torrent.infoHash.substr(0, 4) + "/" + file.id
          )}">${escapeHTML(file.name)}</a> ${file.size} bytes</li>`
      )
      .join();

    ctx.body = getPageHTML(title, `<h1>${title}</h1><ol>${listHtml}</ol>`);
  }
}

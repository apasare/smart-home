import Koa from "koa";
import OS from "opensubtitles-api";
import axios from "axios";
import srt2vtt from "srt-to-vtt";

import { streamTorrentsRepository } from "../../repository";
import { Controller, Get } from "../../service";
import { torrentContainer } from "../../singleton";

const openSubtitles = new OS({
  useragent: "Popcorn Time NodeJS",
});

@Controller("/sub")
export class Subtitles {
  @Get("/:torrentKey/:fileId")
  async listSubtitles(ctx: Koa.ParameterizedContext): Promise<void> {
    const { torrentKey, fileId } = ctx.params;
    const { lang, imdbid, season, episode } = ctx.query;
    const streamTorrent = streamTorrentsRepository.get(torrentKey);
    if (!streamTorrent) {
      ctx.status = 404;
      ctx.body = `No torrent with id "${torrentKey}"`;
      return;
    }
    const torrent = torrentContainer.getTorrent(streamTorrent.infoHash);
    if (!torrent || !torrent.files[fileId]) {
      return;
    }

    const file = torrent.files[fileId];
    const subtitles = await openSubtitles.search({
      extensions: ["srt", "vtt"],
      filesize: file.length,
      filename: file.name,
      imdbid,
      season,
      episode,
    });
    if (lang && subtitles[lang]) {
      const subtitleResponse = await axios(subtitles[lang].utf8, {
        responseType: "stream",
      });
      if (!subtitleResponse) {
        return;
      }

      ctx.set("Cache-Control", "max-age=600");
      ctx.set("Content-Type", "text/vtt; charset=utf-8");
      ctx.body = subtitleResponse.data.pipe(srt2vtt());
      return;
    } else if (lang) {
      return;
    }

    ctx.body = subtitles;
  }
}

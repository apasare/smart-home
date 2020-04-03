import Koa from "koa";
import mime from "mime";
import rangeParser from "range-parser";
import path from "path";

import { streamTorrentsRepository } from "../../repository";
import { IPCReadStream, Controller, Get } from "../../service";
import { streamIpcManager } from "../../singleton";

@Controller()
export class DownloadTorrentFile {
  @Get("/:infoHash/:fileId")
  async downloadtorrentFile(ctx: Koa.ParameterizedContext): Promise<void> {
    const torrent = streamTorrentsRepository.find((torrent) =>
      torrent.infoHash.startsWith(ctx.params.infoHash)
    );
    if (!torrent) {
      // 404 - koa default response
      return;
    }
    const file = torrent.files.find(
      (file) => file.id === parseInt(ctx.params.fileId)
    );
    if (!file) {
      // 404 - koa default response
      return;
    }
    const filePath = path.join(torrent.path, file.path);
    // if (!fs.existsSync(filePath)) {
    //   ctx.status = 404;
    //   ctx.body = "Not Found";
    //   return;
    // }

    // set streaming headers
    ctx.set(
      "Content-Type",
      mime.getType(file.name) || "application/octet-stream"
    );
    ctx.set("Accept-Ranges", "bytes");
    ctx.attachment(file.name, { fallback: false, type: "inline" });
    ctx.set("transferMode.dlna.org", "Streaming");
    ctx.set(
      "contentFeatures.dlna.org",
      "DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000"
    );

    const ranges = rangeParser(file.size, ctx.headers.range || "");
    if (ranges === -1) {
      ctx.status = 416; // unsatisfiable range request
      ctx.set("Content-Range", `bytes */${file.size}`);
      return;
    }

    let range: rangeParser.Range | undefined;
    if (Array.isArray(ranges)) {
      ctx.status = 206; // indicates that range-request was understood

      // no support for multi-range request, just use the first range
      range = ranges[0];

      ctx.set(
        "Content-Range",
        `bytes ${range.start}-${range.end}/${file.size}`
      );
      ctx.set("Content-Length", (range.end - range.start + 1).toString());
    } else {
      ctx.set("Content-Length", file.size);
    }

    const readStream = new IPCReadStream(
      streamIpcManager,
      torrent.infoHash,
      file.id,
      filePath,
      range && range.start,
      range && range.end
    );

    ctx.body = readStream;
  }
}

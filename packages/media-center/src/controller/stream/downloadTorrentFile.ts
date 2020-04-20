import Koa from "koa";
import mime from "mime";
import rangeParser from "range-parser";
import path from "path";

import { streamTorrentsRepository } from "../../repository";
import { IPCReadStream, Controller, Get } from "../../service";
import { streamIpcManager, torrentContainer } from "../../singleton";

// const supportedFileTypes = ["video/mp4", "video/webm", "video/ogg"];

@Controller("/stream")
export class DownloadTorrentFile {
  @Get("/:infoHash/:fileId")
  async downloadtorrentFile(ctx: Koa.ParameterizedContext): Promise<void> {
    if (process.env.SPLIT !== undefined) {
      ctx.req.setTimeout(5000);
    }

    const streamTorrent = streamTorrentsRepository.get(ctx.params.infoHash);
    if (!streamTorrent) {
      ctx.status = 404;
      ctx.body = `No torrent with id ${ctx.params.infoHash}`;
      return;
    }
    const file = streamTorrent.files.find(
      (file) => file.id === parseInt(ctx.params.fileId)
    );
    if (!file) {
      ctx.status = 404;
      ctx.body = `No file with id ${ctx.params.fileId}`;
      return;
    }
    const filePath = path.join(streamTorrent.path, file.path);
    const fileType = mime.getType(file.name) || "application/octet-stream";
    const fileName = file.name;

    // set streaming headers
    ctx.set("Content-Type", fileType);
    ctx.set("Accept-Ranges", "bytes");
    ctx.attachment(fileName, { fallback: false, type: "inline" });
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
      ctx.set("Content-Length", file.size.toString());
    }

    if (process.env.SPLIT !== undefined) {
      const readStream = new IPCReadStream(
        streamIpcManager,
        streamTorrent.infoHash,
        file.id,
        filePath,
        range && range.start,
        range && range.end
      );
      ctx.body = readStream;
    } else {
      const torrent = torrentContainer.getTorrent(streamTorrent.infoHash);
      if (!torrent) {
        return;
      }
      const readStream = torrent.files[file.id].createReadStream(range);
      ctx.body = readStream;
    }
  }
}

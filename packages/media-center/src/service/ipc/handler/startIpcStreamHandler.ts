import { Readable } from "stream";

import {
  HandlerInterface,
  StartIpcStreamAction,
  START_IPC_STREAM_ACTION,
  IpcStreamChunkAction,
  IPC_STREAM_CHUNK_ACTION,
} from "../interface";
import { TorrentContainer } from "../../torrent";
import { dispatchIPCAction } from "../dispatchIpcAction";
import { openStreamsRepository } from "../../../repository";
// import WebTorrent from "webtorrent";
// import FileStream from "webtorrent/lib/file-stream";

// interface Torrent extends WebTorrent.Torrent {
//   bitfield: any;
//   critical(start: number, end: number): void;
// }

// interface TorrentFile extends WebTorrent.TorrentFile {
//   readonly offset: number;
// }

export class StartIpcStreamHandler implements HandlerInterface {
  constructor(
    protected torrentContainer: TorrentContainer,
    protected bubble: boolean = false
  ) {}

  canHandle(action: StartIpcStreamAction): boolean {
    return action.type === START_IPC_STREAM_ACTION;
  }

  canBubble(): boolean {
    return this.bubble;
  }

  handle(action: StartIpcStreamAction): boolean {
    if (openStreamsRepository.has(action.payload.streamId)) {
      return false;
    }

    const torrent = this.torrentContainer.getTorrent(
      action.payload.torrentInfoHash
    );
    if (!torrent) {
      throw new Error(
        `Invalid torrent hash: ${action.payload.torrentInfoHash}`
      );
    }
    const file = torrent.files[action.payload.fileId];
    if (!file) {
      throw new Error(
        `Invalid file id ${action.payload.fileId} for torrent ${action.payload.torrentInfoHash}`
      );
    }

    const start = action.payload.start || 0;
    const end = action.payload.end || file.length - 1;
    // better optimisation if we implement this instead of relying on file.createReadStream
    // const startPiece = (start / torrent.pieceLength) | 0;
    // const endPiece = (end / torrent.pieceLength) | 0;
    // const criticalLength = Math.min(
    //   ((1024 * 1024) / torrent.pieceLength) | 0,
    //   2
    // );

    // let currentPiece = startPiece;
    // torrent.select(startPiece, endPiece, 100, () => {
    //   if (!torrent.bitfield.get(currentPiece)) {
    //     return torrent.critical(currentPiece, currentPiece + criticalLength);
    //   }
    //   ++currentPiece;
    // });

    // @TODO: use a logger
    console.log("start stream", action.payload.streamId);

    let chunkStart = start;
    const fileReadStream = file.createReadStream({
      start,
      end,
    }) as Readable;

    fileReadStream.on("data", (chunk: Buffer) => {
      dispatchIPCAction<IpcStreamChunkAction>({
        type: IPC_STREAM_CHUNK_ACTION,
        payload: {
          streamId: action.payload.streamId,
          chunkStart,
          chunkSize: chunk.length,
        },
        forward: ["stream"],
      });

      chunkStart += chunk.length;
    });
    fileReadStream.on("end", () => {
      dispatchIPCAction<IpcStreamChunkAction>({
        type: IPC_STREAM_CHUNK_ACTION,
        payload: {
          streamId: action.payload.streamId,
          chunkStart,
          chunkSize: 0,
        },
        forward: ["stream"],
      });
    });

    openStreamsRepository.set(action.payload.streamId, fileReadStream);

    return true;
  }
}

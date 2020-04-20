import socketio from "socket.io";
import ParseTorrent from "parse-torrent";
import WebTorrent from "webtorrent";
import mime from "mime";

import { torrentContainer } from "../../singleton";
import { generateInfoHashId } from "../../helper";

function getFile(torrent: WebTorrent.Torrent, fileId?: number): any[] {
  if (fileId !== undefined) {
    return [fileId, torrent.files[fileId]];
  }

  let responseFile: WebTorrent.TorrentFile | null = null;
  let responseFileId: number | null = null;
  torrent.files.forEach((file, index) => {
    if (responseFile === null || responseFile.length < file.length) {
      responseFile = file;
      responseFileId = index;
    }
  });

  return [responseFileId, responseFile];
}

const statsUpdaters: Map<string, NodeJS.Timeout> = new Map();
function startStatsUpdates(
  socket: socketio.Socket,
  playerId: string,
  torrent: WebTorrent.Torrent
): void {
  const response = getFile(torrent);
  const file = response[1] as WebTorrent.TorrentFile | null;
  const statsUpdater = setInterval(
    (playerId, torrent) => {
      socket.emit("stats", {
        playerId,
        uploadSpeed: torrent.uploadSpeed,
        uploaded: torrent.uploaded,
        downloadSpeed: torrent.downloadSpeed,
        downloaded: (file && file.downloaded) || torrent.downloaded,
        progress: (file && file.progress) || torrent.progress,
        size: (file && file.length) || torrent.length,
      });
    },
    1000,
    playerId,
    torrent
  );
  statsUpdaters.set(playerId, statsUpdater);
}

function sendVideoData(
  socket: socketio.Socket,
  playerId: string,
  torrent: WebTorrent.Torrent
): void {
  const key = generateInfoHashId(torrent.infoHash);
  const response = getFile(torrent);
  if (response[0] === null) {
    // TODO: emit error
    return;
  }
  const fileId = response[0] as number;
  const file = response[1] as WebTorrent.TorrentFile;
  socket.emit("loaded", {
    playerId,
    streamUri: `stream/${key}/${fileId}`,
    fileName: file.name,
    fileType: mime.getType(file.name) || "application/octet-stream",
  });
}

function onLoad(socket: socketio.Socket) {
  return (data: Record<string, any>): void => {
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
        startStatsUpdates(socket, playerId, torrent);
      });
      return;
    }

    sendVideoData(socket, playerId, torrent);
    startStatsUpdates(socket, playerId, torrent);
  };
}

function onStop(playerId: string): void {
  const statsUpdater = statsUpdaters.get(playerId);
  if (statsUpdater) {
    clearInterval(statsUpdater);
    statsUpdaters.delete(playerId);
  }
}

function onDisconnect(): void {
  statsUpdaters.forEach(clearInterval);
  statsUpdaters.clear();
}

export function playerOnConnection(socket: socketio.Socket): void {
  socket.on("load", onLoad(socket));
  socket.on("stop", onStop);
  socket.on("disconnect", onDisconnect);
}

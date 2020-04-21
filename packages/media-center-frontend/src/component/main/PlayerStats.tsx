import React from "react";
import Octicon, { ArrowDown, ArrowUp } from "@primer/octicons-react";

import { playerIo } from "../../service";

interface PlayerStatsProps {
  playerId: string;
}

interface StatsData {
  downloadSpeed: number;
  downloaded: number;
  uploadSpeed: number;
  uploaded: number;
  progress: number;
  size: number;
}

function toReadable(bytes: number): string {
  const labels = ["B", "KB", "MB", "GB"];
  let readable = bytes;
  let index = 0;
  while (readable / 1024 > 0.01 && index < labels.length - 1) {
    readable = readable / 1024;
    index += 1;
  }

  return `${readable.toFixed(2)} ${labels[index]}`;
}

function PlayerStats({ playerId }: PlayerStatsProps) {
  const [stats, setStats] = React.useState<StatsData | null>(null);

  const onStats = React.useCallback(
    (data: any) => {
      if (data.playerId !== playerId) {
        return;
      }
      setStats({
        downloadSpeed: data.downloadSpeed,
        downloaded: data.downloaded,
        uploadSpeed: data.uploadSpeed,
        uploaded: data.uploaded,
        progress: data.progress,
        size: data.size,
      });
    },
    [playerId]
  );

  React.useEffect(() => {
    playerIo.on("stats", onStats);
    return () => {
      playerIo.off("stats", onStats);
    };
  }, [onStats]);

  return (
    <>
      {stats && (
        <section className="d-flex small">
          <div className="text-success">
            {toReadable(stats.downloadSpeed)} <Octicon icon={ArrowDown} />
          </div>
          <div className="m-auto text-info">
            {(stats.progress * 100).toFixed(2)} % (
            {toReadable(stats.downloaded)} / {toReadable(stats.size)})
          </div>
          <div className="text-danger">
            {toReadable(stats.uploadSpeed)} <Octicon icon={ArrowUp} />
          </div>
        </section>
      )}
    </>
  );
}

export default PlayerStats;

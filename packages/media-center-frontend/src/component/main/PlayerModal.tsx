import React from "react";
import ReactDom from "react-dom";
import Modal from "react-bootstrap/Modal";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
import Octicon, { Clippy } from "@primer/octicons-react";
import * as uuid from "uuid";

import { playerIo } from "../../service";
import { API_HOST } from "../../constants";
import PlayerStats from "./PlayerStats";

interface PlayerModalProps {
  itemId: string;
  imdbId?: string;
  season?: number;
  episode?: number;
  torrentUrl: string;
  show: boolean;
  onHide: () => void;
}

interface StreamData {
  fileName: string;
  fileType: string;
  streamUrl: string;
  subUrl: string;
}

const supportedFileTypes = ["video/mp4", "video/webm", "video/ogg"];

function PlayerModal({
  itemId,
  imdbId,
  season,
  episode,
  torrentUrl,
  onHide,
  show,
}: PlayerModalProps) {
  const [streamData, setStreamData] = React.useState<StreamData | null>(null);
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [canPlayVideo, setCanPlayVideo] = React.useState(false);
  const streamUrlRef = React.useRef<HTMLInputElement | null>(null);

  const playerId = React.useMemo(() => {
    return `${itemId}-${uuid.v4()}`;
  }, [itemId]);

  const onLoaded = React.useCallback(
    (data: any) => {
      if (data.playerId !== playerId) {
        return;
      }

      ReactDom.unstable_batchedUpdates(() => {
        setShowSpinner(false);
        setStreamData({
          streamUrl: `${API_HOST}${data.streamUri}`,
          subUrl: `${API_HOST}${data.streamUri.replace(
            "stream",
            "sub"
          )}?imdbid=${
            imdbId || itemId
          }&season=${season}&episode=${episode}&lang=en`,
          fileName: data.fileName,
          fileType: data.fileType,
        });
        setCanPlayVideo(supportedFileTypes.includes(data.fileType));
      });
    },
    [playerId, itemId, imdbId, season, episode]
  );

  React.useEffect(() => {
    if (!show) {
      return;
    }

    playerIo.on("loaded", onLoaded);
    playerIo.emit("load", {
      playerId,
      torrentUrl,
    });

    return () => {
      setStreamData(null);
      playerIo.off("loaded", onLoaded);
      playerIo.emit("stop", playerId);
    };
  }, [show, onLoaded, playerId, torrentUrl]);

  return (
    <Modal size="xl" show={show} onHide={onHide} animation={false}>
      <Modal.Body className="bg-dark">
        <PlayerStats playerId={playerId} />
        <ResponsiveEmbed aspectRatio="16by9">
          <>
            {showSpinner && (
              <div className="embed-responsive-item d-flex justify-content-center">
                <div className="spinner-border text-light m-auto" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {!!streamData && !canPlayVideo && (
              <div className="embed-responsive-item d-flex justify-content-center">
                <div className="m-auto form-inline">
                  <input
                    ref={streamUrlRef}
                    className="form-control form-control-sm"
                    type="text"
                    value={streamData.streamUrl}
                    readOnly
                    style={{ width: "270px" }}
                  />
                  <button
                    className="btn btn-sm btn-light"
                    title="Copy"
                    onClick={() => {
                      if (!streamUrlRef || !streamUrlRef.current) {
                        return;
                      }
                      streamUrlRef.current.select();
                      streamUrlRef.current.setSelectionRange(0, 99999);
                      document.execCommand("copy");
                    }}
                  >
                    <Octicon icon={Clippy} />
                  </button>
                </div>
              </div>
            )}
            {!!streamData && canPlayVideo && (
              <video
                className="embed-responsive-item"
                controls
                autoPlay
                playsInline
                crossOrigin="use-credential"
              >
                <source src={streamData.streamUrl} type={streamData.fileType} />
                <track
                  label="English"
                  kind="subtitles"
                  srcLang="en"
                  src={streamData.subUrl}
                  default
                />
              </video>
            )}
          </>
        </ResponsiveEmbed>
      </Modal.Body>
    </Modal>
  );
}

export default PlayerModal;

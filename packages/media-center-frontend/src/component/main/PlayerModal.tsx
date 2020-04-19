import React from "react";
import Modal from "react-bootstrap/Modal";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
import * as uuid from "uuid";

import { playerIo } from "../../service";
import { API_HOST } from "../../constants";

interface PlayerModalProps {
  itemId: string;
  torrentUrl: string;
  show: boolean;
  onHide: () => void;
}

interface StreamData {
  fileName: string;
  fileType: string;
  streamUrl: string;
}

const supportedFileTypes = ["video/mp4", "video/webm", "video/ogg"];

function PlayerModal({ itemId, torrentUrl, onHide, show }: PlayerModalProps) {
  const [streamData, setStreamData] = React.useState<StreamData | null>(null);
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [canPlayVideo, setCanPlayVideo] = React.useState(false);

  const playerId = React.useMemo(() => {
    return `${itemId}-${uuid.v4()}`;
  }, [itemId]);

  const onLoaded = React.useCallback(
    (data: any) => {
      if (data.playerId !== playerId) {
        return;
      }

      setShowSpinner(false);
      setStreamData({
        streamUrl: `${API_HOST}${data.streamUri}`,
        fileName: data.fileName,
        fileType: data.fileType,
      });
      setCanPlayVideo(supportedFileTypes.includes(data.fileType));
    },
    [playerId]
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
      playerIo.emit("stop", {
        playerId,
      });
    };
  }, [show, onLoaded, playerId, torrentUrl]);

  return (
    <Modal size="xl" show={show} onHide={onHide} animation={false}>
      <Modal.Body className="bg-dark">
        <ResponsiveEmbed aspectRatio="16by9">
          <>
            {showSpinner && (
              <div className="embed-responsive-item d-flex justify-content-center">
                <div className="spinner-border text-light m-auto" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {!!streamData && (
              <div className="embed-responsive-item d-flex justify-content-center">
                <div className="m-auto">
                  <p>{streamData.streamUrl}</p>
                </div>
              </div>
            )}
            {!!streamData && canPlayVideo && (
              <video
                className="embed-responsive-item"
                controls
                autoPlay
                playsInline
              >
                <source src={streamData.streamUrl} type={streamData.fileType} />
              </video>
            )}
          </>
        </ResponsiveEmbed>
      </Modal.Body>
    </Modal>
  );
}

export default PlayerModal;

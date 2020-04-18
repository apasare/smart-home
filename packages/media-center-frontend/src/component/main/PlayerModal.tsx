import React from "react";
import Modal from "react-bootstrap/Modal";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
import uuid from "uuid";

import { io } from "../../service";
import { API_ENDPOINT } from "../../constants";

interface PlayerModalProps {
  itemId: string;
  torrentUrl: string;
  show: boolean;
  onHide: () => void;
}

function PlayerModal({ itemId, torrentUrl, onHide, show }: PlayerModalProps) {
  const [streamUrl, setStreamUrl] = React.useState<string | null>(null);
  const playerId = React.useMemo(() => {
    return `${itemId}-${uuid.v4()}`;
  }, [itemId]);

  const onLoaded = React.useCallback(
    (data: any) => {
      if (data.playerId !== playerId) {
        return;
      }

      if (data.streamUri) {
        setStreamUrl(`${API_ENDPOINT}${data.streamUri}`);
      }
    },
    [playerId]
  );

  React.useEffect(() => {
    if (!show) {
      return;
    }

    io.on("loaded", onLoaded);
    io.emit("load", {
      playerId,
      torrentUrl,
    });

    return () => {
      setStreamUrl(null);
      io.off("loaded", onLoaded);
      io.emit("stop", {
        message: "stop it",
      });
    };
  }, [show, onLoaded, playerId, torrentUrl]);

  return (
    <Modal size="xl" show={show} onHide={onHide} animation={false}>
      <Modal.Body className="bg-dark">
        {streamUrl && (
          <ResponsiveEmbed aspectRatio="16by9">
            <video className="embed-responsive-item" controls autoPlay playsInline>
              <source src={streamUrl} type="video/mp4" />
            </video>
          </ResponsiveEmbed>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PlayerModal;

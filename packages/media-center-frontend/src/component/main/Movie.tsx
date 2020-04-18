import React from "react";
import { useParams } from "react-router-dom";
import Octicon, { DeviceCameraVideo } from "@primer/octicons-react";

import { API_ENDPOINT } from "../../constants";
import TrailerModal from "./TrailerModal";
import PlayerModal from "./PlayerModal";

function Movie() {
  const { id } = useParams();
  const [item, setItem] = React.useState<any>(undefined);
  const [showTrailer, setShowTrailer] = React.useState(false);
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [audioLanguage, setAudioLanguage] = React.useState("");
  const [resolution, setResolution] = React.useState("");

  const toggleShowTrailer = React.useCallback(
    () => setShowTrailer((showTrailer) => !showTrailer),
    []
  );
  const toggleShowPlayer = React.useCallback(
    () => setShowPlayer((showPlayer) => !showPlayer),
    []
  );
  const onAudioLanguageChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setAudioLanguage(event.currentTarget.value);
    },
    []
  );
  const onResolutionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setResolution(event.currentTarget.value);
    },
    []
  );

  React.useEffect(() => {
    (async () => {
      const response = await fetch(`${API_ENDPOINT}movies/${id}`);
      const item = await response.json();
      const defaultAudioLang = Object.keys(item.torrents)[0];
      const defaultResolution = Object.keys(item.torrents[defaultAudioLang])[0];

      setItem(item);
      setAudioLanguage(defaultAudioLang);
      setResolution(defaultResolution);
    })();
  }, [id]);

  const languages = item ? Object.keys(item.torrents) : [];
  const resolutions =
    item && audioLanguage ? Object.keys(item.torrents[audioLanguage]) : [];

  return item ? (
    <article className="row justify-content-start movie-article position-relative">
      <section className="col-sm col-md-4 col-lg-4">
        <img className="img-fluid" src={item.images.banner} alt={item.title} />
      </section>
      <section className="col-sm col-md-8 col-lg-8">
        <h3 className="mt-0">{item.title}</h3>
        <span className="small">
          {item.year} &middot; {item.runtime} min &middot;{" "}
          {item.genres.join(" / ")}
        </span>
        <p className="lead mt-3 mb-5">{item.synopsis}</p>

        <nav
          className="navbar navbar-expand-md navbar-dark bg-dark position-absolute"
          style={{ left: 0, bottom: 0, width: "100%", padding: "inherit" }}
        >
          <button
            className="navbar-toggler"
            style={{ fontSize: "1rem", lineHeight: "1.5" }}
            type="button"
            data-toggle="collapse"
            data-target="#playerMenu"
            aria-controls="playerMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <Octicon icon={DeviceCameraVideo}></Octicon>
          </button>

          <div className="collapse navbar-collapse" id="playerMenu">
            <form className="form-inline" style={{ width: "100%" }}>
              <div className="mr-auto">
                {item.trailer && (
                  <button
                    type="button"
                    className="btn btn-light my-1 mr-2"
                    onClick={toggleShowTrailer}
                  >
                    Watch Trailer
                  </button>
                )}
              </div>
              {languages.length > 1 && (
                <>
                  <label
                    className="d-sm-none my-1 mr-2"
                    htmlFor="audioLanguage"
                  >
                    Audio Language
                  </label>
                  <select
                    id="audioLanguage"
                    className="custom-select my-1 mr-2"
                    onChange={onAudioLanguageChange}
                    defaultValue={audioLanguage}
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {resolutions.length > 1 && (
                <>
                  <label
                    className="d-none d-md-inline-block my-1 mr-2"
                    htmlFor="resolution"
                  >
                    Resolution
                  </label>
                  <select
                    id="resolution"
                    className="custom-select my-1 mr-2"
                    onChange={onResolutionChange}
                    defaultValue={resolution}
                  >
                    {resolutions.map((res) => (
                      <option key={res} value={res}>
                        {res}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <button
                type="button"
                className="btn btn-light"
                onClick={toggleShowPlayer}
              >
                Play
              </button>
            </form>
          </div>
        </nav>
      </section>

      <TrailerModal
        item={item}
        show={showTrailer}
        onHide={toggleShowTrailer}
      ></TrailerModal>

      <PlayerModal
        itemId={item._id}
        torrentUrl={
          item && audioLanguage && resolution
            ? item.torrents[audioLanguage][resolution].url
            : ""
        }
        show={showPlayer}
        onHide={toggleShowPlayer}
      ></PlayerModal>
    </article>
  ) : null;
}

export default Movie;

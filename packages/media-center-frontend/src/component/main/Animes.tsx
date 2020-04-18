import React from "react";

import Items from "./Items";

function Animes() {
  const getAnimePosterUrl = React.useCallback(
    (item) => `https://media.kitsu.io/anime/poster_images/${item._id}/large.jpg`,
    []
  );

  return <Items apiResource="animes" getPosterUrl={getAnimePosterUrl} />;
}

export default Animes;

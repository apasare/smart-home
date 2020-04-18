import React from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";

import placeholder from "./poster-placeholder.png";
import { API_ENDPOINT } from "../../constants";

interface ItemsProps {
  apiResource: string;
  getPosterUrl?: Function;
}

function Items({ apiResource, getPosterUrl }: ItemsProps) {
  const [items, setItems] = React.useState<Record<string, any>[]>([]);
  const [hasMoreItems, setHasMoreItems] = React.useState(true);
  const loadMoreItems = React.useCallback(
    async (page) => {
      const response = await fetch(
        `${API_ENDPOINT}${apiResource}?page=${page}`
      );
      const newItems: Record<string, any>[] = await response.json();
      if (!newItems.length) {
        setHasMoreItems(false);
        return;
      }
      setItems((items) => [...items, ...newItems]);
    },
    [apiResource]
  );

  return (
    <InfiniteScroll
      hasMore={hasMoreItems}
      loadMore={loadMoreItems}
      className="d-flex flex-wrap"
    >
      {items.map((item: Record<string, any>) => (
        <article key={item._id} className="m-2 flex-fill">
          <Link
            to={`/${apiResource}/${item._id}`}
            className="d-block"
            title={item.title}
          >
            <div className="card bg-dark text-light movie-card">
              <div
                className="cover mb-2"
                style={{
                  backgroundImage: `url("${
                    getPosterUrl
                      ? getPosterUrl(item)
                      : item.images.poster || placeholder
                  }")`,
                }}
              ></div>
              <h6 className="text-truncate">{item.title}</h6>
              <span>{item.year}</span>
            </div>
          </Link>
        </article>
      ))}
    </InfiniteScroll>
  );
}

export default Items;

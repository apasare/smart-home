import React from "react";
import ReactDom from "react-dom";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import qs from "querystring";

import placeholder from "./poster-placeholder.png";
import { API_HOST } from "../../constants";
import { useQuery } from "../../hook";

interface ItemsProps {
  apiResource: string;
  getPosterUrl?: Function;
}

const loader = (
  <article key="loader" className="m-2 align-self-center">
    <div className="movie-card d-flex justify-content-center">
      <div className="spinner-border text-light" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  </article>
);

function Items({ apiResource, getPosterUrl }: ItemsProps) {
  const [items, setItems] = React.useState<Record<string, any>[]>([]);
  const [hasMoreItems, setHasMoreItems] = React.useState(true);
  const [counter, setCounter] = React.useState(0);
  const query = useQuery();
  const itemsPerPage = 50;

  const loadMoreItems = React.useCallback(
    async (page) => {
      const queryParams = {
        page,
        keywords: query.get("keywords") || "",
      };
      const response = await fetch(
        `${API_HOST}${apiResource}?${qs.stringify(queryParams)}`
      );
      const newItems: Record<string, any>[] = await response.json();

      ReactDom.unstable_batchedUpdates(async () => {
        setHasMoreItems(newItems.length === itemsPerPage);
        setCounter((counter) => (page === 1 ? ++counter : counter));
        setItems(page === 1 ? newItems : (items) => [...items, ...newItems]);
      });
    },
    [apiResource, query]
  );

  React.useEffect(() => {
    (async () => {
      await loadMoreItems(1);
    })();
  }, [loadMoreItems]);

  return (
    <>
      <InfiniteScroll
        key={counter}
        pageStart={1}
        initialLoad={false}
        hasMore={hasMoreItems}
        loadMore={loadMoreItems}
        loader={loader}
        className="d-flex flex-wrap justify-content-start"
      >
        {items.map((item: Record<string, any>) => (
          <article key={item._id} className="m-2">
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
    </>
  );
}

export default Items;

import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import qs from "querystring";

import LiNavLink from "./LiNavLink";
import { useQuery } from "../../hook";

function NavBar() {
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const resourcePath = location.pathname.split("/")[1];

  const [keywords, setKeywords] = React.useState(query.get("keywords") || "");

  React.useEffect(() => {
    setKeywords(query.get("keywords") || "");
  }, [query]);

  const doSearch = (event: React.FormEvent) => {
    const params: Record<string, string> = {};
    if (keywords) {
      params.keywords = keywords;
    }

    history.push(`/${resourcePath}?${qs.stringify(params)}`);

    event.preventDefault();
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#topMenu"
        aria-controls="topMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="topMenu">
        <ul className="navbar-nav mr-auto">
          <LiNavLink to="/movies" activeClassName="active" className="nav-link">
            Movies
          </LiNavLink>
          <LiNavLink to="/shows" activeClassName="active" className="nav-link">
            Shows
          </LiNavLink>
          <LiNavLink to="/animes" activeClassName="active" className="nav-link">
            Animes
          </LiNavLink>
        </ul>
        <form className="form-inline my-2 my-lg-0" onSubmit={doSearch}>
          <input
            className="form-control form-control-sm mr-sm-2"
            type="search"
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn btn-sm btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}

export default NavBar;

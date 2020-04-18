import React from "react";
import LiNavLink from "./LiNavLink";

function NavBar() {
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
        <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
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

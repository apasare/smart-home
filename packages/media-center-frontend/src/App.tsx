import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import { NavBar, Movies, Movie, Shows, Animes } from "./component";

function App() {
  return (
    <div className="container-fluid">
      <NavBar />

      <main>
        <Switch>
          <Route path="/movies/:id">
            <Movie />
          </Route>
          <Route path="/movies">
            <Movies />
          </Route>

          <Route path="/shows">
            <Shows />
          </Route>

          <Route path="/animes">
            <Animes />
          </Route>

          <Route exact path="/">
            <Redirect to="/movies" />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;

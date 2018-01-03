// npm packages
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

// our packages
import Home from "./pages/Home";
import Series from "./pages/Series";
import Episode from "./pages/Episode";

// render on page
ReactDOM.render(
  <HashRouter>
    <div className="container is-fluid">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/series/:id" component={Series} />
        <Route path="/episode/:id" component={Episode} />
        <Route component={Home} />
      </Switch>
    </div>
  </HashRouter>,
  document.getElementById("app")
);

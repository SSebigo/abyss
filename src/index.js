// npm packages
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

// our packages
// components

// pages
import Home from "./pages/Home";

ReactDOM.render(
  <div className="hero">
    <HashRouter>
      <div className="hero-body">
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={Home} />
          </Switch>
        </div>
      </div>
    </HashRouter>
  </div>,
  document.getElementById("app")
);

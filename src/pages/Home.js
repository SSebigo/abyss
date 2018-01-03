// npm packages
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Observable } from "rxjs";
import _ from "lodash";

// our packages
import db from "../db";
import { Abyss } from "../api";

// our components
import Series from "../components/Series";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: []
    };

    // trigger series catalogue loading
    Abyss.Series();
  }

  componentDidMount() {
    this.sub = Observable.fromEvent(
      db.series.changes({
        since: 0,
        live: true,
        include_docs: true
      }),
      "change"
    )
      .filter(change => !change.deleted)
      .map(change => change.doc)
      .scan((acc, doc) => acc.concat([doc]), [])
      .debounceTime(1000)
      .subscribe(series => this.setState({ series }));
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  render() {
    const { series } = this.state;

    return (
      <div>
        {_.chunk(series, 4).map((chunk, i) => (
          <div key={`chunck_${i}`} className="columns">
            {chunk.map(s => <Series key={s._id} series={s} />)}
          </div>
        ))}
      </div>
    );
  }
}

Home.propTypes = {};

export default Home;

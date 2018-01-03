// npm packages
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Observable } from "rxjs";
import { Link } from "react-router-dom";
import _ from "lodash";

// our packages
import db from "../db";
import { AnimeWatcher } from "../api";

// our components
import Episode from "../components/Episode";

class Series extends Component {
  constructor(props) {
    super(props);

    this.state = {
      episodes: []
    };

    // trigger episodes loading
    this.init(props);
  }

  async componentDidMount() {
    const series = await this.getSeries(this.props);

    this.sub = Observable.fromEvent(
      db.episodes.changes({
        since: 0,
        live: true,
        include_docs: true
      }),
      "change"
    )
      .filter(change => !change.deleted)
      .map(change => change.doc)
      .filter(doc => doc.series === series._id)
      .scan((acc, doc) => acc.concat([doc]), [])
      .debounceTime(1000)
      .subscribe(episodes => this.setState({ episodes }));
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  async getSeries(props) {
    const { location } = props;
    let series = location.state;
    if (!series) {
      const { data } = await db.current.get("series");
      series = data;
    }
    return series;
  }

  async init(props) {
    const series = await this.getSeries(props);
    AnimeWatcher.Episodes(series);
  }

  render() {
    const { episodes } = this.state;

    return (
      <div>
        <nav className="navbar is-transparent">
          <div className="navbar-item">
            <Link to="/" className="bd-tw-button button">
              <span className="icon">
                <i className="fa fa-arrow-left" />
              </span>
              <span>Back</span>
            </Link>
          </div>
        </nav>

        {_.chunk(episodes, 4).map((chunk, i) => (
          <div key={`chunck_${i}`} className="columns">
            {chunk.map(ep => <Episode key={ep._id} episode={ep} />)}
          </div>
        ))}
      </div>
    );
  }
}

Series.propTypes = {};

export default Series;

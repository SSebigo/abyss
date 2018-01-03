// npm packages
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import videojs from "video.js";
import path from "path";
import fs from "fs";

// our packages
import { Abyss } from "../api";

// our components

class Episode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      episode: null,
      file: null
    };

    // trigger episode loading
    this.init(props);
  }

  componentDidUpdate() {
    const { episode, file } = this.state;

    if (!episode || !file) {
      return;
    }

    videojs("video");
  }

  componentWillUnmount() {
    videojs("video").dispose();
  }

  async init(props) {
    const { location } = props;
    const file = await Abyss.Episode(location.state);

    this.setState({
      episode: location.state,
      file
    });
  }

  goBackToEpisode(episodePath, subtitlesPath, history) {
    fs.unlink(episodePath, err => {
      if (err) throw err;
      console.log("Episode file deleted.");
    });

    fs.unlink(subtitlesPath, err => {
      if (err) throw err;
      console.log("Subtitles file deleted.");
    });

    history.goBack();
  }

  render() {
    const { episode, file } = this.state;
    const { history } = this.props;

    let body = <div>Loading...</div>;

    if (episode || file) {
      body = (
        <video
          id="video"
          className="video-js vjs-default-skin vjs-big-play-centered vjs-fluid"
          controls
          autoPlay
          preload="auto"
        >
          <source src={file.video} type="video/mp4" />
          <track
            kind="captions"
            src={file.subtitles}
            srcLang="en"
            label="English"
            default
          />
        </video>
      );
    }

    return (
      <div>
        <nav className="nav">
          <div className="nav-left nav-menu">
            <div className="nav-item">
              <a
                href="#back"
                className="button"
                onClick={() =>
                  this.goBackToEpisode(file.video, file.subtitles, history)
                }
              >
                <span className="icon">
                  <i className="fa fa-arrow-left" />
                </span>
                <span>Back</span>
              </a>
            </div>
          </div>
        </nav>

        <div className="columns">
          <div className="column">{body}</div>
        </div>
      </div>
    );
  }
}

Episode.propTypes = {};

export default Episode;

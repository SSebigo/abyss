import React from "react";
import { withRouter } from "react-router-dom";

const Episode = withRouter(({ episode, history }) => {
  const openEpisodePage = () => {
    // but you can use a location instead
    const location = {
      pathname: `/episode/${episode._id}`,
      state: episode
    };

    history.push(location);
  };

  return (
    <div className="column">
      <div className="card" onClick={openEpisodePage}>
        <div className="card-image">
          <figure className="image is-4by3">
            <img alt={episode.episode_title} />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title is-4">
                {episode.anime_title +
                  " - Episode " +
                  episode.episode_info.episode_number}
              </p>
              {/* <p className="subtitle is-6">{episode.description}</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Episode;

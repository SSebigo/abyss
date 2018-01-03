// npm packages
import React from "react";
import { withRouter } from "react-router-dom";

// our packages
import db from "../../db";

const Series = withRouter(({ series, history }) => {
  const openSeriesPage = async () => {
    // but you can use a location instead
    const location = {
      pathname: `/series/${series._id}`,
      state: series
    };

    try {
      const doc = await db.current.get("series");
      const update = {
        _id: "series",
        data: series
      };
      if (doc) {
        update._rev = doc._rev;
      }
      await db.current.put(update);
    } catch (error) {
      if (error.status === 404) {
        await db.current.put({ _id: "series", data: series });
      }
    }

    history.push(location);
  };

  return (
    <div className="column">
      <div className="card" onClick={openSeriesPage}>
        <div className="card-image">
          <figure className="image is-4by3">
            <img src={series.image} alt={series.title} />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title is-4">{series.title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Series;

import PouchDB from "pouchdb-browser";

const db = {
  episodes: new PouchDB("episodes"),
  series: new PouchDB("series"),
  current: new PouchDB("current")
};

export default db;

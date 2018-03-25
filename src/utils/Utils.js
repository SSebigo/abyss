// npm packages
import _ from "lodash";
import fs from "fs-extra";
import path from "path";

// our packages

/**
 * Asynchronously read given directory
 *
 * @param {String} path Path to directory to read
 * @returns Promise
 */
export let readdirAsync = path => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, list) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(list);
    });
  });
};

/**
 * Create directory asynchronously
 *
 * @param {any} directory
 */
export let createDirAsync = async directory => {
  try {
    await fs.ensureDir(directory);
    console.log("success!");
  } catch (err) {
    console.error(err);
  }
};

/**
 * Check if value is not an empty string or 1 char string
 *
 * @param {String} value
 * @returns Boolean
 */
export let isLongEnough = value => {
  return value.length > 1;
};

/**
 * Check if title is in array
 *
 * @param {Array} array Array of anime title & synonyms retrieve from MyAnimeList
 * @param {String} title
 * @returns Boolean
 */
export let isEpisode = (array, title) => {
  let isEp = false;

  array.map(a => {
    if (_.isEqual(a, title)) {
      isEp = true;
    }
  });
  return isEp;
};

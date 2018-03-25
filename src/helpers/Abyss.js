// npm packages
import _ from "lodash";
import fs from "fs-extra";
import path from "path";

// our packages
import { Popura } from "../api/Popura";
import { isLongEnough } from "../utils/index";

/**
 * Modify anime directory names (e.g: berserk.2012 => Berserk)
 * may help reduce loading time for future uses
 * return an empty Promise array
 * TODO: has I haven't find a better way to beautify everything, this will do for now
 *
 * @param {Promise} series List of all anime folders
 * @param {String} targetDirectory Path to directory where folders will be beautify
 * @returns Promise
 */
export let beautifyFolders = (series, targetDirectory) => {
  return new Promise(async resolve => {
    const animeList = await Popura.getAnimeList();

    // console.log("anime list:", animeList);

    // beautify given directory
    const promises = [];

    series.map(s => {
      animeList.list.map(anime => {
        // remove duplicate synonyms in anime series_synonyms
        // remove empty elements from array series_synonyms
        // concat main anime title with series_synonyms
        const titles = _.uniq(
          _.compact(anime.series_synonyms)
            .concat(anime.series_title)
            .filter(isLongEnough)
            .sort()
        );

        // console.log("titles:", titles);
        titles.map(title => {
          // prepare two important variables for beaufification step
          const beautifyID = s
            .toLowerCase()
            .replace(/[\W_]+/g, " ")
            .trim();

          const beautifyTitle = title
            .toLowerCase()
            .replace(/[\W_]+/g, " ")
            .trim();

          if (
            isLongEnough(beautifyTitle) &&
            _.includes(beautifyID, beautifyTitle) &&
            !_.isEqual(beautifyID, beautifyTitle)
          ) {
            // console.log("Good to be beautify");
            // console.log("beautifyID:", beautifyID);
            // console.log("beautifyTitle:", beautifyTitle);

            promises.push(
              Promise.resolve(
                new Promise((resolve, reject) => {
                  const dirPath = path.join(targetDirectory, s);
                  // console.log("url:", dirPath);
                  fs.lstat(dirPath, (err, stats) => {
                    if (err) reject(err);
                    if (stats.isFile()) {
                      console.log(
                        "It's a file. Create a folder and move it in."
                      );
                    } else if (stats.isDirectory()) {
                      fs.rename(
                        dirPath,
                        path.join(targetDirectory, title),
                        err => {
                          if (err) reject(err);
                          resolve();
                        }
                      );
                    }
                  });
                })
              )
            );
          } else {
            return;
          }
        });
      });
    });

    // // beautify directory
    // // TODO: maybe there's a better solution but for now it ok
    await Promise.all(promises);
    // .then(res => console.log("all promise res: ", res));
    // .catch(err => console.log("all promise err: ", err));
    resolve();
  });
};

/**
 * very rudimentary episode string parser
 * only try to create a route path
 * and retrieve episode number
 *
 * @param {String} episode
 * @param {String} anime
 * @returns Object
 */
export let episodeParser = (episode, anime) => {
  const splitEpisode = episode
    .toLowerCase()
    .replace(/[\W_]+/g, " ")
    .trim()
    .split(" ");

  const splitAnime = anime
    .toLowerCase()
    .replace(/[\W_]+/g, " ")
    .trim()
    .split(" ");

  // console.log("split episode:", splitEpisode);
  // console.log("split anime:", splitAnime);

  const popAnime = splitAnime.pop();

  // console.log("pop anime:", popAnime);

  const episodeNumber = splitEpisode[splitEpisode.indexOf(popAnime) + 1];

  // console.log("episode number:", episode_number);

  // let route_anime = null;

  // if (splitAnime.length + 1 > 1) {
  //   route_anime = anime.toLowerCase().replace(/[\W_]+/g, "-");
  // } else {
  //   route_anime = anime.toLowerCase().replace(/[\W_]+/g, "");
  // }

  // const route = "/" + route_anime + "/episode-" + episode_number;

  // console.log("route:", route);

  return { episodeNumber: episodeNumber };
};

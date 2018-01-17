// npm packages
import _ from "lodash";
import cloudinary from "cloudinary";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs-extra";
import path from "path";

// our packages
import { Popura } from "../api/Popura";
const cloudinaryConfig = require("../../cloudinary_config.json");

// configure cloudinary
cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret
});

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
                  console.log("url:", dirPath);
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

export let documentifySeries = (series, directory) => {
  return series.map(element => {
    const url = path.resolve(directory, element);

    const image = cloudinary.url(element.toLowerCase() + (".jpg" || ".png"), {
      secure: true
    });

    return { _id: element, directory_url: url, title: element, image: image };
  });
};

export let documentifyEpisodes = (id, episodes, directory) => {
  return episodes.map(element => {
    const url = path.resolve(directory, element);

    const anime_title = directory.split("\\").pop();

    const episode_info = episodeParser(element, anime_title);

    // console.log("episode info:", episode_info);

    return {
      _id: element,
      url: url,
      directory_url: directory,
      episode_info: episode_info,
      episode_title: element,
      anime_title: anime_title,
      series: id
    };
  });
};

// very rudimentary episode string parser
// only try to create a route path
// and retrieve episode number
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

  const episode_number = splitEpisode[splitEpisode.indexOf(popAnime) + 1];

  // console.log("episode number:", episode_number);

  // let route_anime = null;

  // if (splitAnime.length + 1 > 1) {
  //   route_anime = anime.toLowerCase().replace(/[\W_]+/g, "-");
  // } else {
  //   route_anime = anime.toLowerCase().replace(/[\W_]+/g, "");
  // }

  // const route = "/" + route_anime + "/episode-" + episode_number;

  // console.log("route:", route);

  return { episode_number: episode_number };
};

export let convertEpisode = (episodePath, convertedEpisodePath) => {
  return new Promise((resolve, reject) => {
    let video = ffmpeg(episodePath)
      .format("mp4")
      .on("start", commandLine => {
        console.log("Spawned Ffmpeg with command:", commandLine);
      })
      .on("progress", progress => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on("error", err => {
        console.log("An error occurred:", err.message);
        reject(err);
      })
      .on("end", () => {
        console.log("Transcoding succeeded !");
        resolve(convertedEpisodePath);
      })
      .outputOptions(["-c copy", "-c:s mov_text"])
      .save(convertedEpisodePath);
  });
};

export let extractEpisodeSubtitles = (episodePath, subtitlesPath) => {
  return new Promise((resolve, reject) => {
    let subtitles = ffmpeg(episodePath)
      .on("start", commandLine => {
        console.log("Spawned Ffmpeg with command:", commandLine);
      })
      .noAudio()
      .noVideo()
      .on("error", err => {
        console.error("An error occurred:", err.message);
        reject(err);
      })
      .on("progress", progress => {
        console.log(`Processing subtitles: ${progress.percent}% done`);
      })
      .on("end", () => {
        console.log("Transcoding subtitles succeeded !");
        resolve(subtitlesPath);
      })
      .outputOptions(["-map 0:s"])
      .output(subtitlesPath);

    subtitles.run();
  });
};

export let removeDuplicate = arr => {
  let unique_array = Array.from(new Set(arr));
  return unique_array;
};

export let isLongEnough = value => {
  return value.length > 1;
};

export let isEpisode = (array, title) => {
  let isEp = false;

  array.map(a => {
    if (_.isEqual(a, title)) {
      isEp = true;
    }
  });
  return isEp;
};

// npm packages
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs-extra";

// our packages
import { episodeParser } from "./Abyss";
// import { createDirAsync } from "../utils/";
import { extractThumbnail } from "./Ffmpeg";

// TODO: remove this line in the 1rst release
import { cloudinaryConfig } from "../../abyss.config.js";

// configure cloudinary
cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret
});

/**
 * Create a document for PouchDB
 *
 * @param {Promise} series
 * @param {String} directory
 * @returns
 */
export let documentifySeries = (series, directory) => {
  return series.map(element => {
    const url = path.resolve(directory, element);

    const image = cloudinary.url(element.toLowerCase() + (".jpg" || ".png"), {
      secure: true
    });

    return { _id: element, directory_url: url, title: element, image: image };
  });
};

/**
 *
 *
 * @param {any} id
 * @param {any} episodes
 * @param {any} directory
 * @returns
 */
export let documentifyEpisodes = (id, episodes, dirPath) => {
  console.log("dirPath: ", dirPath);

  const thumbnailsDirPath = dirPath.concat("\\thumbnails");
  console.log("thumbnailsDirPath: ", thumbnailsDirPath);

  const animeTitle = dirPath.split("\\").pop();
  console.log("animeTitle: ", animeTitle);

  // createDirAsync(thumbnailsDirPath);
  return new Promise((resolve, reject) => {
    fs.readdir(thumbnailsDirPath, (err, files) => {
      if (err) {
        fs
          .ensureDir(thumbnailsDirPath)
          .then(() => {
            console.log("success!");
            resolve(
              episodes.map(el => {
                // console.log("directory: ", directory);
                // console.log("full path: ", directory.concat("\\", element));
                const url = path.resolve(dirPath, el);

                const episodePath = dirPath.concat("\\", el);
                console.log("episodePath: ", episodePath);

                const episodeInfo = episodeParser(el, animeTitle);
                console.log("episodeInfo: ", episodeInfo);

                const filename = `${animeTitle}-thumbnail-episode-${
                  episodeInfo.episodeNumber
                }`;
                console.log("filename: ", filename);

                const folder = thumbnailsDirPath;
                console.log("folder: ", folder);

                extractThumbnail(episodePath, filename, folder);

                // console.log("episode info:", episode_info);
                // extractThumbnail(episodePath, episode_info.episode_number, dirPath);
                const episodeThumbnailPath = folder.concat("\\", filename);
                console.log("episodeThumbnail: ", episodeThumbnailPath);

                return {
                  _id: el,
                  url: url,
                  directoryPath: dirPath,
                  episodeInfo: episodeInfo,
                  episodeTitle: el,
                  animeTitle: animeTitle,
                  episodeThumbnailPath: episodeThumbnailPath,
                  series: id
                };
              })
            );
          })
          .catch(err => {
            console.error(err);
          });
      }
      console.log("files: ", files);
    });
  });
};

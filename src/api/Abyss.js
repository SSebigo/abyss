// npm packages
import _ from "lodash";
import filename from "file-name";

// our packages
import db from "../db/index";
import { Popura } from "../api/Popura";

import {
  beautifyFolders,
  documentifyEpisodes,
  documentifySeries
} from "../helpers/index";

import { readdirAsync } from "../utils/index";

// TODO: make user select target directory
// Better use a test directory if you don't want
// to lose things
export const TargetDirectory = "C:/Users/marge/OneDrive/Documents/Test";

export const Abyss = {
  async Series() {
    // TODO: find a way to avoid this first read
    // to decrease launch time
    const series = await readdirAsync(TargetDirectory);

    // console.log("series:", series);

    await beautifyFolders(series, TargetDirectory);

    const beautifySeries = await readdirAsync(TargetDirectory);

    // console.log("beautify series:", beautifySeries);

    const seriesDocs = documentifySeries(beautifySeries, TargetDirectory);

    // console.log("series docs JSON:", JSON.stringify(seriesDocs));
    // console.log("series docs:", seriesDocs);

    await db.series.bulkDocs(seriesDocs);

    return seriesDocs;
  },
  async Episodes(anime) {
    const episodes = await readdirAsync(anime.directory_url);

    // console.log("anime: ", anime);
    // createDirAsync(anime.directory_url+"\\thumbnails");

    // console.log("episodes:", episodes);

    const episodesDocs = await documentifyEpisodes(
      anime._id,
      episodes,
      anime.directory_url
    );

    // console.log("episodes docs JSON:", JSON.stringify(episodesDocs));
    console.log("episodes docs:", episodesDocs);

    await db.episodes.bulkDocs(episodesDocs);

    return episodes;
  }
  // ,
  // async Episode(episode) {
  //   // console.log("Episode playing:", episode);

  //   const file = filename(episode._id);
  //   const convertedVideoPath = `${episode.directory_url}\\${file}.mp4`;
  //   const subtitlesPath = `${episode.directory_url}\\${file}.vtt`;

  //   // console.log("converted video path:", convertedVideoPath);
  //   // console.log("subtitles path:", subtitlesPath);

  //   // const stop = movie => {
  //   //   return movie.ffmpegProc.stdin.write("q");
  //   // };

  //   const anime = await Popura.searchAnimes(episode.anime_title);

  //   // console.log("anime:", anime);

  //   let animeList = await Popura.getAnimeList();
  //   animeList = animeList.list;

  //   // console.log("anime list:", animeList);

  //   const watched_episodes = _.find(animeList, o => {
  //     return isEpisode(
  //       o.series_synonyms.concat(o.series_title),
  //       episode.anime_title
  //     );
  //   }).my_watched_episodes;

  //   // console.log("watched episode:", watched_episodes);

  //   const video = await convertEpisode(episode.url, convertedVideoPath);

  //   const subtitles = await extractEpisodeSubtitles(episode.url, subtitlesPath);

  //   // console.log("video:", video);
  //   // console.log("subtitles:", subtitles);

  //   return {
  //     id: anime[0].id,
  //     episodes: anime[0].episodes,
  //     video,
  //     subtitles,
  //     episode_number: episode.episode_info.episode_number,
  //     watched_episodes
  //   };
  // },
  // Search() {}
};

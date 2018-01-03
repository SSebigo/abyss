// npm packages
// import notDefined from "not-defined";
import _ from "lodash";
import ffmpeg from "fluent-ffmpeg";
import filename from "file-name";
import fs from "fs";

// our packages
import db from "../db";
import {
  convertEpisode,
  documentifyEpisodes,
  documentifySeries,
  extractEpisodeSubtitles,
  readdirAsync
} from "../utils";
// import { Popura } from "./Popura";

// TODO: make user select target directory
// Better use a test directory if you don't want
// to lose things
export const TargetDirectory = "path/to/your/anime/directory/for/tests";

export const AnimeWatcher = {
  async Series() {
    const series = await readdirAsync(TargetDirectory);

    // console.log("series:", series);

    const seriesDocs = documentifySeries(series, TargetDirectory);

    // console.log("series docs JSON:", JSON.stringify(seriesDocs));
    // console.log("series docs:", seriesDocs);

    await db.series.bulkDocs(seriesDocs);

    return seriesDocs;
  },
  async Episodes(anime) {
    const episodes = await readdirAsync(anime.directory_url);

    // console.log("episodes:", episodes);

    const episodesDocs = documentifyEpisodes(
      anime._id,
      episodes,
      anime.directory_url
    );

    // console.log("episodes docs JSON:", JSON.stringify(episodesDocs));
    // console.log("episodes docs:", episodesDocs);

    await db.episodes.bulkDocs(episodesDocs);

    return episodes;
  },
  async Episode(episode) {
    console.log("Episode playing:", episode);

    const file = filename(episode._id);
    const convertedVideoPath = `${episode.directory_url}\\${file}.mp4`;
    const subtitlesPath = `${episode.directory_url}\\${file}.vtt`;

    console.log("converted video path:", convertedVideoPath);
    console.log("subtitles path:", subtitlesPath);

    // const stop = movie => {
    //   return movie.ffmpegProc.stdin.write("q");
    // };

    const video = await convertEpisode(episode.url, convertedVideoPath);

    const subtitles = await extractEpisodeSubtitles(episode.url, subtitlesPath);

    console.log("video:", video);
    console.log("subtitles:", subtitles);

    return { video, subtitles };
  },
  Search() {}
};

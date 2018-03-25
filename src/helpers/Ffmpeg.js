// npm packages
import ffmpeg from "fluent-ffmpeg";

/**
 * Convert selected to mp4 format for HTML5 video
 *
 * @param {String} episodePath
 * @param {String} convertedEpisodePath
 * @returns Promise
 */
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

/**
 * Extract subtitles from selected episode
 *
 * @param {String} episodePath
 * @param {String} subtitlesPath
 * @returns Promise
 */
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

export let extractThumbnail = (episodePath, filename, folder) => {
  let thumbnail = ffmpeg(episodePath)
    .on("end", () => {
      console.log("Thumbnail extraction succeed !");
    })
    .screenshots({
      timestamps: [2],
      filename: filename,
      folder: folder,
      size: "1280x720"
    });

  console.log("thumbnail from ffmpeg: ", thumbnail);
};

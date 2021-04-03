const fs = require("fs");
const pathToFfmpeg = require("ffmpeg-static");
const util = require("util");

const exec = util.promisify(require("child_process").exec);

const mergeMusicAndVideo = async () => {
  await exec(
    `"${pathToFfmpeg}" -i merged.mp4 -i sample3.mp3 -shortest -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 OUTPUT.mp4`
  );
};

mergeMusicAndVideo();

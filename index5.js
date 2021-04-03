const Jimp = require("jimp");
const fs = require("fs");
const pathToFfmpeg = require("ffmpeg-static");
const util = require("util");

const exec = util.promisify(require("child_process").exec);
var ffmpeg = require("fluent-ffmpeg");

// Video editor settings
const videoEncoder = "h264";
const inputFile = "input.mp4";
const outputFile = "output.mp4";

const inputFolder = "temp/raw-frames";
const outputFolder = "temp/edited-frames";

let currentProgress = 0;

const editVideo = async () => {
  ffmpeg("./output1.mp4").seekInput("0:07").output("from-file1").seek(4);
};
editVideo();

//ffmpeg -ss 00:01:00 -i input.mp4 -to 00:02:00 -c copy output.mp4 - 비디오 자르기

//비디오 자르기

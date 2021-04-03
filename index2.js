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
  // ffmpeg("./output1.mp4")
  //   .input("./output2.mp4")
  //   .on("error", function (err) {
  //     console.log("An error occurred: " + err.message);
  //   })
  //   .on("end", function () {
  //     console.log("Merging finished !");
  //   })
  //   .mergeToFile("./merged.mp4");
  ffmpeg("./output4.mp4")
    .input("./output5.mp4")
    .input("./output6.mp4")
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function () {
      console.log("Merging finished !");
    })
    .mergeToFile("./merged.mp4");

  //오디오 붙이기 : ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4(index1이나 index3에서 쓴 ffmpeg써야함)
};
editVideo();

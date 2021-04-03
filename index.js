const Jimp = require("jimp");
const fs = require("fs");
const pathToFfmpeg = require("ffmpeg-static");
const util = require("util");

const exec = util.promisify(require("child_process").exec);

// Video editor settings
const videoEncoder = "h264";
const inputFile = "file1.mp4";
const outputFile = "insta_output1.mp4";
//! 주의 : 기존에 outputFile이 존재하면 안된다.
const inputFolder = "temp/raw-frames";
const outputFolder = "temp/edited-frames";

let currentProgress = 0;

const editVideo = async () => {
  try {
    // Create temporary folders
    console.log("Initialize temp files");
    await fs.mkdir("temp", (err) => {
      if (err) console.log("Err in mkdir : temp");
    });
    await fs.mkdir("temp/raw-frames", (err) => {
      if (err) console.log("Err in mkdir : temp/raw-frames");
    });
    await fs.mkdir("temp/edited-frames", (err) => {
      if (err) console.log("Err in mkdir : temp/edited-frames");
    });

    //Decode MP4 video and resize it to width 1080 and height auto (to keep the aspect ratio)
    console.log("Decoding");
    await exec(
      `"${pathToFfmpeg}" -i ${inputFile} -vf scale=1080:-1 ${inputFolder}/%d.png`
    );

    //Edit each frame
    console.log("Rendering");
    const frames = fs.readdirSync("temp/raw-frames");

    for (let frameCount = 1; frameCount <= frames.length; frameCount++) {
      //Check and log progress
      checkProgress(frameCount, frames.length);

      //Read the current frame
      let frame = await Jimp.read(`${inputFolder}/${frameCount}.png`);

      //Modify frame
      frame = await modifyFrame(frame);

      //Save the frame
      await frame.writeAsync(`${outputFolder}/${frameCount}.png`);
    }

    // Encode video from PNG frames to MP4 (no audio)
    console.log("Encoding");
    await exec(
      `"${pathToFfmpeg}" -start_number 1 -i ${outputFolder}/%d.png -vcodec ${videoEncoder} -pix_fmt yuv420p temp/no-audio.mp4`
    );

    // Copy audio from original video
    console.log("Adding audio");
    await exec(
      `"${pathToFfmpeg}" -i temp/no-audio.mp4 -i ${inputFile} -c copy -map 0:v:0 -map 1:a:0? ${outputFile}`
    );

    //Remove temp folder
    console.log("Cleaning up");
    await fs.rm("temp", { recursive: true }, (err) => {
      //중간에 recursive를 써줘야 다 지워짐.
      console.log("err in remove temp");
    });
  } catch (err) {
    console.log("Err occured : ", err);

    console.log("Cleaning up");
    await fs.rm("temp", { recursive: true }, (err) => {
      console.log("err in remove temp");
    });
  }
};

const modifyFrame = async (frame) => {
  //Calculate the new height for 9:16 aspect ratio based on the current video width
  let newHeight = (16 * frame.bitmap.width) / 9;

  //Video height must be an even number
  newheight = newHeight % 2 === 0 ? newHeight : newHeight + 1;

  //Create new image width current width, new height and white background
  const newImage = new Jimp(frame.bitmap.width, newHeight, "white");

  //Add watermark
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
  newImage.print(
    font,
    20,
    newImage.bitmap.height - 100,
    "@Backend Developer/Lim Jaehyeon"
  );
  //Center the video in the current 9 : 16 image
  newImage.composite(frame, 0, newHeight / 2 - frame.bitmap.height / 2);

  return newImage;
};

const checkProgress = (currentFrame, totalFrame) => {
  const progress = (currentFrame / totalFrame) * 100;
  if (progress > currentProgress + 10) {
    const displayProgress = Math.floor(progress);
    console.log(`Progress : ${displayProgress}`);
    currentProgress = displayProgress;
  }
};
editVideo();

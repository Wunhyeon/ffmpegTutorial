const Jimp = require("jimp");
const fs = require("fs");
const pathToFfmpeg = require("ffmpeg-static");
const util = require("util");

const exec = util.promisify(require("child_process").exec);

// Video editor settings
const videoEncoder = "h264";
const inputFile = "cut3.mp4";
const outputFile = "output6.mp4";
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
    // await exec(
    //   `"${pathToFfmpeg}" -start_number 1 -i ${outputFolder}/%d.png -vcodec ${videoEncoder} -pix_fmt yuv420p temp/no-audio.mp4`
    // );
    await exec(
      `"${pathToFfmpeg}" -start_number 1 -i ${outputFolder}/%d.png -vcodec ${videoEncoder} -pix_fmt yuv420p ${outputFile}`
    );

    // Copy audio from original video
    // console.log("Adding audio");
    // await exec(
    //   `"${pathToFfmpeg}" -i temp/no-audio.mp4 -i ${inputFile} -c copy -map 0:v:0 -map 1:a:0? ${outputFile}`
    // );

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
  //Create new image width current width, new height and white background
  // const newImage = new Jimp(frame.bitmap.width, newHeight, "white");
  const newImage = frame;

  //Add watermark

  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

  // let str = utf8.encode("잘부탁드립니다");

  newImage.print(font, 150, 300, "Thank you!!"); //기본!!!
  // newImage.print(font, 0, 0, {
  //   text: "Lim Jaehyeon",
  //   alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  //   alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
  // }); //공식 깃헙에 나와있긴 하지만 아직 안됨.

  //template sample1(output1~3), output4 : 20,20
  //output5 : 50,50 font 124
  //output6 : 150,300

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

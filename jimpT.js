const Jimp = require("jimp");
const inputFolder = "temp/raw-frames";
const outputFolder = "temp/edited-frames";
const utf8 = require("utf8");

const inputText = async () => {
  //Read the current frame
  let frame = await Jimp.read(`1.png`);

  //Modify frame
  frame = await modifyFrame(frame);

  //Save the frame
  await frame.writeAsync(`jimpT_output.png`);
};

const modifyFrame = async (frame) => {
  //   const newImage = new Jimp(frame.bitmap.width, frame.bitmap.height);
  const newImage = await Jimp.read(`1.png`);
  //   Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then((font) => {
  //     newImage.print(font, 50, 50, "Lim Jaehyeon");
  //     return newImage;
  //   });

  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  let str = utf8.encode("잘부탁드립니다.");

  newImage.print(font, 10, 10, str);

  return newImage;
};

inputText();

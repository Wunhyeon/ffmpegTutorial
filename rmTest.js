const fs = require("fs");
fs.rm("./temp", { recursive: true }, (err) => {
  console.log("err in remove temp : ", err);
});

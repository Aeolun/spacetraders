import spritesheet from "@pencil.js/spritesheet";
import { writeFileSync, readdirSync } from "fs";
import {glob} from 'glob'

const options = {
  outputFormat: "png",
  crop: false,
};
// Call the async function and extract the json and image values
(async () => {
  const files = await glob("public/textures/**/*.png", {
    nodir: true,
  });

  console.log(files);
  const { json, image } = await spritesheet(files, options);
  // Write the files (for example)
  writeFileSync("public/spritesheet.png", image);
  writeFileSync("public/spritesheet.json", JSON.stringify(json));
})();
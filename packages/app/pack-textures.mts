import spritesheet from "@pencil.js/spritesheet";
import { writeFileSync, readdirSync } from "fs";
import {glob} from 'glob'

const options = {
  outputFormat: "png",
};
// Call the async function and extract the json and image values
(async () => {
  const files = await glob("public/textures/**/*", {
    nodir: true,
  });

  console.log(files);
  const { json, image } = await spritesheet(files, options);
  // Write the files (for example)
  writeFileSync("public/spritesheet.png", image);
  writeFileSync("public/spritesheet.json", JSON.stringify(json));
})();
// Make sure that you have your vpy scripts, episodes and DV metadata in one folder. The script will scan the folder recursively and check for the files and if everything is okay it will start immediatly

// Nodejs

let path = process.argv[2];
const fs = require("fs");

// npm modules
const chalk = require("chalk");

// Custom modules

const { findFiles } = require("./module/getFiles");
const { extract } = require("./module/extract");
const { encodeEpisodes } = require("./module/encodeEpisodes");

// executables paths (do not edit if they are added to path)

const doviToolPath = "dovi_tool.exe" || "";
const ffprobe = "ffprobe" || "";

(async function () {
  if (path === undefined) {
    console.log(
      chalk.yellow("[Warning]") +
        " You did not specify a path argument, I will use the current directory instead"
    );

    path = __dirname;
  }

  // Get H265 files that we need

  const getH265Files = findFiles(path, ".h265");
  if (getH265Files.length <= 0)
    return console.log("Faild to find any H265 video streams");

  console.log("============================================");
  console.log(
    chalk.cyan("[LOG] ") +
      "Found H265 Streams!" +
      "\n" +
      chalk.cyan("[LOG] ") +
      "Extracting DV Metdata......."
  );

  // First extract the DV metadata from the Files

  getH265Files.forEach(async (episode) => {
    if (!fs.existsSync(`${path}/${episode}.bin`))
      return await extract.DolbyVision(path, episode, doviToolPath);
  });

  // get all vpy scripts and DV metadata files

  const getVPY = findFiles(path, ".vpy");
  const getDVMetaData = findFiles(path, ".bin");

  // check if they exist, otherwise return

  if (getVPY.length <= 0) {
    console.log(
      chalk.red("[ERROR] ") + "I did not find any vpy scripts!, exiting......"
    );
    return;
  }

  if (getDVMetaData.length <= 0) {
    console.log(
      chalk.red("[ERROR] ") + "I did not find any DV Metadata!, exiting......"
    );
    return;
  }

  console.log("============================================");
  console.log(chalk.cyan("[LOG] ") + "Found vpy scripts!");
  console.log(chalk.cyan("[LOG] ") + "Found DV metadata!");

  // create output folder and check if it exists..

  const outPutPath = `${path}/enocodeOutput`;

  if (fs.existsSync(outPutPath)) {
    console.log(
      chalk.yellow("[Warning] ") +
        `The target folder ${outPutPath} does already exist. That is unusual...`
    );
  }

  if (!fs.existsSync(outPutPath)) {
    fs.mkdirSync(outPutPath);
  }

  console.log("============================================");
  console.log(chalk.cyan("[LOG] ") + "Output Folder created!");

  // start encoding
  getVPY.forEach(async (vpyFile, index) => {
    console.log("============================================");
    console.log(
      `${chalk.cyan("[LOG] ")} Encoding Episode : ${getH265Files[index]}`
    );
    console.log(
      `${chalk.cyan("[LOG] ")} Using vpy script: ${vpyFile}\nDV File : ${
        getDVMetaData[index]
      }`
    );
    console.log("============================================");

    await encodeEpisodes(
      path,
      vpyFile,
      getDVMetaData[index],
      `${outPutPath}/${getH265Files[index]}.encode.265`
    );
  });
})();

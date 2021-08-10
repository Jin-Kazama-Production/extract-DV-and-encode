// Make sure that you have your vpy scripts, episodes and DV metadata in one folder. The script will scan the folder recursively and check for the files and if everything is okay it will start immediatly

const { findFiles } = require("./module/getFiles");
const { videosPath, doviToolPath } = require("./config.json");
const { extractDV } = require("./module/extract_dovi");
const { encodeEpisodes } = require("./module/encodeEpisodes");
const fs = require("fs");

(async function () {
  // Get H265 files that we need

  const getH265Files = findFiles(videosPath, ".h265");
  if (!getH265Files) return console.log("Faild to find any H265 video streams");

  console.log("============================================");
  console.log(
    chalk.cyan("[LOG] ") + "Found H265 Streams!\nExtracting DV Metdata......."
  );

  // First extract the DV metadata from the Files

  getH265Files.forEach(async (episode) => {
    if (!fs.existsSync(`${videosPath}/${episode}.bin`))
      return await extractDV(videosPath, doviToolPath, episode);
  });

  // get all vpy scripts and DV metadata files

  const getVPY = findFiles(videosPath, ".vpy");
  const getDVMetaData = findFiles(videosPath, ".bin");

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

  const outPutPath = `${videosPath}/enocodeOutput`;

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
      videosPath,
      vpyFile,
      getDVMetaData[index],
      `${outPutPath}/Encode.${getH265Files[index]}`
    );
  });
})();

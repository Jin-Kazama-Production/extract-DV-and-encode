const childProcess = require("child_process");

async function extractDV(videosPath, doviToolPath, episode) {
  try {
    if (!doviToolPath)
      return console.log(
        "Please specify the dovi_tool path or just add to the environment variables"
      );

    childProcess.execSync(
      `${doviToolPath} -m 2 --crop extract-rpu ${videosPath}/${episode} --rpu-out "${videosPath}/${episode}.bin"
    `,
      {
        stdio: "inherit",
      }
    );
  } catch (err) {
    throw err;
  }
}

module.exports = { extractDV };

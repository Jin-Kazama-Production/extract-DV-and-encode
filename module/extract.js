const childProcess = require("child_process");

class Extract {
  async DolbyVision(videosPath, episode, doviToolPath) {
    try {
      if (!doviToolPath)
        return console.log(
          "Please specify the dovi_tool path or just add to the environment variables"
        );

      childProcess.execSync(
        `${doviToolPath} -m 2 --crop extract-rpu "${videosPath}/${episode}" --rpu-out "${videosPath}/${episode}.bin"
    `,
        {
          stdio: "inherit",
        }
      );
    } catch (err) {
      throw err;
    }
  }

  async MasterDisplay(ffprobe, mkv, tempPath) {
    try {
      if (!ffprobe) return console.log("Please add ffprobe to path!");
      childProcess.execSync(
        `${ffprobe} -hide_banner -select_streams v -print_format json -show_frames -read_intervals "%+#1" -show_entries "frame=color_space,color_primaries,color_transfer,side_data_list,pix_fmt" -i "${mkv}" > "${tempPath}"`,
        {
          stdio: "inherit",
        }
      );
    } catch (err) {
      throw err;
    }
  }

  async ExtractH265FromMKV(mkvextract, mkv) {
    try {
      childProcess.execSync(`${mkvextract} ${mkv} tracks 0:${mkv}.h265`, {
        stdio: "inherit",
      });
    } catch (error) {
      throw error;
    }
  }
}

const extract = new Extract();
module.exports = { extract };

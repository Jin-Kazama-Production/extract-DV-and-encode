const childProcess = require("child_process");

async function encodeEpisodes(episodesPath, vpyFile, DVMetaData, output) {
  try {
    childProcess.execSync(
      `vspipe --y4m ${episodesPath}/${vpyFile} - | x265 --y4m - --preset veryslow --no-rect --no-amp --no-open-gop --no-cutree --no-sao --max-merge 5 --rc-lookahead 60 --ref 5 --bframes 16  --rd 3 --subme 7  --merange 57  --profile main10 --level-idc 51 --min-keyint 23 --keyint 240 --vbv-bufsize 160000  --vbv-maxrate 160000 --high-tier --range limited --aud --repeat-headers --colorprim 9 --colormatrix 9 --transfer 16 --hdr10 --hdr10-opt --aq-mode 4 --aq-strength 0.8 --master-display "G(8500,39850)B(6550,2300)R(35400,14600)WP(15635,16450)L(10000000,20)" --max-cll "0,0" --cbqpoffs 0 --crqpoffs 0 --crf 17 --qcomp 0.65 --deblock -3:-3 --ipratio 1.30 --pbratio 1.20 --psy-rd 2.00 --chromaloc 2 --psy-rdoq 3.00 --rdoq-level 2 --no-dhdr10-opt --no-strong-intra-smoothing --rskip 0 --rdoq-level=2 --dolby-vision-rpu ${episodesPath}/${DVMetaData} --dolby-vision-profile 8.1 --output "${output}"`,
      { stdio: "inherit" }
    );
  } catch (err) {
    throw err;
  }
}

module.exports = { encodeEpisodes };

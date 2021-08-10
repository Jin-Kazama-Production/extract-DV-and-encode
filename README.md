# extract-DV-and-encode

A simple script to extract the DV metadata from video streams and then encode with the given settings

## Requirements

- Node.js
- NPM

## Installation

There is no complex installation required. Simply clone this repo and install the npm packages: 

`git clone https://github.com/Jin-Kazama-Production/extract-DV-and-encode.git` <br/>
`cd extract-DV-and-encode` <br/>
`npm i`

## Usage

This script checks first for video streams, if it finds h.265 streams it will extract the Dolby Vision metadata from each and put it next to the video stream. Once finished with extracting the DV Metadata, it will check again and make sure that all Dolby Vision Metadata files exist and then check for the vpy scripts. Once all tests returned true, it will invoke the `encodeEpisodes()` function which takes the encode arguments and starts immediately.

- First install [VS](https://github.com/vapoursynth/vapoursynth/releases)
- Then rename `config.example.json` to `config.json` and add the path to your folder with the videos and the path to the [dovi_tool](https://github.com/quietvoid/dovi_tool/releases) (It's recommended to add it to PATH)

- Go to [encodeEpisode](https://github.com/Jin-Kazama-Production/extract-DV-and-encode/blob/main/module/encodeEpisodes.js) function and change the settings to meet your needs.
- finally just run `node main.js`

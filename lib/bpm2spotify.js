import 'babel-core/register';
import 'babel-polyfill';

import _ from 'lodash';
import { songsFromBpm } from './bpm';
import { searchTracks } from './spotify';

export default class SongFinder {
  constructor () {
    this.cachedTracks = {};
    this.retrievedPages = {};
  }

  async getSongData (bpm) {
    if (this.cachedTracks[bpm] && this.cachedTracks[bpm].length) {
      return this.cachedTracks[bpm].pop();
    }
    console.log("Didn't find a song for this BPM in cache, fetching...");
    let page = 1;
    if (this.retrievedPages[bpm]) {
      page = this.retrievedPages[bpm];
      page++;
    }
    let bpmData;
    let found = false, tries = 0;
    while (!found) {
      try {
        bpmData = await songsFromBpm(bpm, page);
        found = true;
      } catch (e) {
        if (tries >= 5) {
          throw e;
        }
        console.log("Something went wrong with DJ page, trying again...");
      }
      tries++;
    }
    if (page < bpmData.numPages) {
      this.retrievedPages[bpm] = page;
    }
    if (!this.cachedTracks[bpm]) {
      this.cachedTracks[bpm] = [];
    }
    this.cachedTracks[bpm] = this.cachedTracks[bpm].concat(_.shuffle(bpmData.songs));
    return this.cachedTracks[bpm].pop();
  }

  async getRandomSong (bpm) {
    let found = false;
    let spotifyUrl, songData;
    while (!found) {
      songData = await this.getSongData(bpm);
      try {
        spotifyUrl = await searchTracks(songData.artist, songData.song);
      } catch (e) {
        console.log(`Didn't work, error was: ${e}`);
        continue;
      }
      found = true;
    }
    return {...songData, spotifyUrl};
  }
}

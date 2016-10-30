/*eslint-env mocha*/
import assert from 'assert';
import SongFinder from '../lib/bpm2spotify.js';

describe('SongFinder', function () {
  before(() => {
    let s = new SongFinder();
    return s.getRandomSong().then((song) => {
      this.song = song;
    });
  });
  it('should find a random song', function() {
    assert.ok(this.song);
  });
});



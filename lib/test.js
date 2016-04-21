import SongFinder from './bpm2spotify';
import { asyncify } from 'asyncbox';

asyncify(async function () {
  let s = new SongFinder('xxx');
  console.log(await s.getRandomSong(150));
});

# bpm2spotify

Insert a BPM, get a random Spotify link for a track with that BPM

### Use

```
npm install bpm2spotify
````

Then:

```js
import SongFinder from 'bpm2spotify';

async function myFunction () {
    let s = new SongFinder();
    let song = await s.getRandomSong(150);
    console.log(song);
    // --> {artist: 'foo', song: 'bar', spotifyUrl: 'https://spotify...'}
}
```

### Develop

Get set up:

```
npm install
```

Transpile code:

```
npm run build
```

import _ from 'lodash';
import request from 'request-promise';

export async function searchTracks (artist, track) {
  let q = `artist:${artist} track:${track}`;
  console.log(`Querying Spotify for ${q}`);
  let res = await request({
    uri: 'https://api.spotify.com/v1/search',
    qs: {
      q,
      type: 'track',
      limit: 1
    },
    json: true
  });
  if (res.tracks && res.tracks.total === 0) {
    throw new Error("No results for that search");
  }
  if (!res.tracks || !res.tracks.items || !res.tracks.items[0] ||
      res.tracks.items[0].type !== "track") {
    console.log(res);
    throw new Error("Spotify returned data that didn't look like track data!");
  }
  return res.tracks.items[0].external_urls.spotify;
}

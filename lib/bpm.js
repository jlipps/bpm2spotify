import _ from 'lodash';
import request from 'request-promise';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';

const bpmUrlTpl = _.template('http://www.djbpmstudio.com/Default.aspx?' +
                             'Page=search&q=<%= bpm %>&p=<%= page %>&se=2' +
                             '&so=2&fg=0');

export async function songsFromBpm (bpm, page = 1) {
  const url = bpmUrlTpl({bpm, page});
  let resHtml = await request(url);
  let pageSection = /Page (\d{1,3}) of (\d{1,3})/.exec(resHtml);
  if (!pageSection) {
    console.log("Warning: Couldn't parse DJ page result");
  }
  let [curPage, numPages] = [parseInt(pageSection[1], 10),
                             parseInt(pageSection[2], 10)];
  if (curPage !== page) {
    console.log("Warning: Wanted page ${page} but got page ${curPage}");
  }
  let tableSec = /<table.*id="ctl15_gvTable">[\s\S]+?<\/table>/i.exec(resHtml);
  let doc = new DOMParser().parseFromString(tableSec[0]);
  let songRows = xpath.select("//tr[contains(@class, 'row-')]", doc);
  let songs = [];
  for (let r of songRows) {
    let newNode = new DOMParser().parseFromString(r.toString());
    let artist = xpath.select("//td[1]/a/text()", newNode).toString();
    let song = xpath.select("//td[5]/text()", newNode).toString();
    songs.push({artist, song});
  }
  return {curPage, numPages, songs};
}

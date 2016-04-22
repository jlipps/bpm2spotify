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
  let curPage = 1, numPages = 1;
  if (!pageSection) {
    console.log("Warning: Couldn't parse DJ page result");
  } else {
    curPage = parseInt(pageSection[1], 10);
    numPages = parseInt(pageSection[2], 10);
    if (curPage !== page) {
      console.log("Warning: Wanted page ${page} but got page ${curPage}");
    }
  }
  let tableSec = /<table.*id="ctl15_gvTable">[\s\S]+?<\/table>/i.exec(resHtml);
  if (!tableSec) {
    throw new Error(`Could not parse tabe section from DJ page. HTML was: ${resHtml}`);
  }
  let doc;
  try {
    doc = new DOMParser().parseFromString(tableSec[0]);
  } catch (e) {
    throw new Error(`Error parsing table section :-( Error was: ${e}`);
  }
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

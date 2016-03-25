
import {TopListPair} from './vars'

export const TopList: TopListPair[] = [
    ['云音乐新歌榜', '/discover/toplist?id=3779629'],
    ['云音乐热歌榜', '/discover/toplist?id=3778678'],
    ['网易原创歌曲榜', '/discover/toplist?id=2884035'],
    ['云音乐飙升榜', '/discover/toplist?id=19723756'],
    ['云音乐电音榜', '/discover/toplist?id=10520166'],
    ['UK排行榜周榜', '/discover/toplist?id=180106'],
    ['美国Billboard周榜', '/discover/toplist?id=60198'],
    ['KTV嗨榜', '/discover/toplist?id=21845217'],
    ['iTunes榜', '/discover/toplist?id=11641012'],
    ['Hit FM Top榜', '/discover/toplist?id=120001'],
    ['日本Oricon周榜', '/discover/toplist?id=60131'],
    ['韩国Melon排行榜周榜', '/discover/toplist?id=3733003'],
    ['韩国Mnet排行榜周榜', '/discover/toplist?id=60255'],
    ['韩国Melon原声周榜', '/discover/toplist?id=46772709'],
    ['中国TOP排行榜(港台榜)', '/discover/toplist?id=112504'],
    ['中国TOP排行榜(内地榜)', '/discover/toplist?id=64016'],
    ['香港电台中文歌曲龙虎榜', '/discover/toplist?id=10169002'],
    ['华语金曲榜', '/discover/toplist?id=4395559'],
    ['中国嘻哈榜', '/discover/toplist?id=1899724'],
    ['法国 NRJ EuroHot 30周榜', '/discover/toplist?id=27135204'],
    ['台湾Hito排行榜', '/discover/toplist?id=112463'],
    ['Beatport全球电子舞曲榜', '/discover/toplist?id=3812895']
];

export const DefaultTime: number = 10;
export const WebLoginUrl = "https://music.163.com/weapi/login/";
export const PhoneLoginUrl = "https://music.163.com/weapi/login/cellphone";
export const BaseUrlPath = "src/frontend/components"

//https://github.com/kittencup/angular2-ama-cn/issues/22
export const RawHeaders = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip,deflate,sdch',
    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'music.163.com',
    'Referer': 'http://music.163.com/search/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
}
export const Cookies = {
    'appver': '1.5.2'
}
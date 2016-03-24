import {Injectable, Inject, OnInit} from 'angular2/core';
import {Http} from 'angular2/http';

import {
    DefaultTime,
    RequestParams
}  from '../../types/types'



@Injectable()
export class HttpService implements OnInit {

    private _header = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'music.163.com',
        'Referer': 'http://music.163.com/search/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
    }
    private _cookies = {
        'appver': '1.5.2'
    }

    constructor( @Inject(Http) private _http: Http) {
         console.log("hello from HttpService");
     }
    ngOnInit() { }

    Get() { }
    Post(action: string, req: RequestParams) {
       
    }

}
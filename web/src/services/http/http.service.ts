import {Injectable, Inject, OnInit} from 'angular2/core';
import {Http} from 'angular2/http';

import {
    DefaultTime,
    RequestParams
}  from '../../types/types'



@Injectable()
export class HttpService implements OnInit {
    constructor( @Inject(Http) private _http: Http) {
        console.log("hello from HttpService");
    }
    ngOnInit() { }

    Get() { }
    Post(action: string, req: RequestParams) {

        console.log("hello from HttpService's Post");

        this._http.post(
            action,
            JSON.stringify(req)).subscribe(
            data => console.log(data),
            err => console.log(err),
            () => console.log("finisehd"));

    }

}

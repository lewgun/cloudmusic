import {Injectable, Inject, OnInit} from 'angular2/core';
import {
    Http,
    Response,
    URLSearchParams,
    RequestOptionsArgs
} from 'angular2/http';

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

    private _promiseHelper(rawData: Response, resolve: any, reject: any) {

        let jsonData = rawData.json();

        /*
        {
            result: "fail",
            faildesc: "...."
        }
         */
        if (jsonData.result !== "success") {
            reject(jsonData.faildesc);
            return;
        }

        /*
        {
            result: "success",
            data: {...}
        }
         */
        let data = JSON.parse(jsonData.data);
        if (data.code !== 200) {
            reject(data);
            return;
        }

        resolve(data);

    }

    Get(action: string, params: {} = {}): Promise<any> {

        let sp = new URLSearchParams();

        // dump an object's own enumerable properties to the console
        // for... in + hasOwnProperty
        for (let key of Object.keys(params)) {
            sp.set(key, params[key]);
        }
        ;

        let options: RequestOptionsArgs = {
            search: sp
        };

        console.log("hello from HttpService's Get");

        let p = new Promise((resolve, reject) => {

            this._http.get(
                action,
                options).
                subscribe(
                rawData => {
                    this._promiseHelper(rawData, resolve, reject);
                },
                err => reject(err),
                () => console.log("finisehd"));
        });
        return p;

    }

    Post(action: string, req: RequestParams): Promise<any> {

        console.log("hello from HttpService's Post");

        let p = new Promise((resolve, reject) => {

            this._http.post(
                action,
                JSON.stringify(req)).
                subscribe(
                rawData => {
                    this._promiseHelper(rawData, resolve, reject);
                },
                err => reject(err),
                () => console.log("finisehd"));
        });
        return p;

    }

}

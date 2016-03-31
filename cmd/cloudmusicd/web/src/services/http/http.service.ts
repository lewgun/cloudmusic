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
    Post(action: string, req: RequestParams): Promise<any> {

        console.log("hello from HttpService's Post");

        let p = new Promise((resolve, reject) => {

            this._http.post(
                action,
                JSON.stringify(req)).
                subscribe(
                rawData => {
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
                        reject(data.code);
                        return;
                    }

                    resolve(data);
                },
                err => reject(err),
                () => console.log("finisehd"));
        });
        return p;


    }

}

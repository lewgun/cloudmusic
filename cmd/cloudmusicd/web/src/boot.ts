import {bootstrap} from 'angular2/platform/browser';
import {RequestOptions, Headers, HTTP_PROVIDERS} from 'angular2/http';
import {provide} from 'angular2/core';
import {UrlResolver} from 'angular2/compiler';

import {MyUrlResolver } from './services/url-resolver/url-resolver.service';
import {AppComponent} from './components/app/app.component';
import {HttpService} from './services/http/http.service';
import {CryptoService} from './services/crypto/crypto.service';
//import {RawHeaders} from './types/types'

bootstrap(AppComponent,
    [HTTP_PROVIDERS,
        HttpService,
        CryptoService,
        provide(UrlResolver, { useClass: MyUrlResolver })
        // provide(RequestOptions, {
        //     useFactory: () => {
        //         console.log("hello from: RequestOptions");
        //         return new RequestOptions({
        //             headers: new Headers(RawHeaders)
        //         });
        //     }
        // })
        
        ])
    .then(success => console.log('Bootstrap CloudMusic successfully!!!'))
    .catch(err => console.log(err));
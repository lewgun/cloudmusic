import {Injectable, OnInit, Inject} from 'angular2/core';

import {CryptoService} from '../crypto/crypto.service';
import {HttpService} from '../http/http.service';
import {IsCellPhone} from '../utils/utils.service'

import {
    // WebLoginUrl,
    // PhoneLoginUrl,
    LoginByMobile,
    LoginByID,
    LoginUrl,
    PhoneLoginParams,
    WebLoginParams
}  from '../../types/types';


//https://github.com/darknessomi/musicbox/blob/master/NEMbox/api.py
//https://github.com/kittencup/angular2-ama-cn/issues/61
@Injectable()
export class CloudMusicService implements OnInit {

    constructor(
        @Inject(CryptoService) private _crypto: CryptoService,
        @Inject(HttpService) private _http: HttpService) {
        console.log("hello from CloudMusicService");
    }

    ngOnInit() { }


    private _phoneLogin(username: string, password: string) {
        let params: PhoneLoginParams = {
            'phone': username,
            'password': password,
            'rememberLogin': 'true',
            'csrf_token': this._crypto.createSecretKey(32)
        }

        this._loginHelper(JSON.stringify(params), LoginByMobile, params.csrf_token);
    }

    private _webLogin(username: string, password: string) {
        let params: WebLoginParams = {
            'username': username,
            'password': password,
            'rememberLogin': 'true',
            'csrf_token': this._crypto.createSecretKey(32)
        }

        this._loginHelper(JSON.stringify(params), LoginByID, params.csrf_token);
    }

    private _loginHelper( params: string, by: string, csrf_token: string ) {
        let data = this._crypto.aesRsaEncrypt(params);
        data.by = by;
        data.csrf_token = csrf_token
        this._http.Post(LoginUrl, data)
    }

    Login(username: string, password: string) {
       
        if (IsCellPhone(username)) {
            return this._phoneLogin(username, password)
        }

        return this._webLogin(username, password);
    }



}
import {Injectable, OnInit, Inject} from 'angular2/core';

import {CryptoService} from '../crypto/crypto.service';
import {HttpService} from '../http/http.service';
import {IsCellPhone} from '../utils/utils.service'

import {
    LoginByMobile,
    LoginByID,
    LoginUrl,
    DailyTaskUrl,
    PhoneLoginParams,
    WebLoginParams,
    Profile
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


    private _phoneLogin(username: string, password: string): Promise<Profile> {
        let params: PhoneLoginParams = {
            'phone': username,
            'password': this._crypto.MD5(password),
            'rememberLogin': 'true'
        }

        return this._loginHelper(JSON.stringify(params), LoginByMobile);
    }

    private _webLogin(username: string, password: string): Promise<any> {
        let params: WebLoginParams = {
            'username': username,
            'password': password,
            'rememberLogin': 'true'
        }

        return this._loginHelper(JSON.stringify(params), LoginByID);
    }

    private _loginHelper(params: string, by: string): Promise<any> {
        let data = this._crypto.aesRsaEncrypt(params);
        data.by = by;
        return this._http.Post(LoginUrl, data);

    }

    Login(username: string, password: string): Promise<any> {

        if (IsCellPhone(username)) {
            return this._phoneLogin(username, password)
        }

        return this._webLogin(username, password);
    }

    SignIn(): Promise<any> {

        let params = {
            type: 1
        };

        let data = this._crypto.aesRsaEncrypt(JSON.stringify(params));
        return this._http.Post(DailyTaskUrl, data);
    }


}

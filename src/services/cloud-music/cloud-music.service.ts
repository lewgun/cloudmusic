import {Injectable, OnInit} from 'angular2/core';

import {Crypto} from '../crypto/crypto.service'
import {HttpService} from '../http/http.service'
import { WebLoginUrl, PhoneLoginUrl, PhoneLoginParams, WebLoginParams }  from '../../types/types'


//https://github.com/darknessomi/musicbox/blob/master/NEMbox/api.py
//https://github.com/kittencup/angular2-ama-cn/issues/61
@Injectable()
export class CloudMusicService implements OnInit {

    private _crypto: Crypto

    constructor() { }
    ngOnInit() {
        this._crypto = new Crypto();
    }

    private _isCellPhone(txt: string): boolean {
        const re = /0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/;
        return re.test(txt)
    }

    _phoneLogin(username: string, password: string) {
        let params: PhoneLoginParams = {
            'phone': username,
            'password': password,
            'rememberLogin': 'true'
        }
    }

    _webLogin(username: string, password: string) {
        let params: WebLoginParams = {
            'username': username,
            'password': password,
            'rememberLogin': 'true'
        }

        let data = this._crypto.aesRsaEncrypt(JSON.stringify(params));
    }

    Login(username: string, password: string) {
        if (this._isCellPhone(username)) {
            return this._phoneLogin(username, password)
        }

        return this._webLogin(username, password);
    }



}
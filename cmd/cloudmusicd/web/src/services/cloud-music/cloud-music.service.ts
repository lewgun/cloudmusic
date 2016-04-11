import {Injectable, OnInit, Inject} from 'angular2/core';

import {CryptoService} from '../crypto/crypto.service';
import {HttpService} from '../http/http.service';
import {IsCellPhone} from '../utils/utils.service'

import {
    LoginByMobile,
    LoginByID,
    
    LoginUrl,
    DailyTaskUrl,
    PlayListUrl,
    PlayListDetailUrl,
    SongUrl,
    
    PhoneLoginParams,
    WebLoginParams,
}  from '../../types/types';


export interface Digger {
    (raw: Array<Object>): Array<Object>;
}

//https://github.com/darknessomi/musicbox/blob/master/NEMbox/api.py
//https://github.com/kittencup/angular2-ama-cn/issues/61
@Injectable()
export class CloudMusicService implements OnInit {

  private  _diggers = new Map<string, Digger>();
 
 
    constructor(
        @Inject(CryptoService) private _crypto: CryptoService,
        @Inject(HttpService) private _http: HttpService) {
        console.log("hello from CloudMusicService");
    }

    ngOnInit() { }


    private _phoneLogin(username: string, password: string): Promise<any> {
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
    
    Playlist(uid:number, offset: number = 0, limit: number = 100): Promise<any> {

        let params = {
            uid: uid,
            offset: offset,
            limit: limit
        };

        let data = this._crypto.aesRsaEncrypt(JSON.stringify(params));
        return this._http.Post(PlayListUrl, data);
        
       // return this._http.Get(PlayListUrl, params);
    }

    PlaylistDetail(id:number): Promise<any> {

        let params = {
            id: id,
            total: true,
            offset: 0,
            limit: 154
        };

        let data = this._crypto.aesRsaEncrypt(JSON.stringify(params));
        return this._http.Post(PlayListDetailUrl, data);
        
       // return this._http.Get(PlayListUrl, params);
    }
    
    SongUrl(id:number, br : number = 320000): Promise<any> {

        let params = {
            ids: [id],
            br: br
        };
        
        let data = this._crypto.aesRsaEncrypt(JSON.stringify(params));
        return this._http.Post(SongUrl, data);
        
    }
    
    RegisterDigger(typ: string, digger: Digger): Error {
        
        if (this._diggers.has(typ)) {
            return new Error( "digger: " + typ + " is existed");
        }
        
        this._diggers.set(typ, digger);
    }
    
    public Dig(typ: string, rawData: Array<Object>): Array<Object> {
        return this._diggers.get(typ)(rawData);
    }

}

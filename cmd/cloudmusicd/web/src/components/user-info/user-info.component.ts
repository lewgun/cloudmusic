

//http://juristr.com/blog/2016/01/learning-ng2-dynamic-styles/
//https://coryrylan.com/blog/css-encapsulation-with-angular-2-components

import {Component, OnInit, OnDestroy}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import { UserInfoStore, StoreToken } from '../../services/flux/flux';

@Component({
    templateUrl: "user-info/user-info.component.html",
    styleUrls: ["user-info/user-info.component.css"]

})

export class UserInfoComponent implements OnInit {

    userInfo: any;

    private _handlerToken: StoreToken;
    private _bgPosition = {};

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _store: UserInfoStore) {

        //this._handlerToken = this._store.Bind(() => this.onProfile());

        this.userInfo = this._store.UserInfo();
        console.log(this.userInfo);


    }

    onProfile() {
        //console.log(this._store.Profile());
    }

    ngOnInit() {
        this._bgPosition["gender"] = (): string => this.genderPostion();

    }
    ngOnDestory() {
        //this._store.Unbind(this._handlerToken ) ;
    }

    genderPostion(): string {

        if (this.userInfo.profile.gender === 1) {  //male
            return "-39px -57px";
        }
        return "-39px -27px";
    }

    position(kind: string): string {
        return this._bgPosition[kind]();
    }
}
import {Component, OnInit, OnDestroy}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import { UserInfoStore, StoreToken } from '../../services/flux/flux';

@Component({
    templateUrl: "user-info/user-info.component.html",
    styleUrls: ["user-info/user-info.component.css"]

})

export class UserInfoComponent implements OnInit {

    userInfo: Object; 

    private _handlerToken: StoreToken;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _store: UserInfoStore) {

        //this._handlerToken = this._store.Bind(() => this.onProfile());
        
        this.userInfo = this._store.UserInfo();


    }

    onProfile() {
        //console.log(this._store.Profile());
    }

    ngOnInit() { }
    ngOnDestory() {
        //this._store.Unbind(this._handlerToken ) ;
    }
}
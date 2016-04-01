import {Component, OnInit, OnDestroy}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import { ProfileStore, StoreToken } from '../../services/flux/flux';

@Component({
    templateUrl: "profile/profile.component.html",
    styleUrls: ["profile/profile.component.css"]

})

export class ProfileComponent implements OnInit {

    private userId: number;
    private nickname: string;
    private signature: string;
    private avatarUrl: string;

    private _handlerToken: StoreToken;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _store: ProfileStore) {

        //this._handlerToken = this._store.Bind(() => this.onProfile());
        
        console.log(this._store.Profile());

    }

    onProfile() {
        //console.log(this._store.Profile());
    }

    ngOnInit() { }
    ngOnDestory() {
        //this._store.Unbind(this._handlerToken ) ;
    }
}
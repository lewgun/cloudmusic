import {Component, OnInit, OnDestroy}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import { Store, Profile_Read } from '../../services/flux/flux';
import { StoreToken  }  from '../../types/types';


@Component({
    templateUrl:"profile/profile.component.html",
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
        private _store: Store) {
            
        this._handlerToken = this._store.Bind(Profile_Read, ()=>this.onProfile());
            
        // this.nickname = _routeParams.get('nickname');
        // this.signature = _routeParams.get('signature');
        // this.avatarUrl = _routeParams.get('avatarUrl'); 

    }
    
    onProfile() {

        console.log(this._store.Profile());
    }

    ngOnInit() { }
    ngOnDestory() {
        this._store.Unbind(this._handlerToken ) ;
    }
}
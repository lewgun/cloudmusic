
import {Injectable, OnInit, Inject } from 'angular2/core';

import {Dispatcher} from "../dispatcher/dispatcher";
import {UserInfo_Read} from "../constants/constants";

@Injectable()
export class UserInfoActionCreator {
    constructor(
        @Inject(Dispatcher) private _dispatcher: Dispatcher
    ) { }

    SaveProfile(profile: any) {
        this._dispatcher.Dispatch(
            {
                typ: UserInfo_Read,
                payload: profile
            });
    }
}


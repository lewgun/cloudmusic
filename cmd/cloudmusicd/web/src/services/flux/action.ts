
import {Injectable, OnInit, Inject } from 'angular2/core';
import {Dispatcher} from "./dispatcher";
import {Profile_Read} from "./consts";

@Injectable()
export class ActionCreator {
    constructor(
        @Inject(Dispatcher)  private _dispatcher: Dispatcher
    ) {}

    SaveProfile(profile: any) {
        this._dispatcher.Dispatch(
            {
                typ: Profile_Read,
                payload: profile
            });
    }
}


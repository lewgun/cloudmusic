
import {Injectable, Inject} from 'angular2/core';

import {UserInfoActionCreator}  from "./actions/userinfo-action";
import {Dispatcher}  from "./dispatcher/dispatcher";
import {UserInfoStore } from "./stores/userinfo-store";

@Injectable()
export class FluxBoot {
    constructor(
        @Inject(Dispatcher) private _dipatcher: Dispatcher,
        @Inject(UserInfoStore) private _store: UserInfoStore,
        @Inject(UserInfoActionCreator) private _ac: UserInfoActionCreator
    ) { }
}
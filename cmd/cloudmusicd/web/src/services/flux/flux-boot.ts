
import {Injectable, Inject} from 'angular2/core';

import {Dispatcher}  from "./dispatcher/dispatcher";

import {UserInfoActionCreator}  from "./actions/userinfo-action";
import {PlayListActionCreator}  from "./actions/playlist-action";
import {PlayActionCreator}  from "./actions/play-action";


import {UserInfoStore } from "./stores/userinfo-store";
import {PlayListStore } from "./stores/playlist-store";
import {PlayStore } from "./stores/play-store";

@Injectable()
export class FluxBoot {
    constructor(
        @Inject(Dispatcher) private _dipatcher: Dispatcher,

        @Inject(UserInfoStore) private _uis: UserInfoStore,
        @Inject(UserInfoActionCreator) private _uiac: UserInfoActionCreator,

        @Inject(PlayListStore) private _pls: PlayListStore,
        @Inject(PlayActionCreator) private _pac: PlayActionCreator,

        @Inject(PlayStore) private _ps: PlayStore,
        @Inject(PlayActionCreator) private _plac: PlayListActionCreator

    ) { }
}
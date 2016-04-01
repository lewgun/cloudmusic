
import {Injectable, Inject} from 'angular2/core';

import {ProfileActionCreator}  from "./actions/profile-action";
import {Dispatcher}  from "./dispatcher/dispatcher";
import {ProfileStore } from "./stores/profile-store";

@Injectable()
export class FluxBoot {
    constructor(
        @Inject(Dispatcher) private _dipatcher: Dispatcher,
        @Inject(ProfileStore) private _store: ProfileStore,
        @Inject(ProfileActionCreator) private _ac: ProfileActionCreator
    ) { }
}
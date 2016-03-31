
import {Injectable, Inject} from 'angular2/core';

import {ActionCreator}  from "./action";
import {Dispatcher}  from "./dispatcher";
import {Store } from "./store";

@Injectable()
export class FluxBoot {
    constructor(
        @Inject(Dispatcher) private _dipatcher: Dispatcher,
        @Inject(Store) private _store: Store,
        @Inject(ActionCreator) private _ac: ActionCreator
    ) { }
}
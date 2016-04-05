
import {Injectable, OnInit, Inject } from 'angular2/core';

import {Dispatcher} from "../dispatcher/dispatcher";
import {PlayList_Read, PlayListDetail_Read} from "../constants/constants";

@Injectable()
export class PlayListActionCreator {
    constructor(
        @Inject(Dispatcher) private _dispatcher: Dispatcher
    ) { }

    SavePlayList(play: any) {
        this._dispatcher.Dispatch(
            {
                typ: PlayList_Read,
                payload: play
            });
    }
    SavePlayListDetail(detail: any) {
        this._dispatcher.Dispatch(
            {
                typ: PlayListDetail_Read,
                payload: detail
            });
    }
    
}



import {Injectable, OnInit, Inject } from 'angular2/core';

import {Dispatcher} from "../dispatcher/dispatcher";
import {CurrentPlaylist_Read, CurrentSong_Read} from "../constants/constants";

@Injectable()
export class PlayActionCreator {
    constructor(
        @Inject(Dispatcher) private _dispatcher: Dispatcher
    ) { }

    //保存当前播放的歌曲
    SaveCurrentSong(sid: number) {
        this._dispatcher.Dispatch(
            {
                typ: CurrentSong_Read,
                payload: sid
            });
    }

    //保存当前播放的歌单
    SaveCurrentPlaylist(pid: any) {
        this._dispatcher.Dispatch(
            {
                typ: CurrentPlaylist_Read,
                payload: pid
            });
    }

}


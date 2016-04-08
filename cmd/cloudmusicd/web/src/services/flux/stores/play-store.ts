
import {Injectable, Inject} from 'angular2/core';

import {Dispatcher} from "../dispatcher/dispatcher";
import {

    CurrentPlaylist_Read,
    CurrentPlaylistKey,

    CurrentSong_Read,
    CurrentSongKey

} from "../constants/constants";

import {BaseStore} from './base-store';

import {
    Action,
    EventHandler,
}  from '../../../types/types';


@Injectable()
export class PlayStore extends BaseStore {
    constructor( @Inject(Dispatcher) private $: Dispatcher) {
        super($);
    }

    public CurrentSong(): any {
        return this.cache.Get(CurrentSongKey);
    }

    public CurrentPlaylist(): any {
        return this.cache.Get(CurrentPlaylistKey);
    }

    //因为store既负责数据的保存又负责通知,所以当action过多,则会变得复杂,所以要按功能分成多个store，而不把store当成ORM.
    actionHandler(action: Action): void {

        switch (action.typ) {

            case CurrentPlaylist_Read:
                {
                    this.cache.InsertOrUpdate(CurrentPlaylistKey, action.payload);
                    this.emitChange(action.typ);
                }
                break;

            case CurrentSong_Read:
                {
                    this.cache.InsertOrUpdate(CurrentSongKey, action.payload);
                    this.emitChange(action.typ);
                }
                break;

            default:
                break;
        }

    }
}
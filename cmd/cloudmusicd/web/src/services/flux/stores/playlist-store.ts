
import {Injectable, Inject} from 'angular2/core';

import {Dispatcher} from "../dispatcher/dispatcher";
import {

    PlayList_Read,
    PlayListKey,

    PlayListDetail_Read,
    PlayListDetailKey

} from "../constants/constants";

import {BaseStore} from './base-store';

import {
    Action,
    EventHandler,
}  from '../../../types/types';


@Injectable()
export class PlayListStore extends BaseStore {
    constructor( @Inject(Dispatcher) private $: Dispatcher) {
        super($);
    }


    //因为store既负责数据的保存又负责通知,所以当action过多,则会变得复杂,所以要按功能分成多个store，而不把store当成ORM.
    actionHandler(action: Action): void {

        switch (action.typ) {

            case PlayList_Read:
                {
                    this.cache.InsertOrUpdate(PlayListKey, action.payload);
                    this.emitChange(action.typ);
                }
                break;

            case PlayListDetail_Read:
                {

                    this.cache.InsertOrUpdate(PlayListDetailKey, action.payload);
                    this.emitChange(action.typ);
                }
                break;

            default:
                break;
        }

    }


    public PlayList(): any {
        return this.cache.Get(PlayListKey);
    }

    public PlayListDetail(): any {
        return this.cache.Get(PlayListDetailKey);
    }
}
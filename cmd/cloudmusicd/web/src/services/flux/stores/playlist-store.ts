import {Injectable, Inject, OnDestroy} from 'angular2/core';

import {PubSubService} from '../../pubsub/pubsub.service'
import { StoreToken} from './store'

import {
    ChangeEvent,
    Action,
    EventHandler,
}  from '../../../types/types';

import { Cache} from './cache'
import {Dispatcher, DispatchToken} from "../dispatcher/dispatcher";
import {

    PlayList_Read,
    PlayListKey,
    
    PlayListDetail_Read,
    PlayListDetailKey

} from "../constants/constants";


@Injectable()
export class PlayListStore implements OnDestroy {


    private _handlerID: DispatchToken;
    private _pubsub: PubSubService;
    private _cache: Cache;

    constructor(
        @Inject(Dispatcher) private _dispatcher: Dispatcher) {

        this._cache = new Cache();
        this._pubsub = new PubSubService();

        this._handlerID = this._dispatcher.Register((action: Action) => this.actionHandler(action));

    }

    ngOnDestroy(): any {
        this._dispatcher.UnRegister(this._handlerID);
        return null;
    }

    //因为store既负责数据的保存又负责通知,所以当action过多,则会变得复杂,所以要按功能分成多个store，而不把store当成ORM.
    actionHandler(action: Action): void {

        switch (action.typ) {

            case PlayList_Read:
                {
                    this._cache.InsertOrUpdate(PlayListKey, action.payload);
                    this.emitChange();
                }
                break;

            case PlayListDetail_Read:
                {
                    this._cache.InsertOrUpdate(PlayListDetailKey, action.payload);
                    this.emitChange();
                }
                break;

            default:
                break;
        }

    }


    public Bind(handler: EventHandler): StoreToken {

        return this._pubsub.Stream.subscribe(handler);

    }
    public Unbind(token: StoreToken): void {
        token.unsubscribe();
    }

    public emitChange() {
        try {
            this._pubsub.Stream.emit(ChangeEvent);
        }
        finally { }


    }

    public PlayList(): any {
        return this._cache.Get(PlayListKey);
    }

    public PlayListDetail(): any {
        return this._cache.Get(PlayListDetailKey);
    }
}
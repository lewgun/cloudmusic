import {Injectable, Inject, OnDestroy} from 'angular2/core';

import {PubSubService, PubSubToken} from '../../pubsub/pubsub.service'


import {
    ChangeEvent,
    Action,
    EventHandler,
}  from '../../../types/types';

import { Cache} from './cache'
import {Dispatcher, DispatchToken} from "../dispatcher/dispatcher";
import {
    UserInfo_Read,
    UserInfoKey,

    DailyTask_Read,
    DailyTaskKey
} from "../constants/constants";

export type StoreToken = PubSubToken;


@Injectable()
export class UserInfoStore implements OnDestroy {


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
            case UserInfo_Read:
                {
                    this._cache.Set(UserInfoKey, action.payload);
                    this.emitChange();
                }
                break;

            case DailyTask_Read:
                {
                    this._cache.InsertOrUpdate(DailyTaskKey, action.payload);
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

    public UserInfo(): any {
        return this._cache.Get(UserInfoKey);
    }

    public DailyTask(): any {
        return this._cache.Get(DailyTaskKey);
    }
}
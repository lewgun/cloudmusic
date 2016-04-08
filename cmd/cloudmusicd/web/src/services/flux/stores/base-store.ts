import {Injectable, OnDestroy} from 'angular2/core';

import {PubSubService} from '../../pubsub/pubsub.service'

import {
    EventType,
    Action,
    EventHandler,
}  from '../../../types/types';

import { Cache} from './cache'
import {Dispatcher, DispatchToken} from "../dispatcher/dispatcher";
import {PubSubToken} from '../../pubsub/pubsub.service'


export type StoreToken = PubSubToken;


@Injectable()
export class BaseStore implements OnDestroy {


    private _handlerID: DispatchToken;
    private _pubsub: PubSubService;

    public cache: Cache;

    constructor(private _dispatcher: Dispatcher) {

        this.cache = new Cache();
        this._pubsub = new PubSubService();

        this._handlerID = this._dispatcher.Register((action: Action) => this.actionHandler(action));

    }

    ngOnDestroy(): any {
        this._dispatcher.UnRegister(this._handlerID);
        return null;
    }

    //因为store既负责数据的保存又负责通知,所以当action过多,则会变得复杂,所以要按功能分成多个store，而不把store当成ORM.
    actionHandler(action: Action): void {
    }


    public Bind(handler: EventHandler): StoreToken {

        return this._pubsub.Stream.subscribe(handler);

    }
    public Unbind(token: StoreToken): void {
        token.unsubscribe();
    }

    public emitChange(evt: EventType) {
        try {
            // this._pubsub.Stream.emit(ChangeEvent);
            this._pubsub.Stream.emit(evt);
        }
        finally { }


    }

}
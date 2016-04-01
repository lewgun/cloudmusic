
import {Injectable, Inject} from 'angular2/core';

import { Action, ActionHandler   }  from '../../../types/types';

import {PubSubService, PubSubToken} from '../../pubsub/pubsub.service'

export type DispatchToken = PubSubToken;

@Injectable()
export class Dispatcher {
    private _pubsub: PubSubService
    constructor() {
        this._pubsub = new PubSubService();
        console.log(this._pubsub, "DIspatcher");
    }

    /**
    * Registers a callback to be invoked with every dispatched payload. Returns
    * a token that can be used with `waitFor()`.
    */
    public Register(callback: ActionHandler): DispatchToken {
        let id = this._pubsub.Stream.subscribe(callback);
        return id;
    }

    /**
    * Removes a callback based on its token.
    */
    public UnRegister(id: DispatchToken): void {
        id.unsubscribe();
    }

    /**
    * Dispatches a payload to all registered callbacks.
    */
    public Dispatch(action: Action): void {
        try {
            this._pubsub.Stream.emit(action);
        }
        finally { }
    }


}
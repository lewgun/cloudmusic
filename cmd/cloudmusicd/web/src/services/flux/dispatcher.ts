
import {Injectable} from 'angular2/core';

import { Action, ActionHandler, DispatchToken  }  from '../../types/types';


@Injectable()
export class Dispatcher {

    static Prefix = "ID_";

    private _lastID = 1;
    private _handlers = new Map<DispatchToken, ActionHandler>();

    constructor() {
    }

    /**
    * Registers a callback to be invoked with every dispatched payload. Returns
    * a token that can be used with `waitFor()`.
    */
    public Register(callback: ActionHandler): DispatchToken {
        let id = Dispatcher.Prefix + this._lastID++;
        this._handlers.set(id, callback);
        return id;
    }

    /**
    * Removes a callback based on its token.
    */
    public UnRegister(id: DispatchToken): void {
        this._handlers.delete(id);
    }

    /**
    * Dispatches a payload to all registered callbacks.
    */
    public Dispatch(action: Action): void {
        try {

            this._handlers.forEach((handler: ActionHandler, key: DispatchToken, m: Map<DispatchToken, ActionHandler>) => {
                handler(action);

            });
        }
        finally { }
    }


}
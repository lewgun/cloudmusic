import {Injectable, Inject, OnDestroy} from 'angular2/core';

import { EventType, Action, EventHandler, DispatchToken, StoreToken  }  from '../../types/types';
import { Cache} from './cache'
import {Dispatcher} from "./dispatcher";
import {Profile_Read} from "./consts";

         
@Injectable()
export  class Store implements OnDestroy {
    
    private _handlers = new Map< StoreToken, EventHandler>();
    private _handerTokens = new Map< EventType, Set<StoreToken>>();
    
    private _handlerID :DispatchToken;
    
    static Prefix = "ID_";

    private _lastID = 1;
    

    constructor(
         @Inject(Dispatcher) private _dispatcher: Dispatcher,
         @Inject(Cache)  private _cache: Cache ) {
             
        this. _handlerID = this._dispatcher.Register(
            (action: Action) =>
                {
                    this.actionHandler(action);
                } );
       
    }
    
    ngOnDestroy() :any {
        this._dispatcher.UnRegister(this._handlerID );
        return null;
    }
    
    actionHandler (action :Action): void  {
          
            switch ( action.typ) {
                case Profile_Read:
                {
                    this._cache.Set(Profile_Read, action.payload);
                    this. Trigger(Profile_Read);
                }
                break;
                
                default:
                    break;
            }
            
        }
    
    
    public Bind( e :EventType, handler: EventHandler): StoreToken {
             
        let set : Set<StoreToken>;
        
        let id = Store.Prefix + this._lastID++;
     
        
        if ( !this._handerTokens.has(e)) {
            set = new Set<StoreToken>();
            this._handerTokens.set(e, set);
        
        } 
        set.add(id);
        
        this._handlers.set(id, handler);
        return id;
        
    }
    public Unbind( id: StoreToken): void {
        if ( !this._handlers.has(id)) {
            return;
        }
        let set = this._handerTokens.get(id);
        set.delete(id);
        
        this._handlers.delete(id);
        
    }
    
    public Trigger(e :EventType) {
        if ( !this._handerTokens.has(e)) {
            return;
        }
        let tokenSet = this._handerTokens.get(e);
        

        try {

           tokenSet.forEach((token: StoreToken, key: StoreToken, s: Set<StoreToken>) => {
               this._handlers[token]();
            });
        }
        finally {}
        
        
    }
    
    public Profile(): any {
        return this._cache.Get(Profile_Read);
    }
}
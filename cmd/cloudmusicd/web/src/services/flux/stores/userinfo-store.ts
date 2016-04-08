
import {Injectable, Inject} from 'angular2/core';

import {Dispatcher} from "../dispatcher/dispatcher";
import {
    UserInfo_Read,
    UserInfoKey,

    DailyTask_Read,
    DailyTaskKey,

} from "../constants/constants";

import {BaseStore} from './base-store';

import {
    Action,
    EventHandler,
}  from '../../../types/types';


@Injectable()
export class UserInfoStore extends BaseStore {
    constructor( @Inject(Dispatcher) private $: Dispatcher) {
        super($);
    }


    //因为store既负责数据的保存又负责通知,所以当action过多,则会变得复杂,所以要按功能分成多个store，而不把store当成ORM.
    actionHandler(action: Action): void {

        switch (action.typ) {
            case UserInfo_Read:
                {
                    this.cache.Set(UserInfoKey, action.payload);
                    this.emitChange(action.typ);
                }
                break;

            case DailyTask_Read:
                {
                    this.cache.InsertOrUpdate(DailyTaskKey, action.payload);
                    this.emitChange(action.typ);
                }
                break;

            default:
                break;
        }

    }


    public UserInfo(): any {
        return this.cache.Get(UserInfoKey);
    }

    public DailyTask(): any {
        return this.cache.Get(DailyTaskKey);
    }
}
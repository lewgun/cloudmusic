//http://www.syntaxsuccess.com/viewarticle/pub-sub-in-angular-2.0

import {Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export type PubSubToken = Subscription;

export class EventEmitter extends Subject<any> {
    constructor() {
        super();
    }

    emit(val: any) {
        super.next(val);
    }
}


export class PubSubService {

    public Stream: EventEmitter;

    constructor() {
        this.Stream = new EventEmitter();

    }

}
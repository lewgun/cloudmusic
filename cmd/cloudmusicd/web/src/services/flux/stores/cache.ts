import {Injectable, OnInit} from 'angular2/core';

@Injectable()
export class Cache implements OnInit {

    private _cache: Map<any, any> = new Map<any, any>()

    constructor() {
    }

    ngOnInit() { }

    Set(key: any, value: any) {
        this._cache.set(key, value);
    }

    Get(key: any): any {
        return this._cache.get(key);
    }

    Delete(key: any): boolean {
        return this._cache.delete(key)
    }

    Has(key: any): boolean {
        return this._cache.has(key);
    }

    InsertOrUpdate(key: any, value: any) {

        if (!this._cache.has(key)) {
            this._cache.set(key, value);
            return;
        }

        this._cache.delete(key);
        this._cache.set(key, value);

    }

    Size(): number {
        return this._cache.size;
    }

}
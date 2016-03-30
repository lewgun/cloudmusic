import {Component, OnInit}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

export class ProfileComponent implements OnInit {

    private userId: number;
    private nickname: string;
    private signature: string;
    private avatarUrl: string;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams) {
        this.nickname = _routeParams.get('nickname');
        this.signature = _routeParams.get('signature');
        this.avatarUrl = _routeParams.get('avatarUrl');

    }

    ngOnInit() { }
}
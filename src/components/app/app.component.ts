//https://dzone.com/articles/completing-the-angular-2-quick-start-in-vs-code-1
import {Component, OnInit} from 'angular2/core';

import {CloudMusicService} from "../../services/cloud-music/cloud-music.service"

import {account} from './user'

@Component({
    selector: 'app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [CloudMusicService]
})
export class AppComponent implements OnInit {
    constructor(private _cloudMusic: CloudMusicService) {
        
    }
    
    ngOnInit() {
        this._cloudMusic.Login(account.username, account.password);
    }
}
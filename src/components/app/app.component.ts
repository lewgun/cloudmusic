//https://dzone.com/articles/completing-the-angular-2-quick-start-in-vs-code-1
import {Component} from 'angular2/core';

import {CloudMusicService} from "../../services/cloud-music/cloud-music.service"

@Component({
    selector: 'app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [CloudMusicService]
})
export class AppComponent {
    constructor(private _cloudMusic: CloudMusicService) {
        
    }
}
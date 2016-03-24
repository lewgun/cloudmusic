//https://dzone.com/articles/completing-the-angular-2-quick-start-in-vs-code-1
import {Component} from 'angular2/core';

import {test} from "../../services/api/api.service"

@Component({
    selector: 'app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    constructor() {
        test();
    }
}
import {Component} from 'angular2/core';
import {Crypto} from '../../services/crypto/crypto.service'

@Component({
   selector: 'app',
   template: '<h1>Hiya! CloudMusic</h1>'
})
export class AppComponent {
    constructor() {
        Crypto.MD5("hello");
    }
}
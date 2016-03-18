import {Component} from 'angular2/core';
import {Crypto} from '../../services/crypto/crypto.service'

@Component({
   selector: 'app',
   templateUrl: 'app/app.component.html'
})
export class AppComponent {
    private md5: string 
    private aesRsa: string 
    constructor() {
       this.md5 =Crypto.MD5("helloworld");
    }
}
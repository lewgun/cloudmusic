import {Component} from 'angular2/core';
//import {Crypto} from '../../services/crypto/crypto.service'

// import {mycrypto} from 'mycrypto'

// import {greet} from "../../services/browserify/bundle"

var greet = require("../../services/browserify/bundle")
@Component({
   selector: 'app',
   templateUrl: 'app/app.component.html'
})
export class AppComponent {
    private md5: string 
    private aesRsa: string 
    constructor() {
        greet.greeting("lewgun");
   //    this.md5 =mycrypto.MD5("abcd");
      // this.aesRsa = Crypto.aesRsaEncrypt("helloworld");
    }
}
//https://dzone.com/articles/completing-the-angular-2-quick-start-in-vs-code-1
import {Component} from 'angular2/core';

//import {md5, enc} from "../../services/api/api.service"

@Component({
   selector: 'app',
   templateUrl: 'app/app.component.html'
})
export class AppComponent {
    private md5: string 
    private aesRsa: string 
    
    
    constructor() {
        
        // console.log(md5("abcd"));
        
        // console.log(enc("abcd"));
    }
}
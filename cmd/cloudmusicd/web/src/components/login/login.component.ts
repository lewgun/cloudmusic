
import {Component } from 'angular2/core';
import {
    FORM_PROVIDERS,
    FormBuilder,
    Validators,
    ControlGroup
} from 'angular2/common';

import {Router}  from 'angular2/router';

import { ValidationService} from '../../services/validation/validation.service';
import { ControlMessageComponent} from '../control-message/control-message.component';

import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';


@Component({
    selector: 'login',
    directives: [ControlMessageComponent],
    providers: [FORM_PROVIDERS ],
    templateUrl: 'login/login.component.html',
    styleUrls: ["login/login.component.css"]
})
export class LoginComponent {

    public myForm: ControlGroup;
    public title: string = "网易云音乐";

    constructor(private _router: Router, private _cloudMusic: CloudMusicService, fb: FormBuilder) {
        this.myForm = fb.group({
            'username': ["", Validators.required],
            'password': ["", Validators.compose([Validators.required, ValidationService.passwordValidator])]
        });

        console.log("hello from LoginComponent")

    }

    login(account: { username: string, password: string }) {

      //  this._cloudMusic.Login(account.username, account.password)
        
        // Like <a [routerLink]="['Profile']">Heroes</a>
        //note route to other branch!!!!!!!!!
        this._router.navigate(['/Dashboard/Profile', {userId:1234, nickname:"lewgun", signature:"hello world2", avatar:"abcd" }]);

    }

    onSubmit(values: any): void {
        if (this.myForm.dirty && this.myForm.valid) {
            this.login(values);

        } // end of if ( this.myForm.dirty && this.myForm.valid) {

    }

}

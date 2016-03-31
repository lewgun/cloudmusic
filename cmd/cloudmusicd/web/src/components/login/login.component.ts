
import {Component } from 'angular2/core';
import {
    FORM_PROVIDERS,
    FormBuilder,
    Validators,
    ControlGroup
} from 'angular2/common';

import {Router}  from 'angular2/router';

import { ValidationService} from '../../services/validation/validation.service';
import { DialogService} from '../../services/dialog/dialog.service';
import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';

import { Profile }  from '../../types/types';

import { ControlMessageComponent} from '../control-message/control-message.component';

@Component({
    selector: 'login',
    directives: [ControlMessageComponent],
    providers: [FORM_PROVIDERS, DialogService],
    templateUrl: 'login/login.component.html',
    styleUrls: ["login/login.component.css"]
})
export class LoginComponent {

    public myForm: ControlGroup;
    public title: string = "网易云音乐";

    constructor(
        private _router: Router,
        private _cloudMusic: CloudMusicService,
        private _fb: FormBuilder,
        private _dlg: DialogService) {
        this.myForm = _fb.group({
            'username': ["", Validators.required],
            'password': ["", Validators.compose([Validators.required, ValidationService.passwordValidator])]
        });

        console.log("hello from LoginComponent")

    }

    login(account: { username: string, password: string }) {

        this._cloudMusic.Login(
            account.username.trim(),
            account.password.trim()).
            then(retVal => {
                console.log(retVal);
                if (retVal.code !== "200") {
                    this._dlg.alert(retVal.code);
                    return;
                }
                
                let profile = <Profile>(retVal.data);

                // Like <a [routerLink]="['Profile']">Heroes</a>
                //note route to other branch!!!!!!!!!Í 
                this._router.navigate(['/Dashboard/Profile', profile]);
            });
        
        
    // let profile = {
    //     userId: 3087853,
    //     avatarUrl: "http://p3.music.126.net/Y2vy6t_vas-WAkKF9VEXYw==/2544269907080454.jpg",
    //     nickname: "laphoon",
    //     signature: "百度 让搜索更无耻-Weibo"

    // }
    //  this._router.navigate(['/Dashboard/Profile', profile]);
     
    }

    onSubmit(values: any): void {
        if (this.myForm.dirty && this.myForm.valid) {
            this.login(values);

        } // end of if ( this.myForm.dirty && this.myForm.valid) {

    }

}

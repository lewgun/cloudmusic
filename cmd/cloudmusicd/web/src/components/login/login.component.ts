
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
import { UserInfoActionCreator} from '../../services/flux/flux';


import { ControlMessageComponent} from '../control-message/control-message.component';

@Component({
    selector: 'login',
    directives: [ControlMessageComponent],
    providers: [FORM_PROVIDERS, DialogService, CloudMusicService],
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
        private _dlg: DialogService,
        private _action: UserInfoActionCreator) {
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

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                this._action.SaveProfile(retVal);

                // Like <a [routerLink]="['Profile']">Heroes</a>
                //note route to other branch!!!!!!!!!Í 
                this._router.navigate(['/Dashboard/UserInfo']);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }

    onSubmit(values: any): void {
        if (this.myForm.dirty && this.myForm.valid) {
            this.login(values);

        } // end of if ( this.myForm.dirty && this.myForm.valid) {

    }

}

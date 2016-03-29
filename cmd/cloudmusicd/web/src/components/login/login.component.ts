
import {Component } from 'angular2/core';
import {FORM_DIRECTIVES,
    FormBuilder,
    ControlGroup,
    Validators,
    AbstractControl
} from 'angular2/common';     

import {Router}  from 'angular2/router';

// import { DialogService} from '../../services/dialog/dialog.service';
 import { ValidationService} from '../../services/validation/validation.service';
 
 import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';

// import { ControlMessageComponent} from '../control-message/control-message.component';

@Component({
	selector: 'login',
	directives: [FORM_DIRECTIVES/*, ControlMessageComponent*/],
 //  providers: [DialogService],
    
	 templateUrl: 'login/login.component.html'
})
export class LoginComponent {
	
	public myForm: ControlGroup;
	public account: AbstractControl;
    public title: string = "网易云音乐";
    
	constructor( private _router: Router, private _cloudMusic: CloudMusicService ,/* private _dlg: DialogService, */ fb: FormBuilder ) {
		this.myForm = fb.group({
			'account': ["your's account", Validators.required],
			'password': ['', Validators.compose([Validators.required, ValidationService.passwordValidator])]
		});
        
        console.log("hello from LoginComponent")
		
		// this.account = this.myForm.controls['account'];
        //
        // this.account.valueChanges.subscribe(  
        // (value: string) => {  
        //     console.log('account changed to: ', value);  
        // }
        // );
        //
        // this.myForm.valueChanges.subscribe(  
        // (value: string) => {  
        //     console.log('form changed to: ', value);  
        // }
        // );
    
	}
    
    login( values: any  ) {
        //   let headers = new Headers();
        //   headers.append('Content-Type', 'application/json');
              
        //     this._http.post(
        //         "http://127.0.0.1:8082/adminauth",
        //         JSON.stringify(values), 
        //         {
        //             headers: headers
        //         } )
        //         .subscribe(
        //             data => {
        //                     this._router.navigate(['Dashboard' /*, {account: value.account, password: value.password}*/]) ;       
        //             },
        //            // err => _dlg.alert(err.text()),
        //             err => this._dlg.alert(err.text()),
        //             () => console.log('logined')
        //         );
        
          this._cloudMusic.Login(values.username, values.password)
                
    }
	
	onSubmit(values: any): void {
        if (this.myForm.dirty && this.myForm.valid) {
            //   if(true){

            //   values.password="16ee3d9cf49f7ced87db4681b8b841fb";
            //   values.name="admin";

            this.login(values);

        } // end of if ( this.myForm.dirty && this.myForm.valid) {

	}

}
